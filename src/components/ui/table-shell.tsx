import { cn } from "@/lib/utils/cn";

interface TableShellProps {
  /** Toolbar row (search, filters, actions) — rendered inside the chrome */
  toolbar?: React.ReactNode;
  /** Error banner shown above the table */
  error?: React.ReactNode;
  /** The <table> element */
  table: React.ReactNode;
  /** Footer row (pagination / Load More) */
  footer?: React.ReactNode;
  className?: string;
}

/** One table pattern across admin lists: surface card, muted toolbar, hairline rows. */
export function TableShell({ toolbar, error, table, footer, className }: TableShellProps) {
  return (
    <div className={cn("bg-surface rounded-card border border-line overflow-hidden", className)}>
      {toolbar && <div className="p-4 border-b border-line bg-canvas-muted/50">{toolbar}</div>}
      {error && (
        <div className="mx-4 mt-4 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">{table}</div>
      {footer && <div className="p-4 border-t border-line flex justify-center">{footer}</div>}
    </div>
  );
}

/** Standard header cell — uppercase display label on the muted band. */
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn("px-6 py-4 text-xs font-display tracking-[2px] text-ink-2 uppercase", className)}
    >
      {children}
    </th>
  );
}
