import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      {/* Breadcrumb & Metadata Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-full max-w-2xl rounded-md" />
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>
      </div>

      {/* Cover Image Skeleton */}
      <Skeleton className="aspect-[16/9] w-full rounded-md" />

      {/* Article Prose Paragraphs Skeleton */}
      <div className="space-y-4 max-w-3xl pt-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <div className="pt-4 space-y-4">
          <Skeleton className="h-6 w-1/2 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>
      </div>
    </div>
  );
}

