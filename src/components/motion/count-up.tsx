'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersMotion } from './reduced-motion';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  /** Final value, e.g. "5000+", "15+", "4" */
  value: string;
  className?: string;
}

function parseValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] };
}

/**
 * Animates a number from 0 to its final value the first time it scrolls into
 * view. Renders the final value in HTML, so no-JS and reduced-motion visitors
 * see the real number.
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { num, suffix } = parseValue(value);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !prefersMotion()) return;

      const counter = { n: 0 };
      gsap.to(counter, {
        n: num,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.n).toLocaleString('en-IN')}${suffix}`;
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
