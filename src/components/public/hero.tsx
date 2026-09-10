'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, X } from 'lucide-react';
import { VideoModal } from '@/components/public/video-modal';
import { ROUTES } from '@/lib/utils/constants';

import { ThemeToggle } from '@/components/ui/theme-toggle';

const NAV_MENU_LINKS = [
  { name: 'Schedule', href: '#schedule' },
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Upcoming Classes', href: '#classes' },
  { name: 'Coaches & Faculty', href: '#coaches' },
  { name: 'Latest Videos', href: '#videos' },
  { name: 'Kuchipudi Classical', href: '/kuchipudi' },
  { name: 'Studio Rental', href: ROUTES.studioRental },
  { name: 'Gallery & Recitals', href: ROUTES.gallery },
  { name: 'About Rhythmzz', href: ROUTES.about },
  { name: 'Contact & Location', href: ROUTES.contact },
];

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <section className="relative w-full px-3 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-8 max-w-[1440px] mx-auto">
      {/* 01 / Main page indicator label directly above hero frame */}
      <div className="flex items-center justify-between mb-3.5 px-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border border-line-strong text-[10px] font-mono flex items-center justify-center text-ink-2 select-none">
            01
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-2 select-none">
            Main page · Dance Academy
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
          <span>SECUNDERABAD · SINCE 2010</span>
        </div>
      </div>

      {/* Main Rounded Hero Frame */}
      <div className="relative w-full rounded-[26px] sm:rounded-[38px] md:rounded-[46px] border border-white/20 dark:border-white/20 overflow-hidden min-h-[82vh] sm:min-h-[86vh] md:min-h-[90vh] flex flex-col justify-between p-6 sm:p-9 md:p-12 bg-[#09090B] shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
        {/* Background Image with Ambient Glow */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/urban-hero.jpg"
            alt="Rhythmzz Urban Dance Academy Studio"
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover object-center scale-[1.02] transition-transform duration-1000 ease-out"
          />
          {/* Subtle studio lighting and vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/45 pointer-events-none" />
        </div>

        {/* Top Navbar Row INSIDE Hero Frame */}
        <div className="relative z-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href={ROUTES.home}
            className="group flex flex-col leading-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB4D8] rounded-sm"
          >
            <span className="heading-urban text-2xl sm:text-3xl tracking-tight text-white group-hover:text-[#2BB4D8] transition-colors">
              RHYTHMZZ
            </span>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FB923C]">
              DANCE CLUB &amp; ACADEMY
            </span>
          </Link>

          {/* Desktop Right Navigation Items */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-7">
            <Link
              href="#schedule"
              className="hidden md:inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
            >
              Schedule
            </Link>

            <Link
              href="#coaches"
              className="hidden md:inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
            >
              Coaches
            </Link>

            {/* Book a Class Warm Peach Pill Button */}
            <Link
              href={ROUTES.enrol}
              className="btn-peach px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] shadow-md active:scale-95"
            >
              Book a Class
            </Link>

            <Link
              href="/login"
              className="hidden md:inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
            >
              Account
            </Link>

            {/* Embedded Theme Toggle */}
            <ThemeToggle className="w-8 h-8 border-white/20 bg-white/10 text-white" />

            {/* Minimalist 2-line Hamburger (═) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Toggle navigation drawer"
              className="flex flex-col justify-center gap-1.5 w-7 h-7 p-1 text-white hover:text-[#FB923C] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <span className="w-5 h-[2px] bg-current" />
              <span className="w-5 h-[2px] bg-current" />
            </button>
          </div>
        </div>

        {/* Centerpiece Giant Italic Typography (DANCE / ACADEMY) */}
        <div className="relative z-10 my-auto text-center pointer-events-none select-none py-10 sm:py-16">
          <div className="inline-flex items-center mb-3 px-3.5 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              HYDERABAD&apos;S PREMIER DANCE INSTITUTION · EST. 2010
            </span>
          </div>
          <h1 className="heading-urban text-5xl sm:text-7xl md:text-8xl lg:text-[130px] xl:text-[150px] text-white tracking-tighter leading-[0.88] drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]">
            DANCE
            <br />
            ACADEMY
          </h1>
        </div>

        {/* Bottom Bar: PLAY VIDEO Trigger on Left, Warm Peach Free Trial on Right */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <button
            onClick={() => setIsVideoOpen(true)}
            aria-label="Play Studio Reel Video"
            className="group inline-flex items-center gap-3.5 cursor-pointer text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full active:scale-[0.96] transition-transform w-fit"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/80 group-hover:border-white bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-200 group-hover:bg-white group-hover:text-black shadow-lg shadow-black/50">
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current translate-x-0.5 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-white group-hover:text-[#2BB4D8] transition-colors">
                PLAY VIDEO
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/50">
                01:45 · Studio Choreo Reel
              </span>
            </div>
          </button>

          {/* Quick Try Free Trial Action (Step Up Inspired) */}
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.enrol}
              className="btn-peach px-6 py-2.5 text-xs font-black uppercase tracking-[0.16em] shadow-xl flex items-center gap-2"
            >
              <span>The First Lesson is Free</span>
              <span className="font-mono text-sm">──→</span>
            </Link>
          </div>
        </div>
      </div>


      {/* Full-Screen Drawer Menu for the Hero hamburger */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-2xl p-6 sm:p-12 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/15 pb-6">
            <div className="flex flex-col leading-none">
              <span className="heading-urban text-2xl text-white">RHYTHMZZ</span>
              <span className="heading-urban text-xs tracking-[0.25em] text-white/70">THE URBAN</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 py-8">
            {NAV_MENU_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                className="heading-urban text-3xl sm:text-5xl text-white/80 hover:text-white hover:translate-x-3 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href={ROUTES.enrol}
              onClick={() => setIsDrawerOpen(false)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-black uppercase text-xs tracking-[0.18em] hover:bg-[#2BB4D8] hover:text-white transition-all text-center"
            >
              Book Free Trial Class
            </Link>
            <span className="text-xs text-white/60">Secunderabad · Since 2010</span>
          </div>
        </div>
      )}

      {/* Interactive Lightbox Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="Rhythmzz Academy Choreography Reel"
        subtitle="Directed by Nitish Kumar · Urban Bolly-Hop & Contemporary Batch"
      />
    </section>
  );
}

