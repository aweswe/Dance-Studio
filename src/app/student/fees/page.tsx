import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { FeeStatusCard } from "@/components/student/fee-status-card";
import { PaymentHistory } from "@/components/student/payment-history";
import { FeeCalendar, FeeMonth } from "@/components/student/fee-calendar";
import { Card } from "@/components/ui/card";
import { coveredMonthKeys, isDue, monthlyAmount, monthKey, trailingMonths } from "@/lib/fees/ledger";
import { Sparkles, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Fees | Student Dashboard",
};

export default async function FeesPage() {
  const supabase = await createServerSupabase();
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const hasBatch = Boolean(student.batch_id || student.programme_id || student.batch || student.programme);

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
        <p className="text-ink-2">View and manage your fee payments and receipts.</p>
      </div>

      {!hasBatch ? (
        <Card className="p-8 border-dashed border-line-strong bg-surface space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={13} />
                No Active Class Enrolment
              </div>
              <h2 className="font-display text-2xl text-ink">
                Join a Batch to Activate Your Fee Ledger
              </h2>
              <p className="text-sm text-ink-2 max-w-xl leading-relaxed">
                You are currently not assigned to any dance batch. Select your dance discipline and weekly batch schedule to view your customized fee plan, due dates, and payment options.
              </p>
            </div>

            <Link
              href={`${ROUTES.student}/classes`}
              className="inline-flex items-center justify-center gap-2 bg-bl hover:bg-bl-deep text-white font-semibold text-xs tracking-[2px] uppercase px-8 py-4 rounded-control transition-all shadow-md active:scale-[0.98] self-start sm:self-auto shrink-0"
            >
              Select Batch & Discipline <ArrowRight size={14} />
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <FeeStatusCard
            status={status}
            amountDue={amountDue}
            dueDate={dueDate}
          />
          <FeeCalendar months={months} />
        </>
      )}

      <div>
        <h2 className="font-display text-2xl tracking-[2px] mb-4">Payment History</h2>
        <PaymentHistory payments={ledgerPayments} />
      </div>
    </div>
  );
}
