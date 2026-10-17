import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminBroadcastLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </Card>

      <TableSkeleton rows={5} columns={4} />
    </div>
  );
}
