import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/utils/format";
import Link from "next/link";

export const metadata = {
  title: "My Schedule | Student Dashboard",
};

export default async function SchedulePage() {
  const { student } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const batch = student?.batch;
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2">Your batch days and times.</p>

      {!batch ? (
        <div className="space-y-4">
          <Card>
            <h3 className="font-anton text-xl text-ink tracking-tight mb-1">No batch yet</h3>
            <p className="text-sm text-ink-2 mb-4">
              Choose a class to see your weekly timetable.
            </p>
            <Link href={`${ROUTES.student}/classes`} className="text-sm font-medium text-bl-ink hover:text-bl">
              Browse batches
            </Link>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h2 className="font-anton text-2xl text-ink tracking-tight mb-4">
              {batch.name || `My batch · ${batch.days?.join(", ")}`}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <p className="text-[11px] text-ink-3 mb-1">Time</p>
                <p className="text-lg font-medium">
                  {batch.time_start && batch.time_end
                    ? `${formatTime(batch.time_start)} - ${formatTime(batch.time_end)}`
                    : "Time not set"}
                </p>
              </div>
              <div className="flex-2">
                <p className="text-[11px] text-ink-3 mb-3">Days</p>
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
