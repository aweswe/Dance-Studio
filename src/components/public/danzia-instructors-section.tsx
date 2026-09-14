import Image from 'next/image';
import { SnapCarousel, snapSlideClass } from '@/components/public/snap-carousel';

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
    <section className="w-full px-4 sm:px-8 md:px-14 py-20 sm:py-32 max-w-[1440px] mx-auto">
      <div className="max-w-3xl mb-10 sm:mb-16">
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ink uppercase leading-[1.05] sm:leading-[0.92]">
          WHO TEACHES
        </h2>
        <p className="text-sm sm:text-base text-ink-2 mt-4 leading-relaxed max-w-xl">
          Nitish, Pranith, Srusti. On the floor, not only on this page.
        </p>
      </div>

      <SnapCarousel columns={3}>
        {INSTRUCTORS.map((instructor) => (
          <article key={instructor.id} className={`${snapSlideClass} group flex flex-col`}>
            <div className="relative aspect-[3/4] w-full rounded-[28px] overflow-hidden bg-canvas-muted mb-5">
              <Image
                src={instructor.image}
                alt={instructor.name}
                fill
                sizes="(max-width: 768px) 80vw, 33vw"
                className="object-cover object-center grayscale contrast-110 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            </div>
            <h3 className="font-anton text-2xl sm:text-3xl tracking-wide uppercase text-ink leading-[1.1] mb-1">
              {instructor.name}
            </h3>
            <span className="text-xs font-mono text-ink-2 tracking-wider uppercase">
              {instructor.styles}
            </span>
          </article>
        ))}
      </SnapCarousel>
    </section>
  );
}
