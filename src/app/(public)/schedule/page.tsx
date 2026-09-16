import { Metadata } from 'next';
import { SITE_URL } from '@/lib/utils/constants';
import { ProgrammeClassesList } from '@/components/public/programme-classes-list';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionPadAfterTitleLg } from '@/lib/ui/section-layout';
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
    <PublicPage>
      <PublicPageTitle
        eyebrow="Weekly timetable"
        title="Batch schedule"
        description="Find your batch across Classical Kuchipudi, Kids Academy, Urban & Hip Hop, and Mind & Body Fitness. First session is a free trial."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <ProgrammeClassesList weekDays={weekDays} filters={filters} />
      </HomepageSection>

      <PublicBookTrialCta />
    </PublicPage>
  );
}
