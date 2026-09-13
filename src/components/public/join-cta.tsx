'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

const PERKS = [
  { value: '₹0', title: 'Registration Fee', desc: 'No hidden admission costs' },
  { value: '1', title: 'Free Trial Pass', desc: 'Full 60-minute studio experience' },
  { value: '100%', title: 'Stage Confidence', desc: 'Personal feedback from mentors' },
];

export function JoinCTA() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 py-16 sm:py-24 max-w-[1440px] mx-auto select-none">
      {/* Outer Luminous Sun Butter & Velvet Obsidian Banner */}
      <div className="relative rounded-[32px] sm:rounded-[44px] bg-[#F5FB38] text-[#000000] p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-[-20px] bottom-[-40px] font-anton text-[180px] sm:text-[240px] md:text-[300px] text-[#000000]/[0.04] leading-none pointer-events-none select-none">
          DANCE
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[#000000]">
              ★ Admissions Open for New Batches
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.92] max-w-4xl text-[#000000]">
            READY TO OWN THE STAGE?
            <br />
            <span>YOUR FIRST CLASS IS ON US.</span>
          </h2>

          <p className="max-w-2xl text-sm sm:text-base text-[#000000]/80 mt-6 mb-10 leading-relaxed font-medium">
            Step onto our studio floors for a 60-minute free trial session. Experience the energy, meet our faculty, and discover which dance style unleashes your fullest creative potential.
          </p>

          {/* 3 Guarantee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full max-w-3xl mb-10">
            {PERKS.map((perk, idx) => (
              <div
                key={idx}
                className="bg-[#000000] text-white p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center shadow-lg group hover:scale-[1.02] transition-transform"
              >
                <span className="font-anton text-3xl sm:text-4xl text-[#F5FB38] leading-none mb-1">
                  {perk.value}
                </span>
                <span className="font-bold text-xs uppercase tracking-wider text-white">
                  {perk.title}
                </span>
                <span className="text-[10px] font-mono text-white/60 mt-1">
                  {perk.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href={ROUTES.enrol}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#000000] text-[#F5FB38] font-anton text-base sm:text-lg uppercase tracking-wider hover:bg-white hover:text-[#000000] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Book Your Free Trial Today</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={ACADEMY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/40 hover:bg-white text-[#000000] font-mono text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 border border-[#000000]/15"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us: {ACADEMY.phoneDisplay}</span>
            </a>
          </div>

          {/* Studio Info Footnote */}
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#000000]/65 mt-6">
            Mon–Sat 6 AM–9 PM · Neredmet X Road · Secunderabad
          </p>
        </div>
      </div>
    </section>
  );
}
