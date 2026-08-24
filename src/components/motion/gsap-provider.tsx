'use client';

import { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once per runtime; idempotent across HMR re-evaluations.
// (gsap.core.globals is not exposed on the public types, hence the cast.)
if (typeof window !== 'undefined' && !(gsap as any).core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

/** Client provider that guarantees ScrollTrigger is registered before any GSAP component mounts. */
export function GsapProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
