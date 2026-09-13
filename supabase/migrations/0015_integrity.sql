-- 0015_integrity.sql
-- Phase 0–4 schema: payment integrity, family-safe RLS, fee months,
-- enrollment trigger, attendance-per-batch, waitlist, leave, events,
-- notice reads, bilingual broadcasts, GST receipts, UPI pending status.

-- ══ Payment orders: never let a student PATCH amount/status ══
DROP POLICY IF EXISTS payment_orders_student_update ON payment_orders;
DROP POLICY IF EXISTS payment_orders_student_insert ON payment_orders;
CREATE POLICY payment_orders_student_insert ON payment_orders FOR INSERT TO authenticated
  WITH CHECK (
    public.get_user_role() = 'student'
    AND (
      student_id IS NULL
      OR student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
    )
  );

ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'monthly';
ALTER TABLE payment_orders DROP CONSTRAINT IF EXISTS payment_orders_plan_check;
ALTER TABLE payment_orders ADD CONSTRAINT payment_orders_plan_check
  CHECK (plan IS NULL OR plan IN ('monthly', 'quarterly'));

-- ══ Unique Razorpay payment ids (NULLs remain allowed) ══
CREATE UNIQUE INDEX IF NOT EXISTS fee_payments_razorpay_payment_id_key
  ON fee_payments (razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;

-- ══ Fee coverage + GST receipt + confirmation status ══
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS receipt_number TEXT;
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed';
ALTER TABLE fee_payments DROP CONSTRAINT IF EXISTS fee_payments_status_check;
ALTER TABLE fee_payments ADD CONSTRAINT fee_payments_status_check
  CHECK (status IN ('pending', 'confirmed', 'rejected'));

CREATE UNIQUE INDEX IF NOT EXISTS fee_payments_receipt_number_key
  ON fee_payments (receipt_number)
  WHERE receipt_number IS NOT NULL;

-- Deduplicate same-month coverage before unique index
DELETE FROM fee_payments a
USING fee_payments b
WHERE a.student_id IS NOT NULL
  AND a.for_month IS NOT NULL
  AND a.student_id = b.student_id
  AND a.for_month = b.for_month
  AND a.id > b.id;

CREATE UNIQUE INDEX IF NOT EXISTS fee_payments_student_month_unique
  ON fee_payments (student_id, for_month)
  WHERE student_id IS NOT NULL AND for_month IS NOT NULL
    AND COALESCE(status, 'confirmed') = 'confirmed';

CREATE SEQUENCE IF NOT EXISTS receipt_seq START 1;

CREATE OR REPLACE FUNCTION assign_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL AND COALESCE(NEW.status, 'confirmed') = 'confirmed' THEN
    NEW.receipt_number := 'RHY-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('receipt_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_receipt_number ON fee_payments;
CREATE TRIGGER set_receipt_number
  BEFORE INSERT OR UPDATE OF status ON fee_payments
  FOR EACH ROW EXECUTE FUNCTION assign_receipt_number();

-- Backfill receipt numbers for existing confirmed rows
UPDATE fee_payments
SET receipt_number = 'RHY-' || to_char(COALESCE(paid_at, now()), 'YYYY') || '-' || lpad(nextval('receipt_seq')::text, 5, '0')
WHERE receipt_number IS NULL AND COALESCE(status, 'confirmed') = 'confirmed';

-- ══ Attendance: one mark per student per batch per day ══
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_student_id_date_key;
DROP INDEX IF EXISTS attendance_student_id_date_key;
CREATE UNIQUE INDEX IF NOT EXISTS attendance_student_batch_date_key
  ON attendance (student_id, batch_id, date);

-- ══ Instructor auth_id unique ══
CREATE UNIQUE INDEX IF NOT EXISTS instructors_auth_id_unique
  ON instructors (auth_id)
  WHERE auth_id IS NOT NULL;

-- ══ Enrolled count from live student rows ══
CREATE OR REPLACE FUNCTION refresh_batch_enrolled_count(p_batch_id UUID)
RETURNS VOID AS $$
DECLARE
  v_count INT;
  v_capacity INT;
BEGIN
  IF p_batch_id IS NULL THEN RETURN; END IF;
  SELECT COUNT(*) INTO v_count
    FROM students WHERE batch_id = p_batch_id AND status = 'active';
  SELECT capacity INTO v_capacity FROM batches WHERE id = p_batch_id;
  UPDATE batches SET
    enrolled_count = v_count,
    status = CASE
      WHEN status = 'paused' THEN 'paused'::batch_status
      WHEN v_capacity > 0 AND v_count >= v_capacity THEN 'full'::batch_status
      ELSE 'active'::batch_status
    END
  WHERE id = p_batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION students_enrollment_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_batch_enrolled_count(OLD.batch_id);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.batch_id IS DISTINCT FROM NEW.batch_id OR OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM refresh_batch_enrolled_count(OLD.batch_id);
      PERFORM refresh_batch_enrolled_count(NEW.batch_id);
    END IF;
    RETURN NEW;
  ELSE
    PERFORM refresh_batch_enrolled_count(NEW.batch_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS students_enrollment_sync ON students;
CREATE TRIGGER students_enrollment_sync
  AFTER INSERT OR UPDATE OF batch_id, status OR DELETE ON students
  FOR EACH ROW EXECUTE FUNCTION students_enrollment_sync();

UPDATE batches b SET enrolled_count = (
  SELECT COUNT(*) FROM students s WHERE s.batch_id = b.id AND s.status = 'active'
);

-- Capacity-check RPCs (count is maintained by the trigger — do not increment here)
CREATE OR REPLACE FUNCTION public.increment_batch_enrollment(p_batch_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_batch RECORD;
BEGIN
  IF public.get_user_role() IS DISTINCT FROM 'admin'
     AND public.get_user_role() IS DISTINCT FROM 'instructor'
     AND auth.uid() IS NOT NULL
     AND public.get_user_role() IS DISTINCT FROM 'student' THEN
    RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_batch FROM batches WHERE id = p_batch_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Batch not found'; END IF;
  IF v_batch.capacity > 0 AND COALESCE(v_batch.enrolled_count, 0) >= v_batch.capacity THEN
    RAISE EXCEPTION 'Batch is full';
  END IF;
  PERFORM refresh_batch_enrolled_count(p_batch_id);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.decrement_batch_enrollment(p_batch_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF public.get_user_role() IS DISTINCT FROM 'admin'
     AND public.get_user_role() IS DISTINCT FROM 'instructor'
     AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
  END IF;
  PERFORM refresh_batch_enrolled_count(p_batch_id);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- True consecutive-absence streak
CREATE OR REPLACE FUNCTION public.check_consecutive_absences(p_student_id UUID, p_threshold INT)
RETURNS BOOLEAN AS $$
DECLARE
  v_streak INT := 0;
  v_row RECORD;
BEGIN
  IF public.get_user_role() NOT IN ('admin', 'instructor', 'student') THEN
    RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
  END IF;
  IF public.get_user_role() = 'student' THEN
    IF NOT EXISTS (
      SELECT 1 FROM students WHERE id = p_student_id AND auth_id = auth.uid()
    ) THEN
      RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
    END IF;
  END IF;

  FOR v_row IN
    SELECT status FROM attendance
    WHERE student_id = p_student_id
    ORDER BY date DESC
    LIMIT GREATEST(p_threshold, 1)
  LOOP
    IF v_row.status = 'absent' THEN
      v_streak := v_streak + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN v_streak >= p_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Instructor write on kuchipudi progress for their batch students
DROP POLICY IF EXISTS kuchipudi_progress_instructor_write ON kuchipudi_progress;
CREATE POLICY kuchipudi_progress_instructor_write ON kuchipudi_progress
  FOR ALL USING (
    public.get_user_role() = 'instructor' AND student_id IN (
      SELECT s.id FROM students s
      JOIN batches b ON b.id = s.batch_id
      JOIN instructors i ON i.id = b.instructor_id
      WHERE i.auth_id = auth.uid()
    )
  );

-- ══ Bilingual broadcasts ══
ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS message_te TEXT;
ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS message_hi TEXT;

-- ══ Notice reads (unread badges) ══
CREATE TABLE IF NOT EXISTS notice_reads (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_id UUID NOT NULL REFERENCES broadcast_logs(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, log_id)
);
ALTER TABLE notice_reads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notice_reads_own ON notice_reads;
CREATE POLICY notice_reads_own ON notice_reads FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS notice_reads_admin ON notice_reads;
CREATE POLICY notice_reads_admin ON notice_reads FOR ALL
  USING (public.get_user_role() = 'admin');

-- ══ Waitlist ══
CREATE TABLE IF NOT EXISTS batch_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (batch_id, phone)
);
ALTER TABLE batch_waitlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS waitlist_admin_all ON batch_waitlist;
CREATE POLICY waitlist_admin_all ON batch_waitlist FOR ALL
  USING (public.get_user_role() = 'admin');
DROP POLICY IF EXISTS waitlist_student_insert ON batch_waitlist;
CREATE POLICY waitlist_student_insert ON batch_waitlist FOR INSERT TO authenticated
  WITH CHECK (
    student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
  );
DROP POLICY IF EXISTS waitlist_student_read ON batch_waitlist;
CREATE POLICY waitlist_student_read ON batch_waitlist FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
         OR public.get_user_role() = 'admin');

-- ══ Leave / makeup requests ══
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  kind TEXT NOT NULL DEFAULT 'leave' CHECK (kind IN ('leave', 'makeup')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
DROP TRIGGER IF EXISTS update_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS leave_requests_own ON leave_requests;
CREATE POLICY leave_requests_own ON leave_requests FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
DROP POLICY IF EXISTS leave_requests_admin ON leave_requests;
CREATE POLICY leave_requests_admin ON leave_requests FOR ALL
  USING (public.get_user_role() = 'admin');
DROP POLICY IF EXISTS leave_requests_instructor ON leave_requests;
CREATE POLICY leave_requests_instructor ON leave_requests FOR ALL
  USING (
    public.get_user_role() = 'instructor' AND batch_id IN (
      SELECT id FROM batches WHERE instructor_id IN (
        SELECT id FROM instructors WHERE auth_id = auth.uid()
      )
    )
  );

-- ══ Annual-day / events + RSVP ══
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  venue TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS events_read_published ON events;
CREATE POLICY events_read_published ON events FOR SELECT
  USING (is_published = true OR public.get_user_role() = 'admin');
DROP POLICY IF EXISTS events_admin_all ON events;
CREATE POLICY events_admin_all ON events FOR ALL
  USING (public.get_user_role() = 'admin');
DROP POLICY IF EXISTS event_rsvps_insert_anon ON event_rsvps;
CREATE POLICY event_rsvps_insert_anon ON event_rsvps FOR INSERT
  WITH CHECK (true);
DROP POLICY IF EXISTS event_rsvps_admin_all ON event_rsvps;
CREATE POLICY event_rsvps_admin_all ON event_rsvps FOR ALL
  USING (public.get_user_role() = 'admin');

INSERT INTO events (title, slug, starts_at, venue, description, is_published)
VALUES (
  'Rhythmzz Annual Day',
  'annual-day',
  '2026-12-20 18:00:00+05:30',
  'Rhythmzz Academy, Neredmet X Road, Secunderabad',
  'Our yearly stage showcase — kids, adults, fitness, and Kuchipudi. RSVP so we can save seats for your family.',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Grants for new tables (0011 ran before these existed)
GRANT ALL ON TABLE public.notice_reads TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.batch_waitlist TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.leave_requests TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.events TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.event_rsvps TO anon, authenticated, service_role;
