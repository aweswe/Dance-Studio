import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/utils/constants';

// Signature Danzia & Top Skills Pro Hybrid Showcase Components
import { Hero } from '@/components/public/hero';
import { CreativeFamilySection } from '@/components/public/creative-family-section';
import { BentoHighlights } from '@/components/public/bento-highlights';
import { PricingSection } from '@/components/public/pricing-section';
import { DanziaClassesSection } from '@/components/public/danzia-classes-section';
import { LevelCertificationSection } from '@/components/public/level-certification-section';
import { DanziaInstructorsSection } from '@/components/public/danzia-instructors-section';
import { DanziaGallerySection } from '@/components/public/danzia-gallery-section';
import { DanziaTestimonialsSection } from '@/components/public/danzia-testimonials-section';
import { DanziaCTASection } from '@/components/public/danzia-cta-section';
import { ReelsStrip } from '@/components/public/reels-strip';
import { GoogleProofStrip } from '@/components/public/google-proof-strip';
import { FAQAccordion } from '@/components/public/faq-accordion';
import { StructuredData } from '@/components/shared/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export const revalidate = 3600;

export default async function HomePage() {
  const { getFAQs, getTestimonials } = await import('@/data/content');
  const [faqs, testimonials] = await Promise.all([getFAQs(), getTestimonials()]);

  return (
    <div className="relative bg-canvas text-ink font-body overflow-x-hidden min-h-screen transition-colors duration-300">
      <StructuredData />
      <Hero />
      <GoogleProofStrip />
      <CreativeFamilySection />
      <BentoHighlights />
      <PricingSection />
      <DanziaClassesSection />
      <LevelCertificationSection />
      <DanziaInstructorsSection />
      <DanziaGallerySection />
      <DanziaTestimonialsSection quotes={Array.isArray(testimonials) ? testimonials : []} />
      <section className="px-4 sm:px-8 md:px-14 py-16 max-w-[1440px] mx-auto">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">Questions parents ask</p>
        <h2 className="font-anton text-4xl sm:text-5xl text-ink tracking-tight uppercase mb-8">FAQ</h2>
        <FAQAccordion faqs={Array.isArray(faqs) ? faqs : []} />
      </section>
      <DanziaCTASection />
      <ReelsStrip />
    </div>
  );
}
