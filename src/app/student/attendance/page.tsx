import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { AttendanceCalendar } from "@/components/student/attendance-calendar";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "My Attendance | Student Dashboard",
};

export default async function AttendancePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.login);

  const { data: studentData } = await supabase
    .from("students")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!studentData) redirect(ROUTES.home);
  const student = studentData as any;

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
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Attendance Record</h1>
        <p className="text-mu">Track your class attendance and history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-mu mb-1 uppercase tracking-widest font-semibold">Overall Attendance</p>
          {total > 0 ? (
            <>
              <p className="font-display text-5xl mb-2">{percentage}%</p>
              <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${percentage >= 75 ? "bg-green" : percentage >= 50 ? "bg-gold" : "bg-red-500"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-mu mt-2">No classes marked yet — your attendance will appear here once classes begin.</p>
          )}
        </Card>

        <Card>
          <p className="text-sm text-mu mb-1 uppercase tracking-widest font-semibold">This Month</p>
          {monthTotal > 0 ? (
            <>
              <p className="font-display text-5xl mb-2">
                {monthPresent}
                <span className="text-2xl text-mu">/{monthTotal}</span>
              </p>
              <p className="text-sm text-mu">classes attended</p>
            </>
          ) : (
            <p className="text-sm text-mu mt-2">Nothing marked this month yet.</p>
          )}
        </Card>

        <Card>
          <p className="text-sm text-mu mb-4 uppercase tracking-widest font-semibold">Stats</p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-sm text-mu">Total Classes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green">{present}</p>
              <p className="text-sm text-mu">Present</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">{absent}</p>
              <p className="text-sm text-mu">Absent</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold">{leave}</p>
              <p className="text-sm text-mu">On Leave</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="font-display text-2xl tracking-[2px] mb-4">Calendar View</h2>
        <AttendanceCalendar records={(attendance || []) as any} />
      </div>
    </div>
  );
}
