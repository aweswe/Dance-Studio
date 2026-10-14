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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          {(
            [
              ['10-year', '10-Year Master Track (Ages 5–7)'],
              ['6-year', '6-Year Accelerated Track (Ages 13+)'],
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
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
          {plan.years.length} Academic Stages
        </span>
      </div>

      <div className="p-4 rounded-lg bg-surface/60 border border-line text-xs text-ink-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="font-semibold text-ink">{plan.title}</span>
        <span className="text-ink-3 font-mono">
          {'targetAudience' in plan ? plan.targetAudience : 'Ages 13+ & Fast-Track Learners'}
        </span>
      </div>

      <ol className="divide-y divide-slate-200 border-y-2 border-slate-200">
        {plan.years.map((item) => {
          const isOpen = open === item.year;
          return (
            <li key={`${track}-${item.year}`} className="transition-colors hover:bg-slate-50">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.year)}
                className="w-full flex items-center gap-4 py-4 px-2 text-left"
                aria-expanded={isOpen}
              >
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-sm">
                  {String(item.year).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-anton text-lg sm:text-xl uppercase tracking-tight text-slate-950 block">
                    {item.stageName}
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {item.level}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={cn('text-slate-700 shrink-0 transition-transform duration-200', isOpen && 'rotate-180 text-sky-800')}
                />
              </button>
              {isOpen && (
                <div className="pl-12 pr-4 pb-6 pt-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.practical && item.practical.length > 0 && (
                      <div className="p-4 rounded-lg bg-slate-50 border-2 border-slate-200">
                        <p className="text-xs font-mono font-bold uppercase tracking-wider text-sky-950 mb-2 flex items-center gap-1.5">
                          <span className="text-sky-800">◆</span> Practical Technique &amp; Repertoire
                        </p>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 font-medium">
                          {item.practical.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-slate-900 font-bold">·</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.theory && item.theory.length > 0 && (
                      <div className="p-4 rounded-lg bg-slate-50 border-2 border-slate-200">
                        <p className="text-xs font-mono font-bold uppercase tracking-wider text-sky-950 mb-2 flex items-center gap-1.5">
                          <span className="text-sky-800">◆</span> Theory, Slokas &amp; Hastas
                        </p>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 font-medium">
                          {item.theory.map((t, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-slate-900 font-bold">·</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-slate-900 text-white border-l-4 border-[#D4AF37] shadow-sm">
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#FDE68A] mb-1">
                      Expected Learning Outcome
                    </p>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {item.learningOutcome}
                    </p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
