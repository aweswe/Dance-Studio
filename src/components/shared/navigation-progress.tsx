"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Global helper to trigger action loader with a custom message anywhere in the app
 * (e.g. triggerActionLoader("Logging out · Redirecting to Home..."))
 */
export function triggerActionLoader(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app:action-loading", { detail: { message } })
    );
  }
}

function resolveNavigationLabel(href: string, linkText?: string): string {
  const cleanHref = href.split("?")[0].replace(/\/$/, "") || "/";

  // Specific high-frequency destinations
  if (cleanHref === "" || cleanHref === "/") return "Redirecting to Home...";
  if (cleanHref === "/auth/signout") return "Logging out · Redirecting to Home...";
  if (cleanHref === "/login" || cleanHref === "/admin-login") return "Redirecting to Login...";

  // Admin section
  if (cleanHref.includes("/admin/students")) return "Loading Students Directory...";
  if (cleanHref.includes("/admin/attendance")) return "Loading Attendance Records...";
  if (cleanHref.includes("/admin/fees")) return "Loading Fees Management...";
  if (cleanHref.includes("/admin/classes")) return "Loading Classes & Batches...";
  if (cleanHref.includes("/admin/instructors")) return "Loading Instructors...";
  if (cleanHref.includes("/admin/enquiries")) return "Loading Enquiries...";
  if (cleanHref.includes("/admin/gallery")) return "Loading Studio Gallery...";
  if (cleanHref.includes("/admin/content")) return "Loading Studio Content...";
  if (cleanHref.includes("/admin/broadcast")) return "Loading WhatsApp Broadcast...";
  if (cleanHref.includes("/admin")) return "Opening Admin Portal...";

  // Student portal
  if (cleanHref.includes("/student/fees")) return "Loading Fees & Receipts...";
  if (cleanHref.includes("/student/attendance")) return "Loading Attendance Records...";
  if (cleanHref.includes("/student/classes")) return "Loading Classes & Batches...";
  if (cleanHref.includes("/student/notices")) return "Loading Notices & Updates...";
  if (cleanHref.includes("/student/progress")) return "Loading Dance Progress...";
  if (cleanHref.includes("/student/profile")) return "Opening Student Profile...";
  if (cleanHref.includes("/student")) return "Opening Student Dashboard...";

  // Instructor portal
  if (cleanHref.includes("/instructor/classes")) return "Loading Instructor Classes...";
  if (cleanHref.includes("/instructor/attendance")) return "Opening Attendance Sheet...";
  if (cleanHref.includes("/instructor/students")) return "Opening Student Roster...";
  if (cleanHref.includes("/instructor")) return "Opening Instructor Portal...";

  // Public sections
  if (cleanHref.includes("/kuchipudi")) return "Opening Kuchipudi Master Syllabus...";
  if (cleanHref.includes("/programmes")) return "Loading Programmes...";
  if (cleanHref.includes("/about")) return "Opening About Rhythmzz...";
  if (cleanHref.includes("/contact")) return "Opening Contact & Location...";
  if (cleanHref.includes("/enrol")) return "Opening Enrolment & Free Trial...";
  if (cleanHref.includes("/gallery")) return "Loading Gallery Photos...";
  if (cleanHref.includes("/blog")) return "Loading Academy Stories...";
  if (cleanHref.includes("/studio-rental")) return "Opening Studio Rental...";

  // Contextual fallback from text
  const trimmed = linkText?.trim();
  if (trimmed && trimmed.length > 2 && trimmed.length < 30) {
    return `Opening ${trimmed}...`;
  }

  return "Loading page...";
}

/**
 * Instant Action & Navigation Progress Bar with Dynamic Status Pill.
 * Provides immediate (<0ms) visual confirmation for all navigations and actions
 * (e.g. "Logging out · Redirecting to Home...", "Opening Students Directory...").
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [actionLabel, setActionLabel] = useState<string>("Loading page...");

  // Path change -> complete bar and fade out pill
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Click & Submit interception
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const isTargetBlank = target.getAttribute("target") === "_blank";
      const isExternal =
        href?.startsWith("http://") ||
        href?.startsWith("https://") ||
        href?.startsWith("mailto:") ||
        href?.startsWith("tel:");
      const isHash = href?.startsWith("#") || href?.startsWith("/#");

      if (href && !isTargetBlank && !isExternal && !isHash && href !== pathname) {
        const text = target.textContent?.replace(/\s+/g, " ") || "";
        const label = resolveNavigationLabel(href, text);

        setActionLabel(label);
        setIsNavigating(true);
        setProgress(35);
        const bumpTimer = setTimeout(() => setProgress(75), 200);
        return () => clearTimeout(bumpTimer);
      }
    };

    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (!form) return;

      const action = form.getAttribute("action") || "";
      if (action.includes("/auth/signout")) {
        setActionLabel("Logging out · Redirecting to Home...");
        setIsNavigating(true);
        setProgress(50);
        const bump = setTimeout(() => setProgress(85), 200);
        return () => clearTimeout(bump);
      }
    };

    const handleCustomAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message || "Processing...";
      setActionLabel(msg);
      setIsNavigating(true);
      setProgress(45);
      const bump = setTimeout(() => setProgress(80), 200);
      return () => clearTimeout(bump);
    };

    window.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("submit", handleFormSubmit, { capture: true });
    window.addEventListener("app:action-loading", handleCustomAction as EventListener);

    return () => {
      window.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("submit", handleFormSubmit, { capture: true });
      window.removeEventListener("app:action-loading", handleCustomAction as EventListener);
    };
  }, [pathname]);

  if (!isNavigating && progress === 0) return null;

  const isAuthOrLogout =
    actionLabel.toLowerCase().includes("logging out") ||
    actionLabel.toLowerCase().includes("signing out") ||
    actionLabel.toLowerCase().includes("redirecting to home") ||
    actionLabel.toLowerCase().includes("redirecting to login") ||
    actionLabel.toLowerCase().includes("auth");

  return (
    <>
      {/* Top glowing progress line */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3.5px] z-[999999] pointer-events-none bg-transparent"
      >
        <div
          className="h-full bg-gradient-to-r from-bl via-cyan-300 to-bl-deep shadow-[0_0_15px_rgba(43,180,216,0.9)] transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: progress === 100 ? "150ms" : "350ms",
          }}
        />
      </div>

      {isAuthOrLogout ? (
        /* Mid-Screen Centered Auth Redirect / Logout Loading Skeleton */
        <div
          aria-live="assertive"
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-blk/80 backdrop-blur-md p-4 animate-in fade-in duration-200 pointer-events-auto"
        >
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-surface border border-line-strong shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-bl/20 border-t-bl animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-bl font-display font-black text-xl">
                R
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink font-display tracking-wide">
                {actionLabel.toLowerCase().includes("out") ? "Signing Out..." : "Redirecting..."}
              </h3>
              <p className="text-xs text-ink-2 mt-1.5 font-medium">
                {actionLabel}
              </p>
            </div>
            {/* Animated accent line */}
            <div className="w-36 h-1 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-bl animate-pulse" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      ) : (
        /* Floating Top Action Pill for standard navigations */
        <div
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none transition-all duration-300 transform translate-y-0 opacity-100"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-blk/90 dark:bg-surface/95 text-white dark:text-ink text-xs font-semibold tracking-wide border border-bl/40 dark:border-line-strong shadow-2xl backdrop-blur-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-bl shrink-0" />
            <span>{actionLabel}</span>
          </div>
        </div>
      )}
    </>
  );
}
