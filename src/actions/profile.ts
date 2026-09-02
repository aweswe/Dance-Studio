'use server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { profileSchema, type ProfileData } from '@/lib/validators/profile';
import { revalidatePath } from 'next/cache';

/**
 * Student self-service profile update.
 * The student session has no UPDATE rights on `students`, so the row write
 * goes through the service role — gated by the caller owning the row via
 * auth_id. Phone changes also update the Supabase Auth user so future
 * OTP logins work on the new number.
 */
export async function updateProfile(input: ProfileData) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not signed in' };
  }

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
  }
  const { name, phone, email } = parsed.data;

  const { data: student } = await supabase
    .from('students')
    .select('id, phone')
    .eq('auth_id', user.id)
    .single();

  if (!student) {
    return { success: false, error: 'Student record not found' };
  }

  const admin = createAdminSupabase();
  const phoneChanged = student.phone !== phone;

  // App-level duplicate check — students.phone lost its UNIQUE constraint
  // when shared family phones became possible, so surface conflicts here.
  if (phoneChanged) {
    const digits = phone.replace(/\D/g, '');
    const last10 = digits.slice(-10);
    const { data: conflict } = await admin
      .from('students')
      .select('id')
      .ilike('phone', `%${last10}`)
      .neq('id', student.id)
      .limit(1)
      .maybeSingle();
    if (conflict) {
      return { success: false, error: 'A student with this phone number already exists' };
    }
  }

  const { error: updateError } = await admin
    .from('students')
    .update({ name, phone, email: email || null })
    .eq('id', student.id);

  if (updateError) {
    console.error('updateProfile failed:', updateError);
    return { success: false, error: 'Could not save your details — try again' };
  }

  // Keep the auth user in sync so phone-based login keeps working.
  if (phoneChanged) {
    const { error: authError } = await admin.auth.admin.updateUserById(user.id, {
      phone: `+91${phone}`,
    });
    if (authError) {
      console.error('updateProfile auth sync failed:', authError);
      return {
        success: false,
        error: 'Details saved, but updating your login number failed — contact the academy',
      };
    }
  }

  revalidatePath('/student/profile');
  revalidatePath('/student');
  return { success: true };
}

/**
 * Completes student phone registration after Email / Google login.
 * Validates 10-digit Indian phone number, links/creates student record,
 * and sets user role to 'student'.
 */
export async function completeStudentOnboarding(phone: string, name?: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not signed in' };
  }

  const cleaned = phone.replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number' };
  }

  const admin = createAdminSupabase();

  // Ensure role is student in users table
  await (admin as any).from('users').upsert({
    id: user.id,
    role: 'student',
  });

  // Check if student exists by auth_id or email
  let { data: student } = await (admin as any)
    .from('students')
    .select('id, auth_id, name, phone, email')
    .or(`auth_id.eq.${user.id},email.ilike.${user.email || 'none'}`)
    .maybeSingle();

  const studentName = name || user.user_metadata?.full_name || user.user_metadata?.name || student?.name || 'Dance Student';

  if (student) {
    await (admin as any).from('students').update({
      auth_id: user.id,
      phone: cleaned,
      email: user.email || student.email || null,
      name: studentName,
    }).eq('id', student.id);
  } else {
    // Also check if phone exists
    const { data: phoneMatch } = await (admin as any)
      .from('students')
      .select('id')
      .eq('phone', cleaned)
      .maybeSingle();

    if (phoneMatch) {
      await (admin as any).from('students').update({
        auth_id: user.id,
        email: user.email || null,
        name: studentName,
      }).eq('id', phoneMatch.id);
    } else {
      await (admin as any).from('students').insert({
        auth_id: user.id,
        name: studentName,
        phone: cleaned,
        email: user.email || null,
        status: 'active',
      });
    }
  }

  revalidatePath('/student');
  return { success: true };
}

/**
 * Allows an authenticated student to select their dance batch & programme.
 */
export async function assignStudentBatch(batchId: string) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student || !student.id) {
    return { success: false, error: 'Student profile not found. Please refresh.' };
  }

  const admin = createAdminSupabase();

  // Find batch and associated programme
  const { data: batch, error: batchErr } = await (admin as any)
    .from('batches')
    .select('id, programme_id')
    .eq('id', batchId)
    .single();

  if (batchErr || !batch) {
    return { success: false, error: 'Selected batch was not found.' };
  }

  const { error: updateErr } = await (admin as any)
    .from('students')
    .update({
      programme_id: batch.programme_id,
      batch_id: batch.id,
    })
    .eq('id', student.id);

  if (updateErr) {
    return { success: false, error: updateErr.message };
  }

  // Increment batch enrollment count
  try {
    await (admin as any).rpc('increment_batch_enrollment', { p_batch_id: batch.id });
  } catch {}

  revalidatePath('/student');
  revalidatePath('/student/schedule');
  revalidatePath('/student/fees');
  return { success: true };
}
