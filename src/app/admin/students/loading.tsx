import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function AdminStudentsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface rounded-card border border-line p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-canvas-muted/50">
        <Skeleton className="h-10 w-full sm:max-w-xs rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
