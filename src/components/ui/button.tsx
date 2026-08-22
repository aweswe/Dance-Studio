import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold tracking-[2px] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-bl text-white hover:opacity-85": variant === "primary",
            "bg-blk text-white hover:bg-bl": variant === "secondary",
            "bg-transparent border border-black/[.18] text-blk hover:border-bl hover:text-bl":
              variant === "outline",
            "bg-transparent text-mu hover:text-blk": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "danger",
          },
          {
            "text-[10px] px-4 py-2": size === "sm",
            "text-[11px] px-6 py-3": size === "md",
            "text-[11px] px-8 py-3.5": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
