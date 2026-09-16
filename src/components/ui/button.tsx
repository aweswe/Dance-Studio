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
          "inline-flex items-center justify-center gap-2 font-semibold transition-[transform,background-color,color,border-color] duration-150 cubic-bezier(0.2,0,0,1) active:scale-[0.96] focus-visible:focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 min-h-10",
          {
            "bg-bl text-white hover:bg-bl-deep": variant === "primary",
            "bg-ink text-canvas hover:opacity-90 dark:bg-surface-raised dark:text-ink dark:border dark:border-line": variant === "secondary",
            "bg-transparent border border-line-strong text-ink hover:bg-canvas-muted": variant === "outline",
            "bg-transparent text-ink-2 hover:text-ink hover:bg-canvas-muted": variant === "ghost",
            "bg-danger text-white hover:bg-danger-deep": variant === "danger",
          },
          {
            "text-xs px-3 py-2 rounded-md": size === "sm",
            "text-sm px-4 py-2.5 rounded-md": size === "md",
            "text-sm px-5 py-3 rounded-md": size === "lg",
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
