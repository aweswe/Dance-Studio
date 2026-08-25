"use client";

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import { Download } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  paid_at: string;
  for_month?: string | null;
  source: string;
  receipt_url: string | null;
}

/** "YYYY-MM-DD" → "Sep 2026". */
function monthLabel(for_month?: string | null, paid_at?: string): string {
  const raw = for_month || paid_at;
  if (!raw) return "—";
  const d = new Date(raw);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="pb-3 font-semibold text-ink-2">Date</th>
            <th className="pb-3 font-semibold text-ink-2">Month</th>
            <th className="pb-3 font-semibold text-ink-2">Amount</th>
            <th className="pb-3 font-semibold text-ink-2">Method</th>
            <th className="pb-3 font-semibold text-ink-2">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-ink-2">No payment history found.</td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id} className="border-b border-line-subtle last:border-0 hover:bg-canvas-muted transition-colors">
                <td className="py-4 font-medium">{formatDate(payment.paid_at)}</td>
                <td className="py-4">{monthLabel(payment.for_month, payment.paid_at)}</td>
                <td className="py-4">₹{payment.amount}</td>
                <td className="py-4 capitalize">{payment.source}</td>
                <td className="py-4">
                  {payment.id ? (
                    <a
                      href={/^https?:\/\//.test(payment.receipt_url ?? "") ? payment.receipt_url! : `/receipt/${payment.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-bl-ink flex items-center gap-1 hover:underline focus-visible:focus-ring active:scale-[0.98]"
                    >
                      <Download size={14} /> Receipt
                    </a>
                  ) : (
                    <span className="text-ink-2">N/A</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
