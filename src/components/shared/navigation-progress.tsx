"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Global helper to trigger action loader modal with a custom message anywhere in the app
 * (e.g. triggerActionLoader("Signing out..."))
 */
export function triggerActionLoader(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app:action-loading", { detail: { message } })
    );
  }
}

/**
 * Global helper to dismiss the action loader modal
 */
export function dismissActionLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:action-dismiss"));
  }
}

/**
 * Global helper to immediately start the top navigation progress bar
 */
export function triggerTopProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:route-start"));
  }
}

/**
 * Global helper to immediately complete the top navigation progress bar
 */
export function completeTopProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:route-complete"));
  }
}

/**
 * NavigationProgress Component
 * Renders:
 * 1. A slim, radiant top loading bar that triggers on ANY internal navigation or link click.
 * 2. An accessible, high-contrast action modal overlay for explicit operations like Login and Logout.
 */
export function NavigationProgress() {
  const pathname = usePathname();

  // Top progress bar state
  const [progress, setProgress] = useState<number>(0);
  const [isTopActive, setIsTopActive] = useState<boolean>(false);
  const [topVisible, setTopVisible] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Action modal overlay state
  const [actionLabel, setActionLabel] = useState<string>("");
  const [isActionActive, setIsActionActive] = useState<boolean>(false);
  const actionShownAtRef = useRef<number>(0);

  const startTopBar = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTopVisible(true);
    setIsTopActive(true);
    setProgress(15);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) return prev + 12;
        if (prev < 65) return prev + 6;
        if (prev < 85) return prev + 2;
        if (prev < 94) return prev + 0.5;
        return prev;
      });
    }, 150);
  }, []);

  const finishTopBar = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(100);
    setIsTopActive(false);

    const timer = setTimeout(() => {
      setTopVisible(false);
      setProgress(0);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // When pathname changes, complete top progress bar & clean up non-auth action loader
  useEffect(() => {
    finishTopBar();

    if (isActionActive) {
      const elapsed = Date.now() - actionShownAtRef.current;
      const remaining = Math.max(0, 400 - elapsed);
      const timer = setTimeout(() => {
        // Do not auto-dismiss signout because page will hard unload to home
        if (!actionLabel.toLowerCase().includes("out")) {
          setIsActionActive(false);
          setActionLabel("");
        }
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [pathname, finishTopBar, isActionActive, actionLabel]);

  // Global listeners for navigation clicks, form submit, and custom events
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, hash, protocols, and new tab links
      if (
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        href.startsWith("javascript:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // If domain is external, skip
      if (href.startsWith("http://") || href.startsWith("https://")) {
        try {
          const parsed = new URL(href);
          if (parsed.origin !== window.location.origin) return;
        } catch {
          return;
        }
      }

      // If navigating to the exact same page & search, skip
      try {
        const dest = new URL(anchor.href, window.location.href);
        if (
          dest.pathname === window.location.pathname &&
          dest.search === window.location.search
        ) {
          return;
        }
      } catch {}

      startTopBar();
    };

    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (!form) return;

      const action = form.getAttribute("action") || "";
      if (action.includes("/auth/signout")) {
        actionShownAtRef.current = Date.now();
        setActionLabel("Signing out of your session...");
        setIsActionActive(true);
      }
    };

    const handleActionLoading = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message;
      if (msg) {
        actionShownAtRef.current = Date.now();
        setActionLabel(msg);
        setIsActionActive(true);
        startTopBar();
      }
    };

    const handleActionDismiss = () => {
      setIsActionActive(false);
      setActionLabel("");
      finishTopBar();
    };

    const handleRouteStart = () => {
      startTopBar();
    };

    const handleRouteComplete = () => {
      finishTopBar();
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("submit", handleFormSubmit, { capture: true });
    window.addEventListener("app:action-loading", handleActionLoading as EventListener);
    window.addEventListener("app:action-dismiss", handleActionDismiss);
    window.addEventListener("app:route-start", handleRouteStart);
    window.addEventListener("app:route-complete", handleRouteComplete);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("submit", handleFormSubmit, { capture: true });
      window.removeEventListener("app:action-loading", handleActionLoading as EventListener);
      window.removeEventListener("app:action-dismiss", handleActionDismiss);
      window.removeEventListener("app:route-start", handleRouteStart);
      window.removeEventListener("app:route-complete", handleRouteComplete);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTopBar, finishTopBar]);

  return (
    <>
      {/* 1. Slim radiant top loading progress bar */}
      {topVisible && (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Navigation progress"
          className="fixed top-0 left-0 right-0 z-[9999999] pointer-events-none h-[3px] bg-transparent"
        >
          <div
            className="h-full bg-gradient-to-r from-bl via-sky-400 to-emerald-400 shadow-[0_0_12px_rgba(0,153,255,0.85)] transition-all ease-out"
            style={{
              width: `${progress}%`,
              transitionDuration: isTopActive ? "220ms" : "150ms",
              opacity: topVisible ? 1 : 0,
            }}
          />
        </div>
      )}

      {/* 2. High-contrast action modal overlay */}
      {isActionActive && actionLabel && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-live="assertive"
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 pointer-events-auto"
        >
          <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-surface border border-line shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-[3px] border-line border-t-bl animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-bl font-anton text-2xl">
                R
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-ink font-anton tracking-wide uppercase">
                {actionLabel.toLowerCase().includes("out")
                  ? "Signing Out..."
                  : actionLabel.toLowerCase().includes("in")
                  ? "Signing In..."
                  : "Please Wait..."}
              </h3>
              <p className="text-xs text-ink-2 font-medium">
                {actionLabel}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
