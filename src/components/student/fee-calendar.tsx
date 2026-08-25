import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export interface FeeMonth {
  /** "YYYY-MM" key. */
  key: string;
  /** Short display label, e.g. "Sep '26". */
  label: string;
  covered: boolean;
  isCurrent: boolean;
}

/** 12-month coverage grid: green for paid months, red for the current
 *  uncovered month, muted for future months not yet due. */
export function FeeCalendar({ months }: { months: FeeMonth[] }) {
  return (
    <Card>
      <h2 className="font-display text-2xl tracking-[2px] mb-1">Payment Calendar</h2>
      <p className="text-sm text-mu mb-5">Your fee coverage for the last 12 months.</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {months.map((m) => (
          <div
            key={m.key}
            className={cn(
              "rounded-lg border p-3 text-center",
              m.covered && "border-green/40 bg-green/5",
              !m.covered && m.isCurrent && "border-red-400 bg-red-50",
              !m.covered && !m.isCurrent && "border-black/10 bg-off",
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mu mb-1.5">{m.label}</p>
            {m.covered ? (
              <p className="text-xs font-semibold text-green">Paid ✓</p>
            ) : m.isCurrent ? (
              <p className="text-xs font-semibold text-red-600">Due</p>
            ) : (
              <p className="text-xs text-mu">—</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
