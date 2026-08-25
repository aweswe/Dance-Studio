import { Skeleton, StatCardSkeleton, CardSkeleton, ListRowSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-56 mb-2" />

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <div className="bg-surface rounded-2xl border border-line-subtle overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
