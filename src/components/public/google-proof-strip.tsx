import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import { ACADEMY, ROUTES } from '@/lib/utils/constants';
import { GOOGLE_STAR_DISTRIBUTION } from '@/data/google-reviews';
import { GoogleReviewTicker } from '@/components/public/google-review-ticker';

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function GoogleProofStrip() {
  return (
    <section className="px-4 sm:px-8 md:px-14 py-10 max-w-[1440px] mx-auto">
      <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] dark:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-5 sm:px-6 py-4 sm:py-5">
          {/* Score block */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-line shadow-sm">
              <GoogleMark className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3 mb-0.5">
                Rated on Google · Neredmet
              </p>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-anton text-3xl sm:text-[2rem] leading-none text-ink tracking-tight">
                  {ACADEMY.googleRating}
                </span>
                <span className="flex items-center gap-0.5 text-gold" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="text-xs sm:text-sm text-ink-2 font-medium">
                  {ACADEMY.googleReviewCount}+ reviews
                </span>
              </div>
            </div>
          </div>

          {/* Compact star distribution — desktop only */}
          <div className="hidden lg:flex flex-col gap-0.5 w-[140px] shrink-0" aria-hidden>
            {GOOGLE_STAR_DISTRIBUTION.filter((r) => r.pct > 0).map((row) => (
              <div key={row.stars} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-ink-3 w-3">{row.stars}</span>
                <div className="flex-1 h-1 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-ink-3 w-6 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>

          {/* Actions — utility style (not hero CTAs) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={ACADEMY.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 min-h-[36px] px-3.5 rounded-full text-[11px] font-semibold text-white bg-[#4285F4] hover:bg-[#3367D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              Google Maps
              <ExternalLink size={12} strokeWidth={2} className="opacity-90" />
            </a>
            <Link
              href={ROUTES.schedule}
              className="inline-flex items-center justify-center min-h-[36px] px-3.5 rounded-full text-[11px] font-semibold text-ink-2 hover:text-ink border border-line hover:border-line-strong bg-transparent hover:bg-canvas-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              Timetable →
            </Link>
          </div>
        </div>

        <GoogleReviewTicker />
      </div>
    </section>
  );
}
