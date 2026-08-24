import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/utils/format";

export const metadata = {
  title: "My Schedule | Student Dashboard",
};

export default async function SchedulePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.login);

  const { data: studentData } = await supabase
    .from("students")
    .select("batch:batches(*)")
    .eq("auth_id", user.id)
    .single();

  const student = studentData as any;
  const batch = student?.batch;
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Class Schedule</h1>
        <p className="text-mu">Your current batch timings and days.</p>
      </div>

      {!batch ? (
        <Card>
          <p className="text-mu">You are not assigned to a batch yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h2 className="font-display text-2xl mb-4">
              {batch.name || `My Batch · ${batch.days?.join(", ")}`}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <p className="text-sm text-mu uppercase tracking-widest font-semibold mb-2">Timings</p>
                <p className="text-lg font-medium">
                  {formatTime(batch.time_start)} - {formatTime(batch.time_end)}
                </p>
              </div>
              <div className="flex-2">
                <p className="text-sm text-mu uppercase tracking-widest font-semibold mb-3">Weekly Routine</p>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isClassDay = batch.days.includes(day);
                    return (
                      <div
                        key={day}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                          isClassDay
                            ? "bg-bl/10 border-bl/20 text-bl"
                            : "bg-black/5 border-transparent text-mu opacity-50"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
