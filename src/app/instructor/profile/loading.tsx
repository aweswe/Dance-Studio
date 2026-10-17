import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function InstructorProfileLoading() {
  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
      <Skeleton className="h-4 w-72 max-w-full" />

      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-line-subtle">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        </div>
      </Card>
    </div>
  );
}
