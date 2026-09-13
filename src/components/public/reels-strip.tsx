'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface Reel {
  id: string;
  title: string;
  image: string;
  /** Direct mp4 preview — plays on hover. Drop files in `public/reels/` and point here. */
  videoSrc?: string;
  /** Full reel URL on Instagram — opened on click. */
  href: string;
}

const PROFILE_URL = 'https://www.instagram.com/rhythmzzdance.live';

const REELS: Reel[] = [
  {
    id: 'r1',
    title: 'Top Skills Pro — Crew Routine',
    image: '/images/bento/bento-acrobat.png',
    videoSrc: '/reels/r1.mp4',
    href: PROFILE_URL,
  },
  {
    id: 'r2',
    title: 'Raasta — Live Stage Cut',
    image: '/images/srilanka-tour/raasta-stage-4.jpg',
    videoSrc: '/reels/r2.mp4',
    href: PROFILE_URL,
  },
  {
    id: 'r3',
    title: 'Studio Leaps — Batch Rehearsal',
    image: '/images/studio-training/studio-leaps.jpg',
    videoSrc: '/reels/r3.mp4',
    href: PROFILE_URL,
  },
  {
    id: 'r4',
    title: 'Kuchipudi — Hasta Showcase',
    image: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
    videoSrc: '/reels/r4.mp4',
    href: PROFILE_URL,
  },
  {
    id: 'r5',
    title: 'Arena Night — Concert Lighting',
    image: '/images/bento/bento-stage.png',
    videoSrc: '/reels/r5.mp4',
    href: PROFILE_URL,
  },
  {
    id: 'r6',
    title: 'Bolly-Hop — Commercial Cut',
    image: '/images/class-1.jpg',
    videoSrc: '/reels/r6.mp4',
    href: PROFILE_URL,
  },
  {
    id: 'r7',
    title: 'Contemporary Flow — Floorwork',
    image: '/images/class-2.jpg',
    videoSrc: '/reels/r7.mp4',
    href: PROFILE_URL,
  },
];

function ReelCard({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleEnter = () => {
    videoRef.current?.play().then(() => setPlaying(true)).catch(() => {});
  };

  const handleLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };

  return (
    <a
      href={reel.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${reel.title} — watch on Instagram`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className="group relative shrink-0 snap-start w-[180px] sm:w-[210px] aspect-[9/16] rounded-2xl overflow-hidden bg-surface border border-line hover:border-[#F5FB38] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#F5FB38]"
    >
      <Image
        src={reel.image}
        alt={reel.title}
        fill
        sizes="220px"
        className={`object-cover object-center transition-all duration-500 ${
          playing ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
        }`}
      />
      {reel.videoSrc && (
        <video
          ref={videoRef}
          src={reel.videoSrc}
          muted
          loop
          playsInline
          preload="none"
          poster={reel.image}
          aria-hidden="true"
          tabIndex={-1}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Play — only on hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="w-12 h-12 rounded-full bg-[#F5FB38] text-black flex items-center justify-center shadow-lg opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
          <Play size={20} className="fill-black ml-0.5" />
        </span>
      </div>

      <p className="absolute bottom-0 left-0 right-0 p-3.5 text-sm font-bold text-white leading-snug line-clamp-2">
        {reel.title}
      </p>
    </a>
  );
}

export function ReelsStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section aria-label="Instagram reels" className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-14 pb-20 sm:pb-28 select-none">
      <div className="flex items-end justify-between gap-6 mb-6 sm:mb-8">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold mb-2">
            Stage Reels
          </p>
          <h2 className="font-anton text-3xl sm:text-5xl text-ink tracking-wide uppercase leading-none">
            WATCH THE MOVEMENT
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-xs font-mono font-bold uppercase tracking-[0.15em] text-ink-2 hover:text-ink transition-colors mr-2"
          >
            @rhythmzzdance.live ↗
          </a>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll reels left"
            className="w-10 h-10 rounded-full border border-line text-ink flex items-center justify-center hover:border-ink transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll reels right"
            className="w-10 h-10 rounded-full border border-line text-ink flex items-center justify-center hover:border-ink transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto py-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {REELS.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </section>
  );
}
