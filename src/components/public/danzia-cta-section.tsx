'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

export function DanziaCTASection() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-14 py-24 sm:py-36 max-w-[1440px] mx-auto select-none">
      <div className="relative rounded-[32px] sm:rounded-[48px] bg-[#000000] text-[#FAF6EE] p-10 sm:p-16 md:p-24 overflow-hidden shadow-2xl flex flex-col items-center text-center">
        {/* Subtle radial ambient glow behind text */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7C5CFC]/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl flex flex-col items-center">
          {/* Monumental Danzia Closing Headline */}
          <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-[0.88] text-[#FAF6EE] mb-6 sm:mb-8">
            LET’S DANCE
            <br />
            <span className="text-[#F5FB38]">TOGETHER</span>
          </h2>

          <p className="max-w-xl text-base sm:text-lg md:text-xl text-[#FAF6EE]/80 leading-relaxed font-medium mb-10 sm:mb-12">
            Have questions or want to schedule a trial class? We’d love to hear from you and welcome you into our creative family.
          </p>

          {/* Minimalist Signature Bracket CTA */}
          <Link
            href={ROUTES.enrol}
            className="inline-flex items-center gap-1 font-mono text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-[#F5FB38] hover:text-white transition-all py-2.5 px-6 rounded active:scale-95 group"
          >
            <span className="group-hover:underline underline-offset-8 mx-1">ENROLL TODAY</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
