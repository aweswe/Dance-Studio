/**
 * Motion-preference helpers.
 *
 * Every GSAP animation in the app gates on prefersMotion(): when the user has
 * requested reduced motion (or JS is unavailable), components render their
 * final, fully-visible state with no animation at all.
 */

export function prefersMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
