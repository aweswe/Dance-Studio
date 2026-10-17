'use server';

import { createServerSupabase } from '@/lib/supabase/server';
import { getLinkedInstructor } from '@/lib/auth/instructor';
import { revalidatePath } from 'next/cache';

/**
 * Instructor self-service: update ONLY photo_url.
 * All other fields (name, email, phone, role, bio) are admin-only.
 */
export async function updateInstructorPhoto(photoUrl: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const instructor = await getLinkedInstructor(supabase, user);
  if (!instructor) return { success: false, error: 'Instructor profile not found' };

  const { error } = await supabase
    .from('instructors')
    .update({ photo_url: photoUrl || null })
    .eq('id', instructor.id)
    .eq('auth_id', user.id); // belt-and-suspenders: enforce same auth_id

  if (error) return { success: false, error: error.message };

  revalidatePath('/instructor');
  revalidatePath('/instructor/profile');
  revalidatePath('/about');
  return { success: true };
}

/**
 * Send a Supabase password reset email for the currently logged-in instructor.
 * Uses the public-facing /login route as the redirect so they arrive back authenticated.
 */
export async function sendInstructorPasswordReset() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { success: false, error: 'No email on account' };

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rhythmzzdance.com'}/login`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, email: user.email };
}
