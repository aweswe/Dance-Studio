'use client';

import { useEffect, useRef } from 'react';
import { X, Play, Volume2, VolumeX } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title = 'Studio Showcase & Choreography',
  subtitle = 'Rhythmzz Academy of Dance · Neredmet, Secunderabad',
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-deep border border-white/20 rounded-md overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-bl block mb-0.5">
              Live Session
            </span>
            <h3 className="text-white text-base sm:text-lg font-bold tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-white/50">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close video modal"
            className="p-2 text-white/70 hover:text-white rounded-full bg-white/5 hover:bg-white/15 transition-all active:scale-[0.96]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full aspect-video bg-blk flex items-center justify-center overflow-hidden">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            /* Dance Studio Reel Embed */
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/90 p-6">
              <div className="relative z-10 text-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-white/10 flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
                </div>
                <h4 className="heading-urban text-2xl sm:text-4xl text-white mb-2">
                  CHOREOGRAPHY SHOWCASE
                </h4>
                <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
                  Academy Faculty &amp; Student Cohorts • Commercial, Contemporary &amp; Classical Training
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <a
                    href="https://www.instagram.com/rhythmzzdance.live"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-blk text-xs font-bold uppercase tracking-wider hover:bg-bl hover:text-white transition-all active:scale-[0.96]"
                  >
                    Watch on Instagram Reels
                  </a>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-[0.96]"
                  >
                    Back to Studio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
