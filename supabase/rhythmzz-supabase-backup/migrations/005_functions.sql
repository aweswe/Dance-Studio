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
