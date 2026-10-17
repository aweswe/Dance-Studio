import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 rounded-md" />
        <Skeleton className="h-4 w-full max-w-md rounded" />
      </div>

      <div className="max-w-4xl mx-auto space-y-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-line rounded-md p-5 sm:p-6 bg-surface space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <Skeleton className="w-full sm:w-48 aspect-[16/10] sm:aspect-square shrink-0 rounded-md" />
              <div className="space-y-3 flex-1 w-full">
                <Skeleton className="h-4 w-36 rounded-full" />
                <Skeleton className="h-7 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <div className="pt-2 flex items-center gap-3">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-9 w-32 rounded-md ml-auto" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
