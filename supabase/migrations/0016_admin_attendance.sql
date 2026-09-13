-- 0016_admin_attendance.sql
-- Only academy admin may write attendance. Instructors keep read access
-- on their own batches so they can see the roster. Students keep SELECT
-- on their own marks. Students cannot self-approve leave requests.

-- Attendance: drop instructor write, keep instructor SELECT
DROP POLICY IF EXISTS attendance_instructor_read_write ON attendance;
DROP POLICY IF EXISTS attendance_instructor_read ON attendance;
CREATE POLICY attendance_instructor_read ON attendance FOR SELECT USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
        SELECT id FROM batches WHERE instructor_id = (
            SELECT id FROM instructors WHERE auth_id = (SELECT auth.uid())
        )
    )
);

-- Leave: students may read and insert pending rows, not change status
DROP POLICY IF EXISTS leave_requests_own ON leave_requests;
DROP POLICY IF EXISTS leave_requests_own_select ON leave_requests;
DROP POLICY IF EXISTS leave_requests_own_insert ON leave_requests;
CREATE POLICY leave_requests_own_select ON leave_requests FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
CREATE POLICY leave_requests_own_insert ON leave_requests FOR INSERT
  WITH CHECK (
    student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
    AND status = 'pending'
  );

-- Leave: instructors may read and review (update) their own batches only
DROP POLICY IF EXISTS leave_requests_instructor ON leave_requests;
DROP POLICY IF EXISTS leave_requests_instructor_select ON leave_requests;
DROP POLICY IF EXISTS leave_requests_instructor_update ON leave_requests;
CREATE POLICY leave_requests_instructor_select ON leave_requests FOR SELECT
  USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
      SELECT id FROM batches WHERE instructor_id IN (
        SELECT id FROM instructors WHERE auth_id = auth.uid()
      )
    )
  );
CREATE POLICY leave_requests_instructor_update ON leave_requests FOR UPDATE
  USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
      SELECT id FROM batches WHERE instructor_id IN (
        SELECT id FROM instructors WHERE auth_id = auth.uid()
      )
    )
  );
