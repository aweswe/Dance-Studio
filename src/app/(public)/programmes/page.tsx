import { Metadata } from 'next';
import Link from 'next/link';

import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { ProgrammeCard } from '@/components/public/programme-card';
import { scheduleFor } from '@/lib/utils/schedule';
import { ROUTES, SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';
import { STUDIO_INFO } from '@/data/studio-info';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dance & Fitness Programmes | Rhythmzz Academy of Dance',
  description:
    'Kids dance, adult dance, mind & body fitness and Kuchipudi classes at Neredmet X Road, Secunderabad. Certified training across Classical, Contemporary, Commercial, and Fitness styles.',
  alternates: { canonical: `${SITE_URL}/programmes` },
};

export default async function ProgrammesPage() {
  const [programmes, batches] = await Promise.all([getProgrammes(), getBatches()]);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dance and fitness programmes at Rhythmzz Academy of Dance',
    itemListElement: programmes.map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/programmes/${p.slug}`,
    })),
  };

  return (
    <div className="bg-canvas text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero with Breathing Room */}
      <section className="relative overflow-hidden py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-16 text-center border-b border-line bg-canvas">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center mb-4 px-3.5 py-1 rounded-full border border-line bg-surface/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              ACCREDITED CURRICULUM · IAO USA CERTIFIED
            </span>
          </div>

          <h1 className="heading-urban text-4xl sm:text-6xl md:text-7xl text-ink mb-6 leading-tight tracking-tight">
            KIDS · ADULTS · FITNESS · CLASSICAL
          </h1>

          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Structured level-based training at Neredmet X Road, Secunderabad. Your first class is completely free — join a batch today with zero registration fees.
          </p>
        </div>
      </section>

      {/* Programme Cards Grid with Spacious Gutter */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto">
        <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {programmes.map((prog: any) => (
            <ProgrammeCard
              key={prog.id ?? prog.slug}
              programme={prog}
              schedule={scheduleFor(prog, batches)}
            />
          ))}
        </Reveal>

        {/* Spacious Disciplines & Styles Directory (De-Noised & Visual) */}
        <div className="mt-24 pt-16 border-t border-line">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-2">
              Comprehensive Syllabus
            </span>
            <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              SPECIALIZED DISCIPLINES TAUGHT
            </h2>
            <p className="text-ink-2 text-sm md:text-base mt-2">
              From foundational rhythm to international production choreography.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Indian Classical */}
            <div className="bento-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-[#FB923C] block mb-3">
                  Indian Classical
                </span>
                <h3 className="heading-urban text-xl sm:text-2xl text-ink mb-4">HERITAGE FORMS</h3>
                <div className="flex flex-wrap gap-1.5">
                  {STUDIO_INFO.danceForms.indianClassical.map((style) => (
                    <span
                      key={style.name}
                      className="px-2.5 py-1 rounded-md bg-canvas border border-line text-[11px] font-medium text-ink"
                    >
                      {style.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-ink-3 mt-6 pt-4 border-t border-line font-mono">
                Rigorous Natyashastra &amp; Tarangam
              </p>
            </div>

            {/* Commercial & Urban */}
            <div className="bento-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-[#2BB4D8] block mb-3">
                  Street &amp; Screen
                </span>
                <h3 className="heading-urban text-xl sm:text-2xl text-ink mb-4">COMMERCIAL URBAN</h3>
                <div className="flex flex-wrap gap-1.5">
                  {STUDIO_INFO.danceForms.commercial.map((style) => (
                    <span
                      key={style.name}
                      className="px-2.5 py-1 rounded-md bg-canvas border border-line text-[11px] font-medium text-ink"
                    >
                      {style.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-ink-3 mt-6 pt-4 border-t border-line font-mono">
                Grooves, Freezing &amp; Music Videos
              </p>
            </div>

            {/* Modern & Latin */}
            <div className="bento-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-[#A855F7] block mb-3">
                  Movement Arts
                </span>
                <h3 className="heading-urban text-xl sm:text-2xl text-ink mb-4">CONTEMPORARY &amp; LATIN</h3>
                <div className="flex flex-wrap gap-1.5">
                  {STUDIO_INFO.danceForms.modernWestern.map((style) => (
                    <span
                      key={style.name}
                      className="px-2.5 py-1 rounded-md bg-canvas border border-line text-[11px] font-medium text-ink"
                    >
                      {style.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-ink-3 mt-6 pt-4 border-t border-line font-mono">
                Floorwork, Fluidity &amp; Partner Dynamics
              </p>
            </div>

            {/* Fitness & Strength */}
            <div className="bento-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-[#10B981] block mb-3">
                  Conditioning
                </span>
                <h3 className="heading-urban text-xl sm:text-2xl text-ink mb-4">FITNESS &amp; MARTIAL ARTS</h3>
                <div className="flex flex-wrap gap-1.5">
                  {STUDIO_INFO.danceForms.fitness.map((style) => (
                    <span
                      key={style.name}
                      className="px-2.5 py-1 rounded-md bg-canvas border border-line text-[11px] font-medium text-ink"
                    >
                      {style.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-ink-3 mt-6 pt-4 border-t border-line font-mono">
                Cardio Stamina &amp; Kalaripayattu Core
              </p>
            </div>
          </div>
        </div>

        {/* Free Trial Invitation Card */}
        <Reveal y={20} className="mt-20 bento-card p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-2">
            No Commitment Trial
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl text-ink mb-3">
            NOT SURE WHICH DISCIPLINE FITS?
          </h2>
          <p className="text-sm text-ink-2 mb-6 max-w-lg mx-auto">
            Attend your first session on us. Our coaches evaluate your rhythm, flexibility, and goals to recommend the perfect batch.
          </p>
          <Link
            href={ROUTES.enrol}
            className="btn-peach px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] inline-flex items-center gap-2 active:scale-[0.96] shadow-md"
          >
            <span>Claim Your Free Trial Class</span>
            <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
