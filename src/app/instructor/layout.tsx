import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { ROUTES } from "@/lib/utils/constants";
import { GsapProvider } from "@/components/motion/gsap-provider";

export const dynamic = 'force-dynamic';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.adminLogin);
  }

  const { data: instructorData } = await supabase
    .from("instructors")
    .select("id, name")
    .or(`auth_id.eq.${user.id},email.ilike.${user.email || 'none'}`)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!instructorData && profile?.role !== "admin" && profile?.role !== "instructor") {
    redirect(ROUTES.home);
  }

  const name = instructorData?.name || (profile?.role === "admin" ? "Admin (Instructor View)" : (user.email?.split("@")[0] || "Instructor"));

  return (
    <PortalShell role="instructor" name={name}>
      <GsapProvider>{children}</GsapProvider>
    </PortalShell>
  );
}
