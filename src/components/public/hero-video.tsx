'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const POSTER = '/images/srilanka-tour/raasta-stage-3.jpg';

interface HeroVideoProps {
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
        'relative w-full overflow-hidden rounded-[18px] sm:rounded-[22px] lg:rounded-[24px]',
        'border border-white/10 bg-[#0c0c0c]',
        'aspect-[16/10] sm:aspect-[4/3] lg:aspect-[3/4] lg:max-h-[min(72vh,560px)]',
        'shadow-[0_20px_60px_-16px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.06] mix-blend-overlay"
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
              className="absolute inset-0 z-[3] flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-colors hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38] touch-manipulation"
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
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2.5 px-6 text-center">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm">
              <Play size={16} className="text-white/90 ml-0.5" fill="currentColor" />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">Studio reel</p>
            <p className="text-[11px] text-white/40 normal-case tracking-normal font-normal">Coming soon</p>
          </div>
        </>
      )}

      <div className="absolute bottom-0 inset-x-0 z-[4] flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 truncate">{caption}</p>
        <span className="shrink-0 h-6 w-6 rounded-full bg-[#F5FB38] text-black text-[8px] font-black flex items-center justify-center">
          R
        </span>
      </div>
    </div>
  );
}
