"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { whatsappLink } from "@/lib/utils/format";

interface FeeStatusCardProps {
  status: "Paid" | "Due";
  amountDue: number;
  dueDate: string;
}

export function FeeStatusCard({ status, amountDue, dueDate }: FeeStatusCardProps) {
  // Razorpay is deferred — paying happens over WhatsApp with the academy.
  const payMessage = `Hi Rhythmzz Academy! I would like to pay my fee of ₹${amountDue} (due ${dueDate}). Please share the payment link.`;

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <p className="text-sm text-mu mb-2 uppercase tracking-widest font-semibold">Current Month Status</p>
        <div className="flex items-center gap-4">
          <h2 className="font-display text-4xl">₹{amountDue}</h2>
          <Badge variant={status === "Paid" ? "green" : "outline"} className={status === "Due" ? "border-red-500 text-red-500" : ""}>
            {status}
          </Badge>
        </div>
        <p className="text-sm text-mu mt-2">Due Date: {dueDate}</p>
      </div>

      {status === "Due" && (
        <a
          href={whatsappLink(payMessage)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center bg-bl text-wh font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-bl/90 transition-colors"
        >
          Pay via WhatsApp
        </a>
      )}
    </Card>
  );
}
