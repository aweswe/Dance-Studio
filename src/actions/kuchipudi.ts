'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { updateProgressSchema, type UpdateProgressData } from '@/lib/validators/kuchipudi';
import { revalidatePath } from 'next/cache';

/**
 * Admin-only: set a Kuchipudi student's level and completed modules.
 * Auth gate here + RLS `kuchipudi_progress_admin_all` as the real fence.
 */
export async function updateProgress(input: UpdateProgressData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) {
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
        updated_by: (await supabase.auth.getUser()).data.user?.id ?? null,
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
  return { success: true, pdfUrl: `/api/certificate?studentId=${studentId}&level=${encodeURIComponent(level)}` };
}
