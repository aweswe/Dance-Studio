'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  KUCHIPUDI_10_YEAR_PLAN,
  KUCHIPUDI_6_YEAR_PLAN,
} from '@/data/kuchipudi';
import { cn } from '@/lib/utils/cn';
import { homepageFilterPill } from '@/lib/ui/homepage-cta';

export function SyllabusYears() {
  const [track, setTrack] = useState<'10-year' | '6-year'>('10-year');
  const [open, setOpen] = useState<number | null>(null);
  const plan = track === '10-year' ? KUCHIPUDI_10_YEAR_PLAN : KUCHIPUDI_6_YEAR_PLAN;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            ['10-year', '10-year'],
            ['6-year', '6-year'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTrack(id);
              setOpen(null);
            }}
            className={homepageFilterPill(track === id, 'px-4 py-2 text-xs font-mono tracking-wider')}
          >
            {label}
          </button>
        ))}
      </div>

      <ol className="divide-y divide-line border-y border-line">
        {plan.years.map((item) => {
          const isOpen = open === item.year;
          return (
            <li key={`${track}-${item.year}`}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.year)}
                className="w-full flex items-baseline gap-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-mono text-[11px] text-ink-3 w-8 shrink-0">
                  {String(item.year).padStart(2, '0')}
                </span>
                <span className="font-anton text-lg sm:text-xl uppercase tracking-tight text-ink flex-1">
                  {item.stageName}
                </span>
                <ChevronDown
                  size={16}
                  className={cn('text-ink-3 shrink-0 transition-transform', isOpen && 'rotate-180')}
                />
              </button>
              {isOpen && (
                <p className="pl-12 pb-5 text-sm text-ink-2 leading-relaxed max-w-xl">
                  {item.learningOutcome}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
