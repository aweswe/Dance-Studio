'use client';

import { Star } from 'lucide-react';
import { CountUp } from '@/components/motion/count-up';
import { ACADEMY } from '@/lib/utils/constants';

const STAT_META: { key: string; label: string; fallback: string }[] = [
  { key: 'stats_students', label: 'Students trained', fallback: '5000+' },
  { key: 'stats_years', label: 'Years teaching', fallback: '15+' },
  { key: 'stats_programmes', label: 'Programmes', fallback: '4' },
  { key: 'stats_awards', label: 'Awards won', fallback: '3' },
];

const VALUE_CLASS =
  'font-anton text-[clamp(1.25rem,3.25vw,1.875rem)] leading-none tracking-tight text-white';
const LABEL_CLASS =
  'm-0 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] leading-snug text-white/40';
const VALUE_ROW = 'm-0 flex h-[1.875rem] items-center';
const CELL = 'flex min-w-0 flex-col gap-1.5';

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

export function HeroStats({ stats }: { stats: { key: string; value: string }[] }) {
  const valueByKey = (stats ?? []).reduce<Record<string, string>>((acc, s) => {
    if (s?.key) acc[s.key] = String(s.value ?? '');
    return acc;
  }, {});

  return (
    <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-nowrap sm:items-start sm:justify-between sm:gap-x-3 lg:gap-x-4">
      <div className="col-span-2 sm:col-span-1 sm:shrink-0 flex justify-center sm:justify-start">
        <a
          href={ACADEMY.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ACADEMY.googleRating} stars on Google, ${ACADEMY.googleReviewCount}+ reviews`}
          className="flex flex-col items-center sm:items-start gap-1.5 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-blk"
        >
          <dt className="m-0 flex h-[1.875rem] items-center justify-center sm:justify-start gap-2">
            <span
              className="flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-md bg-white shadow-[0_2px_6px_-1px_rgba(0,0,0,0.32)]"
              aria-hidden
            >
              <GoogleMark className="h-4 w-4" />
            </span>
            <span className="flex items-center gap-1.5">
              <span className={VALUE_CLASS}>{ACADEMY.googleRating}</span>
              <span className="flex shrink-0 items-center gap-px text-gold" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
            </span>
          </dt>
          <dd className="m-0 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] leading-snug text-white/40 text-center sm:text-left sm:pl-[calc(1.875rem+0.5rem)]">
            {ACADEMY.googleReviewCount}+ reviews
          </dd>
        </a>
      </div>

      {STAT_META.map((stat) => (
        <div
          key={stat.key}
          className="flex min-w-0 flex-col items-center sm:items-start justify-center text-center sm:text-left gap-1.5 sm:shrink-0"
        >
          <dt className="m-0 flex h-[1.875rem] items-center justify-center sm:justify-start">
            <span className={VALUE_CLASS}>
              <CountUp value={valueByKey[stat.key] || stat.fallback} />
            </span>
          </dt>
          <dd className="m-0 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] leading-snug text-white/40 text-center sm:text-left">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
