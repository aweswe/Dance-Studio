'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { BannerContent } from '@/data/content';

function sanitizeBannerLink(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (lower.includes('contact')) return '/contact';
  if (lower.includes('enrol') || lower.includes('enroll') || lower.includes('register')) return '/enrol';
  if (lower.includes('pricing') || lower.includes('fee')) return '/#pricing';
  if (lower.includes('gear') || lower.includes('merch') || lower.includes('shop')) return '/gear';
  return `/${trimmed.replace(/^\/+/, '')}`;
}

export function AnnouncementBanner({ banner }: { banner?: BannerContent | null }) {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissing, setDismissing] = useState(false);

  if (!banner?.text) return null;

  const handleDismiss = () => {
    setDismissing(true);
    window.setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  const cleanLink = sanitizeBannerLink(banner.ctaLink);

  const inner = (
    <>
      {banner.text}
      {cleanLink && (
        <Link href={cleanLink} className="ml-2 underline underline-offset-2 hover:opacity-80 font-black text-slate-950">
          Learn more
        </Link>
      )}
    </>
  );

  return (
    <div
      className={cn(
        'bg-bl text-slate-950 text-[10px] sm:text-[11px] font-black tracking-wide sm:tracking-[1px] uppercase text-center relative z-[600] overflow-hidden transition-all duration-500 ease-out-snap px-11 sm:px-12 leading-snug',
        dismissing ? 'max-h-0 py-0 opacity-0' : 'max-h-24 sm:max-h-12 py-2 sm:py-2.5 opacity-100',
      )}
    >
      {inner}
      <button
        onClick={handleDismiss}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 min-w-9 min-h-9 flex items-center justify-center rounded-md text-slate-950 hover:bg-black/15 transition-colors focus-visible:focus-ring"
        aria-label="Dismiss banner"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}
