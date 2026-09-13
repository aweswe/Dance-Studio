'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

export function BentoHighlights() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 py-20 sm:py-28 md:py-32 max-w-[1360px] mx-auto select-none">
      {/* Section Label */}
      <div className="flex items-center justify-between mb-8 px-1">
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-2">
          02 · Rhythmzz Academy · Since 2010
        </span>
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#F5FB38] bg-[#000000] px-3.5 py-1.5 rounded-md border border-[#F5FB38]/40 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5FB38]" />
          <span>ADMISSIONS OPEN</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

        {/* ── ROW 1 ── */}

        {/* CARD 1: Academy Identity — spans 2 cols */}
        <div className="lg:col-span-2 rounded-[28px] sm:rounded-[36px] bg-[#F5FB38] overflow-hidden relative group shadow-xl transition-transform duration-300 hover:-translate-y-1 min-h-[280px] sm:min-h-[300px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bento/bento-faculty.png"
              alt="Rhythmzz faculty and certified dancers"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover object-center grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5FB38] via-[#F5FB38]/85 to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10 p-7 sm:p-9 md:p-10 h-full flex flex-col justify-between">
            <div className="flex flex-col leading-[0.84] font-anton text-[#000000]">
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] tracking-tighter">RHYTHMZZ</span>
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] tracking-tighter">ACADEMY</span>
            </div>
            <div className="mt-6 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#000000]/70 font-bold">
                Hyderabad &amp; Secunderabad
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#000000]/70 font-bold">
                Hip-Hop · Bollywood · Contemporary · Kuchipudi · Kathak
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Sri Lanka International Stage */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#000000] relative overflow-hidden border border-white/10 min-h-[240px] sm:min-h-[300px] p-6 sm:p-7 flex flex-col justify-between group shadow-xl transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/srilanka-tour/raasta-stage-2.jpg"
              alt="Rhythmzz on stage at Raasta Sri Lanka"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/30 to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10 ml-auto">
            <div className="w-11 h-11 rounded-full border border-[#F5FB38]/80 bg-[#000000]/85 backdrop-blur-md text-[#F5FB38] flex items-center justify-center font-mono font-black text-[11px] leading-tight shadow-lg">
              <div className="grid grid-cols-2 gap-0.5 text-center">
                <span>2</span><span>0</span>
                <span>2</span><span>6</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-white mt-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F5FB38] font-bold block mb-1">
              International Stage
            </span>
            <span className="text-sm font-bold text-white/90">
              Sri Lanka Tour · Raasta Live
            </span>
          </div>
        </div>

        {/* ── ROW 2 & 3 ── */}

        {/* CARD 3: Tall — Studio Training (col 1, row-span-2) */}
        <div className="lg:row-span-2 rounded-[28px] sm:rounded-[36px] bg-[#000000] relative overflow-hidden border border-white/10 min-h-[460px] sm:min-h-[540px] p-6 sm:p-8 flex flex-col justify-between group shadow-xl transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/studio-training/studio-leaps.jpg"
              alt="Students training at Rhythmzz studio"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-transparent to-[#000000]/20 pointer-events-none" />
          </div>
          <div className="relative z-10">
            <div className="w-7 h-7 rounded-full bg-[#F5FB38] shadow-[0_0_24px_rgba(245,251,56,0.65)] group-hover:scale-110 transition-transform" />
          </div>
          <div className="relative z-10 text-white mt-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F5FB38] font-bold block mb-1">
              Advanced Training
            </span>
            <h4 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Contemporary &amp; Acrobatic Staging
            </h4>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              Precision partnering, weight-sharing, and high-elevation choreography.
            </p>
          </div>
        </div>

        {/* CARD 4: Programmes — Wide (col 2–3, row 2) */}
        <div className="lg:col-span-2 rounded-[28px] sm:rounded-[36px] bg-[#F5FB38] text-[#000000] p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-xl group transition-transform duration-300 hover:-translate-y-1">
          <div className="flex flex-col max-w-xl z-10">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[#000000]/60 mb-2">
              Certificate &amp; Diploma · All Ages
            </span>
            <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl text-[#000000] uppercase tracking-tight leading-[0.95]">
              STRUCTURED PROGRAMMES FOR EVERY LEVEL
            </h3>
            <span className="font-mono text-sm text-[#000000]/70 mt-3 tracking-wide">
              Kids · Teens · Adults · Morning Batches
            </span>
          </div>
          <Link
            href={ROUTES.programmes}
            aria-label="View all programmes"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#000000] flex items-center justify-center shrink-0 bg-transparent group-hover:bg-[#000000] text-[#000000] group-hover:text-[#F5FB38] transition-all duration-300 active:scale-95 shadow-lg z-10"
          >
            <ArrowRight className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5] -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </Link>
        </div>

        {/* CARD 5: Certificate (col 2, row 3) */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#F5FB38] relative overflow-hidden min-h-[240px] sm:min-h-[260px] p-6 sm:p-7 flex flex-col justify-between group shadow-xl transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/studio-training/workshop-certificate.jpg"
              alt="Government accredited dance certificate"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-[#F5FB38]/50 mix-blend-color pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5FB38]/90 via-[#F5FB38]/40 to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10">
            <h4 className="font-anton text-2xl sm:text-3xl text-[#000000] uppercase tracking-tight leading-[0.95] max-w-[220px]">
              GOVERNMENT RECOGNIZED CERTIFICATE &amp; DIPLOMA
            </h4>
          </div>
          <div className="relative z-10 mt-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#000000] font-extrabold bg-black/10 backdrop-blur-sm px-3 py-1 rounded-md border border-[#000000]/20 inline-block">
              Affiliated Examination Board
            </span>
          </div>
        </div>

        {/* CARD 6 & 7: Stack (col 3, row 3) */}
        <div className="flex flex-col gap-4 sm:gap-5 justify-between">
          {/* IDC */}
          <div className="rounded-[24px] sm:rounded-[28px] bg-[#F5FB38] p-6 flex items-center justify-between gap-4 group shadow-lg transition-transform duration-300 hover:-translate-y-1 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#000000] flex items-center justify-center text-[#F5FB38] font-anton text-2xl tracking-tighter shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
                IDC
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-anton text-lg sm:text-xl text-[#000000] uppercase tracking-tight">International</span>
                <span className="font-anton text-sm sm:text-base text-[#000000]/80 uppercase tracking-tight">Dance Center</span>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#7C5CFC] group-hover:scale-125 transition-transform" />
          </div>

          {/* Location */}
          <div className="rounded-[24px] sm:rounded-[28px] bg-[#000000] border-2 border-[#F5FB38] text-[#F5FB38] p-5 sm:p-6 flex items-center justify-center text-center shadow-lg group transition-all duration-300 hover:bg-[#F5FB38] hover:text-[#000000] cursor-default relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/srilanka-tour/srilanka-tour-01.jpg"
                alt="Hyderabad Secunderabad"
                fill
                sizes="33vw"
                className="object-cover object-center opacity-20 group-hover:opacity-10 transition-opacity grayscale"
              />
            </div>
            <span className="font-anton text-lg sm:text-xl md:text-2xl tracking-[0.18em] uppercase transition-colors relative z-10">
              SECUNDERABAD · HYDERABAD
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
