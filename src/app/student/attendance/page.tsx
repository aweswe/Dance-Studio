import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { AttendanceCalendar } from "@/components/student/attendance-calendar";
import { MetricStrip } from "@/components/ui/metric-strip";

export const metadata = {
  title: "My Attendance | Student Dashboard",
};

export default async function AttendancePage() {
  const supabase = await createServerSupabase();
  const { student } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const { data: attendance } = await supabase
    .from("attendance")
    .select("date, status")
    .eq("student_id", student.id)
    .order("date", { ascending: false });

  const { data: attendanceSummary } = await (supabase as any)
    .rpc("get_student_attendance_summary", { p_student_id: student.id });

  const attSummary = attendanceSummary as any;
  const total = attSummary?.total_classes || 0;
  const present = attSummary?.present_count || 0;
  const absent = attSummary?.absent_count || 0;
  const leave = attSummary?.leave_count || 0;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  // Monthly context: this month's marks, from the raw records.
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthRecords = ((attendance || []) as { date: string; status: string }[]).filter((r) =>
    r.date.startsWith(monthKey),
  );
  const monthTotal = monthRecords.length;
  const monthPresent = monthRecords.filter((r) => r.status === "present").length;

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-2">Marks from the front desk. You cannot mark yourself present.</p>

      <MetricStrip
        items={[
          {
            label: "Overall",
            value: total > 0 ? `${percentage}%` : "—",
            hint: total > 0 ? undefined : "Not marked yet",
          },
          {
            label: "This month",
            value: monthTotal > 0 ? `${monthPresent}/${monthTotal}` : "—",
            hint: monthTotal > 0 ? "Present / marked" : "Nothing this month",
          },
          {
            label: "Present",
            value: String(present),
            hint: `${absent} absent · ${leave} leave`,
          },
        ]}
      />

      <AttendanceCalendar records={(attendance || []) as any} />
    </div>
  );
}
