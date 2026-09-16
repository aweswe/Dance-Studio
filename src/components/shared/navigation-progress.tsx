"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

/**
 * Navigation & Action Handler.
 * NOTE: Standard anchor clicks and navbar navigations are instant and do NOT show
 * any intrusive loading pills, spinners, or labels.
 * Only explicit auth/signout events trigger an action state.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [actionLabel, setActionLabel] = useState<string>("");

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setActionLabel("");
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, isNavigating]);

  useEffect(() => {
    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (!form) return;

      const action = form.getAttribute("action") || "";
      if (action.includes("/auth/signout")) {
        setActionLabel("Logging out · Redirecting to Home...");
        setIsNavigating(true);
      }
    };

    const handleCustomAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message;
      if (msg) {
        setActionLabel(msg);
        setIsNavigating(true);
      }
    };

    window.addEventListener("submit", handleFormSubmit, { capture: true });
    window.addEventListener("app:action-loading", handleCustomAction as EventListener);

    return () => {
      window.removeEventListener("submit", handleFormSubmit, { capture: true });
      window.removeEventListener("app:action-loading", handleCustomAction as EventListener);
    };
  }, []);

  if (!isNavigating || !actionLabel) return null;

  const isAuthOrLogout =
    actionLabel.toLowerCase().includes("logging out") ||
    actionLabel.toLowerCase().includes("signing out") ||
    actionLabel.toLowerCase().includes("redirecting");

  if (!isAuthOrLogout) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 pointer-events-auto"
    >
      <div className="flex flex-col items-center justify-center p-8 rounded-md bg-surface border border-line shadow-2xl max-w-sm w-full text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-bl/20 border-t-bl animate-spin" />
          <span className="absolute inset-0 flex items-center justify-center text-bl font-anton text-xl">
            R
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-ink font-anton tracking-wide uppercase">
            {actionLabel.toLowerCase().includes("out") ? "Signing Out..." : "Redirecting..."}
          </h3>
          <p className="text-xs text-ink-2 mt-1.5 font-medium">
            {actionLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
