'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import { VideoModal } from '@/components/public/video-modal';

interface ClassCardItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  videoTitle: string;
}

const UPCOMING_CLASSES: ClassCardItem[] = [
  {
    id: 'class-1',
    title: 'Beginner Urban Hip Hop\nFoundations Batch',
    subtitle: 'Kids & Teens Foundations (Ages 7–14)',
    image: '/images/class-1.jpg',
    href: '/programmes#kids-dance',
    videoTitle: 'Beginner Urban Hip Hop Foundations — Studio Showcase',
  },
  {
    id: 'class-2',
    title: 'Bolly-Hop Commercial\nChoreography Intensive',
    subtitle: 'Adults Evening Batch · Mon & Wed 7:00 PM',
    image: '/images/class-2.jpg',
    href: '/programmes#adults-dance',
    videoTitle: 'Bolly-Hop Commercial Choreography — Routine Reel',
  },
  {
    id: 'class-3',
    title: 'Kuchipudi Classical\nMaster Certification',
    subtitle: '10-Year Master Syllabus · Fri & Sat 6:30 PM',
    image: '/images/studio-training/raasta-stage-4.jpg',
    href: '/kuchipudi',
    videoTitle: 'Kuchipudi Classical Certification — Repertoire Rehearsal',
  },
];

export function UpcomingClasses() {
  const [activeVideo, setActiveVideo] = useState<ClassCardItem | null>(null);

  return (
    <section id="classes" className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 max-w-[1440px] mx-auto">
      {/* Section Heading matching reference typography */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-2">
          New Batches &amp; Routines
        </span>
        <h2 className="heading-urban text-3xl sm:text-5xl md:text-6xl text-ink tracking-tight">
          UPCOMING CLASSES
        </h2>
      </div>

      {/* 3 Widescreen Video Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {UPCOMING_CLASSES.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideo(item)}
            className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9.5] border border-line hover:border-ink transition-all duration-300 bg-[#0E0E0E] cursor-pointer shadow-xl"
          >
            {/* Background Media */}
            <Image
              src={item.image.includes('raasta') ? '/images/srilanka-tour/raasta-stage-4.jpg' : item.image}
              alt={item.title.replace('\n', ' ')}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark studio vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity" />

            {/* Subtle hover play icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1.5px]">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform shadow-2xl">
                <Play className="w-5 h-5 fill-black translate-x-0.5" />
              </div>
            </div>

            {/* Bottom-left pinned text exactly matching screenshot */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
              <h3 className="text-white text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight whitespace-pre-line drop-shadow-md mb-2">
                {item.title}
              </h3>
              <div className="inline-flex items-center gap-1.5 text-xs text-white/70 group-hover:text-white font-medium transition-colors">
                <span>more</span>
                <span className="translate-x-0 group-hover:translate-x-1 transition-transform">──→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right-aligned 'More classes ──→' Link */}
      <div className="flex justify-end mt-6 sm:mt-8">
        <Link
          href={ROUTES.programmes}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-ink-2 hover:text-ink transition-colors"
        >
          <span>More classes</span>
          <span className="font-mono text-base translate-x-0 group-hover:translate-x-1.5 transition-transform">
            ──→
          </span>
        </Link>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.videoTitle}
          subtitle={activeVideo.subtitle}
        />
      )}
    </section>
  );
}
