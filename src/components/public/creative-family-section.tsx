'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

export function CreativeFamilySection() {
  return (
    <section className="relative w-full bg-[#FAF6EE] text-[#000000] py-20 sm:py-28 px-4 sm:px-6 md:px-10 overflow-hidden select-none transition-colors">
      <div className="max-w-[1240px] mx-auto relative flex flex-col items-center text-center">
        
        {/* ── Left Tilted Floating Polaroid Photo ── */}
        <div className="hidden md:block absolute left-4 lg:left-12 top-6 z-10 transform -rotate-12 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-[0_20px_35px_rgba(0,0,0,0.14)] rounded-xl bg-white p-2.5 border border-[#000000]/5">
          <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-lg overflow-hidden">
            <Image
              src="/images/studio-training/studio-leaps.jpg"
              alt="Rhythmzz dancer in the Neredmet studio"
              fill
              sizes="144px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* ── Right Tilted Floating Polaroid Photo ── */}
        <div className="hidden md:block absolute right-4 lg:right-12 bottom-12 z-10 transform rotate-12 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-[0_20px_35px_rgba(0,0,0,0.14)] rounded-xl bg-white p-2.5 border border-[#000000]/5">
          <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-lg overflow-hidden">
            <Image
              src="/images/srilanka-tour/raasta-stage-2.jpg"
              alt="Rhythmzz on stage"
              fill
              sizes="144px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* ── Centerpiece Giant Headline ── */}
        <h2 className="font-anton text-5xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[104px] uppercase leading-[1.08] sm:leading-[0.92] tracking-tight max-w-4xl text-[#000000]">
          <span>MORE THAN</span>
          <br />
          <span>A </span>
          <span className="text-[#7C5CFC]">DANCE</span>
          <span> SCHOOL, A</span>
          <br />
          <span>CREATIVE </span>
          <span className="text-[#7C5CFC]">FAMILY</span>
        </h2>

        {/* Subtitle statement */}
        <p className="max-w-xl text-sm sm:text-base text-[#000000]/75 mt-6 mb-8 leading-relaxed font-medium">
          People stay because the batch knows their name and the recital is on a real stage, not a school auditorium with folding chairs.
        </p>

        {/* Action Button */}
        <Link
          href={ROUTES.about}
          className="inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#7C5CFC] hover:text-[#6540EB] py-2 px-4 rounded-xl border border-[#7C5CFC]/30 hover:border-[#7C5CFC] hover:bg-[#7C5CFC]/10 transition-all active:scale-95 group"
        >
          <span className="mx-1 group-hover:underline underline-offset-4">LEARN MORE</span>
        </Link>

      </div>
    </section>
  );
}
