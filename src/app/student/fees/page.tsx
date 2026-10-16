import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { FeeStatusCard } from "@/components/student/fee-status-card";
import { PaymentHistory } from "@/components/student/payment-history";
import { FeeCalendar, FeeMonth } from "@/components/student/fee-calendar";
import { Card } from "@/components/ui/card";
import {
  coveredMonthKeys,
  isDue,
  isOverdue,
  getFeeDueDate,
  monthlyAmount,
  monthKey,
  trailingMonths,
} from "@/lib/fees/ledger";
import Link from "next/link";

export const metadata = {
  title: "Fees | Student Dashboard",
};

export default async function FeesPage() {
  const supabase = await createServerSupabase();
  const { student } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const hasBatch = Boolean(student.batch_id || student.programme_id || student.batch || student.programme);

  // Strictly select status so pending/rejected payments are never treated as confirmed
  const { data: payments } = await supabase
    .from("fee_payments")
    .select("id, amount, source, receipt_url, paid_at, for_month, status, notes")
    .eq("student_id", student.id)
    .order("paid_at", { ascending: false });

  const ledgerPayments = (payments || []) as any[];
  const now = new Date();
  const currentKey = monthKey(now);
  const covered = coveredMonthKeys(ledgerPayments);

  const isCurrentMonthCovered = covered.has(currentKey);
  const isCurrentMonthPending = ledgerPayments.some(
    (p) => p.status === 'pending' && (p.for_month ? monthKey(p.for_month) === currentKey : monthKey(p.paid_at) === currentKey)
  );

  const overdue = isOverdue(ledgerPayments, now);
  const { dueDateStr } = getFeeDueDate(now);

  const status: "Paid" | "Due" | "Overdue" | "Pending Verification" = isCurrentMonthCovered
    ? "Paid"
    : isCurrentMonthPending
    ? "Pending Verification"
    : overdue
    ? "Overdue"
    : "Due";

  const amountDue = monthlyAmount(student.programme?.fees_monthly);
  const dueDate = dueDateStr;

  const months: FeeMonth[] = trailingMonths(now, 12).map((m) => ({
    key: monthKey(m),
    label: m.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
    covered: covered.has(monthKey(m)),
    isCurrent: monthKey(m) === currentKey,
  }));

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-2">Receipts and this month’s fees.</p>

      {!hasBatch ? (
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-anton text-2xl text-ink tracking-tight">No batch yet</h2>
            <p className="text-sm text-ink-2 mt-1 max-w-xl">
              Join a class to see your fee plan and due dates.
            </p>
          </div>
          <Link
            href={`${ROUTES.student}/classes`}
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-bl text-slate-950 text-sm font-bold hover:bg-bl-deep hover:text-slate-950 focus-visible:focus-ring active:scale-[0.96] shrink-0"
          >
            Choose a class
          </Link>
        </Card>
      ) : (
        <>
          <FeeStatusCard
            status={status}
            amountDue={amountDue}
            dueDate={dueDate}
            hasPending={isCurrentMonthPending}
          />
          <FeeCalendar months={months} />
        </>
      )}

      <div>
        <h2 className="text-[11px] text-ink-3 mb-3">Payments</h2>
        <PaymentHistory payments={ledgerPayments} />
      </div>
    </div>
  );
}
