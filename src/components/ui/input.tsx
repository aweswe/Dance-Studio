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
            className="text-[10px] tracking-[2px] uppercase text-mu mb-2 block"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-white border border-black/10 rounded px-4 py-3 text-sm text-blk placeholder-mu/50",
            "focus:outline-none focus:border-bl/50 focus:ring-1 focus:ring-bl/20 transition-all",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
