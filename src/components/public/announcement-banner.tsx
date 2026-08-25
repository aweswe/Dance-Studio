'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AnnouncementBannerProps {
  content?: string;
}

export function AnnouncementBanner({ content }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissing, setDismissing] = useState(false);

  if (!content) return null;

  const handleDismiss = () => {
    setDismissing(true);
    // Unmount once the collapse animation has finished; the header's
    // ResizeObserver smooths the layout shift while it plays.
    window.setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-bl text-white text-[11px] font-semibold tracking-[1px] uppercase text-center relative z-[600] overflow-hidden transition-all duration-500 ease-out-snap',
        dismissing ? 'max-h-0 py-0 opacity-0' : 'max-h-12 py-2.5 opacity-100',
      )}
    >
      {content}
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:opacity-70 transition-opacity focus-visible:focus-ring"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
