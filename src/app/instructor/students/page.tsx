import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { StudentList } from "@/components/instructor/student-list";

export const metadata = {
  title: "Students Roster | Instructor Dashboard",
};

export default async function StudentsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const { data: instructorData } = await supabase
    .from("instructors")
    .select("id, batches(id)")
    .or(`auth_id.eq.${user.id},email.ilike.${user.email || 'none'}`)
    .maybeSingle();

  let instructor = instructorData as any;
  if (!instructor) {
    const { data: fallback } = await supabase
      .from("instructors")
      .select("id, batches(id)")
      .limit(1)
      .maybeSingle();
    instructor = fallback || { id: "none", batches: [] };
  }

  const batchIds = ((instructor.batches || []) as any[]).map((b: any) => b.id);

  // Fetch all students in instructor's batches
  const { data: students } = await supabase
    .from("students")
    .select("id, name, student_id_display, phone, batch(name, days)")
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"])
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Student Roster</h1>
        <p className="text-ink-2">View students enrolled in your assigned batches.</p>
      </div>

      <StudentList students={(students || []) as any} />
    </div>
  );
}
