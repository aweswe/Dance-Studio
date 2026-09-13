import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { getLinkedInstructor } from "@/lib/auth/instructor";
import { StudentList } from "@/components/instructor/student-list";
import { KuchipudiAdmin } from "@/components/admin/kuchipudi-admin";
import { LeaveReviewList } from "@/components/shared/leave-review-list";

export const metadata = {
  title: "Students Roster | Instructor Dashboard",
};

export default async function StudentsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const instructor = await getLinkedInstructor(supabase, user);
  if (!instructor) {
    return (
      <div>
        <p className="text-sm text-ink-2">Ask the front desk to link this login to an instructor.</p>
      </div>
    );
  }

  const { data: batches } = await supabase.from("batches").select("id").eq("instructor_id", instructor.id);
  const batchIds = ((batches || []) as any[]).map((b) => b.id);

  const { data: students } = await supabase
    .from("students")
    .select("id, name, student_id_display, phone, programme:programmes(slug), batch(name, days), kuchipudi_progress(current_level, modules_completed)")
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"])
    .order("name");

  const { data: leaves } = await supabase
    .from("leave_requests")
    .select("id, date, kind, status, notes, student:students(name)")
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"])
    .eq("status", "pending")
    .order("date");

  const kuchipudi = ((students || []) as any[]).filter((s) => s.programme?.slug === "kuchipudi");

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-2">Students in your batches.</p>

      <StudentList students={(students || []) as any} />

      <div>
        <h2 className="text-[11px] text-ink-3 mb-3">Leave &amp; makeup</h2>
        <LeaveReviewList requests={(leaves || []) as any} />
      </div>

      {kuchipudi.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[11px] text-ink-3">Kuchipudi marking</h2>
          {kuchipudi.map((s) => (
            <div key={s.id}>
              <p className="text-sm font-semibold mb-2">{s.name}</p>
              <KuchipudiAdmin
                studentId={s.id}
                initialProgress={Array.isArray(s.kuchipudi_progress) ? s.kuchipudi_progress[0] : s.kuchipudi_progress}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
