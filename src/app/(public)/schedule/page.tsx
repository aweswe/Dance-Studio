import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, ROUTES } from '@/lib/utils/constants';
import { ProgrammeClassesList } from '@/components/public/programme-classes-list';
import { HomepageSection } from '@/components/public/homepage-section';
import { ArrowRight } from 'lucide-react';
import { getBatches } from '@/data/batches';
import { getProgrammes } from '@/data/programmes';
import { buildScheduleFilters, buildWeekScheduleFromBatches } from '@/lib/schedule/from-batches';

export const metadata: Metadata = {
  title: 'Weekly Batch Schedule & Timings | Rhythmzz Academy of Dance',
  description:
    'Explore weekly class schedules for Kids Dance, Adults Hip Hop, Classical Kuchipudi, and Mind & Body Fitness at Rhythmzz Academy in Secunderabad.',
  alternates: { canonical: `${SITE_URL}/schedule` },
};

export default async function SchedulePage() {
  const [batches, programmes] = await Promise.all([getBatches(), getProgrammes()]);
  const weekDays = buildWeekScheduleFromBatches(batches);
  const filters = buildScheduleFilters(
    programmes.map((p) => ({ slug: p.slug, name: p.name, sort_order: p.sort_order })),
  );

  return (
    <div className="bg-canvas text-ink min-h-screen">
      {/* 01: Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 md:px-16 border-b border-line bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-bl uppercase font-bold mb-4">
              ALL DISCIPLINES · WEEKLY TIMETABLE
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl text-ink mb-6 leading-[0.92] tracking-tight uppercase">
              WEEKLY BATCH <br className="hidden sm:inline" />
              <span className="text-bl">SCHEDULE.</span>
            </h1>

            <p className="text-ink-2 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Find your batch across Classical Kuchipudi, Kids Academy, Urban &amp; Hip Hop, and Mind &amp; Body Fitness. Your first session is always a free trial.
            </p>
          </div>
        </div>
      </section>

      {/* 02: Category-wise weekly class list */}
      <HomepageSection className="py-12 sm:py-24">
        <ProgrammeClassesList weekDays={weekDays} filters={filters} />
      </HomepageSection>

      {/* 03: Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 md:px-16 bg-surface border-t border-line text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-anton text-3xl sm:text-4xl text-ink uppercase tracking-wide">
            READY TO JOIN A CLASS?
          </h2>
          <p className="text-sm text-ink-2 max-w-lg mx-auto leading-relaxed">
            Reserve your complimentary trial class today. No admission fee, registration charges, or upfront commitment.
          </p>
          <div className="pt-2">
            <Link
              href={ROUTES.enrol}
              className="btn-sun px-8 py-3.5 text-xs font-black uppercase tracking-[0.16em] shadow-md inline-flex items-center gap-2 active:scale-95"
            >
              <span>Book Your Free Trial</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
