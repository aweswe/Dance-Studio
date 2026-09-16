import { formatTime } from '@/lib/utils/format';

/** Backend programme slugs — same as Supabase `programmes.slug`. */
export type BackendProgrammeSlug =
  | 'kids-dance'
  | 'adults-dance'
  | 'mind-body-fitness'
  | 'kuchipudi'
  | 'kuchipudi-classical'
  | 'classical-dance'
  | 'commercial-expressive';

export const SLUG_ACCENT: Record<string, string> = {
  'mind-body-fitness': 'border-l-bl bg-bl/5',
  'kids-dance': 'border-l-[#1DB954] bg-[#1DB954]/5',
  'adults-dance': 'border-l-[#D4A017] bg-[#D4A017]/5',
  kuchipudi: 'border-l-[#8B5CF6] bg-[#8B5CF6]/5',
  'kuchipudi-classical': 'border-l-[#8B5CF6] bg-[#8B5CF6]/5',
  'classical-dance': 'border-l-[#8B5CF6] bg-[#8B5CF6]/5',
  'commercial-expressive': 'border-l-[#D4A017] bg-[#D4A017]/5',
};

export const SLUG_AVATAR: Record<string, string> = {
  'mind-body-fitness': 'bg-bl',
  'kids-dance': 'bg-[#1DB954]',
  'adults-dance': 'bg-[#D4A017]',
  kuchipudi: 'bg-[#8B5CF6]',
  'kuchipudi-classical': 'bg-[#8B5CF6]',
  'classical-dance': 'bg-[#8B5CF6]',
  'commercial-expressive': 'bg-[#D4A017]',
};

export interface ScheduleFilterOption {
  id: string;
  label: string;
}

export interface ScheduleSlot {
  batchId: string;
  time: string;
  timeSort: number;
  name: string;
  subtitle: string;
  instructor: string;
  instructorInitials: string;
  programmeSlug: string;
  programmeName: string;
  duration: string;
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

function minutesFromMidnight(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function durationLabel(start: string, end: string): string {
  const minutes = minutesFromMidnight(end) - minutesFromMidnight(start);
  return `${minutes} min`;
}

function instructorInitials(name: string): string {
  const parts = name.replace(/&.*$/, '').trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Admin batch names use middot separators, e.g. "Kids Dance · Mon–Wed 5–6 PM". */
function splitBatchLabel(batchLabel: string): { title: string; detail: string | null } {
  const parts = batchLabel.split(/\s·\s/);
  if (parts.length >= 2) {
    return { title: parts[0].trim(), detail: parts.slice(1).join(' · ').trim() };
  }
  const dash = batchLabel.split(/\s—\s/);
  if (dash.length >= 2) {
    return { title: dash[0].trim(), detail: dash.slice(1).join(' — ').trim() };
  }
  return { title: batchLabel.trim(), detail: null };
}

export interface BatchLike {
  id?: string;
  days?: string[] | null;
  time_start?: string | null;
  time_end?: string | null;
  status?: string | null;
  name?: string | null;
  batch_title?: string | null;
  programme?: { name?: string; slug?: string } | null;
  instructor?: { name?: string | null } | null;
}

export interface ProgrammeLike {
  slug: string;
  name: string;
  sort_order?: number;
}

/** Filter pills derived from active programmes in Supabase. */
export function buildScheduleFilters(programmes: ProgrammeLike[]): ScheduleFilterOption[] {
  const sorted = [...programmes].sort(
    (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99),
  );
  return [
    { id: 'all', label: 'All Classes' },
    ...sorted.map((p) => ({ id: p.slug, label: p.name })),
  ];
}

/** Build Mon–Sat list from active admin batches — same source as student portal. */
export function buildWeekScheduleFromBatches(batches: BatchLike[]): DaySchedule[] {
  const active = batches.filter((b) => !b.status || b.status === 'active');

  return DAY_ORDER.map((dayFull) => {
    const slots: ScheduleSlot[] = [];

    for (const batch of active) {
      if (!Array.isArray(batch.days) || !batch.days.includes(dayFull)) continue;
      if (!batch.time_start || !batch.time_end) continue;

      const programmeSlug = batch.programme?.slug || 'kids-dance';
      const programmeName = batch.programme?.name || 'Studio batch';
      const batchLabel = batch.name || batch.batch_title || programmeName;
      const { title, detail } = splitBatchLabel(batchLabel);
      const instructor = batch.instructor?.name || 'Faculty';

      slots.push({
        batchId: batch.id ?? `${programmeSlug}-${batch.time_start}-${dayFull}`,
        time: formatTime(batch.time_start),
        timeSort: minutesFromMidnight(batch.time_start),
        name: title,
        subtitle: detail ?? programmeName,
        instructor,
        instructorInitials: instructorInitials(instructor),
        programmeSlug,
        programmeName,
        duration: durationLabel(batch.time_start, batch.time_end),
      });
    }

    slots.sort((a, b) => a.timeSort - b.timeSort);

    return {
      day: DAY_ABBR[dayFull] ?? dayFull.slice(0, 3).toUpperCase(),
      dayFull,
      slots,
    };
  });
}

export function accentForSlug(slug: string): string {
  return SLUG_ACCENT[slug] ?? SLUG_ACCENT['adults-dance'];
}

export function avatarForSlug(slug: string): string {
  return SLUG_AVATAR[slug] ?? SLUG_AVATAR['adults-dance'];
}
