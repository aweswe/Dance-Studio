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
    .select("name")
    .eq("auth_id", user.id)
    .single();

  if (!instructorData) {
    redirect(ROUTES.home);
  }

  const instructor = instructorData as any;

  return (
    <PortalShell role="instructor" name={instructor.name || "Instructor"}>
      <GsapProvider>{children}</GsapProvider>
    </PortalShell>
  );
}
