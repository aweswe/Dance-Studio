'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

interface ScheduleSlot {
  time: string;
  name: string;
  instructor: string;
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
        instructor: 'DEEPAK',
        level: 'BEG',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:00 - 6:00 PM',
        name: 'Kids Bollywood & Rhythm',
        instructor: 'KAJAL',
        level: 'BEG',
        programmeSlug: 'kids-dance',
      },
      {
        time: '7:00 - 8:00 PM',
        name: 'Hip Hop & Bolly-Hop',
        instructor: 'PRANITH',
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
        instructor: 'DEEPAK',
        level: 'INT',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:00 - 6:00 PM',
        name: 'Kids Foundation Technique',
        instructor: 'KAJAL',
        level: 'BEG',
        programmeSlug: 'kids-dance',
      },
      {
        time: '7:00 - 8:15 PM',
        name: 'Contemporary Floorwork',
        instructor: 'NITISH',
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
        name: 'Mind & Body Yoga',
        instructor: 'DEEPAK',
        level: 'BEG',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:30 - 6:30 PM',
        name: 'Kuchipudi Adavus & Hastas',
        instructor: 'SRUSHTI',
        level: 'INT',
        programmeSlug: 'kuchipudi',
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
        instructor: 'DEEPAK',
        level: 'BEG',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '5:00 - 6:00 PM',
        name: 'Kids Stage Choreography',
        instructor: 'KAJAL',
        level: 'INT',
        programmeSlug: 'kids-dance',
      },
      {
        time: '7:00 - 8:00 PM',
        name: 'Urban Choreography Lab',
        instructor: 'PRANITH',
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
        instructor: 'DEEPAK',
        level: 'INT',
        programmeSlug: 'mind-body-fitness',
      },
      {
        time: '6:00 - 7:30 PM',
        name: 'Masterclass Freestyle',
        instructor: 'NITISH',
        level: 'PRO',
        programmeSlug: 'adults-dance',
      },
    ],
  },
];

export function WeekScheduleGrid() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  return (
    <section id="schedule" className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 max-w-[1440px] mx-auto">
      {/* Section Heading */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-2">
          Weekly Batches &amp; Timings
        </span>
        <h2 className="heading-urban text-3xl sm:text-5xl md:text-6xl text-ink tracking-tight">
          WEEK SCHEDULE
        </h2>
      </div>

      {/* Mobile Day Selector Tabs */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {WEEK_DAYS.map((day, idx) => (
          <button
            key={day.date}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedDayIndex === idx
                ? 'bg-ink text-canvas'
                : 'bg-surface text-ink-2 border border-line'
            }`}
          >
            {day.date}
          </button>
        ))}
      </div>

      {/* Desktop 5-Column Calendar Grid Table (Dual Mode Pixel Perfection) */}
      <div className="hidden md:grid grid-cols-5 border border-line rounded-2xl overflow-hidden bg-surface dark:bg-[#0A0A0A] divide-x divide-line shadow-xl">
        {WEEK_DAYS.map((day) => (
          <div key={day.date} className="flex flex-col min-h-[360px]">
            {/* Day Header Row */}
            <div className="py-3 px-4 border-b border-line bg-black/[0.02] dark:bg-white/[0.03] text-center">
              <span className="text-xs sm:text-sm font-bold text-ink tracking-[0.14em] uppercase font-mono">
                {day.date}
              </span>
            </div>

            {/* Slots in column */}
            <div className="flex-1 flex flex-col divide-y divide-line">
              {day.slots.map((slot, sIdx) => (
                <Link
                  key={sIdx}
                  href={`/enrol?programme=${slot.programmeSlug}`}
                  className="p-4 sm:p-5 flex flex-col justify-between min-h-[105px] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer"
                >
                  {/* Top row: Time and Minimalist Text Level Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-medium text-ink">
                      {slot.time}
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#FB923C]">
                      {slot.level}
                    </span>
                  </div>

                  {/* Class Name and Instructor */}
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-ink group-hover:text-[#2BB4D8] transition-colors leading-snug">
                      {slot.name.split(' ')[0]} — <span className="text-ink-2">{slot.instructor}</span>
                    </p>
                  </div>
                </Link>
              ))}
              {/* Clean remainder if fewer slots */}
              <div className="flex-1 bg-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View: Single Day Card for selectedDayIndex */}
      <div className="md:hidden border border-line rounded-xl overflow-hidden bg-surface dark:bg-[#0A0A0A] divide-y divide-line">
        <div className="p-4 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between border-b border-line">
          <span className="text-sm font-bold text-ink font-mono uppercase tracking-wider">
            {WEEK_DAYS[selectedDayIndex].date}
          </span>
          <span className="text-xs font-mono text-[#FB923C] font-bold">
            {WEEK_DAYS[selectedDayIndex].day}
          </span>
        </div>
        {WEEK_DAYS[selectedDayIndex].slots.map((slot, idx) => (
          <Link
            key={idx}
            href={`/enrol?programme=${slot.programmeSlug}`}
            className="p-4 flex flex-col gap-2 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink">{slot.time}</span>
              <span className="text-[10px] font-mono font-bold text-[#FB923C]">
                {slot.level}
              </span>
            </div>
            <p className="text-sm font-medium text-ink">
              {slot.name.split(' ')[0]} — {slot.instructor}
            </p>
          </Link>
        ))}
      </div>

      {/* Bottom Right: "Full schedule ──→" */}
      <div className="mt-6 sm:mt-8 flex justify-end">
        <Link
          href={ROUTES.enrol}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-ink-2 hover:text-ink transition-colors"
        >
          <span>Full schedule</span>
          <span className="font-mono text-base translate-x-0 group-hover:translate-x-1.5 transition-transform">
            ──→
          </span>
        </Link>
      </div>
    </section>
  );
}

