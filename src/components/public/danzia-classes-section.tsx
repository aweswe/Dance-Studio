'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

interface DanziaClassItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  href: string;
}

const CLASSES: DanziaClassItem[] = [
  {
    id: 'contemporary',
    name: 'CONTEMPORARY',
    category: 'Fluidity and modern form',
    tagline: 'Explore weight distribution, floorwork, and expressive storytelling through fluid motion.',
    image: '/images/srilanka-tour/raasta-stage-4.jpg',
    href: '/programmes/adults-dance',
  },
  {
    id: 'hiphop',
    name: 'HIP-HOP',
    category: 'High-energy, street style, and groove',
    tagline: 'Master rhythm control, isolations, popping, and performance-ready street choreography.',
    image: '/images/class-1.jpg',
    href: '/programmes/adults-dance',
  },
  {
    id: 'kuchipudi',
    name: 'KUCHIPUDI',
    category: 'Indian classical tradition & grace',
    tagline: 'Centuries-old Natya tradition with intricate footwork, mudras, and certified examinations.',
    image: '/images/srilanka-tour/raasta-stage-5.jpg',
    href: '/programmes/kuchipudi',
  },
  {
    id: 'bollyhop',
    name: 'BOLLY-HOP',
    category: 'Bold, upbeat, and commercial',
    tagline: 'Dynamic commercial choreography blending Bollywood charisma with street dance energy.',
    image: '/images/class-2.jpg',
    href: '/programmes/adults-dance',
  },
];

export function DanziaClassesSection() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-14 py-20 sm:py-28 max-w-[1440px] mx-auto select-none">
      {/* Editorial Header with generous breathing space */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ink uppercase leading-[0.92]">
          CLASSES FOR ALL AGES AND LEVELS
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-ink-2 mt-5 leading-relaxed max-w-2xl font-medium">
          Whether you&apos;re taking your first steps or training for the stage, we offer a variety of dance styles taught with care, discipline, and creativity.
        </p>
      </div>

      {/* Spacious 4-Card Clean Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {CLASSES.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-col justify-between transition-all duration-300"
          >
            {/* Image Frame with rounded corners & clean crop */}
            <div className="relative aspect-[3/4] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#000000] shadow-lg mb-5">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Typography & Minimalist Bracket Action */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7C5CFC] font-bold mb-1.5">
                {item.category}
              </span>
              <h3 className="font-anton text-2xl sm:text-3xl tracking-wide uppercase text-ink group-hover:text-[#7C5CFC] transition-colors mb-2">
                {item.name}
              </h3>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed mb-4 line-clamp-2">
                {item.tagline}
              </p>
              <div className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] font-bold text-ink group-hover:text-[#7C5CFC] transition-colors">
                <span className="group-hover:underline underline-offset-4 mx-0.5">view more</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
