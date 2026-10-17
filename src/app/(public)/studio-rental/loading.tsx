import { Skeleton } from "@/components/ui/skeleton";

export default function StudioRentalLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      {/* Title Skeleton */}
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-72 sm:w-96 rounded-md" />
        <Skeleton className="h-4 w-full max-w-lg rounded" />
      </div>

      {/* 7 Amenities Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="rounded-md border border-line bg-surface p-3.5 text-center space-y-1.5">
            <Skeleton className="w-4 h-4 rounded-full mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto rounded" />
          </div>
        ))}
      </div>

      {/* 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pt-4">
        {/* Gallery / Details on Left (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Skeleton className="aspect-[4/3] rounded-md" />
            <Skeleton className="aspect-[4/3] rounded-md" />
            <Skeleton className="aspect-[4/3] rounded-md" />
            <Skeleton className="aspect-[4/3] rounded-md" />
          </div>
          <div className="rounded-md border border-line bg-surface p-6 space-y-3">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>

        {/* Booking Form on Right (5 cols) */}
        <div className="lg:col-span-5 rounded-md border border-line bg-surface p-6 sm:p-7 space-y-5">
          <Skeleton className="h-6 w-36 rounded" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
