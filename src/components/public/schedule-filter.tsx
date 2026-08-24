'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
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
      <div className="flex gap-2 flex-wrap mb-8" role="group" aria-label="Filter classes by day">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveDay(day)}
            aria-pressed={activeDay === day}
            className={cn(
              "text-[11px] tracking-[1.5px] uppercase py-2 px-4.5 bg-transparent border rounded text-mu cursor-pointer transition-all",
              activeDay === day ? "bg-blk text-white border-blk" : "border-[#DDD] hover:bg-blk hover:text-white hover:border-blk"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {grouped.length > 0 ? (
        <div className="flex flex-col gap-8">
          {grouped.map(({ day, batches: dayBatches }) => (
            <div key={day}>
              <h3 className="heading-display text-xl tracking-[3px] text-blk pb-2.5 border-b-2 border-bl-light mb-2">
                {day}
              </h3>
              <div className="flex flex-col">
                {dayBatches.map((batch, i) => {
                  const slotsLeft = (batch.capacity ?? 0) - (batch.enrolled_count ?? 0);
                  return (
                    <div
                      key={batch.id ?? i}
                      className={cn(
                        "grid grid-cols-[80px_1fr] md:grid-cols-[90px_1fr_140px_120px_110px] items-center gap-4 md:gap-4 p-3.5 md:px-5 bg-white border-l-4 border-b border-black/5 hover:bg-bl-pale transition-colors",
                        THEME_BORDER[batch.programme?.slug]
                      )}
                    >
                      <span className="text-xs font-semibold text-blk">
                        {formatTime(batch.time_start)}
                      </span>
                      <div>
                        <span className="heading-display text-[17px] tracking-[1px] text-blk leading-none">
                          {batch.programme?.name}
                        </span>
                        <p className="text-[10px] tracking-[1.5px] uppercase text-mu mt-0.5">
                          {Array.isArray(batch.days) ? batch.days.join(' · ') : batch.days}
                        </p>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-blk text-white heading-display text-xs flex items-center justify-center">
                          {(batch.instructor?.name ?? 'R').charAt(0)}
                        </span>
                        <span className="text-xs font-medium text-blk">{batch.instructor?.name}</span>
                      </div>
                      <span className="hidden md:block text-[11px] text-mu">
                        {durationLabel(batch.time_start, batch.time_end)} · {formatTime(batch.time_end)}
                      </span>
                      <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1.5">
                        <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-bl border border-bl px-2.5 py-1 rounded-sm whitespace-nowrap">
                          {slotsLeft} slots left
                        </span>
                        <Link
                          href={`${ROUTES.enrol}?programme=${batch.programme?.slug ?? ''}`}
                          className="text-[10px] font-semibold tracking-[1.5px] uppercase px-4 py-1.5 border border-bl text-bl hover:bg-bl hover:text-white transition-all rounded-sm whitespace-nowrap"
                        >
                          Book
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
        <p className="text-mu text-sm">No batches found for {activeDay}.</p>
      )}
    </div>
  );
}
