import {
  HeroBlockSkeleton,
  StatStripSkeleton,
  SectionHeaderSkeleton,
  ProgrammeCardSkeleton,
  ListRowSkeleton,
  CardSkeleton,
} from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex-1 bg-white">
      {/* Hero — dark block matched to the real hero's footprint */}
      <div className="bg-blk">
        <HeroBlockSkeleton />
      </div>

      {/* Stats strip */}
      <StatStripSkeleton />

      {/* Programmes */}
      <div className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProgrammeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="py-24 px-6 md:px-16 bg-off border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton />
          <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <ListRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Instructors / testimonials */}
      <div className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
