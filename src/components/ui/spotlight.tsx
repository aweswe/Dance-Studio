"use client";

import { useCallback, type PointerEvent } from "react";
import { cn } from "@/lib/utils/cn";

interface SpotlightCardProps {
  children: React.ReactNode;
  /** teal = dark programme cards; pale = light instructor/testimonial/KPI cards */
  tone?: "teal" | "pale";
  className?: string;
}

/**
 * The "stage light" signature — a cursor-following radial teal glow.
 * Pointer position lands in --spot-x/--spot-y custom properties; the
 * .spotlight::before gradient in globals.css does the rest (opacity-only
 * transition, GPU-cheap, killed by the reduced-motion gate).
 */
export function SpotlightCard({ children, tone = "teal", className }: SpotlightCardProps) {
  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn("spotlight", tone === "pale" && "spotlight-pale", className)}
    >
      {children}
    </div>
  );
}
