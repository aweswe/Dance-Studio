'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { homepageCtaOutlineLight, homepageMediaRadius } from '@/lib/ui/homepage-cta';
import { sectionGap } from '@/lib/ui/section-layout';
import type { PublicReel } from '@/data/reels';
import { ACADEMY } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const navButtonClass =
  'inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-line text-ink hover:border-ink hover:bg-ink/[0.04] transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

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
      className={cn(
        'group relative aspect-[9/16] overflow-hidden bg-blk border border-white/10 hover:border-bl transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-bl',
        'shrink-0 snap-start w-[180px] sm:w-[210px]',
        'lg:flex-1 lg:basis-0 lg:min-w-0 lg:w-auto lg:max-w-none lg:snap-align-none',
        homepageMediaRadius,
      )}
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
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16') || 16;
    const step = first ? first.offsetWidth + gap : 220;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (reels.length === 0) return null;

  return (
    <HomepageSection className="pt-16 sm:pt-20 pb-10 sm:pb-12 select-none" ariaLabel="Instagram reels">
      <div className={cn('flex flex-col', sectionGap)}>
        <div className={cn('flex flex-wrap items-end justify-between', sectionGap)}>
          <header className={cn('min-w-0 flex-1 max-w-2xl flex flex-col', sectionGap)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl">Stage reels</p>
            <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-ink">
              Watch the <span className="text-bl">movement.</span>
            </h2>
          </header>
          <div className="flex items-center shrink-0 gap-2">
            <Link
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(homepageCtaOutlineLight, 'normal-case hidden sm:inline-flex')}
            >
              @rhythmzzdance.live
            </Link>
            <div className="flex items-center gap-0.5 lg:hidden">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll reels left"
                className={navButtonClass}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll reels right"
                className={navButtonClass}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className={cn(
            'flex w-full overflow-x-auto snap-x snap-mandatory scroll-px-0 [scroll-padding-inline:0] overscroll-x-contain no-scrollbar pb-2',
            'lg:min-w-0 lg:overflow-x-clip lg:snap-none lg:pb-0',
            sectionGap,
          )}
        >
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} scrollRoot={trackRef} />
          ))}
        </div>
      </div>
    </HomepageSection>
  );
}
