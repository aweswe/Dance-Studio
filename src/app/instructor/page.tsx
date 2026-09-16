import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { getLinkedInstructor } from "@/lib/auth/instructor";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { MetricStrip } from "@/components/ui/metric-strip";
import { formatTime } from "@/lib/utils/format";
import Link from "next/link";

export const metadata = {
  title: "Instructor Dashboard",
};

export default async function InstructorDashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const instructor = await getLinkedInstructor(supabase, user);
  if (!instructor) {
    return (
      <div className="space-y-4">
        <PageHeader
          label="Instructor"
          title="No profile yet"
          description="Ask the front desk to link this login to an instructor."
        />
      </div>
    );
  }

  const { data: batchRows } = await supabase
    .from("batches")
    .select("id, name, days, time_start, time_end")
    .eq("instructor_id", instructor.id);

  const batches = batchRows || [];
  const batchIds = batches.map((b) => b.id);
  const { count: studentCount } = await supabase
    .from("students")
    .select("id", { count: "exact" })
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"]);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long" });
  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  const todaysBatches = batches.filter((b) => (b.days as string[] | null)?.includes(today));
  const firstName = instructor.name?.split(" ")[0] || "Instructor";

  return (
    <div className="space-y-8">
      <PageHeader
        label={dateLabel}
        title={firstName}
        description="Admin marks attendance. Open a class to see today’s roster."
      />

      <MetricStrip
        items={[
          { label: "Batches", value: String(batches.length) },
          { label: "Students", value: String(studentCount || 0) },
          {
            label: "Today",
            value: String(todaysBatches.length),
            hint: todaysBatches.length ? "On the floor" : "No class",
          },
        ]}
      />

      <section className="space-y-3">
        <h2 className="text-[11px] text-ink-3">Today</h2>
        {todaysBatches.length > 0 ? (
          <ul className="bg-surface-card border border-line shadow-lift rounded-md divide-y divide-line overflow-hidden">
            {todaysBatches.map((batch) => (
              <li key={batch.id} className="flex items-center justify-between gap-3 min-h-16 px-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {batch.name || (batch.days as string[] | null)?.join(", ") || "Batch"}
                  </p>
                  <p className="text-[12px] text-ink-3">
                    {batch.time_start && batch.time_end
                      ? `${formatTime(batch.time_start)} – ${formatTime(batch.time_end)}`
                      : "Time not set"}
                  </p>
                </div>
                <Link
                  href={`${ROUTES.instructor}/attendance?batch=${batch.id}`}
                  className="shrink-0 text-sm font-medium text-bl-ink hover:text-bl focus-visible:focus-ring rounded-md px-2 py-1"
                >
                  Roster
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <p className="text-sm text-ink-2">No class today.</p>
          </Card>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`${ROUTES.instructor}/classes`}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded-md border border-line-strong text-sm font-medium text-ink hover:bg-canvas-muted focus-visible:focus-ring active:scale-[0.96]"
        >
          All classes
        </Link>
        <Link
          href={`${ROUTES.instructor}/students`}
          className="inline-flex items-center justify-center min-h-11 px-4 rounded-md border border-line-strong text-sm font-medium text-ink hover:bg-canvas-muted focus-visible:focus-ring active:scale-[0.96]"
        >
          Student roster
        </Link>
      </div>
    </div>
  );
}
