"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * Top navigation progress bar.
 * Gives instant feedback on every page click to completely eliminate the
 * "3-4 second blank / frozen screen" sensation during data fetching.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When pathname changes, complete and dismiss the bar
    setProgress(100);
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const isTargetBlank = target.getAttribute("target") === "_blank";
      const isExternal = href?.startsWith("http") || href?.startsWith("mailto") || href?.startsWith("tel");
      const isHash = href?.startsWith("#") || href?.startsWith("/#");

      if (href && !isTargetBlank && !isExternal && !isHash && href !== pathname) {
        setIsNavigating(true);
        setProgress(35);
        const bumpTimer = setTimeout(() => setProgress(75), 250);
        return () => clearTimeout(bumpTimer);
      }
    };

    window.addEventListener("click", handleAnchorClick, { capture: true });
    return () => window.removeEventListener("click", handleAnchorClick, { capture: true });
  }, [pathname]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-bl shadow-[0_0_12px_rgba(43,180,216,0.8)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "150ms" : "400ms",
        }}
      />
    </div>
  );
}
