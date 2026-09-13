'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import type { DaySchedule, ScheduleSlot } from '@/lib/schedule/from-batches';

const CATEGORIES = [
  { id: 'all', label: 'All Batches' },
  { id: 'urban', label: 'Urban & Hip Hop' },
  { id: 'classical', label: 'Classical' },
  { id: 'fitness', label: 'Dance Fitness & Yoga' },
  { id: 'kids', label: 'Kids Academy' },
];

export function WeekScheduleGrid({ weekDays }: { weekDays: DaySchedule[] }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const daysWithClasses = weekDays.filter((d) => d.slots.length > 0);
  const displayDays = daysWithClasses.length > 0 ? daysWithClasses : weekDays;

  const filterSlots = (slots: ScheduleSlot[]) => {
    if (activeCategory === 'all') return slots;
    return slots.filter((slot) => slot.category === activeCategory);
  };

  const safeDayIndex = Math.min(selectedDayIndex, displayDays.length - 1);

  return (
    <section id="schedule" className="w-full px-4 sm:px-6 md:px-10 py-24 sm:py-24 max-w-[1440px] mx-auto select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
              06 · Weekly Batches &amp; Timings
            </span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl text-ink tracking-wide uppercase leading-[0.92]">
            WEEK SCHEDULE
          </h2>
          <p className="text-sm text-ink-2 mt-3">Live from the admin timetable — same batches students see in portal.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                activeCategory === cat.id
                  ? 'bg-[#000000] text-[#F5FB38] font-bold shadow-sm'
                  : 'bg-surface text-ink-2 hover:text-ink border border-line hover:border-ink/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {displayDays.map((day, idx) => (
          <button
            key={day.dayFull}
            type="button"
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              safeDayIndex === idx
                ? 'bg-[#000000] text-[#F5FB38] shadow-md'
                : 'bg-surface text-ink-2 border border-line'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      <div
        className="hidden md:grid gap-0 border border-line rounded-[26px] overflow-hidden bg-surface shadow-2xl"
        style={{ gridTemplateColumns: `repeat(${displayDays.length}, minmax(0, 1fr))` }}
      >
        {displayDays.map((day) => {
          const visibleSlots = filterSlots(day.slots);
          return (
            <div key={day.dayFull} className="flex flex-col min-h-[380px] border-r border-line last:border-r-0">
              <div className="py-4 px-4 border-b border-line bg-[#000000] text-center">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#F5FB38]">
                  {day.day}
                </span>
                <span className="text-sm font-anton tracking-wider text-white mt-0.5 block">{day.dayFull}</span>
              </div>

              <div className="flex-1 flex flex-col divide-y divide-line bg-surface">
                {visibleSlots.length > 0 ? (
                  visibleSlots.map((slot, sIdx) => (
                    <Link
                      key={sIdx}
                      href={`/enrol?programme=${slot.programmeSlug}`}
                      className="p-4 sm:p-5 flex flex-col justify-between min-h-[115px] hover:bg-[#7C5CFC]/5 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-ink-2">
                          <Clock size={11} className="text-[#7C5CFC]" />
                          <span>{slot.time}</span>
                        </div>
                        <span className="text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-ink-2">
                          {slot.level}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-ink group-hover:text-[#7C5CFC] transition-colors leading-snug">
                          {slot.name}
                        </p>
                        <p className="text-[11px] font-mono text-ink-3 mt-1">
                          Mentor: <span className="font-semibold text-ink-2">{slot.instructor}</span>
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex-1 p-6 flex items-center justify-center text-center">
                    <span className="text-xs font-mono text-ink-3 italic">No matching batch</span>
                  </div>
                )}
                <div className="flex-1 bg-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="md:hidden border border-line rounded-2xl overflow-hidden bg-surface divide-y divide-line shadow-lg">
        {displayDays[safeDayIndex] && (
          <>
            <div className="p-4 bg-[#000000] flex items-center justify-between border-b border-line">
              <span className="text-sm font-anton tracking-wider text-white uppercase">
                {displayDays[safeDayIndex].day} · {displayDays[safeDayIndex].dayFull}
              </span>
              <span className="text-xs font-mono text-[#F5FB38] font-bold">
                {filterSlots(displayDays[safeDayIndex].slots).length} batches
              </span>
            </div>
            {filterSlots(displayDays[safeDayIndex].slots).map((slot, idx) => (
              <Link
                key={idx}
                href={`/enrol?programme=${slot.programmeSlug}`}
                className="p-4 flex flex-col gap-2 hover:bg-[#7C5CFC]/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-ink-2">{slot.time}</span>
                  <span className="text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded-md bg-black/5 text-ink-2">
                    {slot.level}
                  </span>
                </div>
                <p className="text-sm font-bold text-ink">{slot.name}</p>
                <p className="text-xs text-ink-3 font-mono">Mentor: {slot.instructor}</p>
              </Link>
            ))}
          </>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-xs font-mono text-ink-3">
          Need custom timings? Private batches available on request.
        </span>
        <Link
          href={ROUTES.enrol}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#7C5CFC] hover:text-[#512BDB] transition-colors"
        >
          <span>Full Batches &amp; Fees</span>
        </Link>
      </div>
    </section>
  );
}
