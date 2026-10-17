import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { sectionGap, sectionPad } from '@/lib/ui/section-layout';
import { homepageMediaRadius } from '@/lib/ui/homepage-cta';
import { cn } from '@/lib/utils/cn';

/**
 * Pixel-perfect skeleton for ReelsStrip
 * Exactly mirrors the 6-reel grid layout to eliminate Cumulative Layout Shift (CLS).
 */
export function ReelsStripSkeleton() {
  return (
    <HomepageSection className={cn(sectionPad, 'select-none')} ariaLabel="Loading Instagram reels">
      <div className={cn('flex flex-col', sectionGap)}>
        {/* Header Skeleton */}
        <div className={cn('flex flex-wrap items-end justify-between', sectionGap)}>
          <div className="min-w-0 flex-1 max-w-2xl space-y-2">
            <div className="h-3.5 w-24 rounded bg-bl/20 animate-pulse" />
            <div className="h-8 sm:h-10 w-64 sm:w-80 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="h-9 w-36 rounded-md border border-white/10 bg-white/5 animate-pulse hidden sm:block" />
        </div>

        {/* 6 Reels Grid Skeleton */}
        <div
          className={cn(
            'flex w-full overflow-hidden pb-2 lg:pb-0',
            sectionGap,
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'group relative aspect-[9/16] overflow-hidden bg-black/60 border border-white/10 shadow-xs',
                'shrink-0 w-[200px] sm:w-[240px]',
                'lg:w-[calc((100%-5*1rem)/6)] lg:min-w-[180px] lg:max-w-[260px] lg:flex-1 lg:basis-0',
                homepageMediaRadius,
                'animate-pulse'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-white/[0.03] to-white/[0.06]" />

              {/* Top Reel Badge Placeholder */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <div className="h-4 w-12 rounded bg-white/15" />
                <div className="h-4 w-4 rounded bg-white/10" />
              </div>

              {/* Center Play Icon Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15" />
              </div>

              {/* Bottom Title Placeholder */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 space-y-1.5">
                <div className="h-2.5 w-16 rounded bg-bl/30" />
                <div className="h-3 w-4/5 rounded bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </HomepageSection>
  );
}

/**
 * Pixel-perfect skeleton for HomepageEcomSection
 */
export function HomepageEcomSkeleton() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 border-t border-line bg-canvas">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-8 sm:space-y-10">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-full bg-bl/20 animate-pulse" />
            <div className="h-8 w-60 rounded bg-ink/10 animate-pulse" />
          </div>
          <div className="h-4 w-28 rounded bg-ink/10 animate-pulse hidden sm:block" />
        </div>

        {/* 4 Products Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-line bg-surface p-3 space-y-3 animate-pulse">
              <div className="aspect-square w-full rounded-md bg-ink/[0.06]" />
              <div className="space-y-1.5 pt-1">
                <div className="h-3.5 w-3/4 rounded bg-ink/15" />
                <div className="h-3 w-1/2 rounded bg-ink/10" />
                <div className="h-4 w-16 rounded bg-bl/20 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Pixel-perfect skeleton for DanziaTestimonialsSection
 */
export function DanziaTestimonialsSkeleton() {
  return (
    <HomepageSection className={sectionPad} ariaLabel="Loading testimonials">
      <div className={cn('flex flex-col', sectionGap)}>
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
          <div className="h-3.5 w-28 rounded bg-bl/20 animate-pulse mx-auto" />
          <div className="h-8 sm:h-10 w-72 rounded bg-ink/10 animate-pulse mx-auto" />
        </div>

        {/* Testimonials 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-line bg-surface space-y-4 animate-pulse shadow-2xs"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <div key={s} className="w-3.5 h-3.5 rounded bg-gold/20" />
                ))}
              </div>
              <div className="space-y-2 py-2">
                <div className="h-3.5 w-full rounded bg-ink/10" />
                <div className="h-3.5 w-5/6 rounded bg-ink/10" />
                <div className="h-3.5 w-3/4 rounded bg-ink/10" />
              </div>
              <div className="pt-2 border-t border-line/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ink/10 shrink-0" />
                <div className="space-y-1">
                  <div className="h-3.5 w-24 rounded bg-ink/15" />
                  <div className="h-2.5 w-20 rounded bg-ink/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HomepageSection>
  );
}

/**
 * Pixel-perfect skeleton for FAQSection
 */
export function FAQSectionSkeleton() {
  return (
    <HomepageSection className={sectionPad}>
      <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
        <div className="mb-7 sm:mb-8 max-w-2xl text-center mx-auto space-y-2">
          <div className="h-3.5 w-36 rounded bg-bl/20 animate-pulse mx-auto" />
          <div className="h-8 sm:h-10 w-72 sm:w-96 rounded bg-ink/10 animate-pulse mx-auto" />
        </div>

        <div className="w-full space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full rounded-md border border-line bg-surface p-4 flex items-center justify-between animate-pulse"
            >
              <div className="h-4 w-3/5 rounded bg-ink/15" />
              <div className="h-4 w-4 rounded bg-ink/10" />
            </div>
          ))}
        </div>
      </div>
    </HomepageSection>
  );
}
