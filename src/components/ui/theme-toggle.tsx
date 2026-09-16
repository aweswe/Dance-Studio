"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const THEME_KEY = "rhythmzz-theme";

/**
 * Light/dark toggle. Dark is the default. The inline script in layout
 * only removes .dark when localStorage is explicitly "light".
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const css = document.createElement("style");
    css.appendChild(
      document.createTextNode("*,*::before,*::after{transition:none !important}")
    );
    document.head.appendChild(css);

    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);

    window.getComputedStyle(css).opacity;

    requestAnimationFrame(() => {
      if (document.head.contains(css)) {
        document.head.removeChild(css);
      }
    });

    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // storage unavailable (private mode) — theme still applies for this visit
    }

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = next ? "#0F0F0F" : "#ffffff";
    document.documentElement.style.colorScheme = next ? "dark" : "light";
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Switch theme"
      aria-label="Toggle dark mode"
      className={cn(
        "inline-flex items-center justify-center min-h-11 min-w-11 rounded-md cursor-pointer",
        "border border-line bg-surface-card shadow-lift text-ink",
        "focus-visible:focus-ring active:scale-[0.96]",
        className,
      )}
    >
      <Sun size={16} strokeWidth={1.5} className="hidden dark:block" />
      <Moon size={16} strokeWidth={1.5} className="dark:hidden" />
    </button>
  );
}
