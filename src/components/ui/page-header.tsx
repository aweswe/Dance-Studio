import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  /** micro-label above the title (uses the section-label utility) */
  label?: string;
  title: string;
  description?: string;
  /** right-aligned actions (buttons, filters) */
  actions?: React.ReactNode;
  className?: string;
}

/** Unified page header across all surfaces — one H1 scale everywhere. */
export function PageHeader({ label, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4", className)}>
      <div className="min-w-0">
        {label && <p className="section-label">{label}</p>}
        <h1 className="font-display text-3xl md:text-4xl tracking-[1px] text-ink">{title}</h1>
        {description && <p className="mt-2 text-sm text-ink-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
