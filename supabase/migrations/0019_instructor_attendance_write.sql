-- 0019_instructor_attendance_write.sql
-- Restore instructor write access for attendance on their assigned batches.
-- Admin retains full access via attendance_admin_all policy.

DROP POLICY IF EXISTS attendance_instructor_read ON attendance;
DROP POLICY IF EXISTS attendance_instructor_read_write ON attendance;

CREATE POLICY attendance_instructor_read ON attendance FOR SELECT USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);

CREATE POLICY attendance_instructor_write ON attendance FOR INSERT WITH CHECK (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);

CREATE POLICY attendance_instructor_update ON attendance FOR UPDATE USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);
