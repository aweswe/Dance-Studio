'use server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function updateProgress(studentId: string, level: string, modules: any[]) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('kuchipudi_progress').upsert({
    student_id: studentId,
    current_level: level,
    modules_completed: modules,
  }, { onConflict: 'student_id' });
  return { success: true };
}

export async function generateCertificate(studentId: string, level: string) {
  return { success: true, pdfUrl: `/api/certificate?studentId=${studentId}&level=${encodeURIComponent(level)}` };
}
