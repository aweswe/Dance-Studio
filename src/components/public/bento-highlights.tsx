'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Disc3, Users, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

export function BentoHighlights() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 max-w-[1440px] mx-auto">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
        
        {/* Bento Card 1: Music & Dance connection ("Let's put a dance to your music" / Starboy vibe) */}
        <div className="md:col-span-7 bento-card min-h-[420px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-8 bg-[#0D0D11] text-white relative overflow-hidden group shadow-2xl">
          {/* Background Ambient Photography with warm amber ember glow */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/srilanka-tour/raasta-stage-1.jpg"
              alt="Dancer sitting on stage under dramatic warm lighting"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-center scale-[1.03] group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
            />
            {/* Ember gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/60 pointer-events-none" />
          </div>

          {/* Top Floating Music Track Card (Step Up 'Starboy' aesthetic) */}
          <div className="relative z-10 flex items-start justify-end">
            <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 max-w-[260px] shadow-2xl flex items-center gap-3 transform group-hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-black font-black text-xs shrink-0 shadow-lg relative overflow-hidden">
                <Disc3 className="w-7 h-7 text-black animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FB923C] font-bold">
                  TRENDING BEATS
                </span>
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  Starboy · Bolly-Hop
                </span>
                <span className="text-[10px] text-white/70">
                  Let&apos;s put a dance to your music
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Card Content: "The first lesson is free" */}
          <div className="relative z-10 max-w-md mt-auto pt-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FB923C] font-bold block mb-1">
              Zero Commitment · Trial Batch
            </span>
            <h3 className="heading-urban text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
              THE FIRST <br />
              LESSON IS <span className="text-[#FB923C]">FREE</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
              Step into the studio, feel the sound system, and learn your first routine under certified choreographers. No admission fee required.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.enrol}
                className="btn-peach px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-[0.18em] shadow-lg flex items-center gap-2 group/btn"
              >
                <span>Try</span>
                <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                  <ArrowRight size={12} className="text-black" />
                </span>
              </Link>
              <span className="text-[11px] text-white/60 font-medium">
                Mon to Sat · Kids &amp; Adults
              </span>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Invite Friends & Group Pass (Golden Silhouette) */}
        <div className="md:col-span-5 bento-card min-h-[420px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-8 bg-[#110E0A] text-white relative overflow-hidden group shadow-2xl">
          {/* Background Golden Silhouette */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/srilanka-tour/raasta-stage-4.jpg"
              alt="Golden silhouette dancer arched leap"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center scale-[1.04] group-hover:scale-108 transition-transform duration-700 ease-out opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-amber-950/20 mix-blend-color-dodge pointer-events-none" />
          </div>

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300 font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              COMMUNITY PERK
            </span>
            <Users size={16} className="text-amber-400" />
          </div>

          {/* Bottom Content: "Invite your friends and get a discount" */}
          <div className="relative z-10 mt-auto pt-16">
            <h3 className="heading-urban text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-3">
              INVITE YOUR FRIENDS <br />
              AND GET A <span className="text-amber-400">DISCOUNT</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-5">
              Dancing is better together. Bring friends or family and unlock group concession passes across all adult and kids batches.
            </p>

            <Link
              href={ROUTES.enrol}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white hover:text-[#FB923C] transition-colors group/link"
            >
              <span>Read more</span>
              <span className="font-mono translate-x-0 group-hover/link:translate-x-1 transition-transform">
                ──→
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
