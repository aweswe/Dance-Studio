/**
 * Fee-ledger helpers. A payment "covers" the calendar month in its
 * `for_month` column (backfilled to the paid_at month for history).
 * The current month is due when no payment covers it.
 */

export interface LedgerPayment {
  /** Month the payment covers ("YYYY-MM-DD"); falls back to paid_at. */
  for_month: string | null;
  paid_at: string;
}

/** "YYYY-MM" key for a date or timestamp. */
export function monthKey(input: Date | string): string {
  const d = input instanceof Date ? input : new Date(input);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Month keys covered by the given payments. */
export function coveredMonthKeys(payments: LedgerPayment[]): Set<string> {
  const covered = new Set<string>();
  for (const p of payments) {
    if (p.for_month) covered.add(monthKey(p.for_month));
    else if (p.paid_at) covered.add(monthKey(p.paid_at));
  }
  return covered;
}

/** True when a payment covers the given month. */
export function isMonthCovered(payments: LedgerPayment[], date: Date): boolean {
  return coveredMonthKeys(payments).has(monthKey(date));
}

/** True when the current month is uncovered. */
export function isDue(payments: LedgerPayment[], now: Date = new Date()): boolean {
  return !isMonthCovered(payments, now);
}

/** Monthly fee with the app's fallback when a programme has none set. */
export function monthlyAmount(feesMonthly: number | null | undefined): number {
  return feesMonthly && feesMonthly > 0 ? feesMonthly : 2500;
}

/** The last `count` month starts, oldest first (for the 12-month grid). */
export function trailingMonths(now: Date = new Date(), count = 12): Date[] {
  const months: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }
  return months;
}
