import { ProgrammeClassesList } from '@/components/public/programme-classes-list';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { getBatches } from '@/data/batches';
import { getProgrammes } from '@/data/programmes';
import { buildScheduleFilters, buildWeekScheduleFromBatches } from '@/lib/schedule/from-batches';
import { sectionPadLg } from '@/lib/ui/section-layout';

export async function HomepageClassesSection() {
  const [batches, programmes] = await Promise.all([getBatches(), getProgrammes()]);
  const weekDays = buildWeekScheduleFromBatches(batches);
  const filters = buildScheduleFilters(
    programmes.map((p) => ({ slug: p.slug, name: p.name, sort_order: p.sort_order })),
  );

  return (
    <HomepageSection id="classes" className={sectionPadLg}>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-7 sm:mb-8">
        <HomepageSectionHeading
          eyebrow="Weekly timetable"
          title="This week's"
          accent="classes."
          description="Filter by programme · Click Book to reserve your spot"
          className="mb-0"
        />
      </div>

      <ProgrammeClassesList weekDays={weekDays} filters={filters} />
    </HomepageSection>
  );
}
