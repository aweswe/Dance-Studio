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
    <Card className="w-full overflow-x-auto border-2 border-slate-200 scrollbar-thin">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 bg-slate-50/70">
            <th className="py-3.5 px-4 font-bold text-slate-900 uppercase text-xs tracking-wider">Date</th>
            <th className="py-3.5 px-4 font-bold text-slate-900 uppercase text-xs tracking-wider">Month</th>
            <th className="py-3.5 px-4 font-bold text-slate-900 uppercase text-xs tracking-wider">Amount</th>
            <th className="py-3.5 px-4 font-bold text-slate-900 uppercase text-xs tracking-wider">Method</th>
            <th className="py-3.5 px-4 font-bold text-slate-900 uppercase text-xs tracking-wider">Receipt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payments.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-700 font-medium">No payment history found.</td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-950">{formatDate(payment.paid_at)}</td>
                <td className="py-4 px-4 font-semibold text-slate-800">{monthLabel(payment.for_month, payment.paid_at)}</td>
                <td className="py-4 px-4 font-black text-slate-950">₹{payment.amount}</td>
                <td className="py-4 px-4 font-medium text-slate-800 capitalize">{payment.source}</td>
                <td className="py-4 px-4">
                  {payment.id ? (
                    <a
                      href={/^https?:\/\//.test(payment.receipt_url ?? "") ? payment.receipt_url! : `/receipt/${payment.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-300 text-sky-950 text-xs font-bold hover:bg-sky-100 hover:border-sky-400 focus-visible:focus-ring active:scale-[0.98] transition-all shadow-xs"
                    >
                      <Download size={13} /> View Receipt
                    </a>
                  ) : (
                    <span className="text-slate-500 font-medium">—</span>
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
