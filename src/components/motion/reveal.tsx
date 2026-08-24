'use client';

import { useRef, ReactNode, CSSProperties, ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersMotion } from './reduced-motion';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** vertical offset (px) elements start from before revealing */
  y?: number;
  /** per-target delay in seconds (use for sequential grid items) */
  delay?: number;
  /** when set, staggers the direct children of the wrapper */
  stagger?: number;
  /** re-trigger on every scroll into view, or once only (default) */
  once?: boolean;
  /** render as a different element */
  as?: ElementType;
}

/**
 * Scroll-triggered fade/slide reveal. Without motion preference it renders
 * children visible immediately; with motion it slides them up once when they
 * enter the viewport.
 */
export function Reveal({
  children,
  className,
  style,
  y = 28,
  delay = 0,
  stagger,
  once = true,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!prefersMotion() || !ref.current) return;

      // Stagger mode animates the wrapper's direct children (grid cards).
      const targets =
        stagger !== undefined && ref.current.children.length > 0
          ? Array.from(ref.current.children)
          : [ref.current];

      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay,
          stagger: stagger ?? 0,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            once,
          },
        },
      );
    },
    { scope: ref },
  );

  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className} style={style}>
      {children}
    </Comp>
  );
}
