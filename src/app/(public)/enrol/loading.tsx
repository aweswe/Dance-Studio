import { Skeleton } from "@/components/ui/skeleton";

export default function EnrolLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      {/* Title Skeleton */}
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 rounded-md" />
        <Skeleton className="h-4 w-full max-w-md rounded" />
      </div>

      {/* 7-col / 5-col Enrol Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-2">
        {/* Left: Form Bento Card */}
        <div className="lg:col-span-7 rounded-md border border-line bg-surface p-6 sm:p-8 space-y-6 shadow-md">
          {/* Header pill */}
          <div className="flex justify-between items-center pb-2">
            <Skeleton className="h-7 w-36 rounded-md" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>

          {/* Step 1: Programme selection */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-44 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3.5 rounded-md border border-line-subtle space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Batch timing selector */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>

          {/* Step 3: Inputs */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-12 w-full rounded-md mt-4" />
        </div>

        {/* Right: Studio Quick Info Card */}
        <div className="lg:col-span-5 rounded-md border border-line bg-surface p-6 sm:p-7 space-y-6">
          <div className="space-y-2 border-b border-line pb-4">
            <Skeleton className="h-6 w-44 rounded" />
            <Skeleton className="h-4 w-full rounded" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 rounded-full shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-md border border-line-subtle bg-canvas-muted/50 space-y-2">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
