import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  homepageCtaOutlineLight,
  homepageCtaPair,
  homepageCtaPairButton,
  homepageCtaPrimary,
} from '@/lib/ui/homepage-cta';
import { ROUTES } from '@/lib/utils/constants';
import { BrandLogo } from '@/components/shared/brand-logo';
import { HeroVideo } from '@/components/public/hero-video';
import { HeroStats } from '@/components/public/hero-stats';

interface HeroProps {
  stats: { key: string; value: string }[];
}

export function Hero({ stats }: HeroProps) {
  return (
    <section id="hero" className="relative w-full px-4 sm:px-6 md:px-10 pt-3 sm:pt-4 pb-4 sm:pb-5 max-w-[1440px] mx-auto">
      {/* Subtle top ambient sheen transitioning smoothly from the header */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent"
        aria-hidden
      />

      <div className="relative px-0 sm:px-10 lg:px-12 xl:px-14 py-3 sm:py-5 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 xl:gap-x-12 gap-y-8 items-center">
          {/* Left — copy + CTAs */}
          <div className="@container min-w-0 w-full max-w-[36rem]">
            {/* Prominent Academy Hallmark / Logo Badge */}
            <div className="flex items-center gap-3.5 sm:gap-4 mb-4 sm:mb-5">
              <BrandLogo priority className="h-12 sm:h-14 md:h-16 w-auto object-contain shrink-0" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-bl leading-tight">
                  Secunderabad · Since 2010
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 leading-tight">
                  IAO Accredited Studio (USA)
                </p>
              </div>
            </div>

            <h1 className="font-anton uppercase text-ink w-full max-w-[11ch] flex flex-col gap-1.5 sm:gap-2">
              <span className="block leading-none tracking-[0.02em] sm:tracking-[0.035em] text-[clamp(2.75rem,14cqw,7.25rem)] text-ink">
                Move
              </span>
              <span className="block leading-none tracking-[0.02em] sm:tracking-[0.035em] text-[clamp(2.75rem,17cqw,9.65rem)] text-bl">
                Different
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-[42ch] text-[15px] sm:text-base leading-[1.65] text-ink-2 font-normal normal-case">
              Secunderabad · Dance &amp; Fitness Classes · Neredmet X Road
            </p>

            <div className={`mt-6 sm:mt-8 ${homepageCtaPair}`}>
              <Link href={ROUTES.enrol} className={`${homepageCtaPrimary} ${homepageCtaPairButton}`}>
                Book your free trial
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
              <Link
                href={ROUTES.schedule}
                className={`${homepageCtaOutlineLight} ${homepageCtaPairButton}`}
              >
                View Schedule
              </Link>
            </div>
          </div>

          {/* Right — video ~88% of column */}
          <div className="min-w-0 w-full flex justify-center lg:justify-end">
            <HeroVideo className="w-[88%] max-w-full" />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 pr-0 sm:pr-10 border-t border-line">
          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  );
}
