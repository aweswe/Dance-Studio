'use client';

import { useRef, ReactNode, CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersMotion } from './reduced-motion';
import { DURATION, EASE } from './tokens';

interface EntranceProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** seconds before the entrance starts */
  delay?: number;
  /** stagger between the wrapper's direct children */
  stagger?: number;
}

/**
 * One-time entrance on mount — for hero taglines, CTAs and scroll hints.
 * Never used on the LCP elements (logo, H1): those render with zero animation.
 */
export function Entrance({ children, className, style, delay = 0.15, stagger = 0.08 }: EntranceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!prefersMotion() || !ref.current) return;

      const targets =
        ref.current.children.length > 0 ? Array.from(ref.current.children) : [ref.current];

      gsap.fromTo(
        targets,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.entrance,
          ease: EASE.out,
          delay,
          stagger,
          clearProps: 'transform',
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
