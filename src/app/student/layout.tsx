import { createServerSupabase } from "@/lib/supabase/server";
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
  const { data: student } = await supabase
    .from("students")
    .select("*, programme:programmes(slug)")
    .eq("auth_id", user.id)
    .single();

  if (!student) {
    // Possibly an admin or instructor, or unlinked user
    redirect(ROUTES.home);
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
