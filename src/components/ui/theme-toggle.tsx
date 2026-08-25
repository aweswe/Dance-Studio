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
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // storage unavailable (private mode) — theme still applies for this visit
    }
    // one-shot cross-theme transition; the global reduced-motion gate kills it
    const html = document.documentElement;
    html.classList.add("theme-transition");
    window.setTimeout(() => html.classList.remove("theme-transition"), 400);
    // keep the browser chrome in sync
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = next ? "#0F0F0F" : "#2BB4D8";
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-full",
        "text-ink-2 hover:text-ink hover:bg-canvas-muted",
        "transition-colors focus-visible:focus-ring active:scale-95",
        className,
      )}
    >
      <Sun size={16} className="hidden dark:block" />
      <Moon size={16} className="dark:hidden" />
    </button>
  );
}
