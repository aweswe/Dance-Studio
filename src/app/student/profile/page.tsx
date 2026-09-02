import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { ProfileForm } from "@/components/student/profile-form";

export const metadata = {
  title: "My Profile | Student Dashboard",
};

export default async function ProfilePage() {
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">My Profile</h1>
        <p className="text-ink-2">Your contact details — used for fees, notices, and WhatsApp updates.</p>
      </div>

      <ProfileForm
        initial={{
          name: (student as any)?.name || "",
          phone: (student as any)?.phone || "",
          email: (student as any)?.email || "",
        }}
      />
    </div>
  );
}
