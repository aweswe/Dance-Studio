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
          <div key={i} className={`relative rounded-xl overflow-hidden bg-off aspect-square ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            {image.url ? (
              <Image 
                src={image.url} 
                alt={image.alt || 'Gallery Image'} 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-mu text-xs">No Image</div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link 
          href={ROUTES.gallery}
          className="text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-3.5 border border-black/20 text-blk hover:border-bl hover:text-bl inline-block transition-all"
        >
          View Full Gallery
        </Link>
      </div>
    </div>
  );
}
