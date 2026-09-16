'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import { homepageMediaFrame } from '@/lib/ui/homepage-cta';
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
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setLoadFailed(false);
  }
  const hasVideo = Boolean(src?.trim()) && !loadFailed;

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
    <div className={cn('flex flex-col gap-2.5 w-full max-w-full', className)}>
      <div
        className={cn('relative w-full aspect-square', homepageMediaFrame)}
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
            <div className="absolute bottom-0 inset-x-0 z-[2] flex items-end justify-between gap-2 pb-3 px-3 sm:px-4">
              <p className="min-w-0 max-w-[75%] rounded-md bg-black/55 backdrop-blur-sm px-2.5 py-1 font-body text-[12px] sm:text-[13px] font-medium normal-case tracking-normal text-white/90 leading-snug line-clamp-3 pointer-events-none">
                {caption}
              </p>
              <button
                type="button"
                onClick={toggleSound}
                className="shrink-0 inline-flex items-center justify-center min-h-9 min-w-9 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white/90 hover:text-white hover:bg-black/70 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
                aria-pressed={!muted}
                aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
                title={muted ? 'Sound off' : 'Sound on'}
              >
                {muted ? <VolumeX size={16} strokeWidth={2} /> : <Volume2 size={16} strokeWidth={2} />}
              </button>
            </div>
          </>
        ) : (
          <>
            <Image
              src={POSTER}
              alt="Rhythmzz dancers on stage"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-cover object-[center_25%]"
            />
          </>
        )}
      </div>
    </div>
  );
}
