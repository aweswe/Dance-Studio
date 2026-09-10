"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const THEME_KEY = "rhythmzz-theme";

/**
 * Light/dark toggle. Light is the default theme; the inline script in
 * src/app/layout.tsx applies .dark pre-paint from localStorage/system.
 * Both icons render and CSS picks the right one, so there is no
 * hydration mismatch or mounted-state placeholder.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    // better-ui recipe: suppress transitions during theme flip to prevent color smearing
    const css = document.createElement("style");
    css.appendChild(
      document.createTextNode("*,*::before,*::after{transition:none !important}")
    );
    document.head.appendChild(css);

    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);

    // Force reflow
    window.getComputedStyle(css).opacity;

    // Restore on next animation frame
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

    // keep the browser chrome in sync
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = next ? "#0F0F0F" : "#2BB4D8";
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Toggle Light / Dark theme"
      aria-label="Toggle dark mode"
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer",
        "border border-line hover:border-line-strong",
        "bg-surface/80 dark:bg-white/10 backdrop-blur-sm",
        "transition-transform duration-100 ease-out focus-visible:focus-ring active:scale-[0.96]",
        className,
      )}
    >
      <Sun size={15} className="hidden dark:block text-amber-300 transition-transform duration-300 hover:rotate-45" />
      <Moon size={15} className="dark:hidden text-slate-800 transition-transform duration-300 hover:-rotate-12" />
    </button>
  );
}
