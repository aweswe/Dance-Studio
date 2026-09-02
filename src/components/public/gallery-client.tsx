'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ImageType {
  id: string;
  url: string;
  alt: string;
  title?: string;
  category: string;
  width?: number;
  height?: number;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function GalleryClient({ images }: { images: ImageType[] }) {
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<ImageType | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setLightboxImage(null), []);

  useEffect(() => {
    if (!lightboxImage) {
      triggerRef.current?.focus();
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const index = images.findIndex((img) => img.id === lightboxImage.id);
    const step = (delta: number) => {
      if (index < 0) return;
      const next = images[(index + delta + images.length) % images.length];
      setLightboxImage(next);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxImage, images, close]);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(images.map((img) => img.category).filter(Boolean)))];

  const filteredImages = filter === 'all' ? images : images.filter((img) => img.category === filter);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={cn(
              "px-5 py-2 text-[11px] font-bold tracking-[1.5px] uppercase rounded-full transition-all border focus-visible:focus-ring active:scale-95",
              filter === cat
                ? "bg-blk text-white border-blk dark:bg-white dark:text-black shadow-sm"
                : "bg-surface text-ink-2 border-line hover:border-bl hover:text-ink"
            )}
          >
            {cat}
            <span className="text-[10px] opacity-60 ml-1.5 font-normal">
              ({cat === 'all' ? images.length : images.filter((i) => i.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid with Hover Overlays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <button
            key={image.id}
            type="button"
            className="relative rounded-card overflow-hidden bg-blk aspect-square cursor-pointer group focus-visible:focus-ring border border-line text-left"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setLightboxImage(image);
            }}
            aria-label={`View ${image.title || image.alt || 'gallery image'} larger`}
          >
            <Image
              src={image.url}
              alt={image.alt || image.title || 'Gallery Image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            {/* Always readable title overlay on hover/focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-blk/30 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
              <div className="flex justify-end">
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  <ZoomIn size={16} />
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-bl-light px-2 py-0.5 rounded bg-bl/20 inline-block mb-1">
                  {image.category}
                </span>
                <h4 className="heading-display text-base text-white line-clamp-2 leading-snug">
                  {image.title || image.alt}
                </h4>
              </div>
            </div>
          </button>
        ))}
        {filteredImages.length === 0 && (
          <div className="col-span-full text-center py-16 text-ink-2 bg-surface rounded-card border border-line">
            No images found for this category.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.title || lightboxImage.alt || 'Gallery image'}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 animate-overlay-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close image"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors focus-visible:focus-ring rounded-full p-2 bg-white/10 hover:bg-white/20 z-50"
            onClick={close}
          >
            <X size={28} />
          </button>

          <div className="relative w-full max-w-5xl h-[70vh] max-h-[800px] flex items-center justify-center">
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.alt || lightboxImage.title || 'Gallery Image'}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="mt-4 text-center max-w-2xl px-4 z-10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-bl-light px-2.5 py-0.5 rounded bg-white/10 inline-block">
              {lightboxImage.category}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white">
              {lightboxImage.title || lightboxImage.alt}
            </h3>
            {lightboxImage.alt && lightboxImage.title !== lightboxImage.alt && (
              <p className="text-xs md:text-sm text-white/70 font-light">
                {lightboxImage.alt}
              </p>
            )}
          </div>

          <p className="sr-only">Use left and right arrows to move between images, Escape to close.</p>
        </div>
      )}
    </div>
  );
}
