import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ label, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 sm:mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0">
        {label && (
          <p className="text-[11px] font-medium text-ink-3 mb-1">{label}</p>
        )}
        <h1 className="font-anton text-3xl sm:text-4xl text-ink tracking-tight text-balance">{title}</h1>
        {description && <p className="mt-2 text-sm text-ink-2 max-w-2xl text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
