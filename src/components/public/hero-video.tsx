'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { HERO_REEL } from '@/lib/utils/constants';

const POSTER = '/images/srilanka-tour/raasta-stage-3.jpg';

interface HeroVideoProps {
  src?: string;
  caption?: string;
  className?: string;
}

export function HeroVideo({
  src = HERO_REEL.src,
  caption = HERO_REEL.caption,
  className,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const hasVideo = Boolean(src?.trim()) && !loadFailed;

  useEffect(() => {
    setLoadFailed(false);
  }, [src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [hasVideo, src]);

  const toggleSound = () => {
    const el = videoRef.current;
    if (!el) return;
    const nextMuted = !muted;
    setMuted(nextMuted);
    el.muted = nextMuted;
    if (!nextMuted) el.play().catch(() => {});
  };

  return (
    <div className={cn('flex flex-col gap-2.5 w-full', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[16px] sm:rounded-[20px] lg:rounded-[22px]',
          'border border-white/10 bg-[#0c0c0c]',
          'aspect-[9/16]',
          'shadow-[0_16px_48px_-12px_rgba(0,0,0,0.85)]',
        )}
      >
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              poster={POSTER}
              muted={muted}
              loop
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
              controls={false}
              onError={() => setLoadFailed(true)}
            >
              <source src={src} type="video/mp4" />
            </video>
            <div className="absolute bottom-0 inset-x-0 z-[2] pointer-events-none bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-12 pb-3 px-3 sm:px-4">
              <p className="text-[10px] sm:text-[11px] font-medium normal-case tracking-normal text-white/80 leading-snug line-clamp-3">
                {caption}
              </p>
            </div>
          </>
        ) : (
          <>
            <Image
              src={POSTER}
              alt="Rhythmzz dancers on stage"
              fill
              priority
              sizes="(max-width: 1024px) 85vw, 360px"
              className="object-cover object-[center_25%]"
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/5 to-black/25 pointer-events-none" />
          </>
        )}
      </div>

      {hasVideo && (
        <button
          type="button"
          onClick={toggleSound}
          className="inline-flex items-center justify-center gap-2 self-center min-h-[40px] px-4 rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          aria-pressed={!muted}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
        >
          {muted ? <VolumeX size={14} strokeWidth={2} /> : <Volume2 size={14} strokeWidth={2} />}
          {muted ? 'Sound off' : 'Sound on'}
        </button>
      )}
    </div>
  );
}
