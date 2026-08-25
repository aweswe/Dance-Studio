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
