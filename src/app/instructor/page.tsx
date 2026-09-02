import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KpiNumber } from "@/components/ui/kpi-number";
import Link from "next/link";

export const metadata = {
  title: "Instructor Dashboard",
};

export default async function InstructorDashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.adminLogin);

  const { data: instructorData } = await supabase
    .from("instructors")
    .select("id, name, batches(id, days, time_start, time_end)")
    .or(`auth_id.eq.${user.id},email.ilike.${user.email || 'none'}`)
    .maybeSingle();

  let instructor = instructorData as any;
  if (!instructor) {
    const { data: fallback } = await supabase
      .from("instructors")
      .select("id, name, batches(id, days, time_start, time_end)")
      .limit(1)
      .maybeSingle();
    instructor = fallback || { id: "none", name: user.email?.split("@")[0] || "Instructor", batches: [] };
  }

  const batches: any[] = instructor.batches || [];

  // Calculate total students across all their batches
  const batchIds = batches.map(b => b.id);
  const { count: studentCount } = await supabase
    .from("students")
    .select("id", { count: "exact" })
    .in("batch_id", batchIds.length > 0 ? batchIds : ["00000000-0000-0000-0000-000000000000"]);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long" });
  const todaysBatches = batches.filter((b: any) => b.days?.includes(today));

  return (
    <div className="space-y-8">
      <PageHeader
        label="Instructor Portal"
        title={`Welcome, Instructor ${instructor.name?.split(" ")[0] || ""}`}
        description="Here is your overview for today."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-ink-2 mb-1 uppercase tracking-widest font-semibold">Assigned Batches</p>
          <KpiNumber value={String(batches.length)} className="text-5xl" />
        </Card>

        <Card>
          <p className="text-sm text-ink-2 mb-1 uppercase tracking-widest font-semibold">Total Students</p>
          <KpiNumber value={String(studentCount || 0)} className="text-5xl" />
        </Card>

        <Card>
          <p className="text-sm text-ink-2 mb-1 uppercase tracking-widest font-semibold">Classes Today</p>
          <KpiNumber value={String(todaysBatches.length)} className="text-5xl text-bl" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-2xl tracking-[2px] mb-4 text-ink">Today&apos;s Schedule ({today})</h2>
          {todaysBatches.length > 0 ? (
            <div className="space-y-4">
              {todaysBatches.map((batch: any) => (
                <Card key={batch.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-ink">{batch.days?.join(", ")}</h3>
                      <p className="text-sm text-ink-2">
                        {batch.time_start?.slice(0, 5)} - {batch.time_end?.slice(0, 5)}
                      </p>
                    </div>
                    <Link
                      href={`${ROUTES.instructor}/attendance?batch=${batch.id}`}
                      className="bg-bl text-white text-[10px] font-semibold tracking-[2px] uppercase px-4 py-2 hover:bg-bl-deep transition-colors focus-visible:focus-ring active:scale-[0.98]"
                    >
                      Mark Attendance
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-ink-2">You have no classes scheduled for today.</p>
            </Card>
          )}
        </div>

        <div>
          <h2 className="font-display text-2xl tracking-[2px] mb-4 text-ink">Quick Links</h2>
          <Card className="flex flex-col gap-3">
            <Link
              href={`${ROUTES.instructor}/classes`}
              className="border border-line-strong text-ink hover:border-bl-ink hover:text-bl-ink text-[11px] font-semibold tracking-[2px] uppercase px-6 py-3 rounded text-center transition-all active:scale-[0.98] focus-visible:focus-ring"
            >
              View All Classes
            </Link>
            <Link
              href={`${ROUTES.instructor}/students`}
              className="border border-line-strong text-ink hover:border-bl-ink hover:text-bl-ink text-[11px] font-semibold tracking-[2px] uppercase px-6 py-3 rounded text-center transition-all active:scale-[0.98] focus-visible:focus-ring"
            >
              View Student Roster
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
