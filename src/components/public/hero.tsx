import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';
import { HeroVideo } from '@/components/public/hero-video';
import { HeroStats } from '@/components/public/hero-stats';

interface HeroProps {
  stats: { key: string; value: string }[];
}

/**
 * DLX-style hero: isolated text column + fixed-width media column.
 * No shared overlap — each column is min-w-0 with overflow hidden on media.
 */
export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative w-full px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-6 sm:pb-8 max-w-[1440px] mx-auto">
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] bg-[#050505] border border-white/[0.07]">
        <div
          className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-[#7C5CFC]/12 blur-[90px]"
          aria-hidden
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(240px,380px)] xl:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-12 xl:gap-16 items-center px-6 sm:px-10 lg:px-12 xl:px-14 py-10 sm:py-12 lg:py-14 xl:py-16">
          {/* ── Left: copy + CTAs + stats (DLX pattern) ── */}
          <div className="relative z-10 min-w-0 flex flex-col">
            <div className="inline-flex flex-wrap items-center gap-2 w-fit mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                <MapPin size={11} className="shrink-0 text-[#F5FB38]" strokeWidth={2} />
                Neredmet · Secunderabad
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                Since {ACADEMY.teachingSince}
              </span>
            </div>

            <h1 className="font-anton uppercase leading-[0.95] tracking-[-0.02em] text-white max-w-[12ch]">
              <span className="block text-[clamp(2.25rem,7.5vw,4.25rem)]">Move</span>
              <span className="block text-[clamp(2.25rem,7.5vw,4.25rem)] text-[#F5FB38]">Different.</span>
            </h1>

            <p className="mt-5 sm:mt-6 max-w-[38ch] text-[15px] sm:text-base leading-[1.72] text-white/55 font-normal normal-case tracking-normal">
              Kuchipudi, Bollywood, hip-hop, and fitness — one studio at Neredmet Cross Roads.
              First class is free.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                href={ROUTES.enrol}
                className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-7 bg-[#F5FB38] text-[#0a0a0a] text-xs font-black uppercase tracking-[0.12em] hover:bg-white transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Book free trial
              </Link>
              <Link
                href={ROUTES.programmes}
                className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-7 bg-white text-[#0a0a0a] text-xs font-black uppercase tracking-[0.12em] hover:bg-white/90 transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                I&apos;m new — start here
              </Link>
            </div>

            <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-white/[0.08]">
              <HeroStats stats={stats} />
            </div>
          </div>

          {/* ── Right: media only, hard-contained ── */}
          <div className="relative z-0 min-w-0 w-full max-w-[340px] sm:max-w-[380px] mx-auto lg:max-w-none lg:mx-0 lg:justify-self-end overflow-hidden">
            <HeroVideo />
          </div>
        </div>
      </div>
    </section>
  );
}
