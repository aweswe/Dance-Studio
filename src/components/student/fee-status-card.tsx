"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeeStatusCardProps {
  status: "Paid" | "Due";
  amountDue: number;
  dueDate: string;
}

export function FeeStatusCard({ status, amountDue, dueDate }: FeeStatusCardProps) {
  const handlePay = () => {
    // Integration with Razorpay will go here
    alert("Razorpay integration pending");
  };

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
        <Button size="lg" onClick={handlePay}>Pay Now</Button>
      )}
    </Card>
  );
}
