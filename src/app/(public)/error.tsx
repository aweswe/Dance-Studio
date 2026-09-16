'use client';

import { useEffect } from 'react';
import { homepageCtaBrand } from '@/lib/ui/homepage-cta';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24 bg-canvas text-ink">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl mb-3">Something went wrong</p>
        <h1 className="font-anton text-4xl sm:text-5xl text-ink mb-4 uppercase tracking-tight leading-[0.95]">
          We lost the beat
        </h1>
        <p className="text-sm text-ink-2 leading-relaxed mb-8">
          Give it another go — the music is still playing.
        </p>
        <button type="button" onClick={() => retry()} className={homepageCtaBrand}>
          Try again
        </button>
      </div>
    </div>
  );
}
