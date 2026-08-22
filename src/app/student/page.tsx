import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    .select("id, name, programmes(*), batches(*)")
    .eq("auth_id", user.id)
    .single();

  if (!studentData) redirect(ROUTES.home);
  const student = studentData as any;

  // Fetch attendance summary
  const { data: attendanceSummary } = await (supabase as any)
    .rpc("get_student_attendance_summary", { p_student_id: student.id });

  const attSummary = attendanceSummary as any;
  const attendancePercentage = attSummary?.total_classes > 0 
    ? Math.round((attSummary.present_count / attSummary.total_classes) * 100) 
    : 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Welcome back, {student.name?.split(" ")[0]}!</h1>
        <p className="text-mu">Here is what is happening with your classes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm text-mu mb-1 uppercase tracking-widest font-semibold">Attendance</p>
              <p className="font-display text-5xl">{attendancePercentage}%</p>
            </div>
            <Link href={`${ROUTES.student}/attendance`} className="text-bl text-sm font-semibold mt-4 hover:underline">
              View Details &rarr;
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm text-mu mb-1 uppercase tracking-widest font-semibold">Current Batch</p>
              <h3 className="font-display text-2xl mb-1">{student.batches?.days?.join(", ") || "Batch"}</h3>
              <p className="text-sm">{student.programmes?.name}</p>
            </div>
            <Link href={`${ROUTES.student}/schedule`} className="text-bl text-sm font-semibold mt-4 hover:underline">
              View Schedule &rarr;
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm text-mu mb-1 uppercase tracking-widest font-semibold">Fee Status</p>
              <Badge variant="green" className="mt-2">Paid</Badge>
            </div>
            <Link href={`${ROUTES.student}/fees`} className="text-bl text-sm font-semibold mt-4 hover:underline">
              Manage Fees &rarr;
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-2xl tracking-[2px] mb-4">Batch Schedule</h2>
          {student.batches ? (
            <Card>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-black/[.05]">
                  <div>
                    <p className="font-semibold">{student.batches.days?.join(", ")}</p>
                    <p className="text-sm text-mu">
                      {formatTime(student.batches.time_start)} - {formatTime(student.batches.time_end)}
                    </p>
                  </div>
                  <Badge variant="blue">Active</Badge>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-mu">You are not assigned to a batch yet.</p>
            </Card>
          )}
        </div>

        <div>
          <h2 className="font-display text-2xl tracking-[2px] mb-4">Quick Actions</h2>
          <Card className="flex flex-col gap-3">
            <Link href={`${ROUTES.student}/fees`} className="w-full text-center border border-black/[.18] text-blk hover:border-bl hover:text-bl font-semibold text-[11px] tracking-[2px] uppercase py-3 rounded">
              Pay Monthly Fees
            </Link>
            <Link href={`${ROUTES.student}/attendance`} className="w-full text-center border border-black/[.18] text-blk hover:border-bl hover:text-bl font-semibold text-[11px] tracking-[2px] uppercase py-3 rounded">
              Check Attendance Records
            </Link>
            <Link href={`${ROUTES.student}/notices`} className="w-full text-center border border-black/[.18] text-blk hover:border-bl hover:text-bl font-semibold text-[11px] tracking-[2px] uppercase py-3 rounded">
              View Academy Notices
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
