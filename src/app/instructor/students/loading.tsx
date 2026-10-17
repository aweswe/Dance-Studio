import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function InstructorStudentsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Card className="p-4 space-y-4">
        <Skeleton className="h-10 w-full sm:max-w-sm rounded-md" />
        <TableSkeleton rows={8} columns={4} />
      </Card>
    </div>
  );
}
