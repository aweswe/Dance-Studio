"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 text-[11px] font-semibold tracking-[2px] uppercase px-6 py-3 bg-bl text-white hover:bg-bl/90 transition-colors"
    >
      <Printer size={14} /> Print Receipt
    </button>
  );
}
