'use client';

import './globals.css';

/**
 * App-level error boundary (Next.js renders this when a root layout throws).
 * Keeps a crashed site presentable instead of a blank page.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-light px-6 text-center">
          <h1 className="font-display text-4xl text-blk mb-3 tracking-[2px]">SOMETHING WENT WRONG</h1>
          <p className="text-mu text-sm mb-8 max-w-md">
            Rhythmzz Academy hit an unexpected error. Try again — if this keeps happening, reach
            out to the academy directly.
          </p>
          <button
            onClick={() => reset()}
            className="text-[11px] font-semibold tracking-[2px] uppercase px-8 py-3 bg-bl text-white rounded transition-all focus-visible:focus-ring active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
