'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ImageType {
  id: string;
  url: string;
  alt: string;
  category: string;
  width?: number;
  height?: number;
}

export function GalleryClient({ images }: { images: ImageType[] }) {
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<ImageType | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={cn(
              "px-4 py-2 text-[11px] font-bold tracking-[1.5px] uppercase rounded-full transition-all border",
              filter === cat 
                ? "bg-blk text-white border-blk" 
                : "bg-white text-mu border-black/10 hover:border-black/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <div 
            key={image.id} 
            className="relative rounded-xl overflow-hidden bg-off aspect-square cursor-pointer group"
            onClick={() => setLightboxImage(image)}
          >
            <Image 
              src={image.url} 
              alt={image.alt || 'Gallery Image'} 
              fill 
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
        {filteredImages.length === 0 && (
          <div className="col-span-full text-center py-12 text-mu">
            No images found for this category.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt || 'Gallery image'}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close image"
            className="absolute top-6 right-6 text-white/70 hover:text-white"
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full max-w-5xl aspect-video md:aspect-[3/2] bg-transparent">
            <Image 
              src={lightboxImage.url} 
              alt={lightboxImage.alt || 'Gallery Image'} 
              fill 
              className="object-contain" 
            />
          </div>
          {lightboxImage.alt && (
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm px-4">
              {lightboxImage.alt}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
