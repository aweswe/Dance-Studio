'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  accentForSlug,
  avatarForSlug,
  type DaySchedule,
  type ScheduleFilterOption,
} from '@/lib/schedule/from-batches';
import { enrolHref } from '@/lib/utils/constants';

interface ProgrammeClassesListProps {
  weekDays: DaySchedule[];
  filters: ScheduleFilterOption[];
  showLegend?: boolean;
}

function filterDays(weekDays: DaySchedule[], programmeSlug: string) {
  return weekDays
    .map((day) => ({
      ...day,
      slots:
        programmeSlug === 'all'
          ? day.slots
          : day.slots.filter((slot) => slot.programmeSlug === programmeSlug),
    }))
    .filter((day) => day.slots.length > 0);
}

function ClassRow({ slot }: { slot: DaySchedule['slots'][number] }) {
  const bookLabel =
    slot.programmeSlug === 'kuchipudi' || slot.programmeSlug === 'kuchipudi-classical'
      ? 'Enrol'
      : 'Book';

  return (
    <Link
      href={enrolHref({ programme: slot.programmeSlug, intent: 'trial' })}
      className={`group grid grid-cols-[72px_1fr] sm:grid-cols-[88px_1fr_132px_88px_96px] items-center gap-x-4 gap-y-2 px-4 sm:px-5 py-3.5 sm:py-4 bg-surface border-l-4 transition-colors ${accentForSlug(slot.programmeSlug)}`}
    >
      <p className="text-xs font-semibold text-ink tabular-nums">{slot.time}</p>

      <div className="min-w-0 col-span-1 sm:col-span-1">
        <p className="font-anton text-base sm:text-lg uppercase tracking-wide text-ink leading-tight group-hover:text-bl transition-colors">
          {slot.name}
        </p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-2 line-clamp-1">
          {slot.subtitle}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2.5 min-w-0">
        <div
          className={`size-8 shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${avatarForSlug(slot.programmeSlug)}`}
        >
          {slot.instructorInitials}
        </div>
        <p className="text-xs font-medium text-ink-2 truncate">{slot.instructor}</p>
      </div>

      <p className="hidden sm:block text-xs font-mono text-ink-2">{slot.duration}</p>

      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-bl group-hover:text-bl-deep transition-colors justify-self-end">
        {bookLabel}
        <ArrowUpRight size={12} strokeWidth={2.5} />
      </span>

      <div className="sm:hidden col-span-2 flex items-center justify-between gap-3 pt-1 border-t border-line/60">
        <p className="text-[11px] text-ink-2">
          {slot.instructor} · {slot.duration}
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-bl">
          {bookLabel}
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

export function ProgrammeClassesList({
  weekDays,
  filters,
  showLegend = true,
}: ProgrammeClassesListProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const visibleDays = useMemo(
    () => filterDays(weekDays, activeFilter),
    [weekDays, activeFilter],
  );

  const legendItems = filters.filter((f) => f.id !== 'all');

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3.5 py-2 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer active:scale-[0.98] ${
              activeFilter === filter.id
                ? 'bg-blk text-white'
                : 'bg-surface text-ink-2 ring-1 ring-line hover:text-ink hover:ring-ink/20'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 sm:space-y-8">
        {visibleDays.length > 0 ? (
          visibleDays.map((day) => (
            <div key={day.dayFull}>
              <p className="font-anton text-lg sm:text-xl uppercase tracking-[0.12em] text-ink pb-2.5 mb-0.5 border-b-2 border-bl">
                {day.dayFull}
              </p>
              <div className="flex flex-col gap-px bg-line border border-line overflow-hidden rounded-md">
                {day.slots.map((slot) => (
                  <ClassRow key={`${day.dayFull}-${slot.batchId}`} slot={slot} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-line bg-surface px-6 py-12 text-center">
            <p className="text-sm text-ink-2">No batches match this filter right now.</p>
          </div>
        )}
      </div>

      {showLegend && legendItems.length > 0 ? (
        <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5 text-[11px] text-ink-2">
          <span className="font-semibold uppercase tracking-[0.12em]">Key</span>
          {legendItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${avatarForSlug(item.id)}`} />
              <span>{item.label}</span>
            </div>
          ))}
          <p className="sm:ml-auto text-xs leading-relaxed">
            Fitness timings rotate weekly ·{' '}
            <a
              href="https://wa.me/919052980859"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bl font-semibold hover:text-bl-deep transition-colors"
            >
              WhatsApp us
            </a>{' '}
            for exact slots
          </p>
        </div>
      ) : null}
    </div>
  );
}
