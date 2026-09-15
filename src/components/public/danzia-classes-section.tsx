import Image from 'next/image';
import Link from 'next/link';
import { SnapCarousel, snapSlideClass } from '@/components/public/snap-carousel';
import { getProgrammes } from '@/data/programmes';
import { ROUTES } from '@/lib/utils/constants';

const PROGRAMME_IMAGES: Record<string, string> = {
  'commercial-expressive': '/images/class-1.jpg',
  'mind-body-fitness': '/images/studio-training/studio-technique.jpg',
  'classical-dance': '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
  'kids-dance': '/images/class-1.jpg',
  'adults-dance': '/images/class-2.jpg',
  kuchipudi: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
};

export async function DanziaClassesSection() {
  const programmes = await getProgrammes();
  const active = programmes.filter((p) => p.is_active !== false);

  return (
    <section className="w-full px-4 sm:px-8 md:px-14 py-20 sm:py-32 max-w-[1440px] mx-auto">
      <div className="max-w-3xl mb-10 sm:mb-16">
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ink uppercase leading-[1.05] sm:leading-[0.92]">
          WHAT WE TEACH
        </h2>
        <p className="text-sm sm:text-base text-ink-2 mt-4 leading-relaxed max-w-xl">
          Same programmes the desk manages — fees and batches stay in sync.
        </p>
      </div>

      <SnapCarousel>
        {active.map((item) => (
          <Link
            key={item.id}
            href={ROUTES.programme(item.slug)}
            className={`${snapSlideClass} flex flex-col group`}
          >
            <div className="relative aspect-[3/4] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-canvas-muted mb-4">
              <Image
                src={PROGRAMME_IMAGES[item.slug] ?? '/images/class-2.jpg'}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 80vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-bl font-bold mb-1">
              {item.badge ?? item.age_group ?? 'Open batch'}
            </span>
            <h3 className="font-anton text-2xl sm:text-3xl tracking-wide uppercase text-ink mb-1.5 group-hover:text-bl transition-colors">
              {item.name.split(' ').slice(0, 2).join(' ')}
            </h3>
            <p className="text-sm text-ink-2 leading-relaxed line-clamp-2">{item.tagline}</p>
          </Link>
        ))}
      </SnapCarousel>
    </section>
  );
}
