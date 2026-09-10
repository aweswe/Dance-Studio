'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

interface CoachItem {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
  toneClass: string;
}

const COACHES: CoachItem[] = [
  {
    id: 'c-nitish',
    name: 'Nitish Kumar',
    role: 'Founder & Artistic Director',
    specialty: 'Contemporary & Urban Choreography',
    experience: 'ISPTD Bengaluru · Natfest Sri Lanka',
    image: '/images/studio-training/studio-technique.jpg',
    toneClass: 'from-blue-900/60 via-black/40 to-black',
  },
  {
    id: 'c-pranith',
    name: 'Pranith Nair',
    role: 'Senior Instructor',
    specialty: 'Hip Hop & Bolly-Hop Specialist',
    experience: 'Natfest Stage Artist · Since 2015',
    image: '/images/class-2.jpg',
    toneClass: 'from-amber-900/60 via-black/40 to-black',
  },
  {
    id: 'c-kajal',
    name: 'Kajal Devi',
    role: 'Core Instructor',
    specialty: 'Kids Dance & Flexibility Maestro',
    experience: 'Elastic Girl Technique · Since 2014',
    image: '/images/class-1.jpg',
    toneClass: 'from-purple-900/60 via-black/40 to-black',
  },
  {
    id: 'c-deepak',
    name: 'Deepak Rao',
    role: 'Fitness Director',
    specialty: 'Bollywood, Tollywood & Zumba HIIT',
    experience: 'High-Energy Dance Fitness · 10+ Yrs',
    image: '/images/studio-training/contemporary-movement-1.jpg',
    toneClass: 'from-emerald-900/60 via-black/40 to-black',
  },
  {
    id: 'c-srusti',
    name: 'Srusti',
    role: 'Classical Faculty Head',
    specialty: 'Kuchipudi & Vempati Parampara',
    experience: '12+ Yrs · Rangapravesham Mentor',
    image: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
    toneClass: 'from-amber-950/70 via-black/40 to-black',
  },
];

export function CoachesGrid() {
  return (
    <section id="coaches" className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 max-w-[1440px] mx-auto">
      {/* Header Section (Step Up Inspired) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-2">
            Faculty &amp; Directors
          </span>
          <h2 className="heading-urban text-3xl sm:text-5xl md:text-6xl text-ink tracking-tight">
            MEET OUR TEAM OF COACHES
          </h2>
        </div>
        <Link
          href={ROUTES.about}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-ink-2 hover:text-ink transition-colors"
        >
          <span>All faculty profiles</span>
          <span className="font-mono text-base translate-x-0 group-hover:translate-x-1.5 transition-transform">
            ──→
          </span>
        </Link>
      </div>

      {/* 5 Vertical Portrait Coach Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
        {COACHES.map((coach) => (
          <div
            key={coach.id}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4.2] border border-line hover:border-ink transition-all duration-300 shadow-xl flex flex-col justify-between p-5 sm:p-6 bg-[#0E0E10]"
          >
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
              <Image
                src={coach.image}
                alt={coach.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${coach.toneClass} pointer-events-none`} />
            </div>

            {/* Top Credential Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {coach.role}
              </span>
            </div>

            {/* Bottom Content: Coach Name & Specialty */}
            <div className="relative z-10 pt-6">
              <h3 className="heading-urban text-2xl sm:text-3xl text-white tracking-tight leading-none mb-1 group-hover:text-[#FB923C] transition-colors">
                {coach.name}
              </h3>
              <p className="text-xs font-bold text-white/90 leading-snug">
                {coach.specialty}
              </p>
              <p className="text-[10px] text-white/60 font-mono tracking-wider mt-1.5">
                {coach.experience}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
