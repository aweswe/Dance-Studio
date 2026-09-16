import { InstructorsCarousel } from '@/components/public/instructors-carousel';
import { getInstructors } from '@/data/instructors';
import { filterTeachingInstructors } from '@/lib/instructors/display';

export async function DanziaInstructorsSection() {
  const instructors = filterTeachingInstructors(await getInstructors());
  return <InstructorsCarousel instructors={instructors} />;
}
