'use server';

import { createAdminSupabase, createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function joinWaitlist(batchId: string) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student?.id || !student.phone) {
    return { success: false, error: 'Sign in with a phone number first.' };
  }

  const admin = createAdminSupabase();
  const { error } = await admin.from('batch_waitlist').insert({
    batch_id: batchId,
    student_id: student.id,
    name: student.name,
    phone: student.phone,
  } as any);

  if (error) {
    if (error.code === '23505') return { success: false, error: 'You are already on this waitlist.' };
    return { success: false, error: error.message };
  }

  revalidatePath('/student/classes');
  return { success: true };
}

export async function requestBatchSwitch(requestedBatchId: string, note?: string) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student?.id) {
    return { success: false, error: 'Student profile not found.' };
  }
  if (!student.batch_id) {
    return { success: false, error: 'Enrol in a class first, then you can request a switch.' };
  }
  if (student.batch_id === requestedBatchId) {
    return { success: false, error: 'That is already your current batch.' };
  }

  const admin = createAdminSupabase();

  const { data: pending } = await admin
    .from('batch_switch_requests')
    .select('id')
    .eq('student_id', student.id)
    .eq('status', 'pending')
    .maybeSingle();

  if (pending) {
    return { success: false, error: 'You already have a pending switch request. The studio will respond soon.' };
  }

  const { data: batch, error: batchErr } = await admin
    .from('batches')
    .select('id, programme_id, status, capacity, enrolled_count')
    .eq('id', requestedBatchId)
    .single();

  if (batchErr || !batch) {
    return { success: false, error: 'Selected batch was not found.' };
  }

  const b = batch as any;
  if (b.status === 'paused') {
    return { success: false, error: 'That batch is not open for enrolment right now.' };
  }

  const { error } = await admin.from('batch_switch_requests').insert({
    student_id: student.id,
    current_batch_id: student.batch_id,
    requested_batch_id: requestedBatchId,
    note: note?.trim() || null,
    status: 'pending',
  } as any);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/student/classes');
  revalidatePath('/admin/switch-requests');
  return { success: true };
}

export async function cancelBatchSwitchRequest(requestId: string) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student?.id) return { success: false, error: 'Not signed in' };

  const admin = createAdminSupabase();
  const { error } = await admin
    .from('batch_switch_requests')
    .update({ status: 'declined', admin_note: 'Cancelled by student', resolved_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('student_id', student.id)
    .eq('status', 'pending');

  if (error) return { success: false, error: error.message };

  revalidatePath('/student/classes');
  revalidatePath('/admin/switch-requests');
  return { success: true };
}

async function assertAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: 'Not signed in' };

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return { ok: false as const, error: 'Admin only' };
  return { ok: true as const };
}

export async function syncBatchCount(admin: any, batchId: string | null | undefined) {
  if (!batchId) return;
  try {
    const { count } = await admin
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('batch_id', batchId)
      .eq('status', 'active');

    const enrolled = count ?? 0;
    const { data: batch } = await admin
      .from('batches')
      .select('capacity, status')
      .eq('id', batchId)
      .maybeSingle();

    if (batch) {
      const isFull = batch.capacity > 0 && enrolled >= batch.capacity;
      const nextStatus = isFull ? 'full' : (batch.status === 'full' ? 'active' : batch.status);
      await admin
        .from('batches')
        .update({
          enrolled_count: enrolled,
          status: nextStatus,
        })
        .eq('id', batchId);
    }
  } catch (err) {
    console.error('syncBatchCount error for batch:', batchId, err);
  }
}

export async function resolveBatchSwitchRequest(
  requestId: string,
  decision: 'approved' | 'declined',
  adminNote?: string,
) {
  const auth = await assertAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const admin = createAdminSupabase();
  const { data: req, error: reqErr } = await admin
    .from('batch_switch_requests')
    .select('*, requested:requested_batch_id(id, programme_id, status, capacity, enrolled_count)')
    .eq('id', requestId)
    .eq('status', 'pending')
    .maybeSingle();

  if (reqErr || !req) {
    return { success: false, error: 'Request not found or already resolved.' };
  }

  const row = req as any;

  if (decision === 'approved') {
    const target = row.requested;
    if (!target) return { success: false, error: 'Target batch not found.' };

    // Accurate live capacity check against current active students
    const { count: liveEnrolled } = await admin
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('batch_id', target.id)
      .eq('status', 'active');

    if (target.capacity > 0 && (liveEnrolled ?? 0) >= target.capacity) {
      return { success: false, error: 'Target batch is already at full capacity. Decline or choose another batch.' };
    }

    // Check pricing difference between old and new programme
    const { data: studentBefore } = await admin
      .from('students')
      .select('programme_id, programme:programmes(name, fees_monthly)')
      .eq('id', row.student_id)
      .maybeSingle();

    const { data: targetProg } = await admin
      .from('programmes')
      .select('name, fees_monthly')
      .eq('id', target.programme_id)
      .maybeSingle();

    let feeNote = '';
    const oldFee = (studentBefore as any)?.programme?.fees_monthly ?? 0;
    const newFee = (targetProg as any)?.fees_monthly ?? 0;
    if (newFee > oldFee && oldFee > 0) {
      const diff = newFee - oldFee;
      feeNote = `[Programme Upgrade: ${(studentBefore as any)?.programme?.name || 'Old Track'} (₹${oldFee}) → ${(targetProg as any)?.name || 'New Track'} (₹${newFee}). Fee difference of ₹${diff}/mo applicable]`;
    }

    const { error: studentErr } = await admin
      .from('students')
      .update({
        batch_id: target.id,
        programme_id: target.programme_id,
        status: 'active',
      })
      .eq('id', row.student_id);

    if (studentErr) return { success: false, error: studentErr.message };

    // Sync old and new batch counters atomically
    await Promise.all([
      syncBatchCount(admin, row.current_batch_id),
      syncBatchCount(admin, target.id),
    ]);

    if (feeNote) {
      adminNote = adminNote ? `${adminNote.trim()} · ${feeNote}` : feeNote;
    }
  }

  const { error: updateErr } = await admin
    .from('batch_switch_requests')
    .update({
      status: decision,
      admin_note: adminNote?.trim() || null,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (updateErr) return { success: false, error: updateErr.message };

  revalidatePath('/admin/switch-requests');
  revalidatePath('/student/classes');
  revalidatePath('/student/schedule');
  return { success: true };
}
