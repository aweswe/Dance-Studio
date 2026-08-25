import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { FeeStatusCard } from "@/components/student/fee-status-card";
import { PaymentHistory } from "@/components/student/payment-history";
import { FeeCalendar, FeeMonth } from "@/components/student/fee-calendar";
import { coveredMonthKeys, isDue, monthlyAmount, monthKey, trailingMonths } from "@/lib/fees/ledger";

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
    .select("id, amount, source, receipt_url, paid_at, for_month")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false });

  const ledgerPayments = (payments || []) as any[];
  const now = new Date();
  const covered = coveredMonthKeys(ledgerPayments);
  const status = isDue(ledgerPayments, now) ? "Due" : "Paid";
  const amountDue = monthlyAmount(student.programme?.fees_monthly);

  // Due on the 5th of the current month — already past it? Next month's 5th.
  const dueMonth = now.getDate() > 5 ? now.getMonth() + 1 : now.getMonth();
  const dueDate = new Date(now.getFullYear(), dueMonth, 5).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  const months: FeeMonth[] = trailingMonths(now, 12).map((m) => ({
    key: monthKey(m),
    label: m.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
    covered: covered.has(monthKey(m)),
    isCurrent: monthKey(m) === monthKey(now),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-[2px] mb-2">Fee Management</h1>
        <p className="text-ink-2">View and manage your fee payments.</p>
      </div>

      <FeeStatusCard
        status={status}
        amountDue={amountDue}
        dueDate={dueDate}
      />

      <FeeCalendar months={months} />

      <div>
        <h2 className="font-display text-2xl tracking-[2px] mb-4">Payment History</h2>
        <PaymentHistory payments={ledgerPayments} />
      </div>
    </div>
  );
}
