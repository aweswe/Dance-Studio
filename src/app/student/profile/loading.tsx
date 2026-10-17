import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function StudentProfileLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <Skeleton className="h-4 w-96 max-w-full" />

      <Card className="p-6 max-w-2xl space-y-6">
        {/* Photo avatar skeleton */}
        <div className="flex items-center gap-4 pb-4 border-b border-line-subtle">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Input fields skeletons */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="pt-4 border-t border-line-subtle space-y-4">
            <Skeleton className="h-5 w-44" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>

        <Skeleton className="h-10 w-36 rounded-md" />
      </Card>
    </div>
  );
}
