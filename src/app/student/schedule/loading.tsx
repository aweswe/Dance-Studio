import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function StudentScheduleLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <Skeleton className="h-4 w-52 max-w-full" />

      <Card className="p-6 space-y-6">
        <Skeleton className="h-7 w-64" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="flex-2 space-y-3">
            <Skeleton className="h-3 w-16" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
