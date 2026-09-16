'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { homepageFilterPillMd } from '@/lib/ui/homepage-cta';
import { formatTime } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';

interface ScheduleFilterProps {
  batches: any[];
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const THEME_BORDER: Record<string, string> = {
  'mind-body-fitness': 'border-l-bl',
  'kids-dance': 'border-l-green',
  'adults-dance': 'border-l-gold',
  'kuchipudi': 'border-l-purp',
};

const PROGRAMME_ICONS: Record<string, string> = {
  'mind-body-fitness': '/images/studio-training/floorwork-stretch.jpg',
  'kids-dance': '/images/studio-training/group-circle-drill.jpg',
  'adults-dance': '/images/studio-training/contemporary-conditioning.jpg',
  'kuchipudi': '/images/kuchipudi/kuchipudi-natyarambham-posture.jpg',
};

function durationLabel(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const hours = eh - sh + (em - sm) / 60;
  return hours === 1 ? '1 hr' : `${hours} hrs`;
}

export function ScheduleFilter({ batches }: ScheduleFilterProps) {
  const [activeDay, setActiveDay] = useState<string>('All');
  const days = ['All', ...DAY_ORDER];

  const filteredBatches = activeDay === 'All'
    ? batches
    : batches.filter((b) => Array.isArray(b.days) && b.days.includes(activeDay));

  // Group each batch under its first class day so "All" view reads like a week.
  const grouped = DAY_ORDER.map((day) => ({
    day,
    batches: filteredBatches.filter((b) => Array.isArray(b.days) && b.days[0] === day),
  })).filter((g) => g.batches.length > 0);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:flex-wrap mb-6 sm:mb-8" role="group" aria-label="Filter classes by day">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveDay(day)}
            aria-pressed={activeDay === day}
            className={homepageFilterPillMd(activeDay === day)}
          >
            {day}
          </button>
        ))}
      </div>

      {grouped.length > 0 ? (
        <div className="flex flex-col gap-8">
          {grouped.map(({ day, batches: dayBatches }) => (
            <div key={day} className="bg-surface rounded-md p-4 sm:p-5 md:p-6 border border-line shadow-sm">
              <h3 className="heading-display text-xl sm:text-2xl tracking-[1px] text-ink pb-3 border-b border-line mb-3 flex items-center justify-between">
                <span>{day}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-2 font-body">
                  {dayBatches.length} {dayBatches.length === 1 ? 'Batch' : 'Batches'}
                </span>
              </h3>
              <div className="divide-y divide-line/60">
                {dayBatches.map((batch, i) => {
                  const slotsLeft = (batch.capacity ?? 0) - (batch.enrolled_count ?? 0);
                  const thumb = PROGRAMME_ICONS[batch.programme?.slug] || '/images/studio-training/studio-practice-mirrors.jpg';

                  return (
                    <div
                      key={batch.id ?? i}
                      className={cn(
                        "flex flex-col sm:grid sm:grid-cols-[80px_1fr_auto] md:grid-cols-[80px_50px_1fr_140px_120px_110px] items-start sm:items-center gap-3 md:gap-4 py-3.5 px-2.5 sm:px-2 hover:bg-canvas-muted/60 transition-colors rounded-md border-l-4",
                        THEME_BORDER[batch.programme?.slug]
                      )}
                    >
                      {/* Mobile header / desktop columns */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:contents">
                        {/* Time */}
                        <span className="text-xs font-bold text-ink shrink-0">
                          {formatTime(batch.time_start)}
                        </span>

                        {/* Thumbnail badge */}
                        <div className="hidden md:block relative w-10 h-10 rounded-full overflow-hidden border border-line shrink-0">
                          <Image
                            src={thumb}
                            alt={batch.programme?.name || 'Class preview'}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Discipline info */}
                        <div className="min-w-0 flex-1 sm:flex-initial">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="heading-display text-[18px] text-ink leading-tight">
                              {batch.programme?.name}
                            </span>
                            {batch.programme?.slug === 'kuchipudi' && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purp/10 text-purp">
                                Certified
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] tracking-[1.5px] uppercase text-ink-2 mt-0.5">
                            {Array.isArray(batch.days) ? batch.days.join(' · ') : batch.days}
                          </p>
                        </div>
                      </div>

                      {/* Instructor */}
                      <div className="hidden md:flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-blk text-white heading-display text-xs flex items-center justify-center">
                          {(batch.instructor?.name ?? 'R').charAt(0)}
                        </span>
                        <span className="text-xs font-medium text-ink truncate">{batch.instructor?.name}</span>
                      </div>

                      {/* Duration */}
                      <span className="hidden md:block text-[11px] text-ink-2">
                        {durationLabel(batch.time_start, batch.time_end)} · {formatTime(batch.time_end)}
                      </span>

                      {/* Actions */}
                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end md:flex-col md:items-end gap-2 md:gap-1.5 pt-2 sm:pt-0 border-t border-line/40 sm:border-t-0">
                        <span className="text-[10px] font-semibold tracking-[1px] uppercase text-bl-ink border border-bl/30 px-2 py-0.5 rounded-md whitespace-nowrap bg-bl/5">
                          {slotsLeft > 0 ? `${slotsLeft} slots left` : 'Filling fast'}
                        </span>
                        <Link
                          href={`${ROUTES.enrol}?programme=${batch.programme?.slug ?? ''}`}
                          className="text-[10px] font-semibold tracking-[1.5px] uppercase px-4 py-1.5 bg-bl text-white hover:bg-bl-deep transition-all rounded-md whitespace-nowrap focus-visible:focus-ring active:scale-[0.98]"
                        >
                          Book Trial
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-ink-2 text-sm bg-surface p-8 rounded-md border border-line text-center">
          No batches found for {activeDay}.
        </p>
      )}
    </div>
  );
}
