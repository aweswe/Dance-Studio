'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

interface StyleItem {
  id: string;
  name: string;
  category: string;
  tempo: string;
  level: string;
  slug: string;
  image: string;
  description: string;
}

const DANCE_STYLES: StyleItem[] = [
  {
    id: 's-bolly',
    name: 'Bolly-Hop',
    category: 'Commercial Urban',
    tempo: '95–125 BPM',
    level: 'All Levels',
    slug: 'adults-dance',
    image: '/images/class-2.jpg',
    description: 'High-octane commercial grooves blending Bollywood charisma with street hip hop isolation.',
  },
  {
    id: 's-hiphop',
    name: 'Hip Hop & Popping',
    category: 'Street Choreography',
    tempo: '85–115 BPM',
    level: 'Beg to Pro',
    slug: 'adults-dance',
    image: '/images/class-1.jpg',
    description: 'Foundation grooves, breaking, locking, musicality, and stage battle choreography.',
  },
  {
    id: 's-contemporary',
    name: 'Contemporary Lifts',
    category: 'Floorwork & Fluidity',
    tempo: 'Expressive / Dynamic',
    level: 'Intermediate+',
    slug: 'adults-dance',
    image: '/images/srilanka-tour/raasta-stage-4.jpg',
    description: 'Precision partnering, weight-distribution lifts, emotive storytelling, and stage elevation.',
  },
  {
    id: 's-kuchipudi',
    name: 'Kuchipudi Classical',
    category: 'Indian Classical Tradition',
    tempo: 'Taalam & Jathis',
    level: '10-Yr Master Diploma',
    slug: 'kuchipudi',
    image: '/images/srilanka-tour/raasta-stage-5.jpg',
    description: 'Vempati Chinna Satyam parampara, intricate footwork, Tarangam brass plate, and Natya mudras.',
  },
  {
    id: 's-fitness',
    name: 'Zumba & Dance HIIT',
    category: 'Cardio Conditioning',
    tempo: '130–155 BPM',
    level: 'Daily Fitness',
    slug: 'mind-body-fitness',
    image: '/images/studio-training/studio-leaps.jpg',
    description: 'High-intensity calorie burn, core stability, and full-body conditioning set to Latin & global beats.',
  },
];

export function DanceStylesCarousel() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 py-16 sm:py-24 max-w-[1440px] mx-auto select-none">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-bl font-bold">
              03 · Explore All Disciplines
            </span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl text-ink tracking-wide uppercase leading-[0.92]">
            TRY DIFFERENT DANCE STYLES
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-ink-2 max-w-md leading-relaxed">
          From street choreography and explosive battle grooves to certified classical traditions — learn from mentors who perform on global stages.
        </p>
      </div>

      {/* 5-Column High-Craft Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-stretch">
        {DANCE_STYLES.map((style) => {
          const isHovered = hoveredId === style.id;
          return (
            <Link
              key={style.id}
              href={`/programmes#${style.slug}`}
              onMouseEnter={() => setHoveredId(style.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative rounded-md sm:rounded-md overflow-hidden min-h-[400px] sm:min-h-[440px] border border-line hover:border-bl transition-all duration-500 shadow-xl flex flex-col justify-between p-5 bg-blk hover:-translate-y-1.5"
            >
              {/* Background Media with Cinema Grading */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/60 to-black/30 pointer-events-none" />
                {/* Subtle accent glow on hover */}
                <div className="absolute inset-0 bg-bl/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Top Meta Bar */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-bl bg-blk/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-bold">
                  {style.category}
                </span>
                <span className="text-[9px] font-mono tracking-wider text-white/70 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md">
                  {style.tempo}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 pt-6">
                <div className="text-[10px] font-mono uppercase tracking-wider text-bl font-bold mb-1.5">
                  <span>{style.level}</span>
                </div>

                <h3 className="font-anton text-2xl sm:text-3xl text-white tracking-wide uppercase leading-none group-hover:text-bl transition-colors mb-2">
                  {style.name}
                </h3>

                <p className="text-[11px] text-white/75 leading-relaxed line-clamp-2 mb-4 font-medium">
                  {style.description}
                </p>

                {/* Explore Button */}
                <div className="flex items-center justify-between pt-3 border-t border-white/15 text-white/80 group-hover:text-bl transition-colors">
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em] font-bold">
                    View Syllabus
                  </span>
                  <div className="w-7 h-7 rounded-md border border-white/25 group-hover:border-bl group-hover:bg-bl group-hover:text-blk flex items-center justify-center transition-all">
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
