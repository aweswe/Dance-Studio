"use client";

import { useLayoutEffect } from "react";

export function ThemeInitializer() {
  useLayoutEffect(() => {
    try {
      const t = localStorage.getItem("rhythmzz-theme");
      if (t === "dark") {
        localStorage.setItem("rhythmzz-theme", "light");
      }
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    } catch {}
  }, []);

  return null;
}
