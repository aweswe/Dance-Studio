import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function StudentLeaveLoading() {
  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
      <Skeleton className="h-4 w-72 max-w-full" />

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </Card>
    </div>
  );
}
