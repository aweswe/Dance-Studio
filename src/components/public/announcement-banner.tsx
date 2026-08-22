'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBannerProps {
  content?: string;
}

export function AnnouncementBanner({ content }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!content || !isVisible) return null;

  return (
    <div className="bg-bl text-white text-[11px] font-semibold tracking-[1px] uppercase py-2.5 px-10 text-center relative z-[600]">
      {content}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
