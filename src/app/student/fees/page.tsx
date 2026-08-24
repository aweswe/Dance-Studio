import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { FeeStatusCard } from "@/components/student/fee-status-card";
import { PaymentHistory } from "@/components/student/payment-history";

export const metadata = {
  title: "Fees | Student Dashboard",
};

export default async function FeesPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.login);

  const { data: studentData } = await supabase
    .from("students")
    .select("id, programme:programmes(fees_monthly)")
    .eq("auth_id", user.id)
    .single();

  if (!studentData) redirect(ROUTES.home);
  const student = studentData as any;

  const { data: payments } = await supabase
    .from("fee_payments")
    .select("*")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false });

  // Paid when the latest payment lands in the current month AND year
  const now = new Date();
  const lastPayment = (payments as any)?.[0];
  const lastPaid = lastPayment ? new Date(lastPayment.paid_at) : null;
  const isPaidThisMonth =
    !!lastPaid &&
    lastPaid.getFullYear() === now.getFullYear() &&
    lastPaid.getMonth() === now.getMonth();

  const status = isPaidThisMonth ? "Paid" : "Due";
  const amountDue = student.programme?.fees_monthly || 2500;

  // Due on the 5th of the current month — already past it? Next month's 5th.
  const dueMonth = now.getDate() > 5 ? now.getMonth() + 1 : now.getMonth();
  const dueDate = new Date(now.getFullYear(), dueMonth, 5).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Fee Management</h1>
        <p className="text-mu">View and manage your fee payments.</p>
      </div>

      <FeeStatusCard 
        status={status} 
        amountDue={amountDue} 
        dueDate={dueDate} 
      />

      <div>
        <h2 className="font-display text-2xl tracking-[2px] mb-4">Payment History</h2>
        <PaymentHistory payments={(payments || []) as any} />
      </div>
    </div>
  );
}
