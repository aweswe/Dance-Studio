'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersMotion } from './reduced-motion';
import { DURATION, EASE } from './tokens';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  /** Final value, e.g. "5000+", "15+", "4" */
  value: string;
  className?: string;
}

function parseValue(value: string): { prefix: string; num: number; suffix: string } {
  // "5000+", "₹12,000", "92%" — capture any leading non-digit prefix (currency)
  const match = value.match(/^([^0-9]*)([\d,]+)(.*)$/);
  if (!match) return { prefix: '', num: 0, suffix: value };
  return { prefix: match[1], num: parseInt(match[2].replace(/,/g, ''), 10), suffix: match[3] };
}

/**
 * Animates a number from 0 to its final value the first time it scrolls into
 * view. Renders the final value in HTML, so no-JS and reduced-motion visitors
 * see the real number.
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { prefix, num, suffix } = parseValue(value);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !prefersMotion()) return;

      const counter = { n: 0 };
      gsap.to(counter, {
        n: num,
        duration: DURATION.beat,
        ease: EASE.beat,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(counter.n).toLocaleString('en-IN')}${suffix}`;
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
