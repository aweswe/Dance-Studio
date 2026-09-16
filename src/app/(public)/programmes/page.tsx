import { Metadata } from 'next';

import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { ProgrammeCard } from '@/components/public/programme-card';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { scheduleFor } from '@/lib/utils/schedule';
import { sectionPad, sectionPadAfterTitle } from '@/lib/ui/section-layout';
import { SITE_URL } from '@/lib/utils/constants';
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
    <PublicPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <PublicPageTitle
        eyebrow="Programmes"
        title="What we teach"
        description="Fees from ₹2,000 a month. No registration fee. First class free — WhatsApp or use the form."
      />

      <HomepageSection className={sectionPadAfterTitle}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {programmes.map((prog: any) => (
            <ProgrammeCard
              key={prog.id ?? prog.slug}
              programme={prog}
              schedule={scheduleFor(prog, batches)}
            />
          ))}
        </div>
      </HomepageSection>

      <HomepageSection className={sectionPad}>
        <HomepageSectionHeading eyebrow="What we teach" title="All disciplines" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-md overflow-hidden">
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
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1">{label}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {styles.map((s: { name: string }) => (
                    <span
                      key={s.name}
                      className="text-[11px] font-medium text-ink border border-line px-2 py-0.5 rounded-md"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-3 mt-auto">{note}</p>
            </div>
          ))}
        </div>
      </HomepageSection>

      <PublicBookTrialCta
        eyebrow="Not sure where to start?"
        title="Join"
        accent="a class"
        description="Your first class is free. Our coaches will guide you to the right batch."
      />
    </PublicPage>
  );
}
