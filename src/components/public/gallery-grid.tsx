import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

interface GalleryGridProps {
  images: any[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {images.slice(0, 8).map((image, i) => (
          <div key={i} className={`relative rounded-xl overflow-hidden bg-canvas-muted-2 aspect-square ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            {image.url ? (
              <Image
                src={image.url}
                alt={image.alt || 'Gallery Image'}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-2 text-xs">No Image</div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link
          href={ROUTES.gallery}
          className="text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-3.5 border border-line-strong text-ink hover:border-bl-ink hover:text-bl-ink inline-block transition-all focus-visible:focus-ring active:scale-[0.98]"
        >
          View Full Gallery
        </Link>
      </div>
    </div>
  );
}
