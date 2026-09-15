'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const POSTER = '/images/srilanka-tour/raasta-stage-3.jpg';

interface HeroVideoProps {
  /** Set NEXT_PUBLIC_HERO_VIDEO_URL when the studio reel is ready */
  src?: string;
  caption?: string;
  className?: string;
}

export function HeroVideo({
  src = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '',
  caption = '@rhythmzzdance · Studio reel',
  className,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(Boolean(src));
  const hasVideo = Boolean(src?.trim());

  const startPlayback = () => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    el.play().then(() => setPlaying(true)).catch(() => {});
  };

  return (
    <div
      className={cn(
        'relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-square w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto overflow-hidden rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#111111] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]',
        className,
      )}
    >
      {/* Film grain */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.07] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={POSTER}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            onPlay={() => setPlaying(true)}
          >
            <source src={src} type="video/mp4" />
          </video>
          {!playing && (
            <button
              type="button"
              onClick={startPlayback}
              className="absolute inset-0 z-[3] flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-colors hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38] focus-visible:ring-offset-2 focus-visible:ring-offset-black touch-manipulation"
              aria-label="Play studio reel"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5FB38] text-black shadow-lg active:scale-95 transition-transform">
                <Play size={22} fill="currentColor" className="ml-0.5" />
              </span>
            </button>
          )}
        </>
      ) : (
        <>
          <Image
            src={POSTER}
            alt="Rhythmzz dancers on stage"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 480px"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm">
              <Play size={18} className="text-white/90 ml-0.5" fill="currentColor" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Studio reel
            </p>
            <p className="text-xs text-white/45 max-w-[14rem] leading-relaxed normal-case tracking-normal font-normal">
              New class reel dropping soon
            </p>
          </div>
        </>
      )}

      {/* Caption bar */}
      <div className="absolute bottom-0 inset-x-0 z-[4] flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-t from-black/90 to-transparent">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 truncate">{caption}</p>
        <span className="shrink-0 h-7 w-7 rounded-full bg-[#F5FB38] text-black text-[9px] font-black flex items-center justify-center">
          R
        </span>
      </div>
    </div>
  );
}
