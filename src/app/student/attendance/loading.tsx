import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function StudentAttendanceLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <Skeleton className="h-4 w-80 max-w-full" />

      {/* Metric Strip Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-16" />
          </Card>
        ))}
      </div>

      {/* Calendar / Records Card Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-line-subtle">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-line-subtle last:border-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
