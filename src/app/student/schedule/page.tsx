import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/utils/format";
import { StudentClassesView } from "@/components/student/student-classes-view";

export const metadata = {
  title: "My Schedule | Student Dashboard",
};

export default async function SchedulePage() {
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const batch = student?.batch;
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Class Schedule</h1>
        <p className="text-ink-2">Your current batch timings and days.</p>
      </div>

      {!batch ? (
        <div className="space-y-4">
          <Card className="p-6 border-bl/30 bg-bl/5">
            <h3 className="font-display text-xl text-ink mb-1">No Batch Assigned Yet</h3>
            <p className="text-sm text-ink-2">
              Select or join any class below to activate your weekly timetable.
            </p>
          </Card>
          <StudentClassesView currentStudent={student} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h2 className="font-display text-2xl mb-4">
              {batch.name || `My Batch · ${batch.days?.join(", ")}`}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <p className="text-sm text-ink-2 uppercase tracking-widest font-semibold mb-2">Timings</p>
                <p className="text-lg font-medium">
                  {formatTime(batch.time_start)} - {formatTime(batch.time_end)}
                </p>
              </div>
              <div className="flex-2">
                <p className="text-sm text-ink-2 uppercase tracking-widest font-semibold mb-3">Weekly Routine</p>
                {!batch.days || batch.days.length === 0 ? (
                  <p className="text-sm text-ink-2">Class days not set yet — contact the academy for timings.</p>
                ) : (
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isClassDay = (batch.days ?? []).includes(day);
                    return (
                      <div
                        key={day}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                          isClassDay
                            ? "bg-bl/10 border-bl/20 text-bl-ink"
                            : "bg-canvas-muted-2 border-transparent text-ink-2 opacity-50"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
