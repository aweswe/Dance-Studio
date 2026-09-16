import { cn } from "@/lib/utils/cn";

export interface MetricItem {
  label: string;
  value: string;
  hint?: string;
  /** `text` for names/status; default is a large stat figure. */
  variant?: "stat" | "text";
}

export function MetricStrip({ items, className }: { items: MetricItem[]; className?: string }) {
  const n = items.length;
  const cols =
    n <= 1
      ? "grid-cols-1"
      : n === 2
        ? "grid-cols-2"
        : n === 3
          ? "grid-cols-3"
          : n === 4
            ? "grid-cols-2 sm:grid-cols-4"
            : n === 6
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <dl
      className={cn(
        "grid gap-px rounded-md border border-line bg-line overflow-hidden shadow-lift",
        cols,
        className,
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            "bg-surface-card px-2.5 py-3 sm:px-5 sm:py-5 min-w-0 flex flex-col justify-center",
            n > 3 && n % 2 === 1 && i === n - 1 && "col-span-2 sm:col-span-1 lg:col-span-1",
          )}
        >
          <dt className="text-[10px] sm:text-[11px] text-ink-3 uppercase tracking-wider truncate">{item.label}</dt>
          <dd
            className={cn(
              "mt-1 text-ink tracking-tight truncate",
              item.variant === "text"
                ? "text-xs sm:text-base font-medium leading-snug"
                : n === 3
                  ? "font-anton text-lg sm:text-2xl lg:text-3xl tabular-nums"
                  : "font-anton text-xl sm:text-3xl tabular-nums",
            )}
          >
            {item.value}
          </dd>
          {item.hint && <p className="mt-0.5 text-[10px] sm:text-[11px] text-ink-2 truncate">{item.hint}</p>}
        </div>
      ))}
    </dl>
  );
}
