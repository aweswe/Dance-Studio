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
          "bg-sky-100 text-sky-950 border border-sky-300 font-bold": variant === "blue",
          "bg-amber-100 text-amber-950 border border-amber-300 font-bold": variant === "gold",
          "bg-purple-100 text-purple-950 border border-purple-300 font-bold": variant === "purple",
          "bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold": variant === "green",
          "bg-slate-100 text-slate-900 border border-slate-300 font-bold": variant === "default",
          "border-2 border-slate-300 text-slate-800 font-bold": variant === "outline",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
