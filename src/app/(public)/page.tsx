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
import { StructuredData } from '@/components/shared/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="relative bg-canvas text-ink font-body overflow-x-hidden min-h-screen transition-colors duration-300">
      <StructuredData />

      {/* 01: HERO STAGE (Danzia 3D Layered Hero with Monumental Typography behind Dancer) */}
      <Hero />

      {/* 02: CREATIVE FAMILY (More Than a Dance School, A Creative Family + Floating Polaroids) */}
      <CreativeFamilySection />

      {/* 03: TOP SKILLS PRO BENTO (Modular 7-Block Acid-Lime & Velvet Obsidian Grid) */}
      <BentoHighlights />

      {/* 04: CLASSES & PRICING (Compact price cards from Supabase programmes) */}
      <PricingSection />

      {/* 05: CLASSES FOR ALL AGES AND LEVELS (Clean, Spacious Large-Format Cards) */}
      <DanziaClassesSection />

      {/* 05: STRUCTURED LEVEL-BASED CERTIFICATION */}
      <LevelCertificationSection />

      {/* 06: MEET OUR INSTRUCTORS (Airy High-Fashion Dancer Portraits) */}
      <DanziaInstructorsSection />

      {/* 06: SNAPSHOTS OF MOVEMENT AND MAGIC (Cinematic Photo Mosaic of Stage Moments) */}
      <DanziaGallerySection />

      {/* 07: WHAT OUR STUDENTS & PARENTS SAY (Large Editorial Magazine Pull-Quotes) */}
      <DanziaTestimonialsSection />

      {/* 08: LET'S DANCE TOGETHER (Monumental Minimalist Closing Call to Action) */}
      <DanziaCTASection />

      {/* 09: STAGE REELS (Horizontal hover-reactive Instagram strip) */}
      <ReelsStrip />
    </div>
  );
}
