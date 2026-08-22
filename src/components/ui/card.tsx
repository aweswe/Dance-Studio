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
        "bg-white rounded-2xl border border-black/[.07] overflow-hidden",
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardDark({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-deep rounded-2xl border border-white/[.08] overflow-hidden",
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
