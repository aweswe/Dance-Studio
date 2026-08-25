"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { whatsappLink } from "@/lib/utils/format";
import { PayNowButton } from "@/components/student/pay-now-button";

const PAYMENTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

interface FeeStatusCardProps {
  status: "Paid" | "Due";
  amountDue: number;
  dueDate: string;
}

export function FeeStatusCard({ status, amountDue, dueDate }: FeeStatusCardProps) {
  const payMessage = `Hi Rhythmzz Academy! I would like to pay my fee of ₹${amountDue} (due ${dueDate}). Please share the payment link.`;

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <p className="text-sm text-ink-2 mb-2 uppercase tracking-widest font-semibold">Current Month Status</p>
        {status === "Paid" ? (
          <div className="flex items-center gap-4">
            <h2 className="font-display text-4xl text-green">Paid ✓</h2>
            <Badge variant="green">Paid</Badge>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <h2 className="font-display text-4xl">₹{amountDue}</h2>
            <Badge variant="outline" className="border-danger text-danger">Due</Badge>
          </div>
        )}
        <p className="text-sm text-ink-2 mt-2">
          {status === "Paid"
            ? "This month's fee is covered — thank you!"
            : `Due Date: ${dueDate}`}
        </p>
      </div>

      {status === "Due" && (
        PAYMENTS_ENABLED ? (
          <PayNowButton amount={amountDue} />
        ) : (
          <a
            href={whatsappLink(payMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-bl text-wh font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-bl-deep transition-all active:scale-[0.98] focus-visible:focus-ring"
          >
            Pay via WhatsApp
          </a>
        )
      )}
    </Card>
  );
}
