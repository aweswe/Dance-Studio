'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { homepageCtaOutlineLight, homepageMediaRadius } from '@/lib/ui/homepage-cta';
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
      className={`group relative shrink-0 snap-start w-[180px] sm:w-[210px] aspect-[9/16] ${homepageMediaRadius} overflow-hidden bg-blk border border-white/10 hover:border-bl transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-bl`}
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
          <span className="w-10 h-10 rounded-md bg-bl/90 text-blk flex items-center justify-center shadow-lg">
            <Play size={18} className="fill-black ml-0.5" />
          </span>
        </div>
      )}

      <p className="absolute bottom-0 left-0 right-0 p-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white leading-snug line-clamp-2 z-10">
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
    <HomepageSection className="pb-16 sm:pb-24 select-none" ariaLabel="Instagram reels">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
        <HomepageSectionHeading
          className="mb-0"
          eyebrow="Stage reels"
          title="Watch the movement"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${homepageCtaOutlineLight} hidden sm:inline-flex`}
          >
            @rhythmzzdance.live
          </Link>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll reels left"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-line text-ink hover:border-ink hover:bg-ink/[0.04] transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll reels right"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-line text-ink hover:border-ink hover:bg-ink/[0.04] transition-all active:scale-95"
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
    </HomepageSection>
  );
}
