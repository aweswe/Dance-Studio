"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [closing, setClosing] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Derived-from-props phase machine (render-phase adjustment):
  // opening cancels a pending exit; closing starts the exit animation.
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setClosing(false);
    else setClosing(true);
  }

  // Rendered = open or mid-exit; unmounts after the exit animation finishes.
  const rendered = isOpen || closing;

  // Unmount after the exit completes (reduced-motion makes the CSS exit
  // instant; the timeout still fires so the unmount is never skipped).
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => {
      setClosing(false);
      restoreFocusRef.current?.focus?.();
    }, 250);
    return () => clearTimeout(t);
  }, [closing]);

  // Body scroll lock for the whole visible lifetime (including the exit).
  useEffect(() => {
    if (!rendered) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [rendered]);

  // Escape closes; autofocus the close button on open. Runs before the
  // focus timer fires, so the captured element is still the opener.
  useEffect(() => {
    if (!isOpen) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    const t = setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      clearTimeout(t);
    };
  }, [isOpen, onClose]);

  if (!rendered) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? undefined}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm",
          closing ? "animate-overlay-out" : "animate-overlay-in",
        )}
      />
      <div
        className={cn(
          "relative bg-surface rounded-card shadow-overlay border border-line w-full max-h-[90vh] overflow-y-auto",
          closing ? "animate-panel-out" : "animate-panel-in",
          {
            "max-w-sm": size === "sm",
            "max-w-lg": size === "md",
            "max-w-2xl": size === "lg",
          },
        )}
      >
        {title ? (
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h2 className="font-display text-xl tracking-wider text-ink">{title}</h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close dialog"
              className="text-ink-2 hover:text-ink transition-colors p-1 rounded focus-visible:focus-ring active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-10 text-ink-2 hover:text-ink transition-colors p-1 rounded focus-visible:focus-ring active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
