import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { ProfileForm } from "@/components/student/profile-form";

export const metadata = {
  title: "My Profile | Student Dashboard",
};

export default async function ProfilePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.login);

  const { data: studentData } = await supabase
    .from("students")
    .select("name, phone, email")
    .eq("auth_id", user.id)
    .single();

  if (!studentData) redirect(ROUTES.home);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">My Profile</h1>
        <p className="text-mu">Your contact details — used for fees, notices, and WhatsApp updates.</p>
      </div>

      <ProfileForm
        initial={{
          name: (studentData as any).name || "",
          phone: (studentData as any).phone || "",
          email: (studentData as any).email || "",
        }}
      />
    </div>
  );
}
