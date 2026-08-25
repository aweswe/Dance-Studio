'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function GalleryClient({ images }: { images: ImageType[] }) {
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<ImageType | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setLightboxImage(null), []);

  // Lightbox a11y: Esc closes, arrows navigate, Tab cycles inside (focus trap),
  // body scroll locks, and focus returns to the tile that opened the dialog.
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

      // Focus trap: keep Tab cycling within the dialog.
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
              "px-4 py-2 text-[11px] font-bold tracking-[1.5px] uppercase rounded-full transition-all border focus-visible:focus-ring active:scale-95",
              filter === cat
                ? "bg-blk text-white border-blk"
                : "bg-surface text-ink-2 border-line-strong hover:border-bl"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid — real buttons so every tile is keyboard-operable */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <button
            key={image.id}
            type="button"
            className="relative rounded-xl overflow-hidden bg-canvas-muted-2 aspect-square cursor-pointer group focus-visible:focus-ring"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setLightboxImage(image);
            }}
            aria-label={`View ${image.alt || 'gallery image'} larger`}
          >
            <Image
              src={image.url}
              alt={image.alt || 'Gallery Image'}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
        {filteredImages.length === 0 && (
          <div className="col-span-full text-center py-12 text-ink-2">
            No images found for this category.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt || 'Gallery image'}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-overlay-in"
          onClick={(e) => {
            // Backdrop click (not the image or controls) closes.
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close image"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors focus-visible:focus-ring rounded-sm"
            onClick={close}
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-5xl aspect-video md:aspect-[3/2] bg-transparent animate-panel-in">
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
          <p className="sr-only">Use left and right arrows to move between images, Escape to close.</p>
        </div>
      )}
    </div>
  );
}
