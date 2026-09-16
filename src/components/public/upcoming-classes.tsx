'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Calendar, Users, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import { VideoModal } from '@/components/public/video-modal';

interface ClassCardItem {
  id: string;
  title: string;
  batchType: string;
  timing: string;
  status: string;
  statusType: 'urgent' | 'open' | 'new';
  instructor: string;
  instructorImg: string;
  image: string;
  href: string;
  videoTitle: string;
  subtitle: string;
}

const UPCOMING_CLASSES: ClassCardItem[] = [
  {
    id: 'class-1',
    title: 'Beginner Urban Hip Hop Foundations',
    batchType: 'Kids & Teens · Ages 7–14',
    timing: 'Tue, Thu, Sat · 5:00 PM',
    status: '4 SPOTS LEFT',
    statusType: 'urgent',
    instructor: 'Pranith Nair',
    instructorImg: '/images/pranith-nair.png',
    image: '/images/class-1.jpg',
    href: '/enrol?programme=kids-dance',
    videoTitle: 'Beginner Urban Hip Hop Foundations — Studio Showcase',
    subtitle: 'Kids & Teens Foundations (Ages 7–14)',
  },
  {
    id: 'class-2',
    title: 'Bolly-Hop Commercial Choreo Intensive',
    batchType: 'Adults Evening Batch · 16+',
    timing: 'Mon, Wed, Fri · 7:00 PM',
    status: 'ADMISSIONS OPEN',
    statusType: 'open',
    instructor: 'Nitish Kumar',
    instructorImg: '/images/studio-training/studio-technique.jpg',
    image: '/images/class-2.jpg',
    href: '/enrol?programme=adults-dance',
    videoTitle: 'Bolly-Hop Commercial Choreography — Routine Reel',
    subtitle: 'Adults Evening Batch · Mon & Wed 7:00 PM',
  },
  {
    id: 'class-3',
    title: 'Kuchipudi Classical Master Diploma',
    batchType: '10-Year Certified Parampara',
    timing: 'Fri & Sat · 6:30 PM',
    status: 'NEW BATCH STARTS',
    statusType: 'new',
    instructor: 'Srusti Vempati',
    instructorImg: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
    image: '/images/srilanka-tour/raasta-stage-4.jpg',
    href: '/enrol?programme=kuchipudi',
    videoTitle: 'Kuchipudi Classical Certification — Repertoire Rehearsal',
    subtitle: '10-Year Master Syllabus · Fri & Sat 6:30 PM',
  },
];

export function UpcomingClasses() {
  const [activeVideo, setActiveVideo] = useState<ClassCardItem | null>(null);

  return (
    <section id="classes" className="w-full px-4 sm:px-6 md:px-10 py-24 sm:py-24 max-w-[1440px] mx-auto select-none">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-bl font-bold">
              04 · New Batches &amp; Routines
            </span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl text-ink tracking-wide uppercase leading-[0.92]">
            UPCOMING CLASSES
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-ink-2 max-w-md leading-relaxed">
          Limited slots per batch for focused attention and personal stage readiness. Reserve your free trial pass before admissions close.
        </p>
      </div>

      {/* 3 Widescreen Interactive Masterclass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {UPCOMING_CLASSES.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-md overflow-hidden border border-line hover:border-bl transition-all duration-300 bg-blk shadow-xl flex flex-col justify-between hover:-translate-y-1.5"
          >
            {/* Top Aspect Media Showcase */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/30 to-black/40 pointer-events-none" />

              {/* Status Urgency Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`text-[9px] font-mono uppercase tracking-widest px-3 py-1 rounded-md font-bold shadow-md flex items-center gap-1.5 ${
                    item.statusType === 'urgent'
                      ? 'bg-bl text-blk'
                      : item.statusType === 'new'
                      ? 'bg-bl text-white'
                      : 'bg-white/90 text-blk'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{item.status}</span>
                </span>
              </div>

              {/* Play Video Trigger Button */}
              <button
                onClick={() => setActiveVideo(item)}
                aria-label={`Play preview for ${item.title}`}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-bl hover:text-blk flex items-center justify-center transition-all cursor-pointer shadow-lg"
              >
                <Play size={13} className="fill-current translate-x-0.5" />
              </button>
            </div>

            {/* Bottom Content Body */}
            <div className="p-7 sm:p-7 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-bl font-bold mb-2">
                  <Users size={12} />
                  <span>{item.batchType}</span>
                </div>

                <h3 className="font-anton text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight mb-2.5 group-hover:text-bl transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-white/70 font-mono mb-5">
                  <Calendar size={13} className="text-bl" />
                  <span>{item.timing}</span>
                </div>
              </div>

              {/* Card Footer: Instructor Pill + Book Trial Button */}
              <div className="pt-5 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <Image
                      src={item.instructorImg}
                      alt={item.instructor}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-white leading-none truncate">
                      {item.instructor}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 tracking-wider mt-1">
                      Mentor
                    </span>
                  </div>
                </div>

                <Link
                  href={item.href}
                  className="inline-flex items-center justify-center gap-1.5 min-h-11 px-5 rounded-md bg-bl text-blk text-[10px] font-mono font-black uppercase tracking-wider hover:bg-white transition-all active:scale-[0.98] shadow-sm w-full sm:w-auto shrink-0"
                >
                  <span>Book Trial</span>
                  <ArrowUpRight size={12} className="stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="flex justify-end mt-8 sm:mt-10">
        <Link
          href={ROUTES.programmes}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-bl hover:text-bl-deep transition-colors"
        >
          <span>Explore All 12 Programmes</span>
          <span className="font-mono text-base translate-x-0 group-hover:translate-x-1.5 transition-transform">
          </span>
        </Link>
      </div>

      {/* Video Modal Lightbox */}
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
