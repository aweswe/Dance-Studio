import Image from 'next/image';
import { SnapCarousel, snapSlideClass } from '@/components/public/snap-carousel';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { homepageMediaRadius } from '@/lib/ui/homepage-cta';

const INSTRUCTORS = [
  {
    id: 'nitish',
    name: 'NITISH KUMAR',
    styles: 'Runs the floor · contemporary',
    image: '/images/studio-training/studio-technique.jpg',
  },
  {
    id: 'pranith',
    name: 'PRANITH NAIR',
    styles: 'Hip-hop · urban',
    image: '/images/pranith-nair.png',
  },
  {
    id: 'srusti',
    name: 'SRUSTI VEMPATI',
    styles: 'Kuchipudi',
    image: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
  },
] as const;

export function DanziaInstructorsSection() {
  return (
    <HomepageSection className="py-16 sm:py-24">
      <HomepageSectionHeading
        title="Who teaches"
        description="Nitish, Pranith, Srusti. On the floor, not only on this page."
      />

      <SnapCarousel columns={3}>
        {INSTRUCTORS.map((instructor) => (
          <article key={instructor.id} className={`${snapSlideClass} group flex flex-col`}>
            <div className={`relative aspect-[3/4] w-full ${homepageMediaRadius} overflow-hidden bg-canvas-muted mb-5 border border-line`}>
              <Image
                src={instructor.image}
                alt={instructor.name}
                fill
                sizes="(max-width: 768px) 80vw, 33vw"
                className="object-cover object-center grayscale contrast-110 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            </div>
            <h3 className="font-anton text-xl sm:text-2xl tracking-wide uppercase text-ink leading-[1.1] mb-1">
              {instructor.name}
            </h3>
            <span className="text-xs font-mono text-ink-2 tracking-wider uppercase">{instructor.styles}</span>
          </article>
        ))}
      </SnapCarousel>
    </HomepageSection>
  );
}
