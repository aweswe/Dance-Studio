import { ACADEMY, ROUTES } from '@/lib/utils/constants';
import Link from 'next/link';
import { Star } from 'lucide-react';

export function GoogleProofStrip() {
  return (
    <section className="px-4 sm:px-8 md:px-14 py-10 max-w-[1440px] mx-auto">
      <a
        href={ACADEMY.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5 hover:border-ink/30 transition-colors"
      >
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-3 mb-1">Neredmet X Road · Secunderabad</p>
          <p className="font-anton text-2xl sm:text-3xl text-ink tracking-tight">
            {ACADEMY.googleRating} on Google
          </p>
          <p className="text-sm text-ink-2 mt-1">{ACADEMY.googleReviewCount}+ parent &amp; student reviews</p>
        </div>
        <div className="flex items-center gap-1 text-[#F5A623]" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} fill="currentColor" />
          ))}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-ink">Open in Maps</span>
      </a>
      <p className="text-center mt-4">
        <Link href={ROUTES.schedule} className="text-xs font-bold uppercase tracking-wider text-[#7C5CFC]">
          See this week&apos;s timetable →
        </Link>
      </p>
    </section>
  );
}
