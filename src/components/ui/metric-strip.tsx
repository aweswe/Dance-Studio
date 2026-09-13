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
    n <= 2
      ? "grid-cols-2"
      : n === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : n === 4
          ? "grid-cols-2 lg:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <dl
      className={cn(
        "grid gap-px rounded-[20px] border border-line bg-line overflow-hidden shadow-lift",
        cols,
        className,
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            "bg-surface-card px-3 py-4 sm:px-5 sm:py-5",
            n > 3 && n % 2 === 1 && i === n - 1 && "max-sm:col-span-2",
          )}
        >
          <dt className="text-[11px] text-ink-3">{item.label}</dt>
          <dd
            className={cn(
              "mt-1 text-ink tracking-tight",
              item.variant === "text"
                ? "text-sm sm:text-base font-medium leading-snug"
                : "font-anton text-xl sm:text-3xl tabular-nums",
            )}
          >
            {item.value}
          </dd>
          {item.hint && <p className="mt-0.5 text-[11px] text-ink-2 line-clamp-2">{item.hint}</p>}
        </div>
      ))}
    </dl>
  );
}
