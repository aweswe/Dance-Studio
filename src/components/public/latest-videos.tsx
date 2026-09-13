'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import { VideoModal } from '@/components/public/video-modal';

interface VideoItem {
  id: string;
  title: string;
  watermark: string;
  subtitle?: string;
  caption: string;
  image: string;
  purpleTone?: boolean;
}

const FEATURED_MAIN: VideoItem = {
  id: 'v-main',
  title: 'Urban Street Choreography Showcase',
  watermark: 'GUMP',
  subtitle: 'CHOREOGRAPHY BY NITISH KUMAR',
  caption: 'GUMP / Choreography',
  image: '/images/class-1.jpg',
};

const SECONDARY_VIDEOS: VideoItem[] = [
  {
    id: 'v-top',
    title: 'Advanced Adult Urban Routine',
    watermark: 'DIVOCY',
    caption: 'DIVOCY / Choreography',
    image: '/images/class-2.jpg',
  },
  {
    id: 'v-bottom',
    title: 'Electric Contemporary Showcase',
    watermark: 'SOLLA',
    caption: 'SOLLA / Choreography',
    image: '/images/srilanka-tour/raasta-stage-4.jpg',
    purpleTone: true,
  },
];

export function LatestVideos() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <section id="videos" className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 max-w-[1440px] mx-auto">
      {/* Section Heading */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold block mb-2">
          Studio Recitals &amp; Choreo Reels
        </span>
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl text-ink tracking-wide">
          LATEST VIDEOS
        </h2>
      </div>

      {/* Asymmetric 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* Left: Dominant Featured Video (approx 62% / 7 cols) */}
        <div
          onClick={() => setSelectedVideo(FEATURED_MAIN)}
          className="lg:col-span-7 xl:col-span-7 group relative rounded-xl sm:rounded-2xl overflow-hidden border border-line hover:border-[#F5FB38] bg-[#0A0A0A] cursor-pointer aspect-[16/10] sm:aspect-[16/9] shadow-2xl flex flex-col justify-between p-5 sm:p-7 transition-all duration-300"
        >
          {/* Media Backdrop */}
          <div className="absolute inset-0 z-0">
            <Image
              src={FEATURED_MAIN.image}
              alt={FEATURED_MAIN.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 pointer-events-none" />
          </div>

          {/* Center Watermark Typography matching reference screenshot */}
          <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
            <span className="font-anton text-4xl sm:text-6xl md:text-7xl text-white tracking-wider drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] select-none">
              {FEATURED_MAIN.watermark}
            </span>
            {FEATURED_MAIN.subtitle && (
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-white/80 mt-1 select-none">
                {FEATURED_MAIN.subtitle}
              </span>
            )}
          </div>

          {/* Bottom Left Caption */}
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#F5FB38] transition-colors">
              {FEATURED_MAIN.caption}
            </p>
          </div>
        </div>

        {/* Right: 2 Stacked Widescreen Video Cards (approx 38% / 5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5 lg:gap-6 justify-between">
          {SECONDARY_VIDEOS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedVideo(item)}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-line hover:border-[#F5FB38] bg-[#0A0A0A] cursor-pointer aspect-[16/9] sm:aspect-[16/8.5] flex-1 flex flex-col justify-between p-4 sm:p-5 shadow-xl transition-all duration-300"
            >
              {/* Media Backdrop */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Electric purple neon glow for the bottom card as seen in screenshot */}
                {item.purpleTone ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/90 via-[#7c5cfc]/30 to-black/40 pointer-events-none" />
                    <div className="absolute inset-0 bg-[#7c5cfc]/25 mix-blend-screen pointer-events-none" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />
                )}
              </div>

              {/* Center Watermark */}
              <div className="relative z-10 my-auto text-center flex items-center justify-center">
                <span className="font-anton text-3xl sm:text-4xl md:text-5xl text-white tracking-wider drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] select-none">
                  {item.watermark}
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#F5FB38] transition-colors">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right-aligned 'More videos ──→' Link */}
      <div className="flex justify-end mt-6 sm:mt-8">
        <Link
          href={ROUTES.gallery}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-ink-2 hover:text-ink transition-colors"
        >
          <span>More videos</span>
          <span className="font-mono text-base translate-x-0 group-hover:translate-x-1.5 transition-transform">
            ──→
          </span>
        </Link>
      </div>

      {/* Video Lightbox Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          subtitle={selectedVideo.caption}
        />
      )}
    </section>
  );
}
