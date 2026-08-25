import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex-1 bg-canvas">
      {/* Cover band */}
      <section className="bg-blk py-20 px-6 md:px-16">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <Skeleton dark className="h-5 w-40 rounded-full mb-6" />
          <Skeleton dark className="h-10 md:h-14 w-[70vw] max-w-[560px] mb-4" />
          <Skeleton dark className="h-3 w-56 mb-10" />
        </div>
      </section>

      {/* Article body */}
      <section className="py-16 px-6 md:px-16 max-w-3xl mx-auto">
        <div className="space-y-3 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className={i % 4 === 0 ? "h-3 w-2/3" : "h-3 w-full"} />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-xl mb-10" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}
