-- Migration 0021: Atomic Batch Switch Request Resolution
-- Wraps approval, student reassignment, dual-batch capacity synchronization,
-- and fee-audit logging in a single ACID transaction with row-level locking.

CREATE OR REPLACE FUNCTION public.resolve_batch_switch_request_atomic(
  p_request_id UUID,
  p_decision TEXT,
  p_admin_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_req RECORD;
  v_target_batch RECORD;
  v_student RECORD;
  v_target_prog RECORD;
  v_live_enrolled INT;
  v_old_fee INT := 0;
  v_new_fee INT := 0;
  v_fee_diff INT := 0;
  v_audit_note TEXT;
  v_final_note TEXT;
BEGIN
  -- Validate decision input
  IF p_decision NOT IN ('approved', 'declined') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid decision. Must be approved or declined.');
  END IF;

  -- 1. Lock the switch request row to prevent concurrent / duplicate resolution
  SELECT * INTO v_req
  FROM public.batch_switch_requests
  WHERE id = p_request_id AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request not found or already resolved.');
  END IF;

  v_final_note := p_admin_note;

  IF p_decision = 'approved' THEN
    -- 2. Lock the target batch row
    SELECT id, programme_id, status, capacity, enrolled_count
    INTO v_target_batch
    FROM public.batches
    WHERE id = v_req.requested_batch_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'Target batch not found.');
    END IF;

    -- 3. Live capacity check against active students
    SELECT COUNT(*) INTO v_live_enrolled
    FROM public.students
    WHERE batch_id = v_target_batch.id AND status = 'active';

    IF v_target_batch.capacity > 0 AND v_live_enrolled >= v_target_batch.capacity THEN
      RETURN jsonb_build_object('success', false, 'error', 'Target batch is already at full capacity. Decline or choose another batch.');
    END IF;

    -- 4. Get old student programme and fee info
    SELECT s.programme_id, p.name AS prog_name, p.fees_monthly
    INTO v_student
    FROM public.students s
    LEFT JOIN public.programmes p ON p.id = s.programme_id
    WHERE s.id = v_req.student_id;

    -- Get target programme fee info
    SELECT name AS prog_name, fees_monthly
    INTO v_target_prog
    FROM public.programmes
    WHERE id = v_target_batch.programme_id;

    v_old_fee := COALESCE(v_student.fees_monthly, 0);
    v_new_fee := COALESCE(v_target_prog.fees_monthly, 0);

    IF v_new_fee > v_old_fee AND v_old_fee > 0 THEN
      v_fee_diff := v_new_fee - v_old_fee;
      v_audit_note := '[Programme Upgrade: ' || COALESCE(v_student.prog_name, 'Old Track') || ' (₹' || v_old_fee || ') → ' || COALESCE(v_target_prog.prog_name, 'New Track') || ' (₹' || v_new_fee || '). Fee difference of ₹' || v_fee_diff || '/mo applicable]';
      IF v_final_note IS NOT NULL AND trim(v_final_note) <> '' THEN
        v_final_note := trim(v_final_note) || ' · ' || v_audit_note;
      ELSE
        v_final_note := v_audit_note;
      END IF;
    END IF;

    -- 5. Reassign student to new batch and programme
    UPDATE public.students
    SET batch_id = v_target_batch.id,
        programme_id = v_target_batch.programme_id,
        status = 'active'
    WHERE id = v_req.student_id;

    -- 6. Recalculate and update old batch enrolled_count & status
    IF v_req.current_batch_id IS NOT NULL THEN
      WITH old_count AS (
        SELECT COUNT(*) AS cnt
        FROM public.students
        WHERE batch_id = v_req.current_batch_id AND status = 'active'
      )
      UPDATE public.batches b
      SET enrolled_count = old_count.cnt,
          status = CASE
            WHEN b.capacity > 0 AND old_count.cnt >= b.capacity THEN 'full'::public.batch_status
            WHEN b.status = 'full'::public.batch_status THEN 'active'::public.batch_status
            ELSE b.status
          END
      FROM old_count
      WHERE b.id = v_req.current_batch_id;
    END IF;

    -- 7. Recalculate and update new batch enrolled_count & status
    WITH new_count AS (
      SELECT COUNT(*) AS cnt
      FROM public.students
      WHERE batch_id = v_target_batch.id AND status = 'active'
    )
    UPDATE public.batches b
    SET enrolled_count = new_count.cnt,
        status = CASE
          WHEN b.capacity > 0 AND new_count.cnt >= b.capacity THEN 'full'::public.batch_status
          WHEN b.status = 'full'::public.batch_status THEN 'active'::public.batch_status
          ELSE b.status
        END
    FROM new_count
    WHERE b.id = v_target_batch.id;

  END IF;

  -- 8. Mark switch request resolved with audit notes and timestamp
  UPDATE public.batch_switch_requests
  SET status = p_decision,
      admin_note = v_final_note,
      resolved_at = timezone('utc'::text, now())
  WHERE id = p_request_id;

  RETURN jsonb_build_object(
    'success', true,
    'decision', p_decision,
    'admin_note', v_final_note
  );
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.resolve_batch_switch_request_atomic(UUID, TEXT, TEXT) TO authenticated, service_role;
