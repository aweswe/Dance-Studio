import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { getLinkedInstructor } from "@/lib/auth/instructor";
import { LeaveReviewList } from "@/components/shared/leave-review-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Class roster | Instructor Dashboard",
};

function statusBadge(status?: string) {
  if (status === "present") return <Badge variant="green">Present</Badge>;
  if (status === "absent") return <Badge variant="default">Absent</Badge>;
  if (status === "leave") return <Badge variant="gold">Leave</Badge>;
  return <span className="text-xs text-ink-3">Not marked yet</span>;
}

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
  const today = new Date().toISOString().slice(0, 10);

  const { data: marks } = await supabase
    .from("attendance")
    .select("student_id, batch_id, status")
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"])
    .eq("date", today);

  const markMap = new Map(
    ((marks || []) as { student_id: string; batch_id: string; status: string }[]).map((m) => [
      `${m.batch_id}:${m.student_id}`,
      m.status,
    ]),
  );

  const selected = batch
    ? ((batches || []) as any[]).filter((b) => b.id === batch)
    : ((batches || []) as any[]);

  const { data: leaves } = await supabase
    .from("leave_requests")
    .select("id, date, kind, status, notes, student:students(name)")
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
      <p className="text-sm text-ink-2">
        Today&apos;s marks are read-only. Attendance is submitted at the front desk.
      </p>
      </div>

      {selected.length > 0 ? (
        selected.map((b: any) => (
          <Card key={b.id} className="space-y-4">
            <div>
              <h2 className="font-semibold text-ink">{b.name || (Array.isArray(b.days) ? b.days.join(", ") : "Batch")}</h2>
              <p className="text-sm text-ink-2">
                {b.time_start?.slice(0, 5)} – {b.time_end?.slice(0, 5)} · {today}
              </p>
            </div>
            {(b.students || []).length > 0 ? (
              <div className="space-y-2">
                {(b.students as { id: string; name: string }[]).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-canvas-muted border border-line rounded-md">
                    <span className="font-medium">{student.name}</span>
                    {statusBadge(markMap.get(`${b.id}:${student.id}`))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-2">No students enrolled in this batch yet.</p>
            )}
          </Card>
        ))
      ) : (
        <Card>
          <p className="text-ink-2">You have no assigned classes.</p>
        </Card>
      )}

      <div>
        <h2 className="text-[11px] text-ink-3 mb-3">Leave &amp; makeup</h2>
        <LeaveReviewList requests={(leaves || []) as any} />
      </div>
    </div>
  );
}
