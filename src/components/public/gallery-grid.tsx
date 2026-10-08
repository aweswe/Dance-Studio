import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';
import { homepageCtaOutlineLight, homepageCtaPairButton } from '@/lib/ui/homepage-cta';
import { cn } from '@/lib/utils/cn';

interface GalleryGridProps {
  images: any[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {images.slice(0, 8).map((image, i) => (
          <Link
            key={image.id || i}
            href={ROUTES.gallery}
            className={`group relative rounded-md overflow-hidden bg-blk aspect-square border border-line block ${
              i === 0 ? 'md:col-span-2 md:row-span-2' : ''
            }`}
          >
            {image.url ? (
              <>
                <Image
                  src={image.url}
                  alt={image.alt || image.title || 'Gallery Image'}
                  fill
                  sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {image.category && (
                    <span className="text-[9px] font-bold uppercase tracking-[2px] text-bl-light mb-0.5">
                      {image.category}
                    </span>
                  )}
                  <h4 className="heading-display text-sm md:text-base text-white line-clamp-1">
                    {image.title || image.alt}
                  </h4>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-2 text-xs">No Image</div>
            )}
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link
          href={ROUTES.gallery}
          className={cn(homepageCtaOutlineLight, homepageCtaPairButton, 'px-8')}
        >
          View Full Gallery ({images.length}+ Photos)
        </Link>
      </div>
    </div>
  );
}
