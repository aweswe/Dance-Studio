import { Metadata } from 'next';
import Image from 'next/image';
import { DanziaInstructorsSection } from '@/components/public/danzia-instructors-section';
import { HomepageAboutSection } from '@/components/public/homepage-about-section';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'About Us | Rhythmzz Academy of Dance',
  description:
    'Founded in 2010 by Nitish Kumar, Rhythmzz Academy of Dance is an IAO-accredited dance institute in Secunderabad delivering training across Classical, Contemporary, Commercial, and Fitness styles.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default async function AboutPage() {
  const { getStats } = await import('@/data/content');
  const stats = await getStats();

  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="About"
        title="Who we are"
        description="Nitish started Rhythmzz in 2010 above the ICICI ATM at Neredmet X Road. We still teach in that room — sprung floor, mirrors, AC, the same number on WhatsApp."
      />

      <HomepageAboutSection stats={stats} showLearnMore={false} />

      <DanziaInstructorsSection />

      <HomepageSection className={sectionPadAfterTitle}>
        <HomepageSectionHeading
          eyebrow="International collaboration"
          title="Natfest Sri Lanka"
          description="Representing India at Natfest Contemporary Dance Festival, Rhythmzz performed “Raasta – The Inside Light” with Sri Lanka’s Natanda Dance Company."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { img: '/images/srilanka-tour/srilanka-workshop.jpg', label: 'Colombo Masterclass' },
            { img: '/images/srilanka-tour/raasta-stage-2.jpg', label: 'Raasta Live Performance' },
            { img: '/images/studio-training/studio-batch-portrait.jpg', label: 'Performance Troupe' },
          ].map((item) => (
            <div key={item.label} className="relative h-60 rounded-md overflow-hidden border border-line bg-surface group">
              <Image
                src={item.img}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent p-4 flex items-end">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </HomepageSection>

      <PublicBookTrialCta />
    </PublicPage>
  );
}
