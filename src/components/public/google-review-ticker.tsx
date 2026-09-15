'use client';

import { Star } from 'lucide-react';
import { GOOGLE_REVIEW_SNIPPETS } from '@/data/google-reviews';

export function GoogleReviewTicker() {
  const items = [...GOOGLE_REVIEW_SNIPPETS, ...GOOGLE_REVIEW_SNIPPETS];

  return (
    <div className="relative overflow-hidden py-2.5 sm:py-3 border-t border-line/80 bg-canvas-muted/40 dark:bg-white/[0.03]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 sm:w-12 bg-gradient-to-r from-canvas-muted/40 dark:from-white/[0.03] to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 sm:w-12 bg-gradient-to-l from-canvas-muted/40 dark:from-white/[0.03] to-transparent" aria-hidden />
      <div className="flex w-max animate-marquee [animation-duration:42s]">
        {items.map((review, i) => (
          <div
            key={`${review.author}-${i}`}
            className="flex items-center gap-3 sm:gap-4 shrink-0 pr-6 sm:pr-8 pl-2 first:pl-4 sm:first:pl-6"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4285F4]/15 text-[10px] font-bold text-[#4285F4]">
              {review.author.charAt(0)}
            </span>
            <div className="flex items-center gap-2 min-w-0 max-w-[min(100vw-6rem,320px)] sm:max-w-[360px]">
              <span className="flex shrink-0 text-[#F5A623]" aria-hidden>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={10} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <p className="text-[11px] sm:text-xs text-ink/80 leading-snug truncate">
                <span className="font-semibold text-ink">{review.author}</span>
                <span className="text-ink-3 mx-1.5">·</span>
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
            <span className="hidden md:inline shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-3 px-2 py-0.5 rounded-full border border-line">
              {review.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
