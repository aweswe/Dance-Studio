'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { updateStudentSchema, createStudentSchema, type UpdateStudentData, type CreateStudentData } from '@/lib/validators/student';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { SITE_URL, ROUTES } from '@/lib/utils/constants';
import { revalidatePath } from 'next/cache';

/**
 * Create (or reuse) an auth user for a student so they can log in with
 * WhatsApp OTP, and link it via students.auth_id. Sends the enrolment
 * welcome WhatsApp (soft-fails to mock mode when WhatsApp isn't configured).
 */
export async function enablePortalAccess(studentId: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { data: studentData } = await supabase
    .from('students')
    .select('id, name, phone, auth_id, programme:programmes(name)')
    .eq('id', studentId)
    .single();
  const student = studentData as any;
  if (!student) return { success: false, error: 'Student not found' };

  if (student.auth_id) {
    return { success: false, error: 'Portal access is already enabled for this student' };
  }

  // Normalize to E.164 +91XXXXXXXXXX (the format OTP sign-in expects)
  const digits = String(student.phone ?? '').replace(/\D/g, '');
  const phone =
    digits.length === 10 ? `+91${digits}` :
    digits.length === 12 && digits.startsWith('91') ? `+${digits}` : '';
  if (!phone) {
    return { success: false, error: 'Student has no valid Indian mobile number — add one first' };
  }

  const admin = createAdminSupabase();

  // Create the auth user (idempotent: reuse on "already registered")
  let userId: string;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    phone,
    phone_confirm: true,
  });
  if (createErr) {
    if (createErr.message.includes('already')) {
      const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = existing?.users?.find((u) => u.phone === phone);
      if (!found) return { success: false, error: createErr.message };
      userId = found.id;
    } else {
      return { success: false, error: createErr.message };
    }
  } else {
    userId = created.user.id;
  }

  const { error: linkErr } = await supabase
    .from('students')
    .update({ auth_id: userId })
    .eq('id', studentId);
  if (linkErr) return { success: false, error: linkErr.message };

  // Welcome the student onto the portal (mock-safe)
  try {
    await sendWhatsAppTemplate({
      phone,
      templateName: WHATSAPP_TEMPLATES.welcome.name,
      variables: WHATSAPP_TEMPLATES.welcome.variables({
        studentName: student.name,
        programmeName: student.programme?.name ?? 'Rhythmzz Academy',
        loginUrl: `${SITE_URL}${ROUTES.login}`,
      }),
    });
  } catch (err) {
    console.error('Portal welcome WhatsApp failed for', studentId, err);
  }

  revalidatePath('/admin/students');
  revalidatePath('/admin/students/' + studentId);
  return { success: true };
}

/**
 * Walk-in enrolment: create a student row directly (no Razorpay flow).
 * Optionally enables portal access straight away. Phone conflicts are
 * surfaced so the admin can find the duplicate instead of a raw DB error.
 */
export async function createStudent(data: CreateStudentData & { name: string; phone: string }) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = createStudentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid student data' };
  }
  const d = parsed.data;

  // Programme follows the batch when one is picked, same as updateStudent.
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

  const { data: inserted, error } = await supabase
    .from('students')
    .insert({
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      programme_id: programmeId,
      batch_id: d.batchId ?? null,
      status: d.status,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505' || error.message.includes('duplicate')) {
      return { success: false, error: 'A student with this phone number already exists' };
    }
    return { success: false, error: error.message };
  }

  if (d.batchId) {
    await supabase.rpc('increment_batch_enrollment', { p_batch_id: d.batchId });
  }

  // Optional immediate portal access — reuses the idempotent provisioning flow.
  let portal = { ok: true };
  if (d.enablePortal && inserted) {
    const res = await enablePortalAccess(inserted.id);
    portal = { ok: res.success };
  }

  revalidatePath('/admin/students');
  return { success: true, id: inserted?.id ?? null, portalEnabled: d.enablePortal && portal.ok };
}

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
      id, name, phone, status, created_at, auth_id,
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
