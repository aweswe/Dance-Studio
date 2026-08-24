'use server';

import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { updateStudentSchema, type UpdateStudentData } from '@/lib/validators/student';
import { revalidatePath } from 'next/cache';

export async function deactivateStudent(studentId: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { data: studentData } = await supabase
    .from('students')
    .select('batch_id, status')
    .eq('id', studentId)
    .single();
  const student = studentData as any;

  if (student) {
    const { error } = await supabase
      .from('students')
      .update({ status: 'inactive' })
      .eq('id', studentId);
    if (error) return { success: false, error: error.message };
    if (student.batch_id && student.status === 'active') {
      await supabase.rpc('decrement_batch_enrollment', { p_batch_id: student.batch_id });
    }
  }
  revalidatePath('/admin/students');
  return { success: true };
}

export async function reactivateStudent(studentId: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { data: studentData } = await supabase
    .from('students')
    .select('batch_id, status')
    .eq('id', studentId)
    .single();
  const student = studentData as any;

  if (student) {
    const { error } = await supabase
      .from('students')
      .update({ status: 'active' })
      .eq('id', studentId);
    if (error) return { success: false, error: error.message };
    if (student.batch_id && student.status !== 'active') {
      await supabase.rpc('increment_batch_enrollment', { p_batch_id: student.batch_id });
    }
  }
  revalidatePath('/admin/students');
  return { success: true };
}

export async function updateStudent(studentId: string, data: UpdateStudentData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = updateStudentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid student data' };
  }
  const d = parsed.data;

  // Batch move → programme follows the new batch
  let programmeId = d.programmeId ?? null;
  if (d.batchId) {
    const { data: batch } = await supabase
      .from('batches')
      .select('programme_id')
      .eq('id', d.batchId)
      .single();
    if (!batch) return { success: false, error: 'Batch not found' };
    programmeId = batch.programme_id;
  }

  const { data: current } = await supabase
    .from('students')
    .select('batch_id')
    .eq('id', studentId)
    .single();

  const payload: Record<string, unknown> = {
    name: d.name,
    phone: d.phone,
    status: d.status,
    programme_id: programmeId,
    batch_id: d.batchId ?? null,
  };
  if (d.email !== undefined) payload.email = d.email || null;

  const { error } = await supabase
    .from('students')
    .update(payload as any)
    .eq('id', studentId);
  if (error) {
    if (error.code === '23505' || error.message.includes('duplicate')) {
      return { success: false, error: 'A student with this phone number already exists' };
    }
    return { success: false, error: error.message };
  }

  // Batch-move bookkeeping
  const oldBatch = (current as { batch_id: string | null } | null)?.batch_id ?? null;
  if (oldBatch && oldBatch !== (d.batchId ?? null)) {
    await supabase.rpc('decrement_batch_enrollment', { p_batch_id: oldBatch });
  }
  if (d.batchId && d.batchId !== oldBatch) {
    await supabase.rpc('increment_batch_enrollment', { p_batch_id: d.batchId });
  }

  revalidatePath('/admin/students');
  revalidatePath('/admin/students/' + studentId);
  return { success: true };
}

export async function getStudentsAction({ limit = 10, cursor = null, search = '', status }: { limit?: number, cursor?: string | null, search?: string, status?: string }) {
  const supabase = await createServerSupabase();

  let query = supabase
    .from('students')
    .select(`
      id, name, phone, status, created_at,
      batch:batches (
        name,
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
