import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { KuchipudiProgress } from "@/components/student/kuchipudi-progress";

export const metadata = {
  title: "Kuchipudi Progress | Student Dashboard",
};

export default async function ProgressPage() {
  const supabase = await createServerSupabase();
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  // Progress is only for the Kuchipudi programme
  if ((student.programme as any)?.slug !== "kuchipudi") {
    redirect(ROUTES.student);
  }

  const { data: progress } = await supabase
    .from("kuchipudi_progress")
    .select("*")
    .eq("student_id", student.id)
    .single();

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2">Modules and level, marked by your instructor.</p>

      <KuchipudiProgress progress={progress as any} />
    </div>
  );
}
