import { Skeleton } from "@/components/ui/skeleton";

export default function KuchipudiSyllabusLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-150">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="h-12 w-full max-w-xl rounded-md" />
        <Skeleton className="h-4 w-full max-w-2xl rounded" />
      </div>

      {/* 4 Pillars Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-md border border-line bg-surface p-5 space-y-3">
            <Skeleton className="h-5 w-28 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>

      {/* Curriculum Racetrack Container Skeleton */}
      <div className="rounded-md border border-line bg-surface p-6 sm:p-8 space-y-6">
        <Skeleton className="h-7 w-48 rounded" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-md border border-line-subtle flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-3.5 w-64 rounded" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
