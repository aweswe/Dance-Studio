"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { Download } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  paid_at: string;
  source: string;
  receipt_url: string | null;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10">
            <th className="pb-3 font-semibold text-mu">Date</th>
            <th className="pb-3 font-semibold text-mu">Amount</th>
            <th className="pb-3 font-semibold text-mu">Method</th>
            <th className="pb-3 font-semibold text-mu">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center text-mu">No payment history found.</td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id} className="border-b border-black/5 last:border-0">
                <td className="py-4 font-medium">{formatDate(payment.paid_at)}</td>
                <td className="py-4">₹{payment.amount}</td>
                <td className="py-4 capitalize">{payment.source}</td>
                <td className="py-4">
                  {payment.receipt_url ? (
                    <a href={payment.receipt_url} target="_blank" rel="noreferrer" className="text-bl flex items-center gap-1 hover:underline">
                      <Download size={14} /> Download
                    </a>
                  ) : (
                    <span className="text-mu">N/A</span>
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
