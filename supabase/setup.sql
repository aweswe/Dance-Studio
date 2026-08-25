-- ════════════════════════════════════════════════════════════════
-- Rhythmzz Academy — Supabase setup (combined)
-- Run ONCE in Supabase Dashboard → SQL Editor → New query → paste all → Run.
-- Safe to re-run: everything is idempotent (IF NOT EXISTS / guards).
-- Seed data matches the locked reference: fees, ages, slugs, batch
-- windows, 7 FAQs, 3 testimonials. Programme/batch UUIDs mirror the
-- app's built-in defaults so enrol submissions stay consistent.
-- ════════════════════════════════════════════════════════════════

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
DROP TRIGGER IF EXISTS update_programmes_updated_at ON programmes;
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
DROP TRIGGER IF EXISTS update_instructors_updated_at ON instructors;
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
DROP TRIGGER IF EXISTS update_batches_updated_at ON batches;
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
DROP TRIGGER IF EXISTS set_student_id_display ON students;
CREATE TRIGGER set_student_id_display BEFORE INSERT ON students FOR EACH ROW EXECUTE FUNCTION generate_student_id_display();
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
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
DROP TRIGGER IF EXISTS update_payment_orders_updated_at ON payment_orders;
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
DROP TRIGGER IF EXISTS update_studio_rentals_updated_at ON studio_rentals;
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
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
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
DROP TRIGGER IF EXISTS update_kuchipudi_progress_updated_at ON kuchipudi_progress;
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
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Missing column: instructors.role (the app selects it)
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS role TEXT;

-- 002_create_indexes.sql

-- Students
CREATE INDEX IF NOT EXISTS idx_students_programme_id ON students(programme_id);
CREATE INDEX IF NOT EXISTS idx_students_batch_id ON students(batch_id);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_auth_id ON students(auth_id);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(status) WHERE status = 'active';

-- Attendance
CREATE INDEX IF NOT EXISTS idx_attendance_student_date_desc ON attendance(student_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_batch_date_desc ON attendance(batch_id, date DESC);

-- Fee Payments
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_created_desc ON fee_payments(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fee_payments_source ON fee_payments(source);

-- Payment Orders
CREATE INDEX IF NOT EXISTS idx_payment_orders_razorpay_order_id ON payment_orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_student_phone ON payment_orders(student_phone);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);

-- Batches
CREATE INDEX IF NOT EXISTS idx_batches_programme_id ON batches(programme_id);
CREATE INDEX IF NOT EXISTS idx_batches_instructor_id ON batches(instructor_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);

-- Gallery
CREATE INDEX IF NOT EXISTS idx_gallery_visible_sort ON gallery(is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_programme_id ON gallery(programme_id);
CREATE INDEX IF NOT EXISTS idx_gallery_visible_only ON gallery(is_visible) WHERE is_visible = true;

-- Blog Posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_only ON blog_posts(is_published) WHERE is_published = true;

-- Site Content
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(content_key);

-- Studio Rentals
CREATE INDEX IF NOT EXISTS idx_studio_rentals_status ON studio_rentals(status);
CREATE INDEX IF NOT EXISTS idx_studio_rentals_preferred_date ON studio_rentals(preferred_date);

-- Kuchipudi Progress
CREATE INDEX IF NOT EXISTS idx_kuchipudi_progress_student_id ON kuchipudi_progress(student_id);

-- 003_rls_policies.sql

-- Helper function for role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.users WHERE id = (SELECT auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = '';

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE kuchipudi_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 1. users
DROP POLICY IF EXISTS users_read_own ON users;
CREATE POLICY users_read_own ON users FOR SELECT USING (id = (SELECT auth.uid()));
DROP POLICY IF EXISTS users_read_admin ON users;
CREATE POLICY users_read_admin ON users FOR SELECT USING (public.get_user_role() = 'admin');

-- 2. programmes
DROP POLICY IF EXISTS programmes_read_active ON programmes;
CREATE POLICY programmes_read_active ON programmes FOR SELECT USING (is_active = true OR public.get_user_role() = 'admin');
DROP POLICY IF EXISTS programmes_admin_all ON programmes;
CREATE POLICY programmes_admin_all ON programmes FOR ALL USING (public.get_user_role() = 'admin');

-- 3. batches
DROP POLICY IF EXISTS batches_read_active ON batches;
CREATE POLICY batches_read_active ON batches FOR SELECT USING (status != 'paused' OR public.get_user_role() = 'admin');
DROP POLICY IF EXISTS batches_admin_all ON batches;
CREATE POLICY batches_admin_all ON batches FOR ALL USING (public.get_user_role() = 'admin');

-- 4. instructors
DROP POLICY IF EXISTS instructors_read_active ON instructors;
CREATE POLICY instructors_read_active ON instructors FOR SELECT USING (is_active = true OR public.get_user_role() = 'admin');
DROP POLICY IF EXISTS instructors_admin_all ON instructors;
CREATE POLICY instructors_admin_all ON instructors FOR ALL USING (public.get_user_role() = 'admin');

-- 5. students
DROP POLICY IF EXISTS students_read_own ON students;
CREATE POLICY students_read_own ON students FOR SELECT USING (auth_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS students_read_instructor ON students;
CREATE POLICY students_read_instructor ON students FOR SELECT USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);
DROP POLICY IF EXISTS students_admin_all ON students;
CREATE POLICY students_admin_all ON students FOR ALL USING (public.get_user_role() = 'admin');

-- 6. attendance
DROP POLICY IF EXISTS attendance_read_own ON attendance;
CREATE POLICY attendance_read_own ON attendance FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE auth_id = (SELECT auth.uid()))
);
DROP POLICY IF EXISTS attendance_instructor_read_write ON attendance;
CREATE POLICY attendance_instructor_read_write ON attendance FOR ALL USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);
DROP POLICY IF EXISTS attendance_admin_all ON attendance;
CREATE POLICY attendance_admin_all ON attendance FOR ALL USING (public.get_user_role() = 'admin');

-- 7. fee_payments
DROP POLICY IF EXISTS fee_payments_read_own ON fee_payments;
CREATE POLICY fee_payments_read_own ON fee_payments FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE auth_id = (SELECT auth.uid()))
);
DROP POLICY IF EXISTS fee_payments_admin_all ON fee_payments;
CREATE POLICY fee_payments_admin_all ON fee_payments FOR ALL USING (public.get_user_role() = 'admin');

-- 8. payment_orders
DROP POLICY IF EXISTS payment_orders_admin_all ON payment_orders;
CREATE POLICY payment_orders_admin_all ON payment_orders FOR ALL USING (public.get_user_role() = 'admin');

-- 9. broadcast_logs
DROP POLICY IF EXISTS broadcast_logs_admin_all ON broadcast_logs;
CREATE POLICY broadcast_logs_admin_all ON broadcast_logs FOR ALL USING (public.get_user_role() = 'admin');

-- 10. studio_rentals
DROP POLICY IF EXISTS studio_rentals_insert_anon ON studio_rentals;
CREATE POLICY studio_rentals_insert_anon ON studio_rentals FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS studio_rentals_admin_all ON studio_rentals;
CREATE POLICY studio_rentals_admin_all ON studio_rentals FOR ALL USING (public.get_user_role() = 'admin');

-- 11. gallery
DROP POLICY IF EXISTS gallery_read_visible ON gallery;
CREATE POLICY gallery_read_visible ON gallery FOR SELECT USING (is_visible = true OR public.get_user_role() = 'admin');
DROP POLICY IF EXISTS gallery_admin_all ON gallery;
CREATE POLICY gallery_admin_all ON gallery FOR ALL USING (public.get_user_role() = 'admin');

-- 12. site_content
DROP POLICY IF EXISTS site_content_read_all ON site_content;
CREATE POLICY site_content_read_all ON site_content FOR SELECT USING (true);
DROP POLICY IF EXISTS site_content_admin_all ON site_content;
CREATE POLICY site_content_admin_all ON site_content FOR ALL USING (public.get_user_role() = 'admin');

-- 13. kuchipudi_progress
DROP POLICY IF EXISTS kuchipudi_progress_read_own ON kuchipudi_progress;
CREATE POLICY kuchipudi_progress_read_own ON kuchipudi_progress FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE auth_id = (SELECT auth.uid()))
);
DROP POLICY IF EXISTS kuchipudi_progress_instructor_read ON kuchipudi_progress;
CREATE POLICY kuchipudi_progress_instructor_read ON kuchipudi_progress FOR SELECT USING (
    public.get_user_role() = 'instructor' AND student_id IN (
        SELECT id FROM students WHERE batch_id IN (
            SELECT id FROM batches WHERE instructor_id = (
                SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
            )
        )
    )
);
DROP POLICY IF EXISTS kuchipudi_progress_admin_all ON kuchipudi_progress;
CREATE POLICY kuchipudi_progress_admin_all ON kuchipudi_progress FOR ALL USING (public.get_user_role() = 'admin');

-- 14. blog_posts
DROP POLICY IF EXISTS blog_posts_read_published ON blog_posts;
CREATE POLICY blog_posts_read_published ON blog_posts FOR SELECT USING (is_published = true OR public.get_user_role() = 'admin');
DROP POLICY IF EXISTS blog_posts_admin_all ON blog_posts;
CREATE POLICY blog_posts_admin_all ON blog_posts FOR ALL USING (public.get_user_role() = 'admin');

-- 006_features.sql
-- Batches display name, gallery storage bucket, student notices RLS.

-- 1. batches.name — display label rendered across the UI
ALTER TABLE batches ADD COLUMN IF NOT EXISTS name TEXT;

-- Backfill names for the seeded batches (fixed UUIDs = app defaults)
UPDATE batches b
SET name = v.name
FROM (VALUES
  ('a1b2c3d4-4101-4000-8000-000000000001'::uuid, 'Kids Dance · Mon–Wed 5–6 PM'),
  ('a1b2c3d4-4102-4000-8000-000000000002'::uuid, 'Kids Dance · Mon–Wed 6–7 PM'),
  ('a1b2c3d4-4103-4000-8000-000000000003'::uuid, 'Adults Dance · Mon–Wed 7–8 PM'),
  ('a1b2c3d4-4104-4000-8000-000000000004'::uuid, 'Adults Dance · Mon–Wed 8–9 PM'),
  ('a1b2c3d4-4105-4000-8000-000000000005'::uuid, 'Mind & Body Fitness · Mon–Fri 9:30–10:30 AM'),
  ('a1b2c3d4-4106-4000-8000-000000000006'::uuid, 'Kuchipudi · Fri–Sat 6:30–7:30 PM')
) AS v(id, name)
WHERE b.id = v.id AND b.name IS NULL;

-- 2. Gallery storage bucket (public read; admin uploads via server action)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','video/mp4'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS gallery_storage_public_read ON storage.objects;
CREATE POLICY gallery_storage_public_read ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
DROP POLICY IF EXISTS gallery_storage_authenticated_insert ON storage.objects;
CREATE POLICY gallery_storage_authenticated_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
DROP POLICY IF EXISTS gallery_storage_authenticated_update ON storage.objects;
CREATE POLICY gallery_storage_authenticated_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
DROP POLICY IF EXISTS gallery_storage_authenticated_delete ON storage.objects;
CREATE POLICY gallery_storage_authenticated_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');

-- 3. Students can read broadcasts scoped to them (all / their programme / their batch)
DROP POLICY IF EXISTS broadcast_logs_students_read ON broadcast_logs;
CREATE POLICY broadcast_logs_students_read ON broadcast_logs FOR SELECT USING (
    public.get_user_role() = 'student'
    AND (
        recipients->>'scope' = 'all'
        OR (recipients->>'scope' = 'programme' AND (recipients->>'scopeId')::uuid IN (
            SELECT programme_id FROM students WHERE auth_id = (SELECT auth.uid()) AND programme_id IS NOT NULL
        ))
        OR (recipients->>'scope' = 'batch' AND (recipients->>'scopeId')::uuid IN (
            SELECT batch_id FROM students WHERE auth_id = (SELECT auth.uid()) AND batch_id IS NOT NULL
        ))
    )
);

-- ══ Seed: programmes (reference fees & ages, fixed UUIDs = app defaults) ══
INSERT INTO programmes (id, name, slug, description, includes, fees_monthly, fees_quarterly, age_group, is_active, sort_order)
VALUES
  ('a1b2c3d4-4001-4000-8000-000000000001', 'Kids Dance', 'kids-dance', 'Bollywood, Hip Hop and Contemporary training for children aged 5 and above — technique, rhythm and stage confidence, taught step by step.', ARRAY['Bollywood & Hip Hop routines','Basic technique & rhythm training','Stage performance opportunities','Annual recital participation','Confidence & coordination building'], 2000, 5000, '5+ Years', true, 1),
  ('a1b2c3d4-4002-4000-8000-000000000002', 'Adults Dance', 'adults-dance', 'Bollywood, Hip Hop, Contemporary and choreography for adults aged 16 and above — from first steps to full performance pieces.', ARRAY['Bollywood choreography & trending tracks','Hip Hop foundations & isolation drills','Contemporary movement & expression','Freestyle & musicality development','No prior dance experience required'], 2500, 6500, '16+ Years', true, 2),
  ('a1b2c3d4-4003-4000-8000-000000000003', 'Mind & Body Fitness', 'mind-body-fitness', 'Zumba, Yoga, Pilates, HIIT and strength training — one hour every weekday morning to build stamina, flexibility and core strength.', ARRAY['Zumba — high-calorie-burn dance fitness','Hatha & Vinyasa Yoga for flexibility','Core conditioning & posture alignment','Breathwork & guided stress relief','Suitable for all fitness levels'], 2500, 6500, '16+ Years', true, 3),
  ('a1b2c3d4-4004-4000-8000-000000000004', 'Kuchipudi Classical', 'kuchipudi', 'Level-based classical Kuchipudi training — Foundation through Advanced — adavus, jathis, hastas and abhinaya taught the traditional way.', ARRAY['Structured curriculum: Foundation → Intermediate → Advanced','Adavus (basic steps) & Jathis (rhythmic patterns)','Asamyuta & Samyuta Hastas (hand gestures)','Abhinaya (facial expression & storytelling)','Stage performance & Arangetram preparation'], 2000, 5000, '5+ Years', true, 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, includes = EXCLUDED.includes,
  fees_monthly = EXCLUDED.fees_monthly, fees_quarterly = EXCLUDED.fees_quarterly,
  age_group = EXCLUDED.age_group, sort_order = EXCLUDED.sort_order;

-- ══ Seed: instructors (fixed UUIDs, guarded by name) ══
INSERT INTO instructors (id, name, role, bio, certifications, is_active)
SELECT v.* FROM (VALUES
  ('a1b2c3d4-5001-4000-8000-000000000001'::uuid, 'Nitish', 'Founder & Artistic Director', 'Founder of Rhythmzz Academy. 15+ years of teaching, 5,000+ students trained in Bollywood, Hip Hop and Contemporary. ISPTD-certified; represented India at the nATFEST International Contemporary Dance Festival, Sri Lanka 2017.', ARRAY['ISPTD Certified','nATFEST International Festival, Sri Lanka 2017','15+ Years Teaching Experience'], true),
  ('a1b2c3d4-5002-4000-8000-000000000002'::uuid, 'Deepak', 'Kids Dance Instructor', 'Leads the Kids Dance programme — Bollywood and Hip Hop fundamentals, choreography and stage confidence for children aged 5 and above. Mon–Wed, 5 to 7 PM.', ARRAY['Bollywood & Hip Hop Specialist'], true),
  ('a1b2c3d4-5003-4000-8000-000000000003'::uuid, 'Kajal', 'Kids Dance Instructor', 'Kids Dance instructor — 6 to 7 PM batch, Mon–Wed.', ARRAY['Kids Dance Specialist'], true),
  ('a1b2c3d4-5004-4000-8000-000000000004'::uuid, 'Pranith', 'Adults Dance Instructor', 'Adults Dance instructor — 8 to 9 PM batch, Mon–Wed.', ARRAY['Bollywood Choreography'], true),
  ('a1b2c3d4-5005-4000-8000-000000000005'::uuid, 'Shailaja', 'Mind & Body Fitness Instructor', 'Runs the Mind & Body Fitness programme — Zumba, Yoga, Pilates, HIIT and strength training every weekday morning, 9:30 to 10:30 AM.', ARRAY['Zumba Certified','Yoga Instructor'], true),
  ('a1b2c3d4-5006-4000-8000-000000000006'::uuid, 'Srusti', 'Kuchipudi Classical Instructor', 'Certified Kuchipudi instructor guiding students from Foundation to Advanced level through adavus, jathis, hastas and abhinaya. Fri–Sat, 6:30 to 7:30 PM.', ARRAY['Certified Kuchipudi Instructor'], true)
) AS v(id, name, role, bio, certifications, is_active)
WHERE NOT EXISTS (SELECT 1 FROM instructors i WHERE i.name = v.name);

-- ══ Seed: batches (reference windows, fixed UUIDs = app defaults) ══
INSERT INTO batches (id, name, programme_id, instructor_id, days, time_start, time_end, capacity, enrolled_count, status)
SELECT v.* FROM (VALUES
  ('a1b2c3d4-4101-4000-8000-000000000001'::uuid, 'Kids Dance · Mon–Wed 5–6 PM', 'a1b2c3d4-4001-4000-8000-000000000001'::uuid, 'a1b2c3d4-5002-4000-8000-000000000002'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '17:00:00'::time, '18:00:00'::time, 25, 16, 'active'::batch_status),
  ('a1b2c3d4-4102-4000-8000-000000000002'::uuid, 'Kids Dance · Mon–Wed 6–7 PM', 'a1b2c3d4-4001-4000-8000-000000000001'::uuid, 'a1b2c3d4-5003-4000-8000-000000000003'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '18:00:00'::time, '19:00:00'::time, 25, 15, 'active'::batch_status),
  ('a1b2c3d4-4103-4000-8000-000000000003'::uuid, 'Adults Dance · Mon–Wed 7–8 PM', 'a1b2c3d4-4002-4000-8000-000000000002'::uuid, 'a1b2c3d4-5001-4000-8000-000000000001'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '19:00:00'::time, '20:00:00'::time, 30, 20, 'active'::batch_status),
  ('a1b2c3d4-4104-4000-8000-000000000004'::uuid, 'Adults Dance · Mon–Wed 8–9 PM', 'a1b2c3d4-4002-4000-8000-000000000002'::uuid, 'a1b2c3d4-5004-4000-8000-000000000004'::uuid, ARRAY['Monday','Tuesday','Wednesday'], '20:00:00'::time, '21:00:00'::time, 30, 14, 'active'::batch_status),
  ('a1b2c3d4-4105-4000-8000-000000000005'::uuid, 'Mind & Body Fitness · Mon–Fri 9:30–10:30 AM', 'a1b2c3d4-4003-4000-8000-000000000003'::uuid, 'a1b2c3d4-5005-4000-8000-000000000005'::uuid, ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday'], '09:30:00'::time, '10:30:00'::time, 25, 15, 'active'::batch_status),
  ('a1b2c3d4-4106-4000-8000-000000000006'::uuid, 'Kuchipudi · Fri–Sat 6:30–7:30 PM', 'a1b2c3d4-4004-4000-8000-000000000004'::uuid, 'a1b2c3d4-5006-4000-8000-000000000006'::uuid, ARRAY['Friday','Saturday'], '18:30:00'::time, '19:30:00'::time, 15, 8, 'active'::batch_status)
) AS v(id, name, programme_id, instructor_id, days, time_start, time_end, capacity, enrolled_count, status)
WHERE NOT EXISTS (SELECT 1 FROM batches b WHERE b.id = v.id);

-- ══ Seed: site content (stats + reference FAQs + testimonials) ══
-- Key names match the app's data layer: getStats() reads stats_% scalar rows,
-- getFAQs() reads 'faqs', getTestimonials() reads 'testimonials'.
DELETE FROM site_content WHERE content_key IN ('faq', 'stats'); -- drop any legacy keys
INSERT INTO site_content (content_key, content_value)
VALUES
  ('stats_students', '"5000+"'::jsonb),
  ('stats_years', '"15+"'::jsonb),
  ('stats_programmes', '"4"'::jsonb),
  ('stats_awards', '"3"'::jsonb),
  ('faqs', $json$[
    {"question": "Where are dance classes near Sainikpuri?", "answer": "Rhythmzz Academy of Dance is at Neredmet X Road Bus Stop, just 8 to 12 minutes from Sainikpuri by drive. We offer Kids Dance, Adults Dance, Mind and Body Fitness and Kuchipudi Classical. Call +91 90529 80859 to book a free trial."},
    {"question": "Is there a free trial class for dance classes in Secunderabad?", "answer": "Yes. Rhythmzz Academy of Dance offers one free trial class for all new students. No registration fee. Call or WhatsApp +91 90529 80859 to book your trial class."},
    {"question": "What are the dance class fees at Rhythmzz Academy?", "answer": "Kids Dance: 2000 rupees per month or 5000 rupees per quarter. Adults Dance: 2500 rupees per month or 6500 rupees per quarter. Mind and Body Fitness: 2500 rupees per month or 6500 rupees per quarter. Kuchipudi Classical: 2000 rupees per month or 5000 rupees per quarter. No registration fee."},
    {"question": "Does Rhythmzz offer Kuchipudi classes near AS Rao Nagar?", "answer": "Yes. Rhythmzz Academy of Dance offers certified Kuchipudi Classical Dance classes at Neredmet X Road, about 10 to 14 minutes from AS Rao Nagar. Classes run every Friday and Saturday 6:30 to 7:30 PM. Taught by Srusti, a certified Kuchipudi instructor."},
    {"question": "Are there Zumba classes near Neredmet?", "answer": "Yes. Rhythmzz Academy of Dance offers Zumba as part of the Mind and Body Fitness programme at Neredmet X Road, Secunderabad. Classes run Monday to Friday, 9:30 to 10:30 AM. 2500 rupees per month."},
    {"question": "Can I rent a dance studio in Secunderabad?", "answer": "Yes. Rhythmzz Academy of Dance offers studio rental at Neredmet X Road, Secunderabad. Rates are 1000 rupees per hour on weekdays and 1500 rupees per hour on weekends. The studio is fully air-conditioned with mirrors, a dance floor, and a sound system. WhatsApp +91 90529 80859 to check availability."},
    {"question": "Which areas does Rhythmzz Academy serve?", "answer": "Rhythmzz Academy of Dance at Neredmet X Road serves students from Sainikpuri, AS Rao Nagar, Yapral, Malkajgiri, Hastinapuri, Kapra and surrounding areas in Secunderabad and East Hyderabad. Most students are within 15 minutes by drive."}
  ]$json$::jsonb),
  ('testimonials', $json$[
    {"name": "Pooja Reddy", "quote": "Rhythmzz is more than a dance studio — it's a family. Nitish Sir's energy is contagious and the technique training is unmatched in Secunderabad.", "programme": "Adults Dance", "rating": 5},
    {"name": "Suresh & Deepa", "quote": "Our 7-year-old daughter was shy before joining the kids batch. Now she leads performances with absolute confidence. Truly grateful!", "programme": "Kids Dance", "rating": 5},
    {"name": "Ananya Sharma", "quote": "The Kuchipudi training under traditional guidance is rigorous yet so nurturing. Beautiful studio atmosphere and excellent discipline.", "programme": "Kuchipudi Classical", "rating": 5}
  ]$json$::jsonb)
ON CONFLICT (content_key) DO UPDATE SET content_value = EXCLUDED.content_value;

-- ══ Admin user — run AFTER creating the admin login in Authentication ══
-- In Supabase Dashboard: Authentication → Add user → Email + Password.
-- Then copy the new user's UUID and run:
--   INSERT INTO public.users (id, role) VALUES ('<paste-auth-uid>', 'admin')
--   ON CONFLICT (id) DO UPDATE SET role = 'admin';
-- 005_functions.sql

-- Dashboard Analytics Function
CREATE OR REPLACE FUNCTION get_dashboard_analytics()
RETURNS JSONB AS $$
DECLARE
    v_active_students INT;
    v_enrollments_this_month INT;
    v_enrollments_last_month INT;
    v_revenue_this_month INT;
    v_avg_attendance_this_week NUMERIC;
    v_batch_occupancy JSONB;
BEGIN
    -- Active students
    SELECT COUNT(*) INTO v_active_students FROM students WHERE status = 'active';

    -- Enrollments this month
    SELECT COUNT(*) INTO v_enrollments_this_month FROM students 
    WHERE join_date >= date_trunc('month', CURRENT_DATE);

    -- Enrollments last month
    SELECT COUNT(*) INTO v_enrollments_last_month FROM students 
    WHERE join_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    AND join_date < date_trunc('month', CURRENT_DATE);

    -- Revenue this month
    SELECT COALESCE(SUM(amount), 0) INTO v_revenue_this_month FROM fee_payments
    WHERE paid_at >= date_trunc('month', CURRENT_DATE);

    -- Avg attendance rate this week (Present / Total records * 100)
    WITH weekly_attendance AS (
        SELECT 
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
            COUNT(*) as total_count
        FROM attendance
        WHERE date >= date_trunc('week', CURRENT_DATE)
    )
    SELECT 
        CASE WHEN total_count > 0 THEN ROUND((present_count::NUMERIC / total_count::NUMERIC) * 100, 2) ELSE 0 END
    INTO v_avg_attendance_this_week
    FROM weekly_attendance;

    -- Batch occupancy
    SELECT jsonb_agg(
        jsonb_build_object(
            'batch_id', b.id,
            'programme_name', p.name,
            'capacity', b.capacity,
            'enrolled', b.enrolled_count,
            'occupancy_percentage', CASE WHEN b.capacity > 0 THEN ROUND((b.enrolled_count::NUMERIC / b.capacity::NUMERIC) * 100, 2) ELSE 0 END
        )
    ) INTO v_batch_occupancy
    FROM batches b
    JOIN programmes p ON b.programme_id = p.id
    WHERE b.status = 'active';

    RETURN jsonb_build_object(
        'active_students', v_active_students,
        'enrollments_this_month', v_enrollments_this_month,
        'enrollments_last_month', v_enrollments_last_month,
        'revenue_this_month', v_revenue_this_month,
        'avg_attendance_this_week', v_avg_attendance_this_week,
        'batch_occupancy', COALESCE(v_batch_occupancy, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Student Attendance Summary Function
CREATE OR REPLACE FUNCTION get_student_attendance_summary(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_total_classes INT;
    v_present_count INT;
    v_absent_count INT;
    v_leave_count INT;
    v_percentage NUMERIC;
    v_last_30_days JSONB;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'present'),
        COUNT(*) FILTER (WHERE status = 'absent'),
        COUNT(*) FILTER (WHERE status = 'leave')
    INTO v_total_classes, v_present_count, v_absent_count, v_leave_count
    FROM attendance
    WHERE student_id = p_student_id;

    IF v_total_classes > 0 THEN
        v_percentage := ROUND((v_present_count::NUMERIC / v_total_classes::NUMERIC) * 100, 2);
    ELSE
        v_percentage := 0;
    END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'date', date,
            'status', status
        ) ORDER BY date DESC
    ) INTO v_last_30_days
    FROM attendance
    WHERE student_id = p_student_id AND date >= CURRENT_DATE - INTERVAL '30 days';

    RETURN jsonb_build_object(
        'total_classes', COALESCE(v_total_classes, 0),
        'present_count', COALESCE(v_present_count, 0),
        'absent_count', COALESCE(v_absent_count, 0),
        'leave_count', COALESCE(v_leave_count, 0),
        'percentage', v_percentage,
        'last_30_days', COALESCE(v_last_30_days, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check Consecutive Absences
CREATE OR REPLACE FUNCTION check_consecutive_absences(p_student_id UUID, p_threshold INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_consecutive_absences INT;
BEGIN
    WITH ordered_attendance AS (
        SELECT status
        FROM attendance
        WHERE student_id = p_student_id
        ORDER BY date DESC
        LIMIT p_threshold
    )
    SELECT COUNT(*) INTO v_consecutive_absences
    FROM ordered_attendance
    WHERE status = 'absent';

    RETURN v_consecutive_absences >= p_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment Batch Enrollment
CREATE OR REPLACE FUNCTION increment_batch_enrollment(p_batch_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_count INT;
    v_capacity INT;
BEGIN
    SELECT enrolled_count, capacity INTO v_current_count, v_capacity
    FROM batches
    WHERE id = p_batch_id FOR UPDATE;

    IF v_current_count >= v_capacity THEN
        RAISE EXCEPTION 'Batch is full';
    END IF;

    UPDATE batches
    SET enrolled_count = enrolled_count + 1,
        status = CASE WHEN enrolled_count + 1 >= capacity THEN 'full'::batch_status ELSE status END
    WHERE id = p_batch_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Decrement Batch Enrollment
CREATE OR REPLACE FUNCTION decrement_batch_enrollment(p_batch_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE batches
    SET enrolled_count = GREATEST(0, enrolled_count - 1),
        status = CASE WHEN enrolled_count - 1 < capacity AND status = 'full' THEN 'active'::batch_status ELSE status END
    WHERE id = p_batch_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ════════════════════════════════════════════════════════════════
-- 007_security.sql — RPC privilege lockdown + gallery storage write lockdown
--
-- Before this migration, every SECURITY DEFINER function was executable
-- by PUBLIC (PostgREST exposes them anonymously): revenue/occupancy via
-- get_dashboard_analytics(), any student's attendance via
-- get_student_attendance_summary()/check_consecutive_absences(), and
-- batch-count mutation via increment/decrement_batch_enrollment().
-- Storage write policies on the gallery bucket allowed ANY authenticated
-- user (i.e., any student) to insert/update/delete studio media.
-- ════════════════════════════════════════════════════════════════

-- ── 1. Revoke default PUBLIC EXECUTE, grant only the API + service roles ──
REVOKE EXECUTE ON FUNCTION public.get_dashboard_analytics() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_student_attendance_summary(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_consecutive_absences(uuid, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_batch_enrollment(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decrement_batch_enrollment(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_dashboard_analytics() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_student_attendance_summary(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_consecutive_absences(uuid, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_batch_enrollment(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.decrement_batch_enrollment(uuid) TO authenticated, service_role;

-- ── 2. Role-checked replacements ──
-- The webhook (service role) has no auth.uid(), so service-role calls are
-- recognized by auth.uid() IS NULL — reachable only after the revokes above.

-- Dashboard analytics: admin only
CREATE OR REPLACE FUNCTION public.get_dashboard_analytics()
RETURNS JSONB AS $$
DECLARE
    v_active_students INT;
    v_enrollments_this_month INT;
    v_enrollments_last_month INT;
    v_revenue_this_month INT;
    v_avg_attendance_this_week NUMERIC;
    v_batch_occupancy JSONB;
BEGIN
    IF public.get_user_role() <> 'admin' THEN
        RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
    END IF;

    -- Active students
    SELECT COUNT(*) INTO v_active_students FROM students WHERE status = 'active';

    -- Enrollments this month
    SELECT COUNT(*) INTO v_enrollments_this_month FROM students
    WHERE join_date >= date_trunc('month', CURRENT_DATE);

    -- Enrollments last month
    SELECT COUNT(*) INTO v_enrollments_last_month FROM students
    WHERE join_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    AND join_date < date_trunc('month', CURRENT_DATE);

    -- Revenue this month
    SELECT COALESCE(SUM(amount), 0) INTO v_revenue_this_month FROM fee_payments
    WHERE paid_at >= date_trunc('month', CURRENT_DATE);

    -- Avg attendance rate this week (Present / Total records * 100)
    WITH weekly_attendance AS (
        SELECT
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
            COUNT(*) as total_count
        FROM attendance
        WHERE date >= date_trunc('week', CURRENT_DATE)
    )
    SELECT
        CASE WHEN total_count > 0 THEN ROUND((present_count::NUMERIC / total_count::NUMERIC) * 100, 2) ELSE 0 END
    INTO v_avg_attendance_this_week
    FROM weekly_attendance;

    -- Batch occupancy
    SELECT jsonb_agg(
        jsonb_build_object(
            'batch_id', b.id,
            'programme_name', p.name,
            'capacity', b.capacity,
            'enrolled', b.enrolled_count,
            'occupancy_percentage', CASE WHEN b.capacity > 0 THEN ROUND((b.enrolled_count::NUMERIC / b.capacity::NUMERIC) * 100, 2) ELSE 0 END
        )
    ) INTO v_batch_occupancy
    FROM batches b
    JOIN programmes p ON b.programme_id = p.id
    WHERE b.status = 'active';

    RETURN jsonb_build_object(
        'active_students', v_active_students,
        'enrollments_this_month', v_enrollments_this_month,
        'enrollments_last_month', v_enrollments_last_month,
        'revenue_this_month', v_revenue_this_month,
        'avg_attendance_this_week', v_avg_attendance_this_week,
        'batch_occupancy', COALESCE(v_batch_occupancy, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Student attendance summary: admin, or the student themselves
CREATE OR REPLACE FUNCTION public.get_student_attendance_summary(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_total_classes INT;
    v_present_count INT;
    v_absent_count INT;
    v_leave_count INT;
    v_percentage NUMERIC;
    v_last_30_days JSONB;
BEGIN
    IF NOT (
        public.get_user_role() = 'admin'
        OR (
            public.get_user_role() = 'student'
            AND EXISTS (SELECT 1 FROM students WHERE auth_id = auth.uid() AND id = p_student_id)
        )
    ) THEN
        RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
    END IF;

    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'present'),
        COUNT(*) FILTER (WHERE status = 'absent'),
        COUNT(*) FILTER (WHERE status = 'leave')
    INTO v_total_classes, v_present_count, v_absent_count, v_leave_count
    FROM attendance
    WHERE student_id = p_student_id;

    IF v_total_classes > 0 THEN
        v_percentage := ROUND((v_present_count::NUMERIC / v_total_classes::NUMERIC) * 100, 2);
    ELSE
        v_percentage := 0;
    END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'date', date,
            'status', status
        ) ORDER BY date DESC
    ) INTO v_last_30_days
    FROM attendance
    WHERE student_id = p_student_id AND date >= CURRENT_DATE - INTERVAL '30 days';

    RETURN jsonb_build_object(
        'total_classes', COALESCE(v_total_classes, 0),
        'present_count', COALESCE(v_present_count, 0),
        'absent_count', COALESCE(v_absent_count, 0),
        'leave_count', COALESCE(v_leave_count, 0),
        'percentage', v_percentage,
        'last_30_days', COALESCE(v_last_30_days, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Consecutive absences: admin, or the student themselves
CREATE OR REPLACE FUNCTION public.check_consecutive_absences(p_student_id UUID, p_threshold INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_consecutive_absences INT;
BEGIN
    IF NOT (
        public.get_user_role() = 'admin'
        OR (
            public.get_user_role() = 'student'
            AND EXISTS (SELECT 1 FROM students WHERE auth_id = auth.uid() AND id = p_student_id)
        )
    ) THEN
        RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
    END IF;

    WITH ordered_attendance AS (
        SELECT status
        FROM attendance
        WHERE student_id = p_student_id
        ORDER BY date DESC
        LIMIT p_threshold
    )
    SELECT COUNT(*) INTO v_consecutive_absences
    FROM ordered_attendance
    WHERE status = 'absent';

    RETURN v_consecutive_absences >= p_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Batch enrollment counters: admin, or the service role (payment webhook)
CREATE OR REPLACE FUNCTION public.increment_batch_enrollment(p_batch_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_count INT;
    v_capacity INT;
BEGIN
    IF NOT (public.get_user_role() = 'admin' OR auth.uid() IS NULL) THEN
        RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
    END IF;

    SELECT enrolled_count, capacity INTO v_current_count, v_capacity
    FROM batches
    WHERE id = p_batch_id FOR UPDATE;

    IF v_current_count >= v_capacity THEN
        RAISE EXCEPTION 'Batch is full';
    END IF;

    UPDATE batches
    SET enrolled_count = enrolled_count + 1,
        status = CASE WHEN enrolled_count + 1 >= capacity THEN 'full'::batch_status ELSE status END
    WHERE id = p_batch_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.decrement_batch_enrollment(p_batch_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF NOT (public.get_user_role() = 'admin' OR auth.uid() IS NULL) THEN
        RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
    END IF;

    UPDATE batches
    SET enrolled_count = GREATEST(0, enrolled_count - 1),
        status = CASE WHEN enrolled_count - 1 < capacity AND status = 'full' THEN 'active'::batch_status ELSE status END
    WHERE id = p_batch_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- ── 3. Gallery storage: writes for admins only ──
-- (Public SELECT stays; uploads run under the admin session client.)
DROP POLICY IF EXISTS gallery_storage_authenticated_insert ON storage.objects;
DROP POLICY IF EXISTS gallery_storage_authenticated_update ON storage.objects;
DROP POLICY IF EXISTS gallery_storage_authenticated_delete ON storage.objects;
DROP POLICY IF EXISTS gallery_storage_admin_insert ON storage.objects;
DROP POLICY IF EXISTS gallery_storage_admin_update ON storage.objects;
DROP POLICY IF EXISTS gallery_storage_admin_delete ON storage.objects;
DROP POLICY IF EXISTS gallery_storage_admin_insert ON storage.objects;
CREATE POLICY gallery_storage_admin_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.get_user_role() = 'admin');
DROP POLICY IF EXISTS gallery_storage_admin_update ON storage.objects;
CREATE POLICY gallery_storage_admin_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND public.get_user_role() = 'admin');
DROP POLICY IF EXISTS gallery_storage_admin_delete ON storage.objects;
CREATE POLICY gallery_storage_admin_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND public.get_user_role() = 'admin');

-- ════════════════════════════════════════════════════════════════
-- 008_auth_provisioning.sql — keep public.users in sync with auth.users
--
-- Every role check in the app funnels through get_user_role(), which reads
-- public.users. Until now no trigger created that row, so any auth user
-- created outside the manual admin script (OTP sign-in, admin-created
-- student logins, Razorpay fulfilment) had no public.users row →
-- get_user_role() = NULL → treated as neither student nor admin.
-- This migration adds the standard Supabase handle_new_user trigger and
-- backfills every existing auth user.
-- ════════════════════════════════════════════════════════════════

-- Trigger function: create a student-role profile for every new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, role)
    VALUES (NEW.id, 'student')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users that have no public.users row yet
INSERT INTO public.users (id, role)
SELECT u.id, 'student'
FROM auth.users u
LEFT JOIN public.users pu ON pu.id = u.id
WHERE pu.id IS NULL;

-- ══ Fee ledger: monthly coverage ══
-- for_month marks which calendar month a payment covers. Backfill assumes
-- each historical payment covered its paid_at month (note when real data
-- needs correcting).
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS for_month DATE NULL;
UPDATE fee_payments SET for_month = date_trunc('month', paid_at)::date WHERE for_month IS NULL;
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_month ON fee_payments (student_id, for_month);

-- ══ Family-accounts prerequisite: drop phone uniqueness ══
-- Two siblings may share a parent's phone number. The non-unique
-- idx_students_phone (0002) already exists, so lookups stay fast.
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_phone_key;

-- ══ Default grants (platform parity) ══
-- Supabase's hosted platform grants table privileges to anon/authenticated/
-- service_role by default; local `supabase start` does not. RLS still gates
-- every row, so this mirrors platform behaviour exactly and keeps local and
-- production equal. Functions are NOT included: 0006_security revokes and
-- regrants each RPC explicitly, and a blanket ROUTINES grant would undo it.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ══ Payment order policies: anon checkout + student portal checkout ══
-- payment_orders was admin-only. These open exactly the two checkout
-- paths the app needs:
--   • enrol flow (anonymous visitor): create an order with no student row
--   • student portal: a logged-in student pays their own month
-- Rows remain invisible to both roles (no SELECT policy) — the order id
-- travels in the Razorpay checkout, and fulfilment runs as service_role.

DROP POLICY IF EXISTS payment_orders_anon_insert ON payment_orders;
DROP POLICY IF EXISTS payment_orders_anon_insert ON payment_orders;
CREATE POLICY payment_orders_anon_insert ON payment_orders FOR INSERT TO anon
  WITH CHECK (student_id IS NULL);

DROP POLICY IF EXISTS payment_orders_student_insert ON payment_orders;
DROP POLICY IF EXISTS payment_orders_student_insert ON payment_orders;
CREATE POLICY payment_orders_student_insert ON payment_orders FOR INSERT TO authenticated
  WITH CHECK (
    public.get_user_role() = 'student'
    AND (
      student_id IS NULL
      OR student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS payment_orders_student_update ON payment_orders;
DROP POLICY IF EXISTS payment_orders_student_update ON payment_orders;
CREATE POLICY payment_orders_student_update ON payment_orders FOR UPDATE TO authenticated
  USING (
    public.get_user_role() = 'student'
    AND student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
  );

-- Enquiries from the public contact form.
-- Anon visitors may submit (app-side rate limited); admins read/update via RLS.

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE enquiries IS 'Public contact-form enquiries, managed by admins';
COMMENT ON COLUMN enquiries.status IS 'new | contacted | closed';

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS enquiries_anon_insert ON enquiries;
CREATE POLICY enquiries_anon_insert ON enquiries
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS enquiries_admin_all ON enquiries;
CREATE POLICY enquiries_admin_all ON enquiries
  FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

-- Helpers: admin contact list + dashboard pending feed.
CREATE INDEX IF NOT EXISTS idx_enquiries_status_created ON enquiries (status, created_at DESC);

-- WhatsApp broadcast queue.
-- sendBroadcast enqueues rows instead of sending synchronously; the Vercel
-- cron (/api/cron/broadcast, every 5 min) drains with retries (max 3 attempts).
-- Fee reminders (/api/cron/fee-reminders) reuse the same queue.

CREATE TABLE IF NOT EXISTS broadcast_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone TEXT NOT NULL,
  template_name TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  attempts INT DEFAULT 0,
  last_error TEXT,
  log_id UUID REFERENCES broadcast_logs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE broadcast_queue IS 'Outbound WhatsApp messages waiting to be sent by the cron drain';
COMMENT ON COLUMN broadcast_queue.status IS 'pending | sent | failed';
COMMENT ON COLUMN broadcast_queue.attempts IS 'Send attempts, up to 3, before the drain marks the row failed';

DROP TRIGGER IF EXISTS update_broadcast_queue_updated_at ON broadcast_queue;
CREATE TRIGGER update_broadcast_queue_updated_at BEFORE UPDATE ON broadcast_queue
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE broadcast_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS broadcast_queue_admin_all ON broadcast_queue;
CREATE POLICY broadcast_queue_admin_all ON broadcast_queue
  FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

CREATE INDEX IF NOT EXISTS idx_broadcast_queue_status_created ON broadcast_queue (status, created_at);

-- ══ Realtime: live updates for dashboards ══
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE attendance; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE fee_payments; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE studio_rentals; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE students; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
