"use client";

import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/utils/cn";

/** Client boundary so server components can use the GSAP CountUp. */
export function KpiNumber({ value, className }: { value: string; className?: string }) {
  return <CountUp value={value} className={cn("font-display", className)} />;
}
