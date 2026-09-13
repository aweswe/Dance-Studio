import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

export function Hero() {
  return (
    <section className="relative w-full px-3 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-6 max-w-[1440px] mx-auto select-none">
      {/* Main Rounded Hero Frame */}
      <div className="relative w-full rounded-[28px] sm:rounded-[38px] md:rounded-[48px] border border-white/15 overflow-hidden min-h-[82vh] sm:min-h-[86vh] md:min-h-[90vh] flex flex-col justify-between p-6 sm:p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-[#07131F]">

        {/* ── Background: Real Studio / Stage Photo ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/srilanka-tour/raasta-stage-3.jpg"
            alt="Rhythmzz performers on stage"
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover object-top"
          />
          {/* Top gradient — keeps nav readable */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
          {/* Bottom gradient — keeps copy readable */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/50 to-transparent pointer-events-none" />
        </div>

        {/* ── Top Bar: Location ── */}
        <div className="relative z-20 flex items-center">
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-white/65 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
            <MapPin size={10} className="shrink-0" />
            Hyderabad &amp; Secunderabad
          </div>
        </div>

        {/* ── Bottom: Headline + Sub + CTA ── */}
        <div className="relative z-20 flex flex-col gap-5 max-w-2xl">
          {/* Eyebrow */}
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#F5FB38]/80">
            Rhythmzz Academy · Teaching since 2010
          </p>

          {/* Main headline */}
          <h1 className="font-anton text-[13vw] sm:text-[9vw] md:text-[7.5vw] lg:text-[90px] leading-[0.88] text-white tracking-tight">
            RHYTHMZZ<br />
            <span className="text-[#F5FB38]">ACADEMY.</span>
          </h1>

          {/* Body copy — real info about the studio */}
          <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-[480px] font-medium">
            Rhythmzz Academy — Hyderabad&apos;s training ground for Hip-Hop,
            Contemporary, Bollywood &amp; Classical Kuchipudi.
            Batches for age 5 and above. Certificate &amp; Diploma programmes available.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={ROUTES.enrol}
              className="inline-flex items-center gap-2 bg-[#F5FB38] text-black text-xs font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl hover:bg-white transition-all active:scale-[0.97] shadow-lg shadow-[#F5FB38]/20"
            >
              Enrol Now
            </Link>
            <Link
              href={ROUTES.schedule}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-[0.15em] px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all active:scale-[0.97]"
            >
              This week&apos;s timetable
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            {[
              'Teaching since 2010',
              'Kuchipudi · Hip-Hop · Contemporary',
              'Ages 5 & Above',
            ].map((item) => (
              <span key={item} className="text-[10px] font-mono tracking-wider text-white/45 uppercase">
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
