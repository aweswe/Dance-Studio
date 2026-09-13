import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { MetricStrip } from "@/components/ui/metric-strip";
import Link from "next/link";
import { isDue, monthlyAmount } from "@/lib/fees/ledger";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata = {
  title: "Student Dashboard | Rhythmzz Academy",
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function nextClassLabel(days: string[] | undefined, now: Date) {
  if (!days?.length) return null;
  const today = now.getDay();
  for (let i = 0; i < 7; i++) {
    const name = WEEKDAYS[(today + i) % 7];
    if (!days.includes(name)) continue;
    if (i === 0) return "today";
    if (i === 1) return "tomorrow";
    return name;
  }
  return null;
}

export default async function StudentDashboardPage() {
  const supabase = await createServerSupabase();
  const { student } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const { data: attendanceSummary } = await (supabase as any)
    .rpc("get_student_attendance_summary", { p_student_id: student.id });

  const attSummary = attendanceSummary as { total_classes?: number; present_count?: number } | null;
  const totalClasses = attSummary?.total_classes || 0;
  const presentCount = attSummary?.present_count || 0;
  const hasAttendance = totalClasses > 0;
  const attendancePercentage = hasAttendance ? Math.round((presentCount / totalClasses) * 100) : 0;

  const { data: payments } = await supabase
    .from("fee_payments")
    .select("id, paid_at, amount, for_month, status")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false });

  const feePaid = !isDue((payments || []) as { paid_at: string; for_month: string | null; status?: string }[]);
  const dueAmount = monthlyAmount(student.programme?.fees_monthly);

  const now = new Date();
  const studentFirstName = student.name?.split(" ")[0] || "Dancer";
  const hasEnrolledBatch = Boolean(student.batch_id || student.programme_id || student.batch || student.programme);
  const batch = student.batch;
  const batchName = batch?.name || student.programme?.name;
  const next = nextClassLabel(batch?.days, now);
  const dateLabel = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  let description = "Pick a batch to see class times and fees.";
  if (hasEnrolledBatch && batchName) {
    if (next === "today") description = `${batchName} — today.`;
    else if (next) description = `${batchName} — next class ${next}.`;
    else description = batchName;
  }

  const links = [
    { href: `${ROUTES.student}/classes`, label: "Classes", hint: hasEnrolledBatch ? "Switch batch" : "Join a batch" },
    { href: `${ROUTES.student}/schedule`, label: "Schedule", hint: "Weekly days and times" },
    { href: `${ROUTES.student}/attendance`, label: "Attendance", hint: "Marks from the front desk" },
    { href: `${ROUTES.student}/fees`, label: "Fees", hint: feePaid ? "Receipts" : "Pay this month" },
    { href: `${ROUTES.student}/notices`, label: "Notices", hint: "Studio updates" },
    { href: `${ROUTES.student}/leave`, label: "Leave", hint: "Missed class or makeup" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader label={dateLabel} title={studentFirstName} description={description} />

      {hasEnrolledBatch && !feePaid && (
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-ink-3">Fees</p>
            <p className="font-anton text-2xl text-ink tracking-tight">
              {dueAmount ? `₹${dueAmount} due` : "Due this month"}
            </p>
          </div>
          <Link
            href={`${ROUTES.student}/fees`}
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-xl bg-bl text-white text-sm font-semibold hover:bg-bl-deep focus-visible:focus-ring active:scale-[0.96]"
          >
            Pay fees
          </Link>
        </Card>
      )}

      <MetricStrip
        items={[
          {
            label: "Attendance",
            value: hasAttendance ? `${attendancePercentage}%` : "—",
            hint: hasAttendance ? `${presentCount} of ${totalClasses}` : "Not marked yet",
          },
          {
            label: "Batch",
            value: batch?.name ? batch.name : hasEnrolledBatch ? "Assigned" : "None",
            hint: batch?.days?.length ? batch.days.map((d: string) => d.slice(0, 3)).join(" · ") : undefined,
            variant: "text",
          },
          {
            label: "Fees",
            value: !hasEnrolledBatch ? "—" : feePaid ? "Paid" : "Due",
            hint: !hasEnrolledBatch ? "After you join" : feePaid ? "This month" : "Open the ledger",
            variant: "text",
          },
        ]}
      />

      <nav className="bg-surface-card border border-line shadow-lift rounded-[20px] divide-y divide-line overflow-hidden">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between gap-3 min-h-14 px-4 sm:px-5 hover:bg-canvas-muted focus-visible:focus-ring"
          >
            <span className="text-sm font-medium text-ink">{item.label}</span>
            <span className="text-[12px] text-ink-3 truncate">{item.hint}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
