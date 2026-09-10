import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/utils/constants';

// Signature Hybrid Studio Showcase Components
import { Hero } from '@/components/public/hero';
import { BentoHighlights } from '@/components/public/bento-highlights';
import { DanceStylesCarousel } from '@/components/public/dance-styles-carousel';
import { UpcomingClasses } from '@/components/public/upcoming-classes';
import { CoachesGrid } from '@/components/public/coaches-grid';
import { WeekScheduleGrid } from '@/components/public/week-schedule-grid';
import { LatestVideos } from '@/components/public/latest-videos';
import { StructuredData } from '@/components/shared/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="relative bg-canvas text-ink font-body overflow-x-hidden min-h-screen transition-colors duration-300">
      <StructuredData />

      {/* 01: HERO STAGE (Embedded Header, Giant Italic DANCE ACADEMY, Play Video & Free Trial Pills) */}
      <Hero />

      {/* 02: BENTO HIGHLIGHTS (Step Up: Trending Beats/Starboy, The First Lesson Is Free, Invite Friends) */}
      <BentoHighlights />

      {/* 03: DANCE STYLES EXPLORATION (Step Up: Try Different Dance Styles Carousel) */}
      <DanceStylesCarousel />

      {/* 04: UPCOMING CLASSES (Urban: 3 Widescreen Video Cards + More classes ──→) */}
      <UpcomingClasses />

      {/* 05: COACHES ROSTER (Step Up: Meet Our Team of Coaches Vertical Portrait Cards) */}
      <CoachesGrid />

      {/* 06: WEEK SCHEDULE (Urban: 5-Column Technical Calendar Grid with Hairline Dividers) */}
      <WeekScheduleGrid />

      {/* 07: LATEST VIDEOS (Urban: 1 Dominant 62% Reel + 2 Stacked Cards with Purple Neon) */}
      <LatestVideos />

      {/* 08: Inverted Editorial Dual-Mode Footer rendered automatically by layout.tsx */}
    </div>
  );
}


