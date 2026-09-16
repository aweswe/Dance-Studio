import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { homepageMediaRadius, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { getGalleryImages } from '@/data/gallery';
import { ROUTES } from '@/lib/utils/constants';

export async function DanziaGallerySection() {
  const images = await getGalleryImages(5);
  const moments = images.slice(0, 5);
  const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4'];

  return (
    <HomepageSection className="py-16 sm:py-24 select-none">
      <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
        <HomepageSectionHeading
          className="mb-0"
          title="From the studio"
          description="Pulled from the admin gallery — newest uploads first."
        />
        <Link href={ROUTES.gallery} className={`${homepageCtaOutlineLight} shrink-0`}>
          Full gallery
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        {moments.map((item, i) => (
          <div
            key={item.id}
            className={`group relative aspect-[16/10] ${homepageMediaRadius} overflow-hidden bg-canvas-muted border border-line shadow-md ${spans[i] ?? 'md:col-span-4'}`}
          >
            {item.type === 'video' ? (
              <video src={item.url} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <Image
                src={item.url}
                alt={item.title || item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center grayscale contrast-115 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
            {item.title && (
              <p className="absolute bottom-4 left-4 text-sm font-bold text-white">{item.title}</p>
            )}
          </div>
        ))}
      </div>
    </HomepageSection>
  );
}
