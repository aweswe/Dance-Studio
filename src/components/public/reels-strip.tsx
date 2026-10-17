'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { homepageCtaOutlineLight, homepageMediaRadius } from '@/lib/ui/homepage-cta';
import { sectionGap, sectionPad } from '@/lib/ui/section-layout';
import type { PublicReel } from '@/data/reels';
import { ACADEMY } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const navButtonClass =
  'inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-line text-ink hover:border-ink hover:bg-ink/[0.04] transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

const PROFILE_URL = ACADEMY.socials.instagram;

/** Convert an Instagram link to an official embed player URL */
export function getInstagramEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  if (match && match[1]) {
    return `https://www.instagram.com/reel/${match[1]}/embed/?autoplay=1`;
  }
  return null;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const REEL_GRADIENTS = [
  'from-[#181a20] via-[#111827] to-[#1e1b4b]',
  'from-[#27121c] via-[#1f162b] to-[#0f172a]',
  'from-[#0c1f2c] via-[#0f172a] to-[#1e1e2e]',
  'from-[#1c1917] via-[#262626] to-[#0f172a]',
  'from-[#1e1b4b] via-[#1e293b] to-[#1c1917]',
  'from-[#2e1065] via-[#1e1b4b] to-[#09090b]',
];

function ReelCard({
  reel,
  index = 0,
  scrollRoot,
}: {
  reel: PublicReel;
  index?: number;
  scrollRoot?: RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const inViewRef = useRef(false);
  const hoveredRef = useRef(false);

  // Check if we have an MP4 video source (hosted locally in /reels/ with 0 Supabase egress)
  const isDirectVideo = Boolean(
    reel.videoSrc && (reel.videoSrc.startsWith('/') || reel.videoSrc.includes('.mp4'))
  );
  // Extract Instagram reel embed URL if link contains /reel/ or /p/
  const embedUrl = getInstagramEmbedUrl(reel.href || reel.videoSrc);
  const gradient = REEL_GRADIENTS[index % REEL_GRADIENTS.length];

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
    if (!isDirectVideo) return;
    const card = cardRef.current;
    const root = scrollRoot?.current;
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
  }, [scrollRoot, updatePlayback, isDirectVideo]);

  // Case 1: Direct Video Autoplay (Smooth muted loop with zero Supabase egress)
  if (isDirectVideo) {
    return (
      <a
        ref={cardRef}
        href={reel.href || PROFILE_URL}
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
          'group relative aspect-[9/16] overflow-hidden bg-black border border-line hover:border-bl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-bl shadow-xs hover:shadow-md',
          'shrink-0 snap-start w-[200px] sm:w-[240px]',
          'lg:w-[calc((100%-5*1rem)/6)] lg:min-w-[180px] lg:max-w-[260px] lg:flex-1 lg:basis-0 lg:snap-align-none',
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
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={updatePlayback}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

        {/* Top Instagram badge */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase border border-white/10 group-hover:border-bl/50 transition-colors">
            <InstagramIcon className="w-3 h-3 text-[#E1306C]" />
            <span>{reel.isPlaceholder ? 'Studio Reel' : 'Reel'}</span>
          </span>
          <span className="p-1 rounded-md bg-black/50 text-white/70 group-hover:text-white transition-colors">
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>

        {/* Center play indicator if video is paused */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-11 h-11 rounded-full bg-bl text-blk flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={18} className="fill-black ml-0.5 text-black" />
            </span>
          </div>
        )}

        {/* Bottom Title & Instagram Handle */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 pointer-events-none">
          <p className="text-[10px] font-mono uppercase tracking-wider text-bl font-bold mb-1 drop-shadow-xs">
            @rhythmzzdance.live
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.05em] text-white leading-tight line-clamp-2 group-hover:text-bl-light transition-colors drop-shadow-sm">
            {reel.title}
          </p>
        </div>
      </a>
    );
  }

  // Case 2: Instagram Embed Player (Direct stream from Meta servers)
  if (embedUrl) {
    return (
      <div
        className={cn(
          'group relative aspect-[9/16] overflow-hidden bg-black border border-line hover:border-bl transition-all duration-300 shadow-xs hover:shadow-md',
          'shrink-0 snap-start w-[220px] sm:w-[260px]',
          'lg:w-[calc((100%-5*1rem)/6)] lg:min-w-[180px] lg:max-w-[260px] lg:flex-1 lg:basis-0 lg:snap-align-none',
          homepageMediaRadius,
        )}
      >
        <iframe
          src={embedUrl}
          title={reel.title}
          className="w-full h-full border-0 rounded-md"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          scrolling="no"
          loading="lazy"
        />
        <a
          href={reel.href || PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-black/70 text-white/80 hover:text-white hover:bg-black transition-colors z-20 shadow-xs"
          title="Open in Instagram"
          aria-label={`${reel.title} — open in Instagram`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Case 3: Interactive Gradient Card with direct Instagram Link
  return (
    <a
      href={reel.href || PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${reel.title} — watch on Instagram`}
      className={cn(
        'group relative aspect-[9/16] overflow-hidden bg-black border border-line hover:border-bl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-bl shadow-xs hover:shadow-md hover:-translate-y-1',
        'shrink-0 snap-start w-[200px] sm:w-[240px]',
        'lg:w-[calc((100%-5*1rem)/6)] lg:min-w-[180px] lg:max-w-[260px] lg:flex-1 lg:basis-0 lg:snap-align-none',
        homepageMediaRadius,
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_40%,rgba(43,180,216,0.35),transparent_70%)]" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

      {/* Top Instagram badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase border border-white/10 group-hover:border-bl/50 transition-colors">
          <InstagramIcon className="w-3 h-3 text-[#E1306C]" />
          <span>{reel.isPlaceholder ? 'Studio Reel' : 'Reel'}</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" />
      </div>

      {/* Center play icon button with hover scale */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="w-12 h-12 rounded-full bg-bl text-blk flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
          <Play size={20} className="fill-black ml-0.5 text-black" />
        </span>
      </div>

      {/* Bottom Title & Instagram Handle */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 pointer-events-none">
        <p className="text-[10px] font-mono uppercase tracking-wider text-bl font-bold mb-1">
          @rhythmzzdance.live
        </p>
        <p className="text-xs font-bold uppercase tracking-[0.05em] text-white leading-tight line-clamp-2 group-hover:text-bl-light transition-colors">
          {reel.title}
        </p>
      </div>
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
    const step = first ? first.offsetWidth + gap : 240;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (reels.length === 0) return null;

  return (
    <HomepageSection className={cn(sectionPad, 'select-none')} ariaLabel="Instagram reels">
      <div className={cn('flex flex-col', sectionGap)}>
        <div className={cn('flex flex-wrap items-end justify-between', sectionGap)}>
          <header className={cn('min-w-0 flex-1 max-w-2xl flex flex-col', sectionGap)}>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-bl">Stage reels</p>
            <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-ink">
              Watch the <span className="text-bl">movement.</span>
            </h2>
          </header>
          <div className="flex items-center shrink-0 gap-2">
            <Link
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(homepageCtaOutlineLight, 'normal-case hidden sm:inline-flex font-bold')}
            >
              @rhythmzzdance.live
            </Link>
            <div className="flex items-center gap-0.5">
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
            'lg:min-w-0 lg:overflow-x-auto lg:snap-x lg:justify-start lg:pb-0',
            sectionGap,
          )}
        >
          {reels.map((reel, idx) => (
            <ReelCard key={reel.id} reel={reel} index={idx} scrollRoot={trackRef} />
          ))}
        </div>
      </div>
    </HomepageSection>
  );
}
