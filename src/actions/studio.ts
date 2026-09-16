'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { getLinkedInstructor } from '@/lib/auth/instructor';
import { revalidatePath } from 'next/cache';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';

export async function requestLeave(input: {
  date: string;
  kind: 'leave' | 'makeup';
  notes?: string;
}) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student?.id) return { success: false, error: 'Not signed in' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return { success: false, error: 'Pick a valid date' };
  }

  const admin = createAdminSupabase();
  const { error } = await admin.from('leave_requests').insert({
    student_id: student.id,
    batch_id: student.batch_id || student.batch?.id || null,
    date: input.date,
    kind: input.kind,
    notes: input.notes || null,
    status: 'pending',
  } as any);
  if (error) return { success: false, error: error.message };
  revalidatePath('/student/attendance');
  revalidatePath('/student/leave');
  revalidatePath('/admin/attendance');
  return { success: true };
}

/**
 * Student submits a platform-leave (dropout) request with a mandatory reason.
 * Stored as kind='platform_leave' in leave_requests; date = submission date.
 */
export async function submitPlatformLeave(reason: string) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student?.id) return { success: false, error: 'Not signed in' };

  const trimmed = reason.trim();
  if (!trimmed || trimmed.length < 10) {
    return { success: false, error: 'Please share a reason (at least 10 characters).' };
  }

  const admin = createAdminSupabase();

  // Prevent duplicate pending requests
  const { data: existing } = await admin
    .from('leave_requests')
    .select('id')
    .eq('student_id', student.id)
    .eq('kind', 'platform_leave')
    .eq('status', 'pending')
    .maybeSingle();

  if (existing) {
    return { success: false, error: 'You already have a pending withdrawal request. The admin will be in touch.' };
  }

  const today = new Date().toISOString().split('T')[0];
  const { error } = await admin.from('leave_requests').insert({
    student_id: student.id,
    batch_id: student.batch_id || student.batch?.id || null,
    date: today,
    kind: 'platform_leave',
    notes: trimmed,
    status: 'pending',
  } as any);

  if (error) return { success: false, error: error.message };
  revalidatePath('/student/leave');
  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin acknowledges / closes a platform-leave request.
 * When approved, also marks the student as 'left' to revoke portal access.
 */
export async function acknowledgePlatformLeave(id: string, status: 'approved' | 'declined') {
  const supabase = await createServerSupabase();
  const adminOk = await isAdmin(supabase);
  if (!adminOk) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();

  // Fetch the leave request to get the student ID
  const { data: leaveRow } = await admin
    .from('leave_requests')
    .select('student_id')
    .eq('id', id)
    .eq('kind', 'platform_leave')
    .maybeSingle();

  const { error } = await admin
    .from('leave_requests')
    .update({ status } as any)
    .eq('id', id)
    .eq('kind', 'platform_leave');
  if (error) return { success: false, error: error.message };

  // When approved: mark student as 'left' — blocks their portal on next check
  if (status === 'approved' && leaveRow?.student_id) {
    await admin
      .from('students')
      .update({ status: 'left' } as any)
      .eq('id', leaveRow.student_id);
  }

  revalidatePath('/admin');
  revalidatePath('/student/leave');
  return { success: true };
}



export async function reviewLeaveRequest(id: string, status: 'approved' | 'declined') {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not signed in' };

  const adminOk = await isAdmin(supabase);
  if (!adminOk) {
    const instructor = await getLinkedInstructor(supabase, user);
    if (!instructor) return { success: false, error: 'Not authorized' };
    const { data: leave } = await supabase
      .from('leave_requests')
      .select('id, batch_id')
      .eq('id', id)
      .maybeSingle();
    if (!leave?.batch_id) return { success: false, error: 'Request not found' };
    const { data: batch } = await supabase
      .from('batches')
      .select('instructor_id')
      .eq('id', leave.batch_id)
      .maybeSingle();
    if (batch?.instructor_id !== instructor.id) {
      return { success: false, error: 'Not authorized' };
    }
  }

  const { error } = await supabase.from('leave_requests').update({ status } as any).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/instructor/attendance');
  revalidatePath('/instructor/students');
  revalidatePath('/admin/attendance');
  revalidatePath('/student/leave');
  return { success: true };
}

export async function rsvpEvent(slug: string, name: string, phone: string, guests = 1) {
  const admin = createAdminSupabase();
  const { data: event } = await admin.from('events').select('id').eq('slug', slug).eq('is_published', true).maybeSingle();
  if (!event) return { success: false, error: 'Event not found' };
  const { error } = await admin.from('event_rsvps').insert({
    event_id: (event as any).id,
    name,
    phone,
    guests: Math.min(Math.max(guests, 1), 12),
  } as any);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function markNoticeRead(logId: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  await supabase.from('notice_reads').upsert(
    {
      user_id: user.id,
      log_id: logId,
    } as any,
    { onConflict: 'user_id,log_id' },
  );
  revalidatePath('/student/notices');
  return { success: true };
}

export async function notifyScheduleChange(studentId: string, oldSchedule: string, newSchedule: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };
  const { data: student } = await supabase
    .from('students')
    .select('name, phone, programme:programmes(name)')
    .eq('id', studentId)
    .maybeSingle();
  const s = student as any;
  if (!s?.phone) return { success: false, error: 'No phone' };
  const wa = await sendWhatsAppTemplate({
    phone: s.phone,
    templateName: WHATSAPP_TEMPLATES.scheduleChange.name,
    variables: WHATSAPP_TEMPLATES.scheduleChange.variables({
      studentName: s.name,
      programmeName: s.programme?.name || 'Rhythmzz',
      oldSchedule,
      newSchedule,
    }),
  });
  return { success: true, whatsapp: wa };
}
