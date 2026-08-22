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
        "inline-flex items-center gap-1.5 text-[9px] tracking-[3px] uppercase font-bold px-3 py-1 rounded-full",
        {
          "bg-bl/15 text-bl": variant === "blue",
          "bg-gold/15 text-gold": variant === "gold",
          "bg-purp/20 text-purp": variant === "purple",
          "bg-green/15 text-green": variant === "green",
          "bg-black/5 text-mu": variant === "default",
          "border border-black/10 text-mu": variant === "outline",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
