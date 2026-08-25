import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { ROUTES } from "@/lib/utils/constants";
import { GsapProvider } from "@/components/motion/gsap-provider";

export const dynamic = 'force-dynamic';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  // Fetch student details
  let { data: student } = await supabase
    .from("students")
    .select("*, programme:programmes(slug)")
    .eq("auth_id", user.id)
    .single();

  // Self-heal: an already-enrolled student whose auth_id was never written
  // (created before portal provisioning) can be linked by phone match.
  // Runs under the service role — the student session has no UPDATE rights.
  if (!student && user.phone) {
    const digits = user.phone.replace(/\D/g, "");
    const last10 = digits.slice(-10);
    if (last10.length === 10) {
      const admin = createAdminSupabase();
      const { data: match } = await admin
        .from("students")
        .select("*, programme:programmes(slug)")
        .ilike("phone", `%${last10}`)
        .limit(1)
        .maybeSingle();
      if (match) {
        const { error: linkErr } = await admin
          .from("students")
          .update({ auth_id: user.id })
          .eq("id", (match as any).id);
        if (!linkErr) student = match;
      }
    }
  }

  if (!student) {
    // Admins/instructors keep their old redirect; unlinked students get a
    // helpful login screen instead of a silent dump to the homepage.
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if ((profile as any)?.role && (profile as any).role !== "student") {
      redirect(ROUTES.home);
    }
    redirect(`${ROUTES.login}?error=unlinked`);
  }

  // Check if they are enrolled in Kuchipudi (by programme slug)
  const isKuchipudi = (student as any)?.programme?.slug === "kuchipudi";

  return (
    <PortalShell role="student" name={(student as any)?.name || "Student"} isKuchipudi={isKuchipudi}>
      <GsapProvider>{children}</GsapProvider>
    </PortalShell>
  );
}
