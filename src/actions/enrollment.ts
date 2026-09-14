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
    if (target.status === 'paused') {
      return { success: false, error: 'Target batch is paused. Decline or ask the student to pick an active batch.' };
    }
    if (target.status === 'full' || (target.capacity > 0 && target.enrolled_count >= target.capacity)) {
      return { success: false, error: 'Target batch is full. Decline or pick another batch manually.' };
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
