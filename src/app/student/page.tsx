import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { KpiNumber } from "@/components/ui/kpi-number";
import Link from "next/link";
import { formatTime } from "@/lib/utils/format";

export const metadata = {
  title: "Student Dashboard",
};

export default async function StudentDashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.login);

  const { data: studentData } = await supabase
    .from("students")
    .select("id, name, programme:programmes(*), batch:batches(*)")
    .eq("auth_id", user.id)
    .single();

  if (!studentData) redirect(ROUTES.home);
  const student = studentData as any;

  // Fetch attendance summary
  const { data: attendanceSummary } = await (supabase as any)
    .rpc("get_student_attendance_summary", { p_student_id: student.id });

  const attSummary = attendanceSummary as any;
  const hasAttendance = (attSummary?.total_classes || 0) > 0;
  const attendancePercentage = hasAttendance
    ? Math.round((attSummary.present_count / attSummary.total_classes) * 100)
    : 0;

  // Fee status from the latest payment (same month+year rule as /student/fees)
  const { data: payments } = await supabase
    .from("fee_payments")
    .select("paid_at")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false })
    .limit(1);
  const now = new Date();
  const lastPaid = payments?.[0] ? new Date((payments[0] as any).paid_at) : null;
  const feePaid =
    !!lastPaid &&
    lastPaid.getFullYear() === now.getFullYear() &&
    lastPaid.getMonth() === now.getMonth();

  return (
    <div className="space-y-8">
      <PageHeader
        label="Student Portal"
        title={`Welcome back, ${student.name?.split(" ")[0] || "dancer"}!`}
        description="Here is what is happening with your classes."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm text-ink-2 mb-1 uppercase tracking-widest font-semibold">Attendance</p>
              {hasAttendance ? (
                <KpiNumber value={`${attendancePercentage}%`} className="text-5xl" />
              ) : (
                <p className="font-display text-3xl text-ink-2">No classes marked yet</p>
              )}
            </div>
            <Link href={`${ROUTES.student}/attendance`} className="text-bl-ink text-sm font-semibold mt-4 hover:text-bl transition-colors focus-visible:focus-ring rounded-sm">
              View Details &rarr;
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm text-ink-2 mb-1 uppercase tracking-widest font-semibold">Current Batch</p>
              <h3 className="font-display text-2xl mb-1">
                {student.batch?.name || student.batch?.days?.join(", ") || "No batch"}
              </h3>
              <p className="text-sm text-ink-2">{student.programme?.name}</p>
            </div>
            <Link href={`${ROUTES.student}/schedule`} className="text-bl-ink text-sm font-semibold mt-4 hover:text-bl transition-colors focus-visible:focus-ring rounded-sm">
              View Schedule &rarr;
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm text-ink-2 mb-1 uppercase tracking-widest font-semibold">Fee Status</p>
              <Badge
                variant={feePaid ? "green" : "outline"}
                className={feePaid ? "mt-2" : "mt-2 border-danger text-danger"}
              >
                {feePaid ? "Paid" : "Due"}
              </Badge>
            </div>
            <Link href={`${ROUTES.student}/fees`} className="text-bl-ink text-sm font-semibold mt-4 hover:text-bl transition-colors focus-visible:focus-ring rounded-sm">
              Manage Fees &rarr;
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-2xl tracking-[2px] mb-4 text-ink">Batch Schedule</h2>
          {student.batch ? (
            <Card>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-line-subtle">
                  <div>
                    <p className="font-semibold text-ink">
                      {student.batch.name || student.batch.days?.join(", ")}
                    </p>
                    <p className="text-sm text-ink-2">
                      {student.batch.days?.join(", ")} · {formatTime(student.batch.time_start)} - {formatTime(student.batch.time_end)}
                    </p>
                  </div>
                  <Badge variant="blue">Active</Badge>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-ink-2">You are not assigned to a batch yet.</p>
            </Card>
          )}
        </div>

        <div>
          <h2 className="font-display text-2xl tracking-[2px] mb-4 text-ink">Quick Actions</h2>
          <Card className="flex flex-col gap-3">
            <Link href={`${ROUTES.student}/fees`} className="w-full inline-flex items-center justify-center text-center border border-line-strong text-ink hover:border-bl-ink hover:text-bl-ink font-semibold text-[11px] tracking-[2px] uppercase py-3 rounded transition-all active:scale-[0.98] focus-visible:focus-ring">
              Pay Monthly Fees
            </Link>
            <Link href={`${ROUTES.student}/attendance`} className="w-full inline-flex items-center justify-center text-center border border-line-strong text-ink hover:border-bl-ink hover:text-bl-ink font-semibold text-[11px] tracking-[2px] uppercase py-3 rounded transition-all active:scale-[0.98] focus-visible:focus-ring">
              Check Attendance Records
            </Link>
            <Link href={`${ROUTES.student}/notices`} className="w-full inline-flex items-center justify-center text-center border border-line-strong text-ink hover:border-bl-ink hover:text-bl-ink font-semibold text-[11px] tracking-[2px] uppercase py-3 rounded transition-all active:scale-[0.98] focus-visible:focus-ring">
              View Academy Notices
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
