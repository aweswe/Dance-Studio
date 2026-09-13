'use server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { profileSchema, type ProfileData } from '@/lib/validators/profile';
import { normalizeIndianPhone } from '@/lib/utils/format';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ACTIVE_STUDENT_COOKIE } from '@/lib/auth/student';
import { isDue } from '@/lib/fees/ledger';

export async function switchActiveStudent(studentId: string) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { siblings, user } = await getCurrentStudent();
  if (!user) return { success: false, error: 'Not signed in' };
  if (!siblings.some((s: any) => s.id === studentId)) {
    return { success: false, error: 'That student is not on this account' };
  }
  const store = await cookies();
  store.set(ACTIVE_STUDENT_COOKIE, studentId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath('/student');
  return { success: true };
}

export async function uploadProfilePhoto(formData: FormData) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student, user } = await getCurrentStudent();
  if (!student?.id || !user) return { success: false, error: 'Not signed in' };

  const file = formData.get('file') as File | null;
  if (!file) return { success: false, error: 'Choose a photo' };
  if (!file.type.startsWith('image/')) return { success: false, error: 'Only images are allowed' };
  if (file.size > 2 * 1024 * 1024) return { success: false, error: 'Photo must be 2 MB or smaller' };

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `avatars/${student.id}.${ext}`;
  const admin = createAdminSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadErr } = await admin.storage.from('gallery').upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadErr) return { success: false, error: uploadErr.message };

  const { data: publicUrl } = admin.storage.from('gallery').getPublicUrl(path);
  const url = `${publicUrl.publicUrl}?v=${Date.now()}`;
  const { error } = await admin.from('students').update({ profile_photo_url: url }).eq('id', student.id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/student/profile');
  return { success: true, url };
}

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

  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student) {
    return { success: false, error: 'Student record not found' };
  }

  const admin = createAdminSupabase();
  const phoneChanged = student.phone !== phone;

  const { error: updateError } = await admin
    .from('students')
    .update({ name, phone, email: email || null })
    .eq('id', student.id);

  if (updateError) {
    console.error('updateProfile failed:', updateError);
    return { success: false, error: 'Could not save your details — try again' };
  }

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
 * Completes student phone registration after Email / Google / phone login.
 * Creates a pending row (not active) until payment or staff confirm.
 */
export async function completeStudentOnboarding(phone: string, name?: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not signed in' };
  }

  const cleaned = normalizeIndianPhone(phone);
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number (allows 0, +91, e.g. +91 90529 80859 or 09052980859)' };
  }

  const admin = createAdminSupabase();

  await (admin as any).from('users').upsert({
    id: user.id,
    role: 'student',
  });

  const { data: byAuth } = await (admin as any)
    .from('students')
    .select('id, auth_id, name, phone, email')
    .eq('auth_id', user.id)
    .limit(20);

  const studentName = name || user.user_metadata?.full_name || user.user_metadata?.name || 'Dance Student';

  if (byAuth && byAuth.length > 0) {
    await (admin as any).from('students').update({
      phone: cleaned,
      email: user.email || byAuth[0].email || null,
      name: studentName,
    }).eq('id', byAuth[0].id);
  } else {
    const { data: phoneMatches } = await (admin as any)
      .from('students')
      .select('id, auth_id')
      .eq('phone', cleaned);

    const unlinked = (phoneMatches || []).find((r: any) => !r.auth_id);
    if (unlinked) {
      await (admin as any).from('students').update({
        auth_id: user.id,
        email: user.email || null,
        name: studentName,
      }).eq('id', unlinked.id);
    } else if (phoneMatches && phoneMatches.length > 0) {
      await (admin as any).from('students').update({
        auth_id: user.id,
      }).eq('id', phoneMatches[0].id);
    } else {
      await (admin as any).from('students').insert({
        auth_id: user.id,
        name: studentName,
        phone: cleaned,
        email: user.email || null,
        status: 'pending',
      });
    }
  }

  revalidatePath('/student');
  return { success: true };
}

/**
 * Switch batch only when the current month is paid (or the student is already
 * on a batch for the same programme). Capacity is enforced by the DB trigger.
 */
export async function assignStudentBatch(batchId: string) {
  const { getCurrentStudent } = await import('@/lib/auth/student');
  const { student } = await getCurrentStudent();
  if (!student || !student.id) {
    return { success: false, error: 'Student profile not found. Please refresh.' };
  }

  const admin = createAdminSupabase();

  const { data: batch, error: batchErr } = await (admin as any)
    .from('batches')
    .select('id, programme_id, status, capacity, enrolled_count')
    .eq('id', batchId)
    .single();

  if (batchErr || !batch) {
    return { success: false, error: 'Selected batch was not found.' };
  }

  if (batch.status === 'full' || (batch.capacity > 0 && batch.enrolled_count >= batch.capacity)) {
    return { success: false, error: 'This batch is full. Join the waitlist instead.' };
  }

  const { data: payments } = await admin
    .from('fee_payments')
    .select('for_month, paid_at, status')
    .eq('student_id', student.id);

  const sameProgramme = student.programme_id && student.programme_id === batch.programme_id;
  if (!sameProgramme && isDue((payments || []) as any[])) {
    return { success: false, error: 'Pay this month\'s fee before joining a new batch.' };
  }

  const { error: updateErr } = await (admin as any)
    .from('students')
    .update({
      programme_id: batch.programme_id,
      batch_id: batch.id,
      status: 'active',
    })
    .eq('id', student.id);

  if (updateErr) {
    return { success: false, error: updateErr.message };
  }

  revalidatePath('/student');
  revalidatePath('/student/schedule');
  revalidatePath('/student/fees');
  revalidatePath('/student/classes');
  return { success: true };
}
