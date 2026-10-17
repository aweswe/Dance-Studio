'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
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
 * Also generates a secure direct recovery link as a zero-latency fallback.
 */
export async function sendInstructorPasswordReset() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { success: false, error: 'No email on account' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rhythmzzdance.com';

  // 1. Dispatch official Supabase reset password email
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${siteUrl}/login`,
  });

  // 2. Also generate backup direct recovery link via admin
  let directLink: string | null = null;
  try {
    const admin = createAdminSupabase();
    const { data: linkData } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: user.email,
      options: { redirectTo: `${siteUrl}/login` },
    });
    if (linkData?.properties?.action_link) {
      directLink = linkData.properties.action_link;
    }
  } catch {
    // Non-blocking fallback
  }

  if (error) return { success: false, error: error.message };
  return { success: true, email: user.email, directLink };
}
