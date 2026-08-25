import { Skeleton, SectionHeaderSkeleton, CardSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex-1 bg-canvas">
      {/* Dark hero band */}
      <section className="bg-blk py-20 px-6 md:px-16">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <Skeleton dark className="h-6 w-32 rounded-full mb-6" />
          <Skeleton dark className="h-12 md:h-16 w-[60vw] max-w-[500px] mb-4" />
          <Skeleton dark className="h-4 w-[70vw] max-w-[520px] mb-10" />
          <Skeleton dark className="h-12 w-44" />
        </div>
      </section>

      {/* Two-column content */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
          <SectionHeaderSkeleton />
        </div>
        <div className="space-y-8">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    </div>
  );
}
