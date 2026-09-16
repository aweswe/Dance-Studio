'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { homepageCardRadius, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { ROUTES } from '@/lib/utils/constants';

export function BentoHighlights() {
  return (
    <HomepageSection className="py-16 sm:py-20 md:py-24 select-none">
      <div className="flex items-center justify-between mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-2">
          Rhythmzz Academy · Since 2010
        </span>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase text-bl bg-blk px-3.5 py-1.5 rounded-md border border-bl/40">
          <span className="w-1.5 h-1.5 rounded-full bg-bl" />
          <span>Admissions open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div
          className={`lg:col-span-2 ${homepageCardRadius} bg-bl overflow-hidden relative group shadow-lg min-h-[280px] sm:min-h-[300px]`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bento/bento-faculty.png"
              alt="Rhythmzz faculty and certified dancers"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover object-center grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bl via-bl/85 to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10 p-7 sm:p-9 md:p-10 h-full flex flex-col justify-between">
            <div className="flex flex-col leading-[0.84] font-anton text-blk">
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] tracking-tighter">RHYTHMZZ</span>
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] tracking-tighter">ACADEMY</span>
            </div>
            <div className="mt-6 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-blk/70 font-bold">
                Hyderabad &amp; Secunderabad
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-blk/70 font-bold">
                Hip-Hop · Bollywood · Contemporary · Kuchipudi
              </span>
            </div>
          </div>
        </div>

        <div
          className={`${homepageCardRadius} bg-blk relative overflow-hidden border border-white/10 min-h-[240px] sm:min-h-[300px] p-6 sm:p-7 flex flex-col justify-between group shadow-lg`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/srilanka-tour/raasta-stage-2.jpg"
              alt="Rhythmzz on stage at Raasta Sri Lanka"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/30 to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10 ml-auto">
            <div className="w-11 h-11 rounded-md border border-bl/80 bg-blk/85 backdrop-blur-md text-bl flex items-center justify-center font-mono font-black text-[11px] leading-tight shadow-lg">
              <div className="grid grid-cols-2 gap-0.5 text-center">
                <span>2</span><span>0</span>
                <span>2</span><span>6</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-white mt-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-bl font-bold block mb-1">
              International Stage
            </span>
            <span className="text-sm font-bold text-white/90">Sri Lanka Tour · Raasta Live</span>
          </div>
        </div>

        <div
          className={`lg:row-span-2 ${homepageCardRadius} bg-blk relative overflow-hidden border border-white/10 min-h-[460px] sm:min-h-[540px] p-6 sm:p-8 flex flex-col justify-between group shadow-lg`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/studio-training/studio-leaps.jpg"
              alt="Students training at Rhythmzz studio"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blk/95 via-transparent to-blk/20 pointer-events-none" />
          </div>
          <div className="relative z-10">
            <div className="w-7 h-7 rounded-full bg-bl shadow-[0_0_24px_rgba(43,180,216,0.65)]" />
          </div>
          <div className="relative z-10 text-white mt-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-bl font-bold block mb-1">
              Advanced Training
            </span>
            <h4 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Contemporary &amp; Acrobatic Staging
            </h4>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              Leaps, partner work, and the phrases we take to Raasta.
            </p>
          </div>
        </div>

        <div
          className={`lg:col-span-2 ${homepageCardRadius} bg-bl text-blk p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-lg group`}
        >
          <div className="flex flex-col max-w-xl z-10">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-blk/60 mb-2">
              Kids · teens · adults
            </span>
            <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl text-blk uppercase tracking-tight leading-[0.95]">
              PICK A BATCH.
              <br />
              SHOW UP.
            </h3>
            <span className="font-mono text-sm text-blk/70 mt-3 tracking-wide">
              After school, after work, weekend Kuchipudi
            </span>
          </div>
          <Link
            href={ROUTES.programmes}
            className={`${homepageCtaOutlineLight} shrink-0 border border-blk/20 bg-blk/5 text-blk ring-blk/20 hover:bg-blk hover:text-bl hover:ring-blk z-10`}
          >
            View programmes
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </Link>
        </div>

        <div
          className={`${homepageCardRadius} bg-bl relative overflow-hidden min-h-[240px] sm:min-h-[260px] p-6 sm:p-7 flex flex-col justify-between group shadow-lg`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/studio-training/workshop-certificate.jpg"
              alt="Government accredited dance certificate"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-bl/50 mix-blend-color pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-bl/90 via-bl/40 to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10">
            <h4 className="font-anton text-2xl sm:text-3xl text-blk uppercase tracking-tight leading-[0.95] max-w-[220px]">
              KUCHIPUDI EXAMS
              <br />
              &amp; IAO PAPERS
            </h4>
          </div>
          <div className="relative z-10 mt-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blk font-extrabold bg-black/10 backdrop-blur-sm px-3 py-1 rounded-md border border-blk/20 inline-block">
              Affiliated Examination Board
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 justify-between">
          <div className={`${homepageCardRadius} bg-bl p-6 flex items-center justify-between gap-4 group shadow-lg flex-1`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md bg-blk flex items-center justify-center text-bl font-anton text-2xl tracking-tighter shrink-0 shadow-lg">
                IDC
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-anton text-lg sm:text-xl text-blk uppercase tracking-tight">International</span>
                <span className="font-anton text-sm sm:text-base text-blk/80 uppercase tracking-tight">Dance Center</span>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-bl" />
          </div>

          <div
            className={`${homepageCardRadius} bg-blk border-2 border-bl text-bl p-5 sm:p-6 flex items-center justify-center text-center shadow-lg group transition-colors duration-300 hover:bg-bl hover:text-blk cursor-default relative overflow-hidden`}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/srilanka-tour/srilanka-tour-01.jpg"
                alt="Hyderabad Secunderabad"
                fill
                sizes="33vw"
                className="object-cover object-center opacity-20 group-hover:opacity-10 transition-opacity grayscale"
              />
            </div>
            <span className="font-anton text-lg sm:text-xl md:text-2xl tracking-[0.18em] uppercase transition-colors relative z-10">
              SECUNDERABAD · HYDERABAD
            </span>
          </div>
        </div>
      </div>
    </HomepageSection>
  );
}
