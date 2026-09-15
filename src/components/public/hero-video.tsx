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
        'relative w-full overflow-hidden rounded-[16px] sm:rounded-[20px] lg:rounded-[22px]',
        'border border-white/10 bg-[#0c0c0c]',
        /* Square-ish tile like DLX — stays inside its grid column */
        'aspect-[4/5] sm:aspect-square',
        'shadow-[0_16px_48px_-12px_rgba(0,0,0,0.85)]',
        className,
      )}
    >
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
              className="absolute inset-0 z-[3] flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38] touch-manipulation"
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
            sizes="(max-width: 1024px) 90vw, 400px"
            className="object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/5 to-black/25 pointer-events-none" />
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 px-4 text-center pointer-events-none">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm">
              <Play size={16} className="text-white/90 ml-0.5" fill="currentColor" />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Studio reel</p>
          </div>
        </>
      )}

      <div className="absolute bottom-0 inset-x-0 z-[4] flex items-center justify-between gap-2 px-3 sm:px-4 py-3 bg-gradient-to-t from-black/90 to-transparent pt-8">
        <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-white/65 truncate min-w-0">
          {caption}
        </p>
        <span className="shrink-0 h-6 w-6 rounded-full bg-[#F5FB38] text-black text-[8px] font-black flex items-center justify-center">
          R
        </span>
      </div>
    </div>
  );
}
