import { formatTime } from '@/lib/utils/format';
import { getBatches, DEFAULT_BATCHES } from '@/data/batches';

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

export function instructorInitials(name: string): string {
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
      const instructor = batch.instructor?.name || 'Academy Faculty';

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

export interface ProgrammeScheduleBatch {
  id: string;
  name: string;
  programmeSlug: string;
  programmeName: string;
  days: string[];
  daysDisplay: string;
  daysShort: string;
  time_start: string;
  time_end: string;
  timeDisplay: string;
  duration: string;
  trainer: {
    name: string;
    initials: string;
    photoUrl: string | null;
    role: string;
  };
  capacity?: number;
  enrolledCount?: number;
  status: string;
}

export function formatDaysDisplay(days: string[]): string {
  if (!Array.isArray(days) || days.length === 0) return 'Flexible Schedule';
  return days.join(', ');
}

export function formatDaysShort(days: string[]): string {
  if (!Array.isArray(days) || days.length === 0) return 'Flexible';
  if (days.length === 5 && days.includes('Monday') && days.includes('Friday')) return 'Mon–Fri';
  if (days.length === 3 && days.includes('Monday') && days.includes('Wednesday')) return 'Mon–Wed';
  if (days.length === 2 && days.includes('Monday') && days.includes('Wednesday')) return 'Mon & Wed';
  if (days.length === 2 && days.includes('Thursday') && days.includes('Saturday')) return 'Thu & Sat';
  if (days.length === 2 && days.includes('Friday') && days.includes('Saturday')) return 'Fri & Sat';
  if (days.length === 1) return days[0];
  return days.map((d) => DAY_ABBR[d] || d.slice(0, 3)).join(', ');
}

/**
 * Filter and format active batches for a programme directly from the schedule source,
 * extracting complete trainer names, timings, duration, days, and initials.
 */
export function getProgrammeActiveBatches(
  slug: string,
  batches: BatchLike[],
): ProgrammeScheduleBatch[] {
  const normSlug = slug.toLowerCase();

  const matchesSlug = (b: BatchLike) => {
    if (b.status && b.status !== 'active') return false;
    const progSlug = (b.programme?.slug ?? '').toLowerCase();
    const batchName = (b.name ?? b.batch_title ?? '').toLowerCase();

    if (normSlug === 'kids-dance') {
      return (progSlug === 'kids-dance' || batchName.includes('kids')) && !batchName.includes('adult');
    }
    if (normSlug === 'adults-dance') {
      return (progSlug === 'adults-dance' || batchName.includes('adult')) && !batchName.includes('kids');
    }
    if (normSlug === 'mind-body-fitness') {
      return (
        progSlug === 'mind-body-fitness' ||
        batchName.includes('fitness') ||
        batchName.includes('zumba') ||
        batchName.includes('yoga')
      );
    }
    if (normSlug === 'gymnastics' || normSlug === 'gymnastic') {
      return (
        progSlug === 'gymnastics' ||
        progSlug === 'gymnastic' ||
        batchName.includes('gymnastic') ||
        batchName.includes('tumbling')
      );
    }
    if (normSlug === 'kuchipudi' || normSlug === 'classical-dance') {
      return (
        progSlug === 'kuchipudi' ||
        progSlug === 'classical-dance' ||
        progSlug === 'kuchipudi-classical' ||
        batchName.includes('kuchipudi')
      );
    }
    return progSlug === normSlug;
  };

  let matched = (batches ?? []).filter(matchesSlug);

  // Fallback to default batches if DB has no batches for this programme
  if (matched.length === 0) {
    matched = DEFAULT_BATCHES.filter(matchesSlug);
  }

  // Sort chronologically by start time
  matched.sort((a, b) => {
    const timeA = a.time_start || '00:00:00';
    const timeB = b.time_start || '00:00:00';
    return minutesFromMidnight(timeA) - minutesFromMidnight(timeB);
  });

  return matched.map((batch) => {
    const rawDays = Array.isArray(batch.days) ? batch.days : [];
    const timeStart = batch.time_start || '17:00:00';
    const timeEnd = batch.time_end || '18:00:00';

    const defaultMatch = DEFAULT_BATCHES.find(
      (d) =>
        d.id === batch.id ||
        ((d.programme?.slug === normSlug || d.programme?.slug === (batch.programme?.slug ?? '').toLowerCase()) &&
          d.time_start === timeStart) ||
        (d.name && batch.name && d.name.toLowerCase() === batch.name.toLowerCase()),
    );

    const instructorName =
      batch.instructor?.name?.trim() ||
      defaultMatch?.instructor?.name?.trim() ||
      (normSlug === 'mind-body-fitness'
        ? 'Fitness Faculty'
        : normSlug === 'kuchipudi'
        ? 'Guru Srushti Nidhi'
        : 'Academy Faculty');

    const trainerRole =
      normSlug === 'kuchipudi'
        ? 'Classical Guru'
        : normSlug === 'mind-body-fitness'
        ? 'Fitness Faculty'
        : normSlug === 'gymnastics' || normSlug === 'gymnastic'
        ? 'Acrobatics Coach'
        : 'Dance Faculty';

    const photoUrl =
      (batch.instructor as any)?.photo_url ||
      defaultMatch?.instructor?.photo_url ||
      null;

    return {
      id: batch.id || `${slug}-${timeStart}`,
      name: batch.name || batch.batch_title || `${batch.programme?.name || 'Studio'} Cohort`,
      programmeSlug: batch.programme?.slug || slug,
      programmeName: batch.programme?.name || 'Studio Batch',
      days: rawDays,
      daysDisplay: formatDaysDisplay(rawDays),
      daysShort: formatDaysShort(rawDays),
      time_start: timeStart,
      time_end: timeEnd,
      timeDisplay: `${formatTime(timeStart)} – ${formatTime(timeEnd)}`,
      duration: durationLabel(timeStart, timeEnd),
      trainer: {
        name: instructorName,
        initials: instructorInitials(instructorName),
        photoUrl,
        role: trainerRole,
      },
      capacity: (batch as any).capacity ?? 25,
      enrolledCount: (batch as any).enrolled_count ?? 0,
      status: batch.status || 'active',
    };
  });
}

/**
 * Public async function to fetch active batches directly from the schedule source
 * with complete trainer, timing, and date details.
 */
export async function getProgrammeSchedule(
  slug: string,
  existingBatches?: BatchLike[],
): Promise<ProgrammeScheduleBatch[]> {
  const sourceBatches =
    existingBatches && existingBatches.length > 0 ? existingBatches : await getBatches();
  return getProgrammeActiveBatches(slug, sourceBatches);
}
