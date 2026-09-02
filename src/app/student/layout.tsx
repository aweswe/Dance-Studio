import { getCurrentStudent } from "@/lib/auth/student";
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
  const { student, user } = await getCurrentStudent();

  if (!student && !user) {
    redirect(ROUTES.login);
  }

  // Check if they are enrolled in Kuchipudi (by programme slug)
  const isKuchipudi = (student as any)?.programme?.slug === "kuchipudi";
  const displayName = (student as any)?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Student";

  return (
    <PortalShell role="student" name={displayName} isKuchipudi={isKuchipudi}>
      <GsapProvider>{children}</GsapProvider>
    </PortalShell>
  );
}
