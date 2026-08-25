import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Centered empty-state block for tables, feeds, and lists with no data. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}
    >
      {icon && <div className="mb-4 text-ink-3 [&>svg]:w-10 [&>svg]:h-10">{icon}</div>}
      <h3 className="font-display text-xl tracking-wide text-ink">{title}</h3>
      {description && <p className="mt-2 text-sm text-ink-2 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
