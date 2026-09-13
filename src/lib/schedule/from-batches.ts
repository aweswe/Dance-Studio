import { formatTime } from '@/lib/utils/format';

export interface ScheduleSlot {
  time: string;
  name: string;
  instructor: string;
  category: 'urban' | 'classical' | 'fitness' | 'kids';
  level: 'BEG' | 'INT' | 'ADV' | 'PRO';
  programmeSlug: string;
}

export interface DaySchedule {
  day: string;
  dayFull: string;
  slots: ScheduleSlot[];
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

const DAY_ABBR: Record<string, string> = {
  Monday: 'MON',
  Tuesday: 'TUE',
  Wednesday: 'WED',
  Thursday: 'THU',
  Friday: 'FRI',
  Saturday: 'SAT',
};

function programmeCategory(slug: string): ScheduleSlot['category'] {
  if (slug.includes('classical') || slug === 'kuchipudi' || slug === 'kathak') return 'classical';
  if (slug.includes('fitness') || slug.includes('mind-body')) return 'fitness';
  if (slug.includes('kids')) return 'kids';
  return 'urban';
}

function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export interface BatchLike {
  days?: string[] | null;
  time_start: string;
  time_end: string;
  status?: string | null;
  name?: string | null;
  batch_title?: string | null;
  programme?: { name?: string; slug?: string } | null;
  instructor?: { name?: string | null } | null;
}

/** Build Mon–Sat grid from active admin batches. */
export function buildWeekScheduleFromBatches(batches: BatchLike[]): DaySchedule[] {
  const active = batches.filter((b) => !b.status || b.status === 'active');

  return DAY_ORDER.map((dayFull) => {
    const slots: ScheduleSlot[] = [];

    for (const batch of active) {
      if (!Array.isArray(batch.days) || !batch.days.includes(dayFull)) continue;

      const programmeSlug = batch.programme?.slug || 'commercial-expressive';
      slots.push({
        time: formatTimeRange(batch.time_start, batch.time_end),
        name: batch.name || batch.batch_title || batch.programme?.name || 'Studio batch',
        instructor: batch.instructor?.name || 'Faculty',
        category: programmeCategory(programmeSlug),
        level: 'BEG',
        programmeSlug,
      });
    }

    slots.sort((a, b) => a.time.localeCompare(b.time));

    return {
      day: DAY_ABBR[dayFull] ?? dayFull.slice(0, 3).toUpperCase(),
      dayFull,
      slots,
    };
  });
}
