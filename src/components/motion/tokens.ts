/**
 * Motion timing tokens — single source of truth for GSAP animations.
 * CSS equivalents live in globals.css (--ease-out-snap ≈ EASE.snap,
 * --ease-scroll ≈ EASE.scroll; durations map to Tailwind bare-number
 * utilities like duration-250).
 */
export const DURATION = {
  /** hover/micro-interactions */
  micro: 0.15,
  /** small transitions, modal enter/exit */
  fast: 0.25,
  /** medium transitions */
  standard: 0.5,
  /** hero/mount entrances */
  entrance: 0.8,
  /** scroll reveals */
  scroll: 0.9,
  /** number count-up beat */
  beat: 1.6,
} as const;

export const EASE = {
  /** default scroll/entrance easing */
  out: 'power3.out',
  /** snappy settle (matches --ease-out-snap) */
  snap: 'power4.out',
  /** long scroll-linked tweens */
  scroll: 'power1.inOut',
  /** number count-up */
  beat: 'power2.out',
} as const;
