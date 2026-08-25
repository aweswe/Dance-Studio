import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  /** pulse = Tailwind fade, shimmer = moving gradient sheen */
  variant?: "pulse" | "shimmer";
  /** dark surfaces (blk/deep cards) need a light fill instead of black/5 */
  dark?: boolean;
}

export function Skeleton({ className, variant = "pulse", dark = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded",
        dark ? "bg-white/5" : "bg-line",
        variant === "shimmer" && (dark ? "skeleton-shimmer-dark" : "skeleton-shimmer"),
        variant === "pulse" && "animate-pulse",
        className,
      )}
    />
  );
}

/** Inline spinner for buttons and small loading states */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/** Skeleton for stat numbers (hero stats section) */
export function StatSkeleton() {
  return (
    <div className="text-center py-8 px-5 border-r border-line last:border-r-0">
      <Skeleton className="h-12 w-20 mx-auto mb-2" />
      <Skeleton className="h-3 w-24 mx-auto" />
    </div>
  );
}

/** Skeleton for programme cards */
export function ProgrammeCardSkeleton() {
  return (
    <div className="rounded-2xl bg-deep border border-white/[.08] p-10">
      <Skeleton dark className="h-5 w-24 rounded-full mb-4" />
      <Skeleton dark className="h-8 w-48 mb-2" />
      <Skeleton dark className="h-3 w-32 mb-5" />
      <div className="space-y-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton dark key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton dark className="h-20 w-full rounded-lg mb-5" />
      <Skeleton dark className="h-12 w-full" />
    </div>
  );
}

/** Skeleton for table rows in dashboard */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/** Full table skeleton: header row + body rows */
export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-x-auto rounded-card border border-line bg-surface">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-line-subtle">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-3.5 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRowSkeleton key={r} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Micro-label + big heading + sub-line, matching public section headers */
export function SectionHeaderSkeleton({ center = false }: { center?: boolean }) {
  return (
    <div className={cn("mb-12", center && "flex flex-col items-center text-center")}>
      <Skeleton className="h-3 w-40 mb-3" />
      <Skeleton className="h-10 w-80 max-w-full mb-4" />
      <Skeleton className="h-3 w-96 max-w-full" />
    </div>
  );
}

/** Public stats strip (4 bordered cells) */
export function StatStripSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-line">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center py-8 px-5">
          <Skeleton className="h-12 w-20 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Full-height dark hero block (logo + H1 + tagline + CTAs), CLS-matched to Hero */
export function HeroBlockSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-blk relative pt-[110px] px-6 pb-20">
      <Skeleton dark className="h-[110px] w-[220px] mb-6" />
      <Skeleton dark className="h-3 w-80 max-w-full mb-3" />
      <Skeleton dark className="h-14 md:h-20 w-[70vw] max-w-[700px] mb-2" />
      <Skeleton dark className="h-3 w-96 max-w-full mb-9" />
      <div className="flex gap-3">
        <Skeleton dark className="h-12 w-40" />
        <Skeleton dark className="h-12 w-44" />
      </div>
      <div className="absolute bottom-5.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <Skeleton dark className="h-2.5 w-48" />
        <Skeleton dark className="w-px h-7" />
      </div>
    </div>
  );
}

/** Generic card skeleton; pass dark for blk/deep cards */
export function CardSkeleton({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-card p-8 border",
        dark ? "bg-deep border-white/[.08]" : "bg-surface border-line",
        className,
      )}
    >
      <Skeleton dark={dark} className="h-5 w-24 rounded-full mb-4" />
      <Skeleton dark={dark} className="h-8 w-48 mb-3" />
      <div className="space-y-2 mb-6">
        {[1, 2, 3].map((i) => (
          <Skeleton dark={dark} key={i} className="h-3 w-full" />
        ))}
      </div>
      <Skeleton dark={dark} className="h-10 w-32" />
    </div>
  );
}

/** Dashboard KPI card (label + big number + delta) */
export function StatCardSkeleton() {
  return (
    <div className="bg-surface p-6 rounded-card border border-line">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-16" />
    </div>
  );
}

/** Avatar circle + two text lines (list items, comments) */
export function AvatarRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </div>
    </div>
  );
}

/** Generic list row: thumb + two lines + right-aligned action */
export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-line-subtle">
      <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48 max-w-full" />
        <Skeleton className="h-3 w-72 max-w-full" />
      </div>
      <Skeleton className="h-8 w-20 shrink-0" />
    </div>
  );
}
