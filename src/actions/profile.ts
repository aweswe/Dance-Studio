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
