import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function StudentFeesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Fee Status Card Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-11 w-36 rounded-md" />
        </div>
      </Card>

      {/* Trailing Months Calendar Skeleton */}
      <Card className="p-6 space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3 rounded-md border border-line-subtle text-center space-y-2">
              <Skeleton className="h-3 w-16 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </Card>

      {/* Payment History Card Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-line-subtle">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-line-subtle last:border-0">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right space-y-1.5">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
