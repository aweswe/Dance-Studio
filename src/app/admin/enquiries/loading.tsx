import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function AdminEnquiriesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-line pb-2">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
