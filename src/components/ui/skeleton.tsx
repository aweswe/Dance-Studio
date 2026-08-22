import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-black/5 rounded",
        className,
      )}
    />
  );
}

/** Skeleton for stat numbers (hero stats section) */
export function StatSkeleton() {
  return (
    <div className="text-center py-8 px-5 border-r border-black/[.07] last:border-r-0">
      <Skeleton className="h-12 w-20 mx-auto mb-2" />
      <Skeleton className="h-3 w-24 mx-auto" />
    </div>
  );
}

/** Skeleton for programme cards */
export function ProgrammeCardSkeleton() {
  return (
    <div className="rounded-2xl bg-deep border border-white/[.08] p-10">
      <Skeleton className="h-5 w-24 rounded-full mb-4 bg-white/5" />
      <Skeleton className="h-8 w-48 mb-2 bg-white/5" />
      <Skeleton className="h-3 w-32 mb-5 bg-white/5" />
      <div className="space-y-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-4 w-full bg-white/5" />
        ))}
      </div>
      <Skeleton className="h-20 w-full rounded-lg mb-5 bg-white/5" />
      <Skeleton className="h-12 w-full bg-white/5" />
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
