import { Metadata } from 'next';
import Link from 'next/link';

import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { ProgrammeCard } from '@/components/public/programme-card';
import { scheduleFor } from '@/lib/utils/schedule';
import { ROUTES, SITE_URL } from '@/lib/utils/constants';
import { STUDIO_INFO } from '@/data/studio-info';

export const metadata: Metadata = {
  title: 'Dance & Fitness Programmes | Rhythmzz Academy of Dance',
  description:
    'Certified training across commercial, fitness, and Kuchipudi at Neredmet X Road. First class free.',
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

      {/* Page Header */}
      <section className="py-24 sm:py-24 px-4 sm:px-8 md:px-14 border-b border-line max-w-[1440px] mx-auto">
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-ink-3 mb-4">
          All Programmes · Rhythmzz Academy
        </p>
        <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl text-ink leading-[0.92] tracking-tight uppercase mb-6">
          COMMERCIAL<br />FITNESS<br />CLASSICAL
        </h1>
        <p className="text-ink-2 text-sm sm:text-base max-w-lg">
          Fees from ₹2,000 a month. No registration fee. First class free — WhatsApp or use the form.
        </p>
      </section>

      {/* Programme Cards */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-14 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programmes.map((prog: any) => (
            <ProgrammeCard
              key={prog.id ?? prog.slug}
              programme={prog}
              schedule={scheduleFor(prog, batches)}
            />
          ))}
        </div>
      </section>

      {/* Disciplines */}
      <section className="px-4 sm:px-8 md:px-14 pb-14 sm:pb-20 max-w-[1440px] mx-auto">
        <div className="border-t border-line pt-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
            What We Teach
          </p>
          <h2 className="font-anton text-3xl sm:text-4xl text-ink uppercase tracking-tight mb-10">
            ALL DISCIPLINES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-[20px] overflow-hidden">
            {[
              {
                label: 'Indian Classical',
                note: 'Natyashastra & Tarangam',
                styles: STUDIO_INFO.danceForms.indianClassical,
              },
              {
                label: 'Street & Screen',
                note: 'Grooves, Freezing & Music Videos',
                styles: STUDIO_INFO.danceForms.commercial,
              },
              {
                label: 'Contemporary & Latin',
                note: 'Floorwork, Fluidity & Partner Dynamics',
                styles: STUDIO_INFO.danceForms.modernWestern,
              },
              {
                label: 'Fitness & Conditioning',
                note: 'Cardio Stamina & Kalaripayattu Core',
                styles: STUDIO_INFO.danceForms.fitness,
              },
            ].map(({ label, note, styles }) => (
              <div key={label} className="bg-canvas p-6 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-1">{label}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {styles.map((s: any) => (
                      <span
                        key={s.name}
                        className="text-[11px] font-medium text-ink border border-line px-2 py-0.5 rounded-md"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] font-mono text-ink-3 mt-auto">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 md:px-14 pb-20 sm:pb-28 max-w-[1440px] mx-auto">
        <div className="border border-line rounded-[24px] p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-anton text-2xl sm:text-3xl text-ink uppercase tracking-tight">
              NOT SURE WHERE TO START?
            </h2>
            <p className="text-sm text-ink-2 mt-1">
              Your first class is free. Our coaches will guide you to the right batch.
            </p>
          </div>
          <Link
            href={ROUTES.enrol}
            className="btn-sun py-3.5 px-8 text-xs font-black uppercase tracking-[0.18em] shrink-0"
          >
            Book Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
