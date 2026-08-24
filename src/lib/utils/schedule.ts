import { formatTime } from '@/lib/utils/format';

const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat',
};

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Reference defaults, used when Supabase has no matching batch (or is unconfigured).
export const FALLBACK_SCHEDULES: Record<string, { days: string; time: string; instructor: string }> = {
  'kids-dance': { days: 'Mon – Wed', time: '5:00 PM – 7:00 PM', instructor: 'Deepak' },
  'adults-dance': { days: 'Mon – Wed', time: '7:00 PM – 9:00 PM', instructor: 'Nitish' },
  'mind-body-fitness': { days: 'Mon – Fri', time: '9:30 AM – 10:30 AM', instructor: 'Shailaja' },
  'kuchipudi': { days: 'Fri · Sat', time: '6:30 PM – 7:30 PM', instructor: 'Srusti' },
};

/** "Mon · Wed" for scattered days, "Mon – Wed" for a consecutive run. */
function collapseDays(days: string[]): string {
  if (days.length === 0) return '';
  if (days.length > 2) {
    const idx = days.map((d) => DAY_ORDER.indexOf(d));
    const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
    if (consecutive) return `${DAY_SHORT[days[0]]} – ${DAY_SHORT[days[days.length - 1]]}`;
  }
  return days.map((d) => DAY_SHORT[d] ?? d).join(' · ');
}

/** Resolve a programme's class window from its batches (all batches aggregated),
 *  falling back to reference defaults. */
export function scheduleFor(prog: any, batches: any[]) {
  const own = (batches ?? []).filter((b) => b.programme?.slug === prog.slug);
  if (own.length > 0) {
    const starts = own.map((b) => b.time_start).filter(Boolean).sort();
    const ends = own.map((b) => b.time_end).filter(Boolean).sort();
    const days = Array.isArray(own[0].days) ? collapseDays(own[0].days) : own[0].days;
    const instructors = [...new Set(own.map((b) => b.instructor?.name).filter(Boolean))];
    return {
      days,
      time: `${formatTime(starts[0])} – ${formatTime(ends[ends.length - 1])}`,
      instructor: instructors.join(' & '),
    };
  }
  return FALLBACK_SCHEDULES[prog.slug];
}
