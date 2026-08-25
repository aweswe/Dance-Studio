import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { KuchipudiProgress } from "@/components/student/kuchipudi-progress";

export const metadata = {
  title: "Kuchipudi Progress | Student Dashboard",
};

export default async function ProgressPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.login);

  const { data: studentData } = await supabase
    .from("students")
    .select("id, programme:programmes(slug)")
    .eq("auth_id", user.id)
    .single();

  if (!studentData) redirect(ROUTES.home);
  const student = studentData as any;

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
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Kuchipudi Progress</h1>
        <p className="text-ink-2">Track your learning journey and modules.</p>
      </div>

      <KuchipudiProgress progress={progress as any} />
    </div>
  );
}
