'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { BannerContent } from '@/data/content';

export function AnnouncementBanner({ banner }: { banner?: BannerContent | null }) {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissing, setDismissing] = useState(false);

  if (!banner?.text) return null;

  const handleDismiss = () => {
    setDismissing(true);
    window.setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  const inner = (
    <>
      {banner.text}
      {banner.ctaLink && (
        <Link href={banner.ctaLink} className="ml-2 underline underline-offset-2 hover:opacity-80">
          Learn more
        </Link>
      )}
    </>
  );

  return (
    <div
      className={cn(
        'bg-bl text-white text-[10px] sm:text-[11px] font-semibold tracking-wide sm:tracking-[1px] uppercase text-center relative z-[600] overflow-hidden transition-all duration-500 ease-out-snap px-11 sm:px-12 leading-snug',
        dismissing ? 'max-h-0 py-0 opacity-0' : 'max-h-24 sm:max-h-12 py-2 sm:py-2.5 opacity-100',
      )}
    >
      {inner}
      <button
        onClick={handleDismiss}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 min-w-9 min-h-9 flex items-center justify-center rounded-md hover:opacity-70 transition-opacity focus-visible:focus-ring"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
