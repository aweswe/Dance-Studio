'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface StudioImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  aspect?: 'wide' | 'standard';
}

export const STUDIO_GALLERY_IMAGES: StudioImage[] = [
  {
    id: 'studio-mirrors',
    url: '/images/studio-rental/studio-mirror-reflection.jpg',
    title: 'Full-Length Mirror Wall',
    subtitle: 'Distortion-free wall-to-wall reflection',
    category: 'Full Mirrors',
    description:
      'Seamless floor-to-ceiling mirrors spanning the entire studio length, giving dancers, instructors, and choreographers complete visual feedback for formations and technique.',
    aspect: 'wide',
  },
  {
    id: 'studio-barre',
    url: '/images/studio-rental/studio-barre-lights.jpg',
    title: 'Ballet Barre & Ambient Lighting',
    subtitle: 'Dual-height wooden barre & pendant lamps',
    category: 'Barre & Lighting',
    description:
      'Dual-height ballet barre station accompanied by warm overhead acoustic pendant lights, providing an inspiring atmosphere for classical, contemporary, and conditioning sessions.',
    aspect: 'standard',
  },
  {
    id: 'studio-neon',
    url: '/images/studio-rental/studio-neon-wall.jpg',
    title: 'Acoustic Feature Wall & Neon Ambience',
    subtitle: 'Matte black surface with custom mood lighting',
    category: 'Video & Mood',
    description:
      'Matte black acoustic wall with vibrant neon backlight accents, engineered specifically for high-definition video shoots, Instagram reels, and professional showcases.',
    aspect: 'standard',
  },
  {
    id: 'studio-floor',
    url: '/images/studio-rental/studio-floor-overview.jpg',
    title: 'Sprung Marley Dance Floor',
    subtitle: 'Joint-protective shock-absorbing surface',
    category: 'Marley Floor',
    description:
      'Professional sprung Marley flooring designed to absorb landing impact, protect dancer joints, and provide the ideal balance of grip and slip for all dance forms.',
    aspect: 'wide',
  },
  {
    id: 'studio-depth',
    url: '/images/studio-rental/studio-depth-wide.jpg',
    title: 'High Clearance & Open Volume',
    subtitle: 'Unobstructed spatial headroom',
    category: 'Spacious Layout',
    description:
      'Generous ceiling height and an uncluttered open floor plan allow ample clearance for partner lifts, dynamic jumps, prop work, and large group choreographies.',
    aspect: 'standard',
  },
  {
    id: 'studio-corner',
    url: '/images/studio-rental/studio-barre-corner.jpg',
    title: 'Instructor & Rehearsal Station',
    subtitle: 'Dedicated prep & coaching vantage point',
    category: 'Coaching Zone',
    description:
      'Direct line-of-sight across the entire floor with quick access to the sound console, comfortable seating, and staging area for equipment.',
    aspect: 'standard',
  },
];

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function StudioGallery() {
  const [activeImage, setActiveImage] = useState<StudioImage | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setActiveImage(null), []);

  useEffect(() => {
    if (!activeImage) {
      triggerRef.current?.focus();
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const index = STUDIO_GALLERY_IMAGES.findIndex((img) => img.id === activeImage.id);
    const step = (delta: number) => {
      if (index < 0) return;
      const next =
        STUDIO_GALLERY_IMAGES[
          (index + delta + STUDIO_GALLERY_IMAGES.length) % STUDIO_GALLERY_IMAGES.length
        ];
      setActiveImage(next);
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
  }, [activeImage, close]);

  const activeIndex = activeImage
    ? STUDIO_GALLERY_IMAGES.findIndex((img) => img.id === activeImage.id)
    : -1;

  const navigate = (delta: number) => {
    if (activeIndex < 0) return;
    const next =
      STUDIO_GALLERY_IMAGES[
        (activeIndex + delta + STUDIO_GALLERY_IMAGES.length) % STUDIO_GALLERY_IMAGES.length
      ];
    setActiveImage(next);
  };

  return (
    <div className="w-full">
      {/* Visual Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {STUDIO_GALLERY_IMAGES.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setActiveImage(img);
            }}
            className={cn(
              'group relative aspect-[4/3] rounded-md overflow-hidden border border-line bg-surface text-left cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2',
              'transition-all duration-300 hover:border-line-strong hover:shadow-md',
            )}
            aria-label={`View photo of ${img.title} full size`}
          >
            <Image
              src={img.url}
              alt={img.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay & Metadata */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 sm:p-5 flex flex-col justify-between transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-bl border border-bl/30 shadow-sm">
                  {img.category}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                  <ZoomIn size={15} />
                </span>
              </div>

              <div>
                <h3 className="font-anton text-lg sm:text-xl text-white uppercase tracking-tight leading-snug drop-shadow-sm">
                  {img.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5 font-medium">
                  {img.subtitle}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Accessible Fullscreen Lightbox Modal */}
      {activeImage && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 animate-overlay-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* Top Bar: Counter & Close */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white/80 z-50">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest text-bl font-semibold uppercase">
                Photo {activeIndex + 1} of {STUDIO_GALLERY_IMAGES.length}
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/40" />
              <span className="hidden sm:inline-block text-xs font-mono uppercase text-white/60">
                {activeImage.category}
              </span>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Close photo preview"
              className="text-white/80 hover:text-white transition-colors rounded-full p-2 bg-white/10 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
              onClick={close}
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Photo Container with Nav Buttons */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-3 sm:my-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-colors backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative w-full h-[55vh] sm:h-[65vh] max-h-[750px]">
              <Image
                src={activeImage.url}
                alt={activeImage.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-colors backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Bar: Title, Description & Action */}
          <div className="w-full max-w-5xl flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/15 pt-4 text-white">
            <div className="max-w-2xl space-y-1">
              <h4 className="font-anton text-xl sm:text-2xl uppercase tracking-tight text-white">
                {activeImage.title}
              </h4>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-body">
                {activeImage.description}
              </p>
            </div>

            <a
              href="#rental-form"
              onClick={() => close()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-bl hover:bg-bl-deep text-blk font-bold text-xs uppercase tracking-wider transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>Book this space</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
