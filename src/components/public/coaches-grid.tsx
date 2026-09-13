'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, ArrowUpRight, Instagram } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

interface CoachItem {
  id: string;
  number: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
  quote: string;
}

const COACHES: CoachItem[] = [
  {
    id: 'c-nitish',
    number: '01',
    name: 'Nitish Kumar',
    role: 'Artistic Director',
    specialty: 'Urban & Contemporary Choreography',
    experience: 'Natfest Sri Lanka · 14+ Yrs',
    image: '/images/studio-training/studio-technique.jpg',
    quote: 'Dance is not just movement — it is spatial architecture and emotional honesty.',
  },
  {
    id: 'c-pranith',
    number: '02',
    name: 'Pranith Nair',
    role: 'Senior Faculty',
    specialty: 'Hip Hop & Bolly-Hop Master',
    experience: 'Natfest Stage Soloist · 10+ Yrs',
    image: '/images/pranith-nair.png',
    quote: 'Groove comes before choreography. Master the pocket, and the stage is yours.',
  },
  {
    id: 'c-kajal',
    number: '03',
    name: 'Kajal Devi',
    role: 'Core Instructor',
    specialty: 'Kids Dance & Flexibility Anatomy',
    experience: 'Elastic Technique · 10+ Yrs',
    image: '/images/kajal-devi.png',
    quote: 'Every child is born with natural rhythm. We turn that spark into discipline.',
  },
  {
    id: 'c-deepak',
    number: '04',
    name: 'Deepak Rao',
    role: 'Fitness Director',
    specialty: 'Bollywood & Zumba Cardio HIIT',
    experience: 'High-Energy Conditioning · 11+ Yrs',
    image: '/images/studio-training/contemporary-movement-1.jpg',
    quote: 'Condition your stamina so your creative expression never runs out of breath.',
  },
  {
    id: 'c-srusti',
    number: '05',
    name: 'Srusti Vempati',
    role: 'Classical Head',
    specialty: 'Kuchipudi Classical Parampara',
    experience: 'Rangapravesham Mentor · 12+ Yrs',
    image: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
    quote: 'Centuries of classical geometry and storytelling brought alive on modern stage.',
  },
];

export function CoachesGrid() {
  return (
    <section id="coaches" className="w-full px-4 sm:px-6 md:px-10 py-24 sm:py-24 max-w-[1440px] mx-auto select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
              05 · Faculty &amp; Directors
            </span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl text-ink tracking-wide uppercase leading-[0.92]">
            MEET OUR TEAM OF COACHES
          </h2>
        </div>
        <Link
          href={ROUTES.about}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#7C5CFC] hover:text-[#512BDB] transition-colors"
        >
          <span>All Faculty Profiles</span>
          <span className="font-mono text-base translate-x-0 group-hover:translate-x-1.5 transition-transform">
          </span>
        </Link>
      </div>

      {/* 5 Vertical High-Impact Portrait Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-5">
        {COACHES.map((coach) => (
          <div
            key={coach.id}
            className="group relative rounded-[26px] overflow-hidden aspect-[3/4.6] border border-line hover:border-[#F5FB38] transition-all duration-500 shadow-xl flex flex-col justify-between p-6 sm:p-6 bg-[#000000] hover:-translate-y-2"
          >
            {/* Background Media with Dark Dramatic Vignette */}
            <div className="absolute inset-0 z-0">
              <Image
                src={coach.image}
                alt={coach.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover object-center grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:scale-108 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-black/30 pointer-events-none" />
            </div>

            {/* Top Bar: Sequence Number & Role Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#F5FB38] bg-[#000000]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                {coach.number}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/90 bg-[#000000]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-bold">
                {coach.role}
              </span>
            </div>

            {/* Bottom Content: Coach Name, Specialty & Quote */}
            <div className="relative z-10 pt-6">
              <h3 className="font-anton text-2xl sm:text-3xl text-white tracking-wide uppercase leading-none mb-1 group-hover:text-[#F5FB38] transition-colors">
                {coach.name}
              </h3>

              <p className="text-xs font-bold text-[#FAF6EE]/90 leading-snug">
                {coach.specialty}
              </p>

              <p className="text-[10px] text-white/60 font-mono tracking-wider mt-1 mb-3">
                {coach.experience}
              </p>

              {/* Hover Philosophy Reveal */}
              <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24 transition-all duration-500 overflow-hidden border-t border-white/15 pt-2">
                <p className="text-[10px] text-white/80 italic leading-relaxed font-serif">
                  &ldquo;{coach.quote}&rdquo;
                </p>
              </div>

              {/* Action Link */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2 text-white/70 group-hover:text-[#F5FB38] transition-colors">
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                  View Portfolio
                </span>
                <ArrowUpRight size={13} className="stroke-[2.5]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
