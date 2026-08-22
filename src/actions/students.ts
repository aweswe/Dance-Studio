'use server';

import { createServerSupabase } from '@/lib/supabase/server';
import { updateTag } from 'next/cache';

export async function deactivateStudent(studentId: string) {
  const supabase = await createServerSupabase();
  const { data: studentData } = await supabase.from('students').select('batch_id').eq('id', studentId).single();
  const student = studentData as any;
  
  if (student) {
    await (supabase as any).from('students').update({ status: 'inactive' }).eq('id', studentId);
    if (student.batch_id) {
      await (supabase as any).rpc('decrement_batch_enrollment', { p_batch_id: student.batch_id });
    }
  }
  try { updateTag('students'); } catch {}
  return { success: true };
}

export async function reactivateStudent(studentId: string) {
  const supabase = await createServerSupabase();
  const { data: studentData } = await supabase.from('students').select('batch_id').eq('id', studentId).single();
  const student = studentData as any;
  
  if (student) {
    await (supabase as any).from('students').update({ status: 'active' }).eq('id', studentId);
    if (student.batch_id) {
      await (supabase as any).rpc('increment_batch_enrollment', { p_batch_id: student.batch_id });
    }
  }
  try { updateTag('students'); } catch {}
  return { success: true };
}

export async function getStudentsAction({ limit = 10, cursor = null, search = '', status }: { limit?: number, cursor?: string | null, search?: string, status?: string }) {
  const supabase = await createServerSupabase();
  
  let query = (supabase as any)
    .from('students')
    .select(`
      id, name, phone, status, created_at,
      batch:batches (
        days,
        programme:programmes (
          name
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return { data: [], nextCursor: null };
  }

  const items = data as any[];
  const hasMore = items.length > limit;
  const results = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore && results.length > 0 ? results[results.length - 1].created_at : null;

  return { data: results, nextCursor };
}
