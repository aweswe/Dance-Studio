import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SITE_URL } from '@/lib/utils/constants';

// Signature Danzia & Top Skills Pro Hybrid Showcase Components (Instant Render)
import { Hero } from '@/components/public/hero';
import { HeroSpotlightVideos } from '@/components/public/hero-spotlight-videos';
import { ProgrammePricingBoard } from '@/components/public/programme-pricing-board';
import { StudioLocalitiesSection } from '@/components/public/studio-localities-section';
import { LevelCertificationSection } from '@/components/public/level-certification-section';
import { HomepageClassesSection } from '@/components/public/homepage-classes-section';
import { DanziaInstructorsSection } from '@/components/public/danzia-instructors-section';
import { DanziaGallerySection } from '@/components/public/danzia-gallery-section';
import { HomepageAboutSection } from '@/components/public/homepage-about-section';
import { DanziaCTASection } from '@/components/public/danzia-cta-section';
import { CorporateCollaborationsStrip } from '@/components/public/corporate-collaborations-strip';
import { StructuredData } from '@/components/shared/structured-data';

// Dynamic Streamed Sections with Lazy Loading Skeletons
import { DanziaTestimonialsSection } from '@/components/public/danzia-testimonials-section';
import { FAQSection } from '@/components/public/faq-section';
import { HomepageEcomSection } from '@/components/public/homepage-ecom-section';
import { ReelsStrip } from '@/components/public/reels-strip';
import {
  ReelsStripSkeleton,
  HomepageEcomSkeleton,
  DanziaTestimonialsSkeleton,
  FAQSectionSkeleton,
} from '@/components/public/homepage-skeletons';
import { DEFAULT_STATS, getHomepageContentBundle } from '@/data/content';
import { getHomepageReels } from '@/data/reels';
import { getProducts } from '@/data/products';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export const revalidate = 3600;

/** Async Streamed Section: Instagram Reels (Lazy Loaded) */
async function AsyncReelsSection() {
  const reels = await getHomepageReels();
  return <ReelsStrip reels={reels} />;
}

/** Async Streamed Section: Studio Gear & Merch Store (Lazy Loaded) */
async function AsyncEcomSection() {
  const [products, contentBundle] = await Promise.all([
    getProducts(),
    getHomepageContentBundle(),
  ]);
  return <HomepageEcomSection mode={contentBundle.storefrontMode} products={products} />;
}

/** Async Streamed Section: Student & Parent Testimonials (Lazy Loaded) */
async function AsyncTestimonialsSection() {
  const content = await getHomepageContentBundle();
  return (
    <DanziaTestimonialsSection
      quotes={Array.isArray(content.testimonials) ? content.testimonials : []}
    />
  );
}

/** Async Streamed Section: Frequently Asked Questions (Lazy Loaded) */
async function AsyncFAQSection() {
  const content = await getHomepageContentBundle();
  return <FAQSection faqs={Array.isArray(content.faqs) ? content.faqs : []} />;
}

export default async function HomePage(props: {
  searchParams?: Promise<{ code?: string; error?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  if (searchParams?.code) {
    redirect(`/api/auth/callback?code=${encodeURIComponent(searchParams.code)}`);
  }

  return (
    <div className="relative bg-canvas text-ink font-body overflow-x-hidden transition-colors duration-300">
      <StructuredData />

      {/* ── ABOVE-THE-FOLD: ZERO DELAY, INSTANT FIRST PAINT ── */}
      <Hero stats={DEFAULT_STATS} />
      <HeroSpotlightVideos />
      <ProgrammePricingBoard />
      <StudioLocalitiesSection />
      <LevelCertificationSection />
      <HomepageClassesSection />
      <DanziaInstructorsSection />
      <DanziaGallerySection />
      <HomepageAboutSection stats={DEFAULT_STATS} />

      {/* ── LAZY-LOADED BELOW-THE-FOLD SECTIONS WITH MATCHING SKELETONS ── */}
      <Suspense fallback={<DanziaTestimonialsSkeleton />}>
        <AsyncTestimonialsSection />
      </Suspense>

      <CorporateCollaborationsStrip />

      <Suspense fallback={<HomepageEcomSkeleton />}>
        <AsyncEcomSection />
      </Suspense>

      <Suspense fallback={<FAQSectionSkeleton />}>
        <AsyncFAQSection />
      </Suspense>

      <DanziaCTASection />

      <Suspense fallback={<ReelsStripSkeleton />}>
        <AsyncReelsSection />
      </Suspense>
    </div>
  );
}

