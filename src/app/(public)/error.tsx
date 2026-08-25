'use client';

import { useEffect } from 'react';

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
        <div className="section-label mb-3">Curtain Call</div>
        <h1 className="heading-display text-6xl text-ink mb-4">WE LOST THE BEAT</h1>
        <p className="text-sm text-ink-2 leading-relaxed mb-8">
          Something went wrong on this page. Give it another go — the music is still playing.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="bg-blk text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 px-9 hover:bg-bl transition-all cursor-pointer focus-visible:focus-ring active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
