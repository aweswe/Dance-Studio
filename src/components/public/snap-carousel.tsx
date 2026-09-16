import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SnapCarouselProps {
  children: ReactNode;
  columns?: 3 | 4;
  className?: string;
  /** Keep horizontal snap scroll at all breakpoints (no md+ grid). */
  scrollOnly?: boolean;
}

export const snapSlideClass =
  'shrink-0 w-[min(78vw,20rem)] snap-start md:w-auto md:min-w-0 md:shrink';

/** Compact faculty / pill cards — always one row in scroll carousels. */
export const compactSnapSlideClass =
  'shrink-0 w-[min(68vw,9.75rem)] snap-start sm:w-[10.25rem] lg:w-[11rem]';

/** Grid from `md` up. Below that it is a snap carousel with a peek of the next card. */
export function SnapCarousel({
  children,
  columns = 4,
  className,
  scrollOnly = false,
}: SnapCarouselProps) {
  return (
    <div
      className={cn(
        'flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar pb-2 scroll-px-0 [scroll-padding-inline:0]',
        !scrollOnly &&
          columns === 4 &&
          'md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 lg:gap-7 md:overflow-visible md:mx-0 md:px-0 md:pb-0',
        !scrollOnly &&
          columns === 3 &&
          'md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:mx-0 md:px-0 md:pb-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
