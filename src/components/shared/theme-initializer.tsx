"use client";

import { useLayoutEffect } from "react";

export function ThemeInitializer() {
  useLayoutEffect(() => {
    try {
      localStorage.removeItem("rhythmzz-theme");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    } catch {}
  }, []);

  return null;
}
