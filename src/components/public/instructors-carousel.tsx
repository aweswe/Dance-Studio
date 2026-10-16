'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { compactSnapSlideClass } from '@/components/public/snap-carousel';
import { HomepageSection } from '@/components/public/homepage-section';
import type { InstructorDisplay } from '@/lib/instructors/display';
import { formatInstructorRole, resolveInstructorPhoto } from '@/lib/instructors/display';
import { homepageCtaOutlineLight, homepageMediaFrame } from '@/lib/ui/homepage-cta';
import { sectionGap, sectionPad } from '@/lib/ui/section-layout';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const navButtonClass =
  'inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-line text-ink hover:border-ink hover:bg-ink/[0.04] transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

export function InstructorsCarousel({ instructors }: { instructors: InstructorDisplay[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16') || 16;
    const step = first ? first.offsetWidth + gap : 180;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <HomepageSection id="faculty" className={sectionPad}>
      <div className={cn('flex flex-col', sectionGap)}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
          <header className="min-w-0 flex-1 max-w-2xl flex flex-col gap-1.5 sm:gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl">Faculty</p>
            <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-ink">
              Who <span className="text-bl">teaches?</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Meet the coaches who train, guide, and perform with our students every day.
            </p>
          </header>
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
            <Link
              href={ROUTES.about}
              className={cn(homepageCtaOutlineLight, 'h-10 min-h-[40px] px-3.5 text-[10px]')}
            >
              All faculty
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </Link>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Previous instructor"
                className={navButtonClass}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Next instructor"
                className={navButtonClass}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className={cn(
            'flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar pb-2 scroll-px-0 [scroll-padding-inline:0]',
            sectionGap,
          )}
        >
          {instructors.map((instructor) => (
            <article key={instructor.id} className={cn(compactSnapSlideClass, 'group flex flex-col', sectionGap)}>
              <div
                className={cn(
                  'relative aspect-[3/4] w-full bg-canvas-muted border border-line',
                  homepageMediaFrame,
                )}
              >
                <Image
                  src={resolveInstructorPhoto(instructor.name, instructor.photo_url)}
                  alt={instructor.name}
                  fill
                  sizes="11rem"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="min-w-0 pr-0.5">
                <h3 className="font-anton text-base sm:text-[1.05rem] uppercase tracking-tight text-ink leading-[1.05] line-clamp-2">
                  {instructor.name}
                </h3>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.12em] text-bl line-clamp-2 leading-snug">
                  {formatInstructorRole(instructor.role)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </HomepageSection>
  );
}
