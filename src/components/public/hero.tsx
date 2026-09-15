import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { ACADEMY, ROUTES } from '@/lib/utils/constants';
import { HeroVideo } from '@/components/public/hero-video';

const HERO_STATS = [
  { value: '4+', label: 'Dance styles' },
  { value: '15+', label: 'Years teaching' },
  { value: 'All', label: 'Levels welcome' },
] as const;

export function Hero() {
  const years = new Date().getFullYear() - ACADEMY.teachingSince;

  return (
    <section className="relative w-full px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-8 sm:pb-10 max-w-[1440px] mx-auto">
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] bg-[#050505] border border-white/[0.07] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)]">
        {/* Ambient glow — periwinkle, not generic red */}
        <div
          className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#7C5CFC]/20 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#F5FB38]/10 blur-[80px]"
          aria-hidden
        />

        <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-2 gap-8 lg:gap-6 xl:gap-10 items-center">
          {/* Copy */}
          <div className="order-1 px-6 sm:px-10 lg:pl-12 lg:pr-4 xl:pl-14 pt-10 sm:pt-12 lg:py-14 xl:py-16 pb-4 lg:pb-14 flex flex-col">
            <div className="inline-flex items-center gap-2 w-fit mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                <MapPin size={11} className="shrink-0 text-[#F5FB38]" strokeWidth={2} />
                Neredmet · Secunderabad
              </span>
              <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Since {ACADEMY.teachingSince}
              </span>
            </div>

            <h1 className="font-anton text-[clamp(2.75rem,11vw,5.5rem)] leading-[0.92] tracking-[-0.03em] text-white uppercase">
              <span className="block">Secunderabad</span>
              <span className="block">Moves</span>
              <span className="block text-[#F5FB38]">Here.</span>
            </h1>

            <p className="mt-6 sm:mt-8 max-w-md text-[15px] sm:text-base leading-[1.7] text-white/60 font-normal normal-case tracking-normal">
              Kuchipudi, Bollywood, hip-hop, and fitness — one studio at Neredmet Cross Roads.
              {years}+ years in, first class still free.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                href={ROUTES.enrol}
                className="inline-flex items-center justify-center min-h-[52px] px-7 bg-[#F5FB38] text-[#0a0a0a] text-xs font-black uppercase tracking-[0.14em] rounded-none hover:bg-white transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Book free trial
              </Link>
              <Link
                href={ROUTES.programmes}
                className="inline-flex items-center justify-center min-h-[52px] px-7 bg-white text-[#0a0a0a] text-xs font-black uppercase tracking-[0.14em] rounded-none hover:bg-white/90 transition-colors active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                I&apos;m new — start here
              </Link>
            </div>

            <dl className="mt-10 sm:mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-anton text-2xl sm:text-3xl text-white leading-none tracking-tight">
                    {stat.value}
                  </dt>
                  <dd className="mt-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Media */}
          <div className="order-2 px-4 sm:px-8 lg:px-6 xl:pr-12 pb-10 sm:pb-12 lg:pb-0 lg:py-10 xl:py-12">
            <HeroVideo />
          </div>
        </div>
      </div>
    </section>
  );
}
