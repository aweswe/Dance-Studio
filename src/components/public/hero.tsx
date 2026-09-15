import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import { HeroVideo } from '@/components/public/hero-video';
import { HeroStats } from '@/components/public/hero-stats';

interface HeroProps {
  stats: { key: string; value: string }[];
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative w-full px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-6 sm:pb-8 max-w-[1440px] mx-auto">
      <div className="relative px-6 sm:px-10 lg:px-12 xl:px-14 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 xl:gap-x-12 gap-y-10 items-center">
          {/* Left — copy + CTAs */}
          <div className="@container min-w-0 w-full max-w-[36rem]">
            <div className="inline-flex flex-col gap-2 mb-4 sm:mb-5 w-fit">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl">
                Secunderabad · Since 2010
              </p>
              <span className="h-px w-[11.75rem] sm:w-[12.5rem] max-w-[52%] bg-bl/50" aria-hidden />
            </div>

            <h1 className="font-anton uppercase text-white w-full max-w-[11ch] flex flex-col gap-2 sm:gap-3">
              <span className="block leading-none tracking-[0.02em] sm:tracking-[0.035em] text-[clamp(3.45rem,16.5cqw,7.25rem)] text-white">
                Move
              </span>
              <span className="block leading-none tracking-[0.02em] sm:tracking-[0.035em] text-[clamp(4.15rem,22cqw,9.65rem)] text-bl">
                Different
              </span>
            </h1>

            <p className="mt-6 sm:mt-8 max-w-[42ch] text-[15px] sm:text-base leading-[1.65] text-white/60 font-normal normal-case">
              Secunderabad · Dance &amp; Fitness Classes · Neredmet X Road
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-2.5">
              <Link
                href={ROUTES.enrol}
                className="inline-flex w-full sm:w-[13.75rem] items-center justify-center gap-1.5 min-h-[44px] px-5 rounded-md bg-white text-blk text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-bl transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                Book your free trial
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
              <Link
                href={ROUTES.programmes}
                className="inline-flex w-full sm:w-[13.75rem] items-center justify-center min-h-[44px] px-5 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] text-white ring-1 ring-white/35 bg-white/[0.06] hover:bg-white/[0.1] hover:ring-white/50 transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                Explore more
              </Link>
            </div>
          </div>

          {/* Right — video ~88% of column */}
          <div className="min-w-0 w-full flex justify-center lg:justify-end">
            <HeroVideo className="w-[88%] max-w-full" />
          </div>
        </div>

        <div className="mt-8 sm:mt-9 pt-6 sm:pt-7 pr-8 sm:pr-10 border-t border-white/[0.08]">
          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  );
}
