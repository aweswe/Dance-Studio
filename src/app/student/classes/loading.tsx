import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function StudentClassesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <Skeleton className="h-4 w-72 max-w-full" />

      {/* Enrolled Batch Banner Skeleton */}
      <Card className="p-6 border-bl/30 bg-bl/5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </Card>

      {/* Available Programmes & Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2 pt-2 border-t border-line-subtle">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
