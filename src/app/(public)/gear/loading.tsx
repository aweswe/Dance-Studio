import { Skeleton } from "@/components/ui/skeleton";

export default function GearLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      {/* Header Skeleton */}
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 rounded-md" />
        <Skeleton className="h-4 w-full max-w-md rounded" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 border-b border-line">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24 sm:w-28 rounded-md shrink-0" />
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-md border border-line bg-surface p-4 sm:p-5 space-y-4 shadow-sm"
          >
            {/* Product Image Skeleton */}
            <Skeleton className="aspect-square w-full rounded-md" />

            {/* Tag / Category */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>

            {/* Name & Price */}
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>

            {/* Action Button */}
            <Skeleton className="h-10 w-full rounded-md mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
