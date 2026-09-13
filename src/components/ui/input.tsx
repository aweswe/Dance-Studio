import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-ink-2 mb-1.5 block"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-11 bg-canvas-muted border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3",
            "focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger mt-1">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
