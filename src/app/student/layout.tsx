import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { ROUTES } from "@/lib/utils/constants";
import { GsapProvider } from "@/components/motion/gsap-provider";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { student, siblings, user } = await getCurrentStudent();

  if (!user) {
    redirect(ROUTES.login);
  }
  if (!student) {
    redirect(`${ROUTES.login}?step=phone`);
  }

  const isKuchipudi = (student as any)?.programme?.slug === "kuchipudi";
  const displayName = (student as any)?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  let unreadNotices = 0;
  if (user && student) {
    const supabase = await createServerSupabase();
    const { count: total } = await supabase.from("broadcast_logs").select("id", { count: "exact", head: true });
    const { count: read } = await supabase.from("notice_reads").select("log_id", { count: "exact", head: true }).eq("user_id", user.id);
    unreadNotices = Math.max(0, (total || 0) - (read || 0));
  }

  return (
    <PortalShell
      role="student"
      name={displayName}
      isKuchipudi={isKuchipudi}
      siblings={(siblings || []).map((s: any) => ({ id: s.id, name: s.name }))}
      activeStudentId={student?.id}
      unreadNotices={unreadNotices}
    >
      <GsapProvider>{children}</GsapProvider>
    </PortalShell>
  );
}
