'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

interface InstructorItem {
  id: string;
  name: string;
  role: string;
  styles: string;
  image: string;
  href: string;
}

const INSTRUCTORS: InstructorItem[] = [
  {
    id: 'nitish',
    name: 'NITISH KUMAR',
    role: 'Artistic Director',
    styles: 'Contemp, Modern',
    image: '/images/studio-training/studio-technique.jpg',
    href: '/about',
  },
  {
    id: 'pranith',
    name: 'PRANITH NAIR',
    role: 'Senior Instructor',
    styles: 'Hip-Hop, Urban',
    image: '/images/pranith-nair.png',
    href: '/about',
  },
  {
    id: 'srusti',
    name: 'SRUSTI VEMPATI',
    role: 'Classical Head',
    styles: 'Kuchipudi, Classical',
    image: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
    href: '/about',
  },
];

export function DanziaInstructorsSection() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-14 py-20 sm:py-28 max-w-[1440px] mx-auto select-none">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ink uppercase leading-[0.92]">
          MEET OUR INSTRUCTORS
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-ink-2 mt-5 leading-relaxed max-w-2xl font-medium">
          Our experienced, passionate instructors bring professional backgrounds, teaching expertise, and personal mentorship. Each one is dedicated to guiding students with care, discipline, and creativity.
        </p>
      </div>

      {/* 3 Spacious Editorial Portrait Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {INSTRUCTORS.map((instructor) => (
          <Link
            key={instructor.id}
            href={instructor.href}
            className="group flex flex-col transition-all duration-300"
          >
            {/* Portrait Frame */}
            <div className="relative aspect-[3/4] w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#000000] shadow-xl mb-6">
              <Image
                src={instructor.image}
                alt={instructor.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center grayscale contrast-110 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
            </div>

            {/* Typography */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="font-anton text-2xl sm:text-3xl lg:text-4xl tracking-wide uppercase text-ink group-hover:text-[#7C5CFC] transition-colors leading-none mb-2">
                  {instructor.name}
                </h3>
                <span className="text-xs sm:text-sm font-mono text-ink-2 tracking-wider uppercase">
                  {instructor.styles}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] font-bold text-ink group-hover:text-[#7C5CFC] transition-colors pb-0.5">
                <span className="group-hover:underline underline-offset-4 mx-0.5">view more</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
