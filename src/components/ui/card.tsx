import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-card rounded-[20px] border border-line shadow-lift overflow-hidden",
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-5 sm:p-6": padding === "md",
          "p-6 sm:p-8": padding === "lg",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

/** High-contrast ink block. Lifts off cream in light mode and off black in dark mode. */
export function CardDark({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "ink-panel rounded-[20px] overflow-hidden",
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-5 sm:p-6": padding === "md",
          "p-6 sm:p-8": padding === "lg",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
