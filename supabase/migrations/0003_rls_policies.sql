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
CREATE POLICY users_read_own ON users FOR SELECT USING (id = (SELECT auth.uid()));
CREATE POLICY users_read_admin ON users FOR SELECT USING (public.get_user_role() = 'admin');

-- 2. programmes
CREATE POLICY programmes_read_active ON programmes FOR SELECT USING (is_active = true OR public.get_user_role() = 'admin');
CREATE POLICY programmes_admin_all ON programmes FOR ALL USING (public.get_user_role() = 'admin');

-- 3. batches
CREATE POLICY batches_read_active ON batches FOR SELECT USING (status != 'paused' OR public.get_user_role() = 'admin');
CREATE POLICY batches_admin_all ON batches FOR ALL USING (public.get_user_role() = 'admin');

-- 4. instructors
CREATE POLICY instructors_read_active ON instructors FOR SELECT USING (is_active = true OR public.get_user_role() = 'admin');
CREATE POLICY instructors_admin_all ON instructors FOR ALL USING (public.get_user_role() = 'admin');

-- 5. students
CREATE POLICY students_read_own ON students FOR SELECT USING (auth_id = (SELECT auth.uid()));
CREATE POLICY students_read_instructor ON students FOR SELECT USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);
CREATE POLICY students_admin_all ON students FOR ALL USING (public.get_user_role() = 'admin');

-- 6. attendance
CREATE POLICY attendance_read_own ON attendance FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE auth_id = (SELECT auth.uid()))
);
CREATE POLICY attendance_instructor_read_write ON attendance FOR ALL USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);
CREATE POLICY attendance_admin_all ON attendance FOR ALL USING (public.get_user_role() = 'admin');

-- 7. fee_payments
CREATE POLICY fee_payments_read_own ON fee_payments FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE auth_id = (SELECT auth.uid()))
);
CREATE POLICY fee_payments_admin_all ON fee_payments FOR ALL USING (public.get_user_role() = 'admin');

-- 8. payment_orders
CREATE POLICY payment_orders_admin_all ON payment_orders FOR ALL USING (public.get_user_role() = 'admin');

-- 9. broadcast_logs
CREATE POLICY broadcast_logs_admin_all ON broadcast_logs FOR ALL USING (public.get_user_role() = 'admin');

-- 10. studio_rentals
CREATE POLICY studio_rentals_insert_anon ON studio_rentals FOR INSERT WITH CHECK (true);
CREATE POLICY studio_rentals_admin_all ON studio_rentals FOR ALL USING (public.get_user_role() = 'admin');

-- 11. gallery
CREATE POLICY gallery_read_visible ON gallery FOR SELECT USING (is_visible = true OR public.get_user_role() = 'admin');
CREATE POLICY gallery_admin_all ON gallery FOR ALL USING (public.get_user_role() = 'admin');

-- 12. site_content
CREATE POLICY site_content_read_all ON site_content FOR SELECT USING (true);
CREATE POLICY site_content_admin_all ON site_content FOR ALL USING (public.get_user_role() = 'admin');

-- 13. kuchipudi_progress
CREATE POLICY kuchipudi_progress_read_own ON kuchipudi_progress FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE auth_id = (SELECT auth.uid()))
);
CREATE POLICY kuchipudi_progress_instructor_read ON kuchipudi_progress FOR SELECT USING (
    public.get_user_role() = 'instructor' AND student_id IN (
        SELECT id FROM students WHERE batch_id IN (
            SELECT id FROM batches WHERE instructor_id = (
                SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
            )
        )
    )
);
CREATE POLICY kuchipudi_progress_admin_all ON kuchipudi_progress FOR ALL USING (public.get_user_role() = 'admin');

-- 14. blog_posts
CREATE POLICY blog_posts_read_published ON blog_posts FOR SELECT USING (is_published = true OR public.get_user_role() = 'admin');
CREATE POLICY blog_posts_admin_all ON blog_posts FOR ALL USING (public.get_user_role() = 'admin');
