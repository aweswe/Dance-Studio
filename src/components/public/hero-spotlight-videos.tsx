'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import { HERO_SPOTLIGHT_VIDEOS } from '@/data/hero-spotlight-videos';

function SpotlightCard({
  label,
  poster,
  src,
}: {
  label: string;
  poster: string;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setFailed(false);
  }
  const hasVideo = Boolean(src?.trim()) && !failed;

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    el.defaultMuted = true;
    el.muted = muted;
    const p = el.play();
    if (p !== undefined) {
      p.catch(() => {});
    }
  }, [hasVideo, muted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;

    tryPlay();

    // Auto-play when scrolled into viewport; pause when out
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVideo, src, tryPlay]);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    const next = !muted;
    setMuted(next);
    el.muted = next;
    if (!next) {
      el.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    // Safety: if video is longer than 31s (e.g. cached older video), skip last 3.2s; otherwise loop seamlessly 0.25s before end
    const cutoff = el.duration > 31 ? el.duration - 3.2 : el.duration - 0.25;
    if (el.currentTime >= cutoff) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-md border border-line bg-surface shadow-sm">
      {hasVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted={muted}
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          controls={false}
          onLoadedMetadata={tryPlay}
          onCanPlay={tryPlay}
          onEnded={tryPlay}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 inset-x-0 z-[2] flex items-end justify-between gap-2 p-3 sm:p-3.5">
        <span className="inline-block max-w-[calc(100%-44px)] rounded-md bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white/95 leading-tight">
          {label}
        </span>
        {hasVideo ? (
          <button
            type="button"
            onClick={toggleMute}
            className="shrink-0 inline-flex items-center justify-center min-h-9 min-w-9 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white/90 hover:text-white hover:bg-black/70 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
            aria-pressed={!muted}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            title={muted ? 'Sound off' : 'Sound on'}
          >
            {muted ? <VolumeX size={16} strokeWidth={2} /> : <Volume2 size={16} strokeWidth={2} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function HeroSpotlightVideos() {
  return (
    <section
      className="w-full px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 max-w-[1440px] mx-auto"
      aria-label="Studio video highlights"
    >
      {/* Match hero card inner padding so first card lines up with “Different” and last with hero video */}
      <div className="px-0 sm:px-10 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {HERO_SPOTLIGHT_VIDEOS.map((item) => (
            <SpotlightCard
              key={item.id}
              label={item.label}
              poster={item.poster}
              src={item.src}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
