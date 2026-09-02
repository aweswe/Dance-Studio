"use client";

import { useLayoutEffect } from "react";

export function ThemeInitializer() {
  useLayoutEffect(() => {
    try {
      const t = localStorage.getItem("rhythmzz-theme");
      if (t === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      }
    } catch {}
  }, []);

  return null;
}
