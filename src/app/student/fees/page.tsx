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
    .select("id, programmes(fees_monthly)")
    .eq("auth_id", user.id)
    .single();

  if (!studentData) redirect(ROUTES.home);
  const student = studentData as any;

  const { data: payments } = await supabase
    .from("fee_payments")
    .select("*")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false });

  // Check last payment date
  const lastPayment = (payments as any)?.[0];
  const isPaidThisMonth = lastPayment 
    ? new Date(lastPayment.paid_at).getMonth() === new Date().getMonth()
    : false;

  const status = isPaidThisMonth ? "Paid" : "Due";
  const amountDue = student.programmes?.fees_monthly || 2500;
  
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), 5).toLocaleDateString("en-IN", {
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
