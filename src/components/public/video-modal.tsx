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
  subtitle = 'Rhythmzz Dance Academy · Neredmet, Secunderabad',
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
        className="relative w-full max-w-5xl bg-[#111111] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2BB4D8] block mb-0.5">
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
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            /* Cinematic Dance Studio Reel Embed with Ambient Lighting */
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-black via-[#141414] to-[#1c182a]">
              {/* Studio Stage Spotlight Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2BB4D8]/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5A623]/80 to-transparent blur-[1px]" />
              
              <div className="relative z-10 text-center px-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-cyan-500/20">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
                </div>
                <h4 className="heading-urban text-2xl sm:text-4xl text-white mb-2">
                  CHOREOGRAPHY SHOWCASE
                </h4>
                <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
                  Featuring Nitish Kumar & Faculty • Urban Bolly-Hop, Contemporary & Foundation Training
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <a
                    href="https://www.instagram.com/rhythmzzdance.live"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-[#2BB4D8] hover:text-white transition-all active:scale-[0.96]"
                  >
                    Watch on Instagram Reels
                  </a>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-[0.96]"
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
