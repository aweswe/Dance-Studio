'use client';

import { useRef, ReactNode, CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersMotion } from './reduced-motion';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Gentle scroll-linked drift for decorative background layers (hero orbs).
 * Purely cosmetic: aria-hidden by default, inert under reduced motion.
 */
export function Parallax({ children, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!prefersMotion() || !ref.current) return;

      gsap.fromTo(
        ref.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current.parentElement ?? ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={style} aria-hidden="true">
      {children}
    </div>
  );
}
