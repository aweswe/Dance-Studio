import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "gold" | "purple" | "green" | "default" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md",
        {
          "bg-bl/15 text-bl-ink": variant === "blue",
          "bg-gold/15 text-gold-ink": variant === "gold",
          "bg-purp/20 text-purp": variant === "purple",
          "bg-green/15 text-green-ink": variant === "green",
          "bg-canvas-muted-2 text-ink-2": variant === "default",
          "border border-line-strong text-ink-2": variant === "outline",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
