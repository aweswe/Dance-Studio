import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { StudentClassesView } from "@/components/student/student-classes-view";

export const metadata = {
  title: "Dance Classes & Batches | Student Portal",
  description: "Browse programmes, choose your batch schedule, and pay tuition fees online.",
};

export default async function StudentClassesPage() {
  const supabase = await createServerSupabase();
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  // Check fee status
  const { data: payments } = await supabase
    .from("fee_payments")
    .select("id, paid_at, amount")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false })
    .limit(1);

  const now = new Date();
  const lastPaid = payments?.[0] ? new Date((payments[0] as any).paid_at) : null;
  const feePaid =
    !!lastPaid &&
    lastPaid.getFullYear() === now.getFullYear() &&
    lastPaid.getMonth() === now.getMonth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl tracking-[2px] mb-2 text-ink">
          Dance Classes & Batches
        </h1>
        <p className="text-sm text-ink-2">
          Explore all academy dance disciplines, join a batch, or pay monthly fees online.
        </p>
      </div>

      <StudentClassesView currentStudent={student} feePaid={feePaid} />
    </div>
  );
}
