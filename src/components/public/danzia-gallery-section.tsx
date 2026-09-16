import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { getHomepageGalleryMoments } from '@/data/gallery';
import { homepageCtaOutlineLight, homepageMediaFrame } from '@/lib/ui/homepage-cta';
import { sectionGap } from '@/lib/ui/section-layout';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

export async function DanziaGallerySection() {
  const moments = await getHomepageGalleryMoments(6);

  return (
    <HomepageSection id="gallery" className="py-16 sm:py-20 select-none">
      <div className={cn('flex flex-col', sectionGap)}>
        <div className={cn('flex flex-wrap items-end justify-between', sectionGap)}>
          <header className={cn('min-w-0 flex-1 max-w-2xl flex flex-col', sectionGap)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl">Studio life</p>
            <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-ink">
              From the <span className="text-bl">studio.</span>
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              Rehearsals, classes, and stage moments — a quick look inside Rhythmzz.
            </p>
          </header>
          <Link href={ROUTES.gallery} className={`${homepageCtaOutlineLight} shrink-0`}>
            Full gallery
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </Link>
        </div>

        <div className={cn('grid grid-cols-2 lg:grid-cols-3', sectionGap)}>
          {moments.map((item) => (
            <Link
              key={item.id}
              href={ROUTES.gallery}
              className={cn(
                'group relative aspect-[4/3] bg-canvas-muted border border-line',
                homepageMediaFrame,
              )}
            >
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </HomepageSection>
  );
}
