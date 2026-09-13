'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowUpRight, Filter } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

interface ScheduleSlot {
  time: string;
  name: string;
  instructor: string;
  category: 'urban' | 'classical' | 'fitness' | 'kids';
  level: 'BEG' | 'INT' | 'ADV' | 'PRO';
  programmeSlug: string;
}

interface DaySchedule {
  date: string;
  day: string;
  slots: ScheduleSlot[];
}

const WEEK_DAYS: DaySchedule[] = [
  {
    date: 'MAY 23',
    day: 'MON',
    slots: [
      {
        time: '6:30 - 7:30 AM',
        name: 'Mind & Body Fitness',
        instructor: 'Deepak',
        category: 'fitness',
        level: 'BEG',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:00 - 6:00 PM',
        name: 'Kids Bollywood Rhythm',
        instructor: 'Kajal',
        category: 'kids',
        level: 'BEG',
        programmeSlug: 'kids-dance',
      },
      {
        time: '7:00 - 8:00 PM',
        name: 'Hip Hop & Bolly-Hop',
        instructor: 'Pranith',
        category: 'urban',
        level: 'ADV',
        programmeSlug: 'adults-dance',
      },
    ],
  },
  {
    date: 'MAY 24',
    day: 'TUE',
    slots: [
      {
        time: '6:30 - 7:30 AM',
        name: 'Core HIIT & Zumba',
        instructor: 'Deepak',
        category: 'fitness',
        level: 'INT',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:00 - 6:00 PM',
        name: 'Kids Foundation Technique',
        instructor: 'Kajal',
        category: 'kids',
        level: 'BEG',
        programmeSlug: 'kids-dance',
      },
      {
        time: '7:00 - 8:15 PM',
        name: 'Contemporary Floorwork',
        instructor: 'Nitish',
        category: 'urban',
        level: 'PRO',
        programmeSlug: 'adults-dance',
      },
    ],
  },
  {
    date: 'MAY 25',
    day: 'WED',
    slots: [
      {
        time: '6:30 - 7:30 AM',
        name: 'Mind & Body Yoga Flow',
        instructor: 'Deepak',
        category: 'fitness',
        level: 'BEG',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:30 - 6:30 PM',
        name: 'Kuchipudi Adavus & Hastas',
        instructor: 'Srusti',
        category: 'classical',
        level: 'INT',
        programmeSlug: 'kuchipudi',
      },
      {
        time: '7:00 - 8:00 PM',
        name: 'Urban Breaking Foundations',
        instructor: 'Pranith',
        category: 'urban',
        level: 'BEG',
        programmeSlug: 'adults-dance',
      },
    ],
  },
  {
    date: 'MAY 26',
    day: 'THU',
    slots: [
      {
        time: '6:30 - 7:30 AM',
        name: 'Zumba Cardio Burn',
        instructor: 'Deepak',
        category: 'fitness',
        level: 'BEG',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:00 - 6:00 PM',
        name: 'Kids Stage Choreography',
        instructor: 'Kajal',
        category: 'kids',
        level: 'INT',
        programmeSlug: 'kids-dance',
      },
      {
        time: '7:00 - 8:00 PM',
        name: 'Urban Choreography Lab',
        instructor: 'Pranith',
        category: 'urban',
        level: 'ADV',
        programmeSlug: 'adults-dance',
      },
    ],
  },
  {
    date: 'MAY 27',
    day: 'FRI',
    slots: [
      {
        time: '6:30 - 7:30 AM',
        name: 'Core Conditioning',
        instructor: 'Deepak',
        category: 'fitness',
        level: 'INT',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:30 - 6:45 PM',
        name: 'Kuchipudi Tarangam Repertoire',
        instructor: 'Srusti',
        category: 'classical',
        level: 'ADV',
        programmeSlug: 'kuchipudi',
      },
      {
        time: '7:00 - 8:30 PM',
        name: 'Masterclass Freestyle',
        instructor: 'Nitish',
        category: 'urban',
        level: 'PRO',
        programmeSlug: 'adults-dance',
      },
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Batches' },
  { id: 'urban', label: 'Urban & Hip Hop' },
  { id: 'classical', label: 'Classical Kuchipudi' },
  { id: 'fitness', label: 'Dance Fitness & Yoga' },
  { id: 'kids', label: 'Kids Academy' },
];

export function WeekScheduleGrid() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filterSlots = (slots: ScheduleSlot[]) => {
    if (activeCategory === 'all') return slots;
    return slots.filter((slot) => slot.category === activeCategory);
  };

  return (
    <section id="schedule" className="w-full px-4 sm:px-6 md:px-10 py-24 sm:py-24 max-w-[1440px] mx-auto select-none">
      {/* Header & Filter Bar */}
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
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
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

      {/* Mobile Day Selector Tabs */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {WEEK_DAYS.map((day, idx) => (
          <button
            key={day.date}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedDayIndex === idx
                ? 'bg-[#000000] text-[#F5FB38] shadow-md'
                : 'bg-surface text-ink-2 border border-line'
            }`}
          >
            <span>{day.day}</span> · <span className="font-mono text-[11px]">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Desktop 5-Column Calendar Grid Table */}
      <div className="hidden md:grid grid-cols-5 border border-line rounded-[26px] overflow-hidden bg-surface divide-x divide-line shadow-2xl">
        {WEEK_DAYS.map((day) => {
          const visibleSlots = filterSlots(day.slots);
          return (
            <div key={day.date} className="flex flex-col min-h-[380px]">
              {/* Day Header Row */}
              <div className="py-4 px-4 border-b border-line bg-[#000000] text-center flex flex-col items-center justify-center">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#F5FB38]">
                  {day.day}
                </span>
                <span className="text-sm font-anton tracking-wider text-white mt-0.5">
                  {day.date}
                </span>
              </div>

              {/* Slots in column */}
              <div className="flex-1 flex flex-col divide-y divide-line bg-surface">
                {visibleSlots.length > 0 ? (
                  visibleSlots.map((slot, sIdx) => (
                    <Link
                      key={sIdx}
                      href={`/enrol?programme=${slot.programmeSlug}`}
                      className="p-4 sm:p-5 flex flex-col justify-between min-h-[115px] hover:bg-[#7C5CFC]/5 transition-all group cursor-pointer"
                    >
                      {/* Top row: Time and Level Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-ink-2">
                          <Clock size={11} className="text-[#7C5CFC]" />
                          <span>{slot.time}</span>
                        </div>
                        <span
                          className={`text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded-md ${
                            slot.level === 'PRO'
                              ? 'bg-[#F5FB38] text-[#000000]'
                              : slot.level === 'ADV'
                              ? 'bg-[#7C5CFC] text-white'
                              : 'bg-black/5 dark:bg-white/10 text-ink-2'
                          }`}
                        >
                          {slot.level}
                        </span>
                      </div>

                      {/* Class Name and Instructor */}
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
                    <span className="text-xs font-mono text-ink-3 italic">
                      No matching batch
                    </span>
                  </div>
                )}
                {/* Remainder fill */}
                <div className="flex-1 bg-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View: Single Day Card for selectedDayIndex */}
      <div className="md:hidden border border-line rounded-2xl overflow-hidden bg-surface divide-y divide-line shadow-lg">
        <div className="p-4 bg-[#000000] flex items-center justify-between border-b border-line">
          <span className="text-sm font-anton tracking-wider text-white uppercase">
            {WEEK_DAYS[selectedDayIndex].day} · {WEEK_DAYS[selectedDayIndex].date}
          </span>
          <span className="text-xs font-mono text-[#F5FB38] font-bold">
            {filterSlots(WEEK_DAYS[selectedDayIndex].slots).length} Batches Today
          </span>
        </div>
        {filterSlots(WEEK_DAYS[selectedDayIndex].slots).map((slot, idx) => (
          <Link
            key={idx}
            href={`/enrol?programme=${slot.programmeSlug}`}
            className="p-4 flex flex-col gap-2 hover:bg-[#7C5CFC]/5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-2">{slot.time}</span>
              <span
                className={`text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded-md ${
                  slot.level === 'PRO'
                    ? 'bg-[#F5FB38] text-[#000000]'
                    : slot.level === 'ADV'
                    ? 'bg-[#7C5CFC] text-white'
                    : 'bg-black/5 dark:bg-white/10 text-ink-2'
                }`}
              >
                {slot.level}
              </span>
            </div>
            <p className="text-sm font-bold text-ink">
              {slot.name}
            </p>
            <p className="text-xs text-ink-3 font-mono">
              Mentor: {slot.instructor}
            </p>
          </Link>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="mt-8 flex items-center justify-between">
        <span className="text-xs font-mono text-ink-3">
          Need custom timings? Private batches available on request.
        </span>
        <Link
          href={ROUTES.enrol}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#7C5CFC] hover:text-[#512BDB] transition-colors"
        >
          <span>Full Batches &amp; Fees</span>
          <span className="font-mono text-base translate-x-0 group-hover:translate-x-1.5 transition-transform">
          </span>
        </Link>
      </div>
    </section>
  );
}
