import { cn } from '@/lib/utils/cn';

/** Shared homepage CTA tiers — hero, pricing, and lower sections. */

/** Minimal shared radius — buttons, cards, media, controls, FAQ. */
export const homepageRadius = 'rounded-md';

/** @deprecated Use homepageRadius — kept for existing imports. */
export const homepageControlRadius = homepageRadius;
export const homepageCardRadius = homepageRadius;
export const homepageMediaRadius = homepageRadius;

/** Hero video + matching portrait media — rounded frame, transparent border */
export const homepageMediaFrame =
  'overflow-hidden rounded-md border border-transparent bg-transparent';

const homepageCtaBase =
  'inline-flex items-center justify-center gap-1.5 box-border min-h-[44px] h-11 px-5 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] transition-colors active:scale-[0.98] touch-manipulation whitespace-nowrap';

export const homepageCtaPrimary = [
  homepageCtaBase,
  'bg-white text-blk hover:bg-bl',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
].join(' ');

export const homepageCtaOutlineDark = [
  homepageCtaBase,
  'text-white ring-1 ring-white/35 bg-white/[0.06] hover:bg-white/[0.1] hover:ring-white/50',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
].join(' ');

/** Cyan fill — dark sections (Our Story, reference .btn-bl). */
export const homepageCtaBrand = [
  homepageCtaBase,
  'bg-bl text-blk hover:bg-bl-deep shadow-[0_6px_28px_-8px_rgba(43,180,216,0.45)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-blk',
].join(' ');

export const homepageCtaOutlineLight = [
  homepageCtaBase,
  'text-ink ring-1 ring-ink/15 bg-ink/[0.04] hover:bg-ink/[0.08] hover:ring-ink/30',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
].join(' ');

export const homepageCtaWhatsApp = [
  homepageCtaBase,
  'text-[#25D366] ring-1 ring-[#25D366]/35 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white hover:ring-[#25D366]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
].join(' ');

/** Two CTAs side-by-side (sm+) or stacked — equal width columns. */
export const homepageCtaPair = 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full sm:max-w-[29rem]';

/** Centered pair block (CTA sections). */
export const homepageCtaPairCentered = `${homepageCtaPair} sm:mx-auto`;

/** Stacked pair — full width of parent, equal button widths. */
export const homepageCtaPairStack = 'grid grid-cols-1 gap-2.5 w-full';

/** Every button inside a pair — stretch to column width, same height via homepageCtaBase. */
export const homepageCtaPairButton = 'w-full';

/** Filter / tab pills — visible border on all; cyan hint when selected */
export const homepageFilterPillBase =
  'rounded-md border font-bold uppercase transition-colors cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

/** Selected — cyan border hint; readable on light and dark canvas */
export const homepageFilterPillActive =
  'border-bl bg-bl/10 text-ink dark:text-white shadow-[0_0_0_1px_rgba(43,180,216,0.35)]';

/** Unselected — always show border so pills don’t vanish on dark sections */
export const homepageFilterPillInactive =
  'border-line bg-transparent text-ink-2 hover:text-ink hover:border-ink/25';

export function homepageFilterPill(active: boolean, className?: string) {
  return cn(
    homepageFilterPillBase,
    'px-3.5 py-2 text-[10px] tracking-[0.12em]',
    active ? homepageFilterPillActive : homepageFilterPillInactive,
    className,
  );
}

export function homepageFilterPillMd(active: boolean, className?: string) {
  return cn(
    homepageFilterPillBase,
    'shrink-0 py-2 px-4.5 text-[11px] tracking-[1.5px]',
    active ? homepageFilterPillActive : homepageFilterPillInactive,
    className,
  );
}
