import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { getLinkedInstructor } from "@/lib/auth/instructor";
import { LeaveReviewList } from "@/components/shared/leave-review-list";
import { AttendanceMarker } from "@/components/instructor/attendance-marker";

export const metadata = {
  title: "Class roster | Instructor Dashboard",
};

export default async function AttendancePage({
  searchParams
}: {
  searchParams: Promise<{ batch?: string }>
}) {
  const { batch } = await searchParams;

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

  const { data: batches } = await supabase
    .from("batches")
    .select("id, name, days, time_start, time_end, students(id, name)")
    .eq("instructor_id", instructor.id);

  const batchIds = ((batches || []) as any[]).map((b) => b.id);

  const { data: leaves } = await supabase
    .from("leave_requests")
    .select("id, date, kind, status, notes, student:students(name)")
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })
    .limit(20);

  const markerBatches = ((batches ?? []) as any[]).map((b) => ({
    id: b.id,
    name: b.name || (Array.isArray(b.days) ? b.days.join(", ") : "Batch"),
    days: b.days,
    students: b.students ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink-2">
          Mark attendance for your assigned batches. Admin can view and edit all batches.
        </p>
      </div>

      <AttendanceMarker batches={markerBatches} initialBatchId={batch} />

      <div>
        <h2 className="text-[11px] text-ink-3 mb-3">Leave &amp; makeup</h2>
        <LeaveReviewList requests={(leaves || []) as any} />
      </div>
    </div>
  );
}
