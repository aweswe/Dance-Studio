import type { Metadata } from 'next';
import { SITE_URL, ACADEMY } from '@/lib/utils/constants';
import { PublicPage } from '@/components/public/public-page';
import { ProgrammePricingBoard } from '@/components/public/programme-pricing-board';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { StructuredData } from '@/components/shared/structured-data';

export const metadata: Metadata = {
  title: 'Pricing & Tuition Plans | Rhythmzz Academy of Dance',
  description:
    'Transparent dance class tuition, quarterly savings, sibling plans, and annual passes for Kids Dance, Adults Dance, Classical Kuchipudi, and Mind & Body Fitness in Secunderabad.',
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'Dance Class Pricing & Tuition Plans | Rhythmzz Academy of Dance',
    description:
      'Transparent tuition, quarterly savings, sibling discounts, and annual passes in Secunderabad. First trial class is on us with zero admission fee.',
    url: `${SITE_URL}/pricing`,
    siteName: ACADEMY.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PricingPage() {
  return (
    <PublicPage>
      <StructuredData />
      <div className="pt-4 sm:pt-6">
        <ProgrammePricingBoard />
      </div>
      <PublicBookTrialCta />
    </PublicPage>
  );
}
