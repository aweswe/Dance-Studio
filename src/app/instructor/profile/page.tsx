import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';
import { getLinkedInstructor } from '@/lib/auth/instructor';
import { PageHeader } from '@/components/ui/page-header';
import { InstructorProfileForm } from '@/components/instructor/instructor-profile-form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Profile | Instructor Portal',
};

export default async function InstructorProfilePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const baseInstructor = await getLinkedInstructor(supabase, user);
  if (!baseInstructor) {
    return (
      <div className="space-y-4">
        <PageHeader
          label="Profile"
          title="No profile linked"
          description="Contact studio administration to link your login to an instructor profile."
        />
      </div>
    );
  }

  // Fetch full instructor row (getLinkedInstructor only fetches id/name/email/auth_id)
  const { data: instructor } = await supabase
    .from('instructors')
    .select('id, name, email, role, bio, certifications, phone, photo_url')
    .eq('id', baseInstructor.id)
    .single();

  if (!instructor) redirect(ROUTES.instructor);

  return (
    <div className="space-y-6">
      <PageHeader
        label="Instructor"
        title="My Profile"
        description="Update your profile photo or reset your login password."
      />
      <InstructorProfileForm
        instructor={instructor}
        userEmail={user.email ?? ''}
      />
    </div>
  );
}
