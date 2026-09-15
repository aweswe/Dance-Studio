import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { ACADEMY, ROUTES } from '@/lib/utils/constants';
import { HeroVideo } from '@/components/public/hero-video';
import { HeroStats } from '@/components/public/hero-stats';

interface HeroProps {
  stats: { key: string; value: string }[];
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative w-full px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-6 sm:pb-8 max-w-[1440px] mx-auto">
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[36px] bg-[#050505] border border-white/[0.07] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)]">
        <div
          className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#7C5CFC]/15 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#F5FB38]/8 blur-[90px]"
          aria-hidden
        />

        {/* Mobile + desktop: explicit regions so copy and media never collapse together */}
        <div className="relative flex flex-col lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-stretch">
          {/* ── Copy block ── */}
          <div className="flex flex-col px-6 sm:px-10 lg:px-12 xl:px-14 pt-10 sm:pt-12 lg:pt-14 lg:pb-14">
            <div className="inline-flex flex-wrap items-center gap-2 w-fit mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                <MapPin size={11} className="shrink-0 text-[#F5FB38]" strokeWidth={2} />
                Neredmet · Secunderabad
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                Since {ACADEMY.teachingSince}
              </span>
            </div>

            <h1 className="font-anton text-[clamp(2.5rem,10vw,5.25rem)] leading-[0.93] tracking-[-0.03em] text-white uppercase max-w-[14ch]">
              <span className="block">Secunderabad</span>
              <span className="block">Moves</span>
              <span className="block text-[#F5FB38]">Here.</span>
            </h1>

            <p className="mt-5 sm:mt-7 max-w-[36ch] text-[15px] sm:text-base leading-[1.72] text-white/55 font-normal normal-case tracking-normal">
              Kuchipudi, Bollywood, hip-hop, and fitness — one studio at Neredmet Cross Roads. First class is free.
            </p>

            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={ROUTES.enrol}
                className="inline-flex items-center justify-center min-h-[48px] sm:min-h-[52px] px-6 sm:px-7 bg-[#F5FB38] text-[#0a0a0a] text-xs font-black uppercase tracking-[0.12em] hover:bg-white transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Book free trial
              </Link>
              <Link
                href={ROUTES.programmes}
                className="inline-flex items-center justify-center min-h-[48px] sm:min-h-[52px] px-6 sm:px-7 bg-white text-[#0a0a0a] text-xs font-black uppercase tracking-[0.12em] hover:bg-white/90 transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                I&apos;m new — start here
              </Link>
            </div>
          </div>

          {/* ── Media block — isolated row on mobile ── */}
          <div className="px-6 sm:px-10 py-8 sm:py-10 lg:py-0 lg:px-8 xl:px-10 border-t border-white/[0.08] lg:border-t-0 lg:border-l lg:border-white/[0.08] flex flex-col justify-center min-h-0">
            <HeroVideo className="mx-auto lg:mx-0 lg:ml-auto w-full max-w-[540px] lg:max-w-none lg:h-full lg:min-h-[420px] lg:max-h-[min(72vh,560px)]" />
          </div>

          {/* ── Stats — full-width footer strip inside hero ── */}
          <div className="col-span-full px-6 sm:px-10 lg:px-12 xl:px-14 py-8 sm:py-10 border-t border-white/[0.08] bg-white/[0.02]">
            <HeroStats stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
}
