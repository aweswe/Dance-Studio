import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StudentSidebar } from "@/components/student/sidebar";
import { ROUTES } from "@/lib/utils/constants";

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
    <div className="min-h-screen bg-light flex">
      <StudentSidebar studentName={(student as any)?.name || "Student"} isKuchipudi={isKuchipudi} />
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto mt-12 md:mt-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
