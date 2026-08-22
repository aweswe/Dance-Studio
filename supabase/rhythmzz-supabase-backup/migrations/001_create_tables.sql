-- 001_create_tables.sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'leave');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_source AS ENUM ('razorpay', 'cash', 'upi_offline');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE batch_status AS ENUM ('active', 'paused', 'full');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE rental_status AS ENUM ('pending', 'confirmed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gallery_type AS ENUM ('photo', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Sequence for student ID
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1;

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth';

-- 2. programmes
CREATE TABLE IF NOT EXISTS programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    includes TEXT[],
    fees_monthly INT,
    fees_quarterly INT,
    age_group TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE programmes IS 'Dance programmes offered by the academy';
CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON programmes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3. instructors
CREATE TABLE IF NOT EXISTS instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    photo_url TEXT,
    bio TEXT,
    certifications TEXT[],
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE instructors IS 'Instructor profiles';
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. batches
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID REFERENCES programmes(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
    days TEXT[],
    time_start TIME,
    time_end TIME,
    capacity INT NOT NULL DEFAULT 0,
    enrolled_count INT DEFAULT 0,
    status batch_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE batches IS 'Batches/classes for each programme';
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT,
    programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    student_id_display TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    join_date DATE DEFAULT CURRENT_DATE,
    profile_photo_url TEXT,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE students IS 'Student profiles and enrollment details';

-- Trigger for auto-generating student_id_display
CREATE OR REPLACE FUNCTION generate_student_id_display()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id_display IS NULL THEN
        NEW.student_id_display := 'RHY-' || LPAD(nextval('student_id_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_student_id_display BEFORE INSERT ON students FOR EACH ROW EXECUTE FUNCTION generate_student_id_display();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    marked_by UUID REFERENCES instructors(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, date)
);
COMMENT ON TABLE attendance IS 'Daily attendance records per student';

-- 8. payment_orders
CREATE TABLE IF NOT EXISTS payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    razorpay_order_id TEXT UNIQUE,
    amount INT NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created',
    webhook_payload JSONB,
    programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    student_name TEXT,
    student_phone TEXT,
    student_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE payment_orders IS 'Payment initiation orders (Razorpay)';
CREATE TRIGGER update_payment_orders_updated_at BEFORE UPDATE ON payment_orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 7. fee_payments
CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    amount INT NOT NULL,
    source payment_source NOT NULL,
    razorpay_payment_id TEXT,
    payment_order_id UUID REFERENCES payment_orders(id) ON DELETE SET NULL,
    receipt_url TEXT,
    notes TEXT,
    paid_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE fee_payments IS 'Completed fee payments records';

-- 9. broadcast_logs
CREATE TABLE IF NOT EXISTS broadcast_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    template_name TEXT,
    recipients JSONB,
    recipient_count INT DEFAULT 0,
    sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
    sent_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE broadcast_logs IS 'WhatsApp/SMS broadcast message logs';

-- 10. studio_rentals
CREATE TABLE IF NOT EXISTS studio_rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    preferred_date DATE NOT NULL,
    preferred_time_start TIME NOT NULL,
    preferred_time_end TIME NOT NULL,
    status rental_status DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE studio_rentals IS 'Studio rental requests from users';
CREATE TRIGGER update_studio_rentals_updated_at BEFORE UPDATE ON studio_rentals FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 11. gallery
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    type gallery_type NOT NULL,
    title TEXT,
    tags TEXT[],
    programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE gallery IS 'Media gallery for the public website';

-- 12. site_content
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_key TEXT UNIQUE NOT NULL,
    content_value JSONB,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);
COMMENT ON TABLE site_content IS 'Dynamic CMS content for the website';
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 13. kuchipudi_progress
CREATE TABLE IF NOT EXISTS kuchipudi_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    current_level TEXT DEFAULT 'foundation',
    modules_completed JSONB DEFAULT '[]',
    certificate_urls JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);
COMMENT ON TABLE kuchipudi_progress IS 'Progress tracking for Kuchipudi students';
CREATE TRIGGER update_kuchipudi_progress_updated_at BEFORE UPDATE ON kuchipudi_progress FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 14. blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    cover_image_url TEXT,
    meta_description TEXT,
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE blog_posts IS 'Blog posts for the website';
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
