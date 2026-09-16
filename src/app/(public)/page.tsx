import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/utils/constants';

// Signature Danzia & Top Skills Pro Hybrid Showcase Components
import { Hero } from '@/components/public/hero';
import { HeroSpotlightVideos } from '@/components/public/hero-spotlight-videos';
import { ProgrammePricingBoard } from '@/components/public/programme-pricing-board';
import { HomepageClassesSection } from '@/components/public/homepage-classes-section';
import { LevelCertificationSection } from '@/components/public/level-certification-section';
import { DanziaInstructorsSection } from '@/components/public/danzia-instructors-section';
import { DanziaGallerySection } from '@/components/public/danzia-gallery-section';
import { HomepageAboutSection } from '@/components/public/homepage-about-section';
import { DanziaTestimonialsSection } from '@/components/public/danzia-testimonials-section';
import { DanziaCTASection } from '@/components/public/danzia-cta-section';
import { ReelsStrip } from '@/components/public/reels-strip';
import { getHomepageReels } from '@/data/reels';
// import { GoogleProofStrip } from '@/components/public/google-proof-strip';
import { FAQSection } from '@/components/public/faq-section';
import { StructuredData } from '@/components/shared/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export const revalidate = 3600;

export default async function HomePage() {
  const { getFAQs, getTestimonials } = await import('@/data/content');
  const { getStats } = await import('@/data/content');
  const [faqs, testimonials, reels, stats] = await Promise.all([
    getFAQs(),
    getTestimonials(),
    getHomepageReels(),
    getStats(),
  ]);

  return (
    <div className="relative bg-canvas text-ink font-body overflow-x-hidden min-h-screen transition-colors duration-300">
      <StructuredData />
      <Hero stats={stats} />
      <HeroSpotlightVideos />
      {/* <GoogleProofStrip /> */}
      <ProgrammePricingBoard />
      <HomepageClassesSection />
      <LevelCertificationSection />
      <DanziaInstructorsSection />
      <DanziaGallerySection />
      <HomepageAboutSection stats={stats} />
      <DanziaTestimonialsSection quotes={Array.isArray(testimonials) ? testimonials : []} />
      <FAQSection faqs={Array.isArray(faqs) ? faqs : []} />
      <DanziaCTASection />
      <ReelsStrip reels={reels} />
    </div>
  );
}
