import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDetailLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full border border-line bg-canvas-muted flex items-center justify-center">
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48 sm:w-64" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Main Grid: Left Profile Card + Right Fee/Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Details Card */}
        <Card className="p-6 col-span-1 lg:col-span-1 h-fit space-y-6">
          <div className="border-b border-line-subtle pb-3">
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="space-y-5">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <Skeleton className="w-4 h-4 rounded mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Skeleton className="w-4 h-4 rounded mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Batch & Programme */}
            <div className="flex items-start gap-3">
              <Skeleton className="w-4 h-4 rounded mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            {/* Parent Info */}
            <div className="flex items-start gap-3 pt-2 border-t border-line-subtle">
              <Skeleton className="w-4 h-4 rounded mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Fee History & Actions */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Fee Payment History Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Table skeleton */}
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-line-subtle last:border-0"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="space-y-1.5 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Student Actions Card */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-line-subtle pb-3">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
