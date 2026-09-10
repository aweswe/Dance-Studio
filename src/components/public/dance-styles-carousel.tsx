'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

interface StyleItem {
  id: string;
  name: string;
  category: string;
  slug: string;
  image: string;
  accent: string;
}

const DANCE_STYLES: StyleItem[] = [
  {
    id: 's-bolly',
    name: 'Bolly-Hop',
    category: 'Urban Commercial',
    slug: 'adults-dance',
    image: '/images/class-2.jpg',
    accent: '#FB923C',
  },
  {
    id: 's-hiphop',
    name: 'Hip Hop',
    category: 'Street Choreography',
    slug: 'adults-dance',
    image: '/images/class-1.jpg',
    accent: '#2BB4D8',
  },
  {
    id: 's-contemporary',
    name: 'Contemporary',
    category: 'Floorwork & Fluidity',
    slug: 'adults-dance',
    image: '/images/srilanka-tour/raasta-stage-4.jpg',
    accent: '#A855F7',
  },
  {
    id: 's-kuchipudi',
    name: 'Kuchipudi',
    category: 'Indian Classical',
    slug: 'kuchipudi',
    image: '/images/srilanka-tour/raasta-stage-5.jpg',
    accent: '#F59E0B',
  },
  {
    id: 's-fitness',
    name: 'Dance Fitness',
    category: 'HIIT & Zumba',
    slug: 'mind-body-fitness',
    image: '/images/studio-training/studio-leaps.jpg',
    accent: '#10B981',
  },
];

export function DanceStylesCarousel() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 max-w-[1440px] mx-auto">
      {/* Header Section (Step Up Inspired) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-2">
            Explore All Disciplines
          </span>
          <h2 className="heading-urban text-3xl sm:text-5xl md:text-6xl text-ink tracking-tight">
            TRY DIFFERENT DANCE STYLES
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-ink-2 max-w-md leading-relaxed">
          We will teach you how to dance to <strong className="text-ink font-semibold">any rhythm</strong>,{' '}
          <strong className="text-ink font-semibold">any music</strong>, as well as{' '}
          <strong className="text-ink font-semibold">any style</strong>.
        </p>
      </div>

      {/* Horizontal Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
        {DANCE_STYLES.map((style) => (
          <Link
            key={style.id}
            href={`/programmes#${style.slug}`}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] border border-line hover:border-ink transition-all duration-300 shadow-md flex flex-col justify-between p-4 bg-surface"
          >
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
              <Image
                src={style.image}
                alt={style.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
            </div>

            {/* Top Category Tag */}
            <div className="relative z-10">
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                {style.category}
              </span>
            </div>

            {/* Bottom Style Name */}
            <div className="relative z-10 pt-4">
              <h3 className="heading-urban text-xl sm:text-2xl text-white tracking-tight leading-none group-hover:translate-x-1 transition-transform">
                {style.name}
              </h3>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/60 group-hover:text-white mt-1 transition-colors">
                <span>Explore</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
