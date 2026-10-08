import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  homepageCtaOutlineLight,
  homepageCtaPair,
  homepageCtaPairButton,
  homepageCtaPrimary,
} from '@/lib/ui/homepage-cta';
import { ROUTES } from '@/lib/utils/constants';
import { HeroVideo } from '@/components/public/hero-video';
import { HeroStats } from '@/components/public/hero-stats';

interface HeroProps {
  stats: { key: string; value: string }[];
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative w-full px-4 sm:px-6 md:px-10 pt-2 sm:pt-3 pb-4 sm:pb-5 max-w-[1440px] mx-auto">
      <div className="relative px-0 sm:px-10 lg:px-12 xl:px-14 py-3 sm:py-5 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 xl:gap-x-12 gap-y-8 items-center">
          {/* Left — copy + CTAs */}
          <div className="@container min-w-0 w-full max-w-[36rem]">
            <div className="inline-flex flex-col gap-2 mb-3 sm:mb-4 w-fit">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl">
                Secunderabad · Since 2010
              </p>
              <span className="h-px w-[11.75rem] sm:w-[12.5rem] max-w-[52%] bg-bl/50" aria-hidden />
            </div>

            <h1 className="font-anton uppercase text-ink w-full max-w-[11ch] flex flex-col gap-1.5 sm:gap-2">
              <span className="block leading-none tracking-[0.02em] sm:tracking-[0.035em] text-[clamp(3.45rem,16.5cqw,7.25rem)] text-ink">
                Move
              </span>
              <span className="block leading-none tracking-[0.02em] sm:tracking-[0.035em] text-[clamp(4.15rem,22cqw,9.65rem)] text-bl">
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
                href={ROUTES.programmes}
                className={`${homepageCtaOutlineLight} ${homepageCtaPairButton}`}
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

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 pr-0 sm:pr-10 border-t border-line">
          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  );
}
