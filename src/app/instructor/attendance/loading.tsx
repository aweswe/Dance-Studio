import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function InstructorAttendanceLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-line-subtle">
          <Skeleton className="h-10 w-full sm:w-60 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2.5 px-4 rounded-md border border-line-subtle">
              <Skeleton className="h-4 w-36" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
