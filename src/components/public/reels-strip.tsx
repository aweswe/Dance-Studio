'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PublicReel } from '@/data/reels';
import { ACADEMY } from '@/lib/utils/constants';

const PROFILE_URL = ACADEMY.socials.instagram;

function ReelCard({ reel, scrollRoot }: { reel: PublicReel; scrollRoot: RefObject<HTMLDivElement | null> }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(false);
  const hoveredRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const updatePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inViewRef.current || hoveredRef.current) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    const root = scrollRoot.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting && entry.intersectionRatio > 0.35;
        updatePlayback();
      },
      { root, threshold: [0, 0.35, 0.6, 1] },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [scrollRoot, updatePlayback]);

  return (
    <a
      ref={cardRef}
      href={reel.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${reel.title} — watch on Instagram`}
      onMouseEnter={() => {
        hoveredRef.current = true;
        updatePlayback();
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        updatePlayback();
      }}
      onFocus={() => {
        hoveredRef.current = true;
        updatePlayback();
      }}
      onBlur={() => {
        hoveredRef.current = false;
        updatePlayback();
      }}
      className="group relative shrink-0 snap-start w-[180px] sm:w-[210px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-line hover:border-[#F5FB38] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#F5FB38]"
    >
      <video
        ref={videoRef}
        src={reel.videoSrc}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onLoadedData={updatePlayback}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-12 h-12 rounded-full bg-[#F5FB38]/90 text-black flex items-center justify-center shadow-lg">
            <Play size={20} className="fill-black ml-0.5" />
          </span>
        </div>
      )}

      <p className="absolute bottom-0 left-0 right-0 p-3.5 text-sm font-bold text-white leading-snug line-clamp-2 z-10">
        {reel.title}
      </p>
    </a>
  );
}

export function ReelsStrip({ reels }: { reels: PublicReel[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (reels.length === 0) return null;

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
        className="flex gap-4 overflow-x-auto py-2 snap-x snap-mandatory scroll-px-0 [scroll-padding-inline:0] overscroll-x-contain"
        style={{ scrollbarWidth: 'none' }}
      >
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} scrollRoot={trackRef} />
        ))}
      </div>
    </section>
  );
}
