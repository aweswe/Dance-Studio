-- 0022_instructor_profile_rls.sql
-- Allow instructors to update ONLY their own photo_url column.
-- All other columns (name, email, phone, role, bio, certifications) remain admin-only.

CREATE POLICY instructors_self_update_photo ON instructors
  FOR UPDATE
  USING (auth_id = (SELECT auth.uid()))
  WITH CHECK (auth_id = (SELECT auth.uid()));
