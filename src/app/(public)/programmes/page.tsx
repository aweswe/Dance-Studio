import { Metadata } from 'next';
import Link from 'next/link';

import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { ProgrammeCard } from '@/components/public/programme-card';
import { scheduleFor } from '@/lib/utils/schedule';
import { ROUTES, SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Dance & Fitness Programmes | Rhythmzz Academy of Dance',
  description:
    'Kids dance, adult dance, mind & body fitness and Kuchipudi classes at Neredmet X Road, Secunderabad. Fees from ₹2,000 a month, no registration fee, free trial class.',
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
      <section className="bg-blk text-white py-20 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-[10px] tracking-[5px] uppercase text-bl-light mb-3">
            Four Programmes · One Studio
          </div>
          <h1 className="heading-display text-5xl md:text-7xl mb-6">
            KIDS · ADULTS · FITNESS · CLASSICAL
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto">
            Fees from ₹2,000 a month. No registration fee. Your first class is on us — book a free
            trial at Neredmet X Road, Secunderabad.
          </p>
        </div>
      </section>

      {/* Programme grid */}
      <section className="py-24 px-6 md:px-16">
        <Reveal stagger={0.08} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {programmes.map((prog: any) => (
            <ProgrammeCard
              key={prog.id ?? prog.slug}
              programme={prog}
              schedule={scheduleFor(prog, batches)}
            />
          ))}
        </Reveal>

        {/* Not sure? CTA */}
        <Reveal y={20} className="max-w-3xl mx-auto mt-16 text-center bg-canvas-muted border border-line rounded-card p-10">
          <h2 className="heading-display text-3xl mb-3">NOT SURE WHICH ONE?</h2>
          <p className="text-sm text-ink-2 mb-6">
            Come for a free trial class and we&apos;ll help you find the right batch. No
            registration fee, no commitment.
          </p>
          <Link
            href={ROUTES.enrol}
            className="inline-block bg-blk text-white text-[11px] font-semibold tracking-[2px] uppercase py-4 px-10 hover:bg-bl transition-all focus-visible:focus-ring active:scale-[0.98]"
          >
            Book a Free Trial
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
