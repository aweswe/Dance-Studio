'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// In-memory flag so client-side navigation within the same tab doesn't re-trigger the 2s loader
let hasPlayedIntroSession = false;

export function SiteIntroLoader() {
  const [isMounted, setIsMounted] = useState(() => !hasPlayedIntroSession);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (hasPlayedIntroSession) return;

    // Lock body scroll while loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Kick off the progress bar fill on the next tick
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 50);

    // Exactly 1.5 seconds: begin the smooth fade-out exit
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      document.body.style.overflow = originalOverflow;
    }, 1500);

    // Allow 600ms exit transition to complete before unmounting from DOM
    const unmountTimer = setTimeout(() => {
      hasPlayedIntroSession = true;
      setIsMounted(false);
    }, 2100);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSkip = () => {
    setIsExiting(true);
    document.body.style.overflow = '';
    setTimeout(() => {
      hasPlayedIntroSession = true;
      setIsMounted(false);
    }, 300);
  };

  if (!hasPlayedIntroSession && !isMounted) return null;
  if (!isMounted) return null;

  return (
    <aside
      aria-label="Loading Rhythmzz Academy of Dance"
      aria-live="polite"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#08090b] text-white select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.03] filter blur-[6px] pointer-events-none'
          : 'opacity-100 scale-100 filter blur-0'
      }`}
    >
      {/* Soft minimal ambient glow — clean blank background, no grid squares */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(56,189,248,0.08)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md sm:max-w-lg mx-auto">
        {/* Soft subtle glow behind Logo — no harsh rings */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute -inset-6 sm:-inset-8 rounded-full bg-bl/10 blur-2xl"
            aria-hidden="true"
          />

          {/* Logo — fully transparent, no card, no padding */}
          <div className="relative transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src="/logo.png"
              alt="Rhythmzz Academy of Dance"
              width={896}
              height={697}
              priority
              className="h-52 sm:h-60 md:h-68 lg:h-76 w-auto object-contain drop-shadow-[0_0_60px_rgba(43,180,216,0.6)]"
            />
          </div>
        </div>



        {/* Tagline */}
        <p className="mt-4 font-anton text-xl sm:text-2xl uppercase tracking-[0.14em] text-white/90 leading-none">
          Move <span className="text-bl">Different</span> <span className="text-white/35 text-base sm:text-lg">· Secunderabad</span>
        </p>
        <p className="mt-2.5 text-[11px] sm:text-xs text-white/45 font-body tracking-wide text-center">
          Feel the Beat. Every Beat Tells a Story.
        </p>

        {/* Dance Equalizer Soundwave Micro-Indicator */}
        <div className="flex items-center gap-1.5 mt-5 mb-2" aria-hidden="true">
          <span className="w-1 bg-bl rounded-full animate-pulse h-3.5" style={{ animationDelay: '0ms' }} />
          <span className="w-1 bg-bl-light rounded-full animate-pulse h-6" style={{ animationDelay: '150ms' }} />
          <span className="w-1 bg-bl rounded-full animate-pulse h-4" style={{ animationDelay: '300ms' }} />
          <span className="w-1 bg-bl-light rounded-full animate-pulse h-7" style={{ animationDelay: '450ms' }} />
          <span className="w-1 bg-bl rounded-full animate-pulse h-3" style={{ animationDelay: '200ms' }} />
        </div>

        {/* 2-Second Calibrated Progress Track */}
        <div className="w-48 sm:w-56 h-1 bg-white/10 rounded-full overflow-hidden relative mt-2 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-bl/70 via-bl to-bl-light rounded-full transition-all duration-[1500ms] ease-[cubic-bezier(0.2,0,0.1,1)] shadow-[0_0_12px_#2BB4D8]"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* Fast Skip Option */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-6 right-6 z-20 text-[11px] font-mono uppercase tracking-wider text-white/40 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-bl"
      >
        Skip &rarr;
      </button>
    </aside>
  );
}
