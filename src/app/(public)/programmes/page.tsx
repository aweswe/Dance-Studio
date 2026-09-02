import { Metadata } from 'next';
import Link from 'next/link';

import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { ProgrammeCard } from '@/components/public/programme-card';
import { scheduleFor } from '@/lib/utils/schedule';
import { ROUTES, SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';
import { STUDIO_INFO } from '@/data/studio-info';
import { Sparkles, ArrowRight } from 'lucide-react';

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

      {/* Hero band */}
      <section className="bg-blk text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-[10px] tracking-[2px] sm:tracking-[5px] uppercase text-bl-light mb-3 font-bold">
            Four Structured Programmes · IAO USA Accredited
          </div>
          <h1 className="heading-display text-3xl sm:text-5xl md:text-7xl mb-4 leading-tight">
            KIDS · ADULTS · FITNESS · CLASSICAL
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Structured level-based training at Neredmet X Road, Secunderabad. No registration fee. Your first class is on us — book a free trial today.
          </p>
        </div>
      </section>

      {/* Programme grid */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16">
        <Reveal stagger={0.08} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {programmes.map((prog: any) => (
            <ProgrammeCard
              key={prog.id ?? prog.slug}
              programme={prog}
              schedule={scheduleFor(prog, batches)}
            />
          ))}
        </Reveal>

        {/* Complete Styles & Dance Forms Directory */}
        <section className="max-w-7xl mx-auto mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-line">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-bl px-3 py-1 rounded bg-bl/10 inline-block mb-3">
              Comprehensive Syllabus
            </span>
            <h2 className="heading-display text-2xl sm:text-4xl md:text-5xl text-ink leading-tight">
              DANCE STYLES &amp; DISCIPLINES TAUGHT
            </h2>
            <p className="text-ink-2 text-sm md:text-base mt-3">
              Providing a wide range of authentic dance forms — learn, explore, and master routines under accredited instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Indian Classical */}
            <div className="p-6 rounded-card bg-surface border border-line">
              <h3 className="text-xs font-extrabold uppercase tracking-[2px] text-bl-ink mb-4 pb-2 border-b border-line">
                Indian Classical
              </h3>
              <div className="space-y-4">
                {STUDIO_INFO.danceForms.indianClassical.map((style) => (
                  <div key={style.name}>
                    <h4 className="font-bold text-sm text-ink">{style.name}</h4>
                    <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Commercial Styles */}
            <div className="p-6 rounded-card bg-surface border border-line">
              <h3 className="text-xs font-extrabold uppercase tracking-[2px] text-bl-ink mb-4 pb-2 border-b border-line">
                Commercial &amp; Urban
              </h3>
              <div className="space-y-4">
                {STUDIO_INFO.danceForms.commercial.map((style) => (
                  <div key={style.name}>
                    <h4 className="font-bold text-sm text-ink">{style.name}</h4>
                    <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern & Western */}
            <div className="p-6 rounded-card bg-surface border border-line">
              <h3 className="text-xs font-extrabold uppercase tracking-[2px] text-bl-ink mb-4 pb-2 border-b border-line">
                Modern &amp; Latin
              </h3>
              <div className="space-y-4">
                {STUDIO_INFO.danceForms.modernWestern.map((style) => (
                  <div key={style.name}>
                    <h4 className="font-bold text-sm text-ink">{style.name}</h4>
                    <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fitness & Strength */}
            <div className="p-6 rounded-card bg-surface border border-line">
              <h3 className="text-xs font-extrabold uppercase tracking-[2px] text-bl-ink mb-4 pb-2 border-b border-line">
                Fitness &amp; Martial Arts
              </h3>
              <div className="space-y-4">
                {STUDIO_INFO.danceForms.fitness.map((style) => (
                  <div key={style.name}>
                    <h4 className="font-bold text-sm text-ink">{style.name}</h4>
                    <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Not sure? CTA */}
        <Reveal y={20} className="max-w-3xl mx-auto mt-20 text-center bg-canvas-muted border border-line rounded-card p-10">
          <h2 className="heading-display text-3xl mb-3">NOT SURE WHICH BATCH?</h2>
          <p className="text-sm text-ink-2 mb-6">
            Come for a free trial class and our instructors will guide you to the perfect level. No registration fee, no commitment.
          </p>
          <Link
            href={ROUTES.enrol}
            className="inline-block bg-blk text-white text-[11px] font-semibold tracking-[2px] uppercase py-4 px-10 hover:bg-bl hover:text-blk transition-all focus-visible:focus-ring active:scale-[0.98] rounded-control"
          >
            Book a Free Trial
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
