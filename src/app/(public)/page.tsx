import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SITE_URL } from '@/lib/utils/constants';

// Signature Danzia & Top Skills Pro Hybrid Showcase Components
import { Hero } from '@/components/public/hero';
import { HeroSpotlightVideos } from '@/components/public/hero-spotlight-videos';
import { ProgrammePricingBoard } from '@/components/public/programme-pricing-board';
import { StudioLocalitiesSection } from '@/components/public/studio-localities-section';
import { LevelCertificationSection } from '@/components/public/level-certification-section';
import { HomepageClassesSection } from '@/components/public/homepage-classes-section';
import { DanziaInstructorsSection } from '@/components/public/danzia-instructors-section';
import { DanziaGallerySection } from '@/components/public/danzia-gallery-section';
import { HomepageAboutSection } from '@/components/public/homepage-about-section';
import { DanziaTestimonialsSection } from '@/components/public/danzia-testimonials-section';
import { DanziaCTASection } from '@/components/public/danzia-cta-section';
import { ReelsStrip } from '@/components/public/reels-strip';
import { getHomepageReels } from '@/data/reels';
import { CorporateCollaborationsStrip } from '@/components/public/corporate-collaborations-strip';
import { FAQSection } from '@/components/public/faq-section';
import { HomepageEcomSection } from '@/components/public/homepage-ecom-section';
import { getProducts } from '@/data/products';
import { getStorefrontStatus } from '@/actions/products';
import { StructuredData } from '@/components/shared/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export const revalidate = 3600;

export default async function HomePage(props: {
  searchParams?: Promise<{ code?: string; error?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  if (searchParams?.code) {
    redirect(`/api/auth/callback?code=${encodeURIComponent(searchParams.code)}`);
  }

  const { getFAQs, getTestimonials } = await import('@/data/content');
  const { getStats } = await import('@/data/content');
  const [faqs, testimonials, reels, stats, products, storefrontMode] = await Promise.all([
    getFAQs(),
    getTestimonials(),
    getHomepageReels(),
    getStats(),
    getProducts(),
    getStorefrontStatus(),
  ]);


  return (
    <div className="relative bg-canvas text-ink font-body overflow-x-hidden transition-colors duration-300">
      <StructuredData />
      <Hero stats={stats} />
      <HeroSpotlightVideos />
      <ProgrammePricingBoard />
      <StudioLocalitiesSection />
      <LevelCertificationSection />
      <HomepageClassesSection />
      <DanziaInstructorsSection />
      <DanziaGallerySection />
      <HomepageAboutSection stats={stats} />
      <DanziaTestimonialsSection quotes={Array.isArray(testimonials) ? testimonials : []} />
      <CorporateCollaborationsStrip />
      <HomepageEcomSection mode={storefrontMode} products={products} />
      <FAQSection faqs={Array.isArray(faqs) ? faqs : []} />
      <DanziaCTASection />
      <ReelsStrip reels={reels} />
    </div>
  );
}
