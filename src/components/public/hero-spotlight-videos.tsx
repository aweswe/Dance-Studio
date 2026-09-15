'use client';

import { useEffect, useRef, useState } from 'react';
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
  const hasVideo = Boolean(src?.trim()) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [hasVideo, src]);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    const next = !muted;
    setMuted(next);
    el.muted = next;
    if (!next) el.play().catch(() => {});
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0a]">
      {hasVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted={muted}
          loop
          playsInline
          autoPlay
          preload="metadata"
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
        <span className="inline-block max-w-[75%] rounded-md bg-black/55 backdrop-blur-sm px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 leading-snug">
          {label}
        </span>
        {hasVideo ? (
          <button
            type="button"
            onClick={toggleMute}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-sm hover:bg-black/70 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5FB38]"
            aria-pressed={!muted}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          >
            {muted ? <VolumeX size={14} strokeWidth={2} /> : <Volume2 size={14} strokeWidth={2} />}
          </button>
        ) : (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 text-[8px] font-bold uppercase tracking-wider text-white/40"
            aria-hidden
          >
            R
          </span>
        )}
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
    </section>
  );
}
