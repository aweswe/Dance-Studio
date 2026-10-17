import { Skeleton } from "@/components/ui/skeleton";

export default function ProgrammeDetailLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14 animate-in fade-in duration-150">
      {/* 1. Programme Hero Skeleton */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-full" />
        </div>
        <Skeleton className="h-12 sm:h-14 w-80 sm:w-full max-w-xl rounded-md" />
        <Skeleton className="h-4 w-full max-w-2xl rounded" />
        <Skeleton className="h-4 w-5/6 max-w-xl rounded" />

        <div className="flex flex-wrap gap-3 pt-2">
          <Skeleton className="h-12 w-40 rounded-md" />
          <Skeleton className="h-12 w-36 rounded-md" />
        </div>
      </div>

      {/* 2. 4 Quick Specs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-md border border-line bg-surface p-4 text-center space-y-2">
            <Skeleton className="h-3.5 w-16 mx-auto rounded" />
            <Skeleton className="h-6 w-24 mx-auto rounded" />
          </div>
        ))}
      </div>

      {/* 3. Schedule & Pricing 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Schedule Card (7 cols) */}
        <div className="lg:col-span-7 rounded-md border border-line bg-surface p-6 sm:p-7 space-y-5">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <Skeleton className="h-6 w-44 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-md border border-line-subtle flex justify-between items-center">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pricing Tier Card (5 cols) */}
        <div className="lg:col-span-5 rounded-md border border-line bg-surface p-6 sm:p-7 space-y-5">
          <div className="border-b border-line pb-3">
            <Skeleton className="h-6 w-36 rounded" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-32 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

