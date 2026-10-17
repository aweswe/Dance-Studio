import { Skeleton } from "@/components/ui/skeleton";

export function PublicPageSkeleton({
  hasHeader = true,
  cardCount = 3,
  columns = 3,
}: {
  hasHeader?: boolean;
  cardCount?: number;
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 animate-in fade-in duration-150">
      {/* 1. Page Header Skeleton */}
      {hasHeader && (
        <div className="space-y-3 max-w-2xl">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-64 sm:w-96 rounded-md" />
          <Skeleton className="h-4 w-full max-w-lg rounded" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded" />
        </div>
      )}

      {/* 2. Main Content Cards Grid Skeleton */}
      <div className={`grid ${colClass} gap-6`}>
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-line bg-surface p-6 sm:p-7 space-y-4 shadow-sm"
          >
            {/* Card Thumbnail / Top Accent */}
            <Skeleton className="h-44 w-full rounded-md" />

            {/* Badge / Metadata */}
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
            </div>

            {/* Footer / CTA row */}
            <div className="pt-3 border-t border-line-subtle flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
