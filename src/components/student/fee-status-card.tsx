"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/utils/format";
import { PayNowButton } from "@/components/student/pay-now-button";
import { reportUpiPayment } from "@/actions/fees";
import { ACADEMY } from "@/lib/utils/constants";

const PAYMENTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

interface FeeStatusCardProps {
  status: "Paid" | "Due";
  amountDue: number;
  dueDate: string;
}

export function FeeStatusCard({ status, amountDue, dueDate }: FeeStatusCardProps) {
  const payMessage = `Hi Rhythmzz Academy! I would like to pay my fee of ₹${amountDue} (due ${dueDate}). Please share the payment link.`;
  const [upiBusy, setUpiBusy] = useState(false);
  const [upiMsg, setUpiMsg] = useState("");

  const upiLink = ACADEMY.upiId
    ? `upi://pay?pa=${encodeURIComponent(ACADEMY.upiId)}&pn=${encodeURIComponent(ACADEMY.name)}&am=${amountDue}&cu=INR`
    : null;

  async function markPaid() {
    setUpiBusy(true);
    const res = await reportUpiPayment(amountDue);
    setUpiMsg(res.success ? "Marked as paid — waiting for academy confirmation." : res.error || "Could not record");
    setUpiBusy(false);
  }

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div>
        <p className="text-[11px] text-ink-3 mb-1">This month</p>
        {status === "Paid" ? (
          <div className="flex items-center gap-2">
            <h2 className="font-anton text-3xl text-ink tracking-tight">Paid</h2>
            <Badge variant="green">Covered</Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="font-anton text-3xl text-ink tracking-tight">₹{amountDue}</h2>
            <Badge variant="outline" className="border-danger text-danger">Due</Badge>
          </div>
        )}
        <p className="text-sm text-ink-2 mt-2">
          {status === "Paid" ? "This month is covered." : `Due ${dueDate}`}
        </p>
      </div>

      {status === "Due" && (
        PAYMENTS_ENABLED ? (
          <PayNowButton amount={amountDue} />
        ) : (
          <div className="flex flex-col gap-2 items-stretch w-full md:w-auto md:min-w-[14rem]">
            {upiLink && (
              <a
                href={upiLink}
                className="inline-flex items-center justify-center min-h-11 bg-bl text-white text-sm font-semibold px-4 rounded-xl hover:bg-bl-deep focus-visible:focus-ring active:scale-[0.96]"
              >
                Pay ₹{amountDue} with UPI
              </a>
            )}
            <a
              href={whatsappLink(payMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center min-h-11 border border-line-strong text-sm font-medium px-4 rounded-xl hover:bg-canvas-muted focus-visible:focus-ring active:scale-[0.96]"
            >
              Pay on WhatsApp
            </a>
            <Button type="button" variant="ghost" onClick={markPaid} disabled={upiBusy} isLoading={upiBusy}>
              I’ve paid — notify the academy
            </Button>
            {upiMsg && <p className="text-xs text-ink-2">{upiMsg}</p>}
            <p className="text-[11px] text-ink-3">GST receipt after the academy confirms.</p>
          </div>
        )
      )}
    </Card>
  );
}
