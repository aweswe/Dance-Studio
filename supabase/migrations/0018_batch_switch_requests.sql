-- Students request a batch change after initial enrolment; admin approves.

CREATE TABLE IF NOT EXISTS batch_switch_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  current_batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  requested_batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_batch_switch_one_pending
  ON batch_switch_requests (student_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_batch_switch_status_created
  ON batch_switch_requests (status, created_at DESC);

ALTER TABLE batch_switch_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS batch_switch_student_insert ON batch_switch_requests;
CREATE POLICY batch_switch_student_insert ON batch_switch_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
  );

DROP POLICY IF EXISTS batch_switch_student_read ON batch_switch_requests;
CREATE POLICY batch_switch_student_read ON batch_switch_requests
  FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
    OR public.get_user_role() = 'admin'
  );

DROP POLICY IF EXISTS batch_switch_admin_all ON batch_switch_requests;
CREATE POLICY batch_switch_admin_all ON batch_switch_requests
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

GRANT ALL ON TABLE public.batch_switch_requests TO anon, authenticated, service_role;
