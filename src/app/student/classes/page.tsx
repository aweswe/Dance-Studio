import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { StudentClassesView, type LiveProgramme } from "@/components/student/student-classes-view";
import { isDue } from "@/lib/fees/ledger";
import { getProgrammes } from "@/data/programmes";
import { getBatches } from "@/data/batches";

export const metadata = {
  title: "Dance Classes & Batches | Student Portal",
  description: "Browse programmes, choose your batch schedule, and pay tuition fees online.",
};

export default async function StudentClassesPage() {
  const supabase = await createServerSupabase();
  const { student } = await getCurrentStudent();
  if (!student) redirect(ROUTES.login);

  const [{ data: progRows }, { data: batchRows }, { data: payments }] = await Promise.all([
    supabase.from("programmes").select("id, name, slug, description, fees_monthly, is_active").eq("is_active", true).order("sort_order"),
    supabase.from("batches").select("id, name, days, time_start, time_end, capacity, enrolled_count, status, programme_id"),
    supabase.from("fee_payments").select("for_month, paid_at, status").eq("student_id", student.id),
  ]);

  let programmes: LiveProgramme[] = [];
  if (progRows && progRows.length > 0) {
    programmes = (progRows as any[]).map((p) => ({
      ...p,
      batches: ((batchRows || []) as any[]).filter((b) => b.programme_id === p.id),
    }));
  } else {
    const [fallbackP, fallbackB] = await Promise.all([getProgrammes(), getBatches()]);
    programmes = fallbackP.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      fees_monthly: p.fees_monthly,
      batches: (fallbackB as any[]).filter((b) => b.programme_id === p.id || b.programme?.slug === p.slug),
    }));
  }

  const feePaid = !isDue((payments || []) as any[]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2">Live timetable. Pay to join, or waitlist when a batch is full.</p>
      <StudentClassesView currentStudent={student} feePaid={feePaid} programmes={programmes} />
    </div>
  );
}
