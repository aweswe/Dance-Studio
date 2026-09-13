'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { updateProgressSchema, type UpdateProgressData } from '@/lib/validators/kuchipudi';
import { revalidatePath } from 'next/cache';

/**
 * Admin-only: set a Kuchipudi student's level and completed modules.
 * Auth gate here + RLS `kuchipudi_progress_admin_all` as the real fence.
 */
export async function updateProgress(input: UpdateProgressData) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not signed in' };

  const { data: roleRow } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();
  const role = (roleRow as any)?.role;
  const adminOk = role === 'admin';
  let instructorOk = false;
  if (role === 'instructor') {
    const { data: instructor } = await supabase.from('instructors').select('id').eq('auth_id', user.id).maybeSingle();
    if (instructor) {
      const parsedPeek = updateProgressSchema.safeParse(input);
      if (parsedPeek.success) {
        const { data: student } = await supabase
          .from('students')
          .select('batch_id, batch:batches(instructor_id)')
          .eq('id', parsedPeek.data.studentId)
          .maybeSingle();
        instructorOk = (student as any)?.batch?.instructor_id === instructor.id;
      }
    }
  }
  if (!adminOk && !instructorOk) {
    return { success: false, error: 'Not authorized' };
  }

  const parsed = updateProgressSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
  }
  const { studentId, level, modules } = parsed.data;

  const { error } = await supabase
    .from('kuchipudi_progress')
    .upsert(
      {
        student_id: studentId,
        current_level: level,
        modules_completed: modules,
        updated_by: user.id,
      },
      { onConflict: 'student_id' },
    );

  if (error) {
    console.error('updateProgress failed:', error);
    return { success: false, error: 'Could not save progress — try again' };
  }

  revalidatePath('/admin/students');
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath('/student/progress');
  return { success: true };
}

export async function generateCertificate(studentId: string, level: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not signed in', pdfUrl: '' };
  const { data: roleRow } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();
  const role = (roleRow as any)?.role;
  const adminOk = role === 'admin';
  let instructorOk = false;
  if (role === 'instructor') {
    const { data: instructor } = await supabase.from('instructors').select('id').eq('auth_id', user.id).maybeSingle();
    if (instructor) {
      const { data: student } = await supabase
        .from('students')
        .select('batch_id, batch:batches(instructor_id)')
        .eq('id', studentId)
        .maybeSingle();
      instructorOk = (student as any)?.batch?.instructor_id === instructor.id;
    }
  }
  if (!adminOk && !instructorOk) {
    return { success: false, error: 'Not authorized', pdfUrl: '' };
  }

  const pdfUrl = `/api/certificate?studentId=${studentId}&level=${encodeURIComponent(level)}`;
  const { SITE_URL } = await import('@/lib/utils/constants');
  const { sendWhatsAppTemplate } = await import('@/lib/whatsapp/client');
  const { WHATSAPP_TEMPLATES } = await import('@/lib/whatsapp/templates');

  const { data: student } = await supabase
    .from('students')
    .select('name, phone, kuchipudi_progress(certificate_urls)')
    .eq('id', studentId)
    .maybeSingle();
  const s = student as any;
  const urls = { ...(s?.kuchipudi_progress?.certificate_urls || {}), [level]: pdfUrl };
  await supabase.from('kuchipudi_progress').upsert(
    { student_id: studentId, certificate_urls: urls },
    { onConflict: 'student_id' },
  );

  if (s?.phone) {
    await sendWhatsAppTemplate({
      phone: s.phone,
      templateName: WHATSAPP_TEMPLATES.certificateReady.name,
      variables: WHATSAPP_TEMPLATES.certificateReady.variables({
        studentName: s.name,
        level,
        downloadUrl: `${SITE_URL}${pdfUrl}`,
      }),
    });
  }

  return { success: true, pdfUrl };
}
