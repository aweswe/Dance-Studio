import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

export function Hero() {
  return (
    <section className="relative w-full px-3 sm:px-6 md:px-10 pt-3 sm:pt-6 pb-6 max-w-[1440px] mx-auto">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[38px] md:rounded-[48px] border border-white/15 bg-[#07131F] md:min-h-[86vh] md:flex md:flex-col shadow-[0_25px_60px_rgba(0,0,0,0.5)] md:p-12">
        {/* Photo is its own block on a phone so type never sits on top of it. */}
        <div className="relative aspect-[4/5] sm:aspect-[5/4] md:absolute md:inset-0 md:aspect-auto">
          <Image
            src="/images/srilanka-tour/raasta-stage-3.jpg"
            alt="Rhythmzz performers on stage"
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover object-top"
          />
          <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 md:h-[55%] bg-gradient-to-t from-[#07131F] md:from-black/85 to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 md:top-12 md:left-12 z-20">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.12em] uppercase text-white/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
              <MapPin size={10} className="shrink-0" />
              Neredmet · Secunderabad
            </div>
          </div>
        </div>

        <div className="relative z-20 px-5 pt-6 pb-20 sm:px-8 sm:pb-10 md:px-0 md:pt-0 md:pb-0 md:mt-auto md:max-w-xl space-y-4">
          <p className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#F5FB38]/85">
            Since 2010
          </p>

          <h1 className="font-anton text-[clamp(2.25rem,8vw,5.625rem)] leading-[1.1] text-white tracking-normal">
            <span className="block">RHYTHMZZ</span>
            <span className="block mt-1 text-[#F5FB38]">ACADEMY</span>
          </h1>

          <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-md">
            Hip-hop, Bollywood, contemporary, Kuchipudi. First class is free.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 max-w-xs sm:max-w-none pr-16 sm:pr-0">
            <Link
              href={ROUTES.enrol}
              className="inline-flex items-center justify-center bg-[#F5FB38] text-black text-xs font-black uppercase tracking-[0.16em] px-6 py-3.5 rounded-xl hover:bg-white transition-colors active:scale-[0.96]"
            >
              Enrol Now
            </Link>
            <Link
              href={ROUTES.schedule}
              className="inline-flex items-center justify-center bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.12em] px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors active:scale-[0.96]"
            >
              Timetable
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
