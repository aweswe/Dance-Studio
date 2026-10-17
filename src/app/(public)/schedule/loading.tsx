import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 rounded-md" />
        <Skeleton className="h-4 w-full max-w-md rounded" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-line">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-md shrink-0" />
        ))}
      </div>

      {/* Schedule Rows Skeleton */}
      <div className="space-y-4 pt-2 max-w-5xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-md border border-line bg-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-20 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton className="h-3.5 w-32 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
