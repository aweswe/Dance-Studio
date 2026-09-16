'use client';

import { useState } from 'react';
import {
  KUCHIPUDI_10_YEAR_PLAN,
  KUCHIPUDI_6_YEAR_PLAN,
  CurriculumYear,
} from '@/data/kuchipudi';
import { BookOpen, ChevronDown, GraduationCap, Zap } from 'lucide-react';

export function ClassicalCurriculumMatrix() {
  const [activeKuchipudiTrack, setActiveKuchipudiTrack] = useState<'10-year' | '6-year'>('10-year');
  const [expandedYear, setExpandedYear] = useState<number | null>(1);

  const toggleYear = (year: number) => {
    setExpandedYear((prev) => (prev === year ? null : year));
  };

  const currentKuchipudiPlan =
    activeKuchipudiTrack === '10-year' ? KUCHIPUDI_10_YEAR_PLAN : KUCHIPUDI_6_YEAR_PLAN;

  return (
    <div id="curriculum" className="w-full space-y-8 scroll-mt-24">
      <div className="bento-card rounded-md sm:rounded-md border border-line p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-line">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
              Kuchipudi syllabus
            </p>
            <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-ink tracking-wide uppercase">
              Year by year with Srusti
            </h2>
            <p className="text-ink-2 text-xs sm:text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              This is the Kuchipudi plan we actually teach — Friday and Saturday, 6:30 to 7:30. Pick the 10-year track if you are starting young, or the 6-year track if you already have some classical work.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-ink-3 uppercase tracking-wider font-semibold mr-1">
              Track
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveKuchipudiTrack('10-year');
                setExpandedYear(1);
              }}
              className={`px-4 py-2 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeKuchipudiTrack === '10-year'
                  ? 'bg-ink text-canvas shadow-sm'
                  : 'bg-canvas text-ink-2 hover:text-ink border border-line'
              }`}
            >
              10-year foundation
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveKuchipudiTrack('6-year');
                setExpandedYear(1);
              }}
              className={`px-4 py-2 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeKuchipudiTrack === '6-year'
                  ? 'bg-bl text-white shadow-sm'
                  : 'bg-canvas text-ink-2 hover:text-ink border border-line'
              }`}
            >
              6-year certificate
            </button>
          </div>

          <p className="text-xs font-mono text-ink-2 bg-canvas px-4 py-2.5 rounded-md border border-line">
            Lineage: Dr. Vempati Chinna Satyam · Guru Srushti
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {currentKuchipudiPlan.years.map((item: CurriculumYear) => {
          const isExpanded = expandedYear === item.year;
          return (
            <div
              key={`kuchipudi-${activeKuchipudiTrack}-${item.year}`}
              className={`bento-card rounded-md border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'border-bl/50 shadow-md ring-1 ring-bl/20 bg-surface'
                  : 'border-line bg-surface/60 hover:border-line-strong'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleYear(item.year)}
                className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-md flex items-center justify-center font-anton text-xl shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-bl text-blk shadow-sm'
                        : 'bg-canvas text-ink border border-line'
                    }`}
                  >
                    Y{item.year}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-bl font-bold">
                        {item.level}
                      </span>
                    </div>
                    <h3 className="font-anton text-xl sm:text-2xl text-ink tracking-wide uppercase truncate">
                      {item.stageName}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border border-line transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 bg-ink text-canvas' : 'bg-canvas text-ink'
                  }`}
                >
                  <ChevronDown size={18} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-line space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-canvas p-5 rounded-md border border-line space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-bl">
                        <BookOpen size={16} />
                        <span>Theory</span>
                      </div>
                      <ul className="space-y-2">
                        {item.theory.map((t, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-ink-2 flex items-start gap-2 leading-relaxed">
                            <span className="text-bl font-bold mt-0.5">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-canvas p-5 rounded-md border border-line space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ink">
                        <Zap size={16} className="text-bl" />
                        <span>On the floor</span>
                      </div>
                      <ul className="space-y-2">
                        {item.practical.map((p, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-ink-2 flex items-start gap-2.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-bl shrink-0 mt-2" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-canvas rounded-md border border-line flex items-start gap-3 text-xs sm:text-sm text-ink-2">
                    <GraduationCap size={18} className="text-bl shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ink font-semibold block mb-0.5">By the end of this year</strong>
                      <span>{item.learningOutcome}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
