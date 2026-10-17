'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle2, Award, BookOpen, Layers } from 'lucide-react';
import { KATHAK_SYLLABUS, KathakSyllabusLevel } from '@/data/kathak-syllabus';
import { cn } from '@/lib/utils/cn';

function BulletList({ items, variant = 'technical' }: { items: string[]; variant?: 'technical' | 'theory' }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-2 text-xs sm:text-sm text-ink-2 font-medium leading-relaxed">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className={cn('font-bold shrink-0 mt-0.5', variant === 'technical' ? 'text-bl' : 'text-ink-3')}>
            {variant === 'technical' ? '◆' : '·'}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function KathakSyllabusLevels() {
  const [open, setOpen] = useState<number | null>(1); // Default level 1 expanded

  return (
    <div className="space-y-8">
      {/* Level Selector Badges for Quick Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {KATHAK_SYLLABUS.levels.map((item) => {
            const isActive = open === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => setOpen(item.level)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer',
                  isActive
                    ? 'bg-bl text-slate-950 shadow-2xs'
                    : 'bg-surface border border-line text-ink-2 hover:border-bl/40 hover:text-ink',
                )}
              >
                L{item.level}: {item.title}
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
          5 Graded Academic Levels
        </span>
      </div>

      {/* Accordion List with In-Depth Technical & Repertoire Sections */}
      <ol className="divide-y divide-line border-y border-line">
        {KATHAK_SYLLABUS.levels.map((item) => {
          const isOpen = open === item.level;
          return (
            <li key={item.level} className={cn('transition-colors', isOpen ? 'bg-surface/50' : 'hover:bg-surface/30')}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.level)}
                className="w-full flex items-start sm:items-center gap-3.5 sm:gap-5 py-4 sm:py-5 px-2 text-left cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-black shrink-0 transition-colors',
                    isOpen
                      ? 'bg-bl text-slate-950 shadow-2xs'
                      : 'bg-ink text-canvas group-hover:bg-bl group-hover:text-slate-950',
                  )}
                >
                  {String(item.level).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-anton text-lg sm:text-xl uppercase tracking-tight text-ink group-hover:text-bl transition-colors">
                      Level {item.level}: {item.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-line/60 text-ink-2 font-semibold">
                      {item.stage}
                    </span>
                  </div>
                  {!isOpen && (
                    <span className="text-xs sm:text-sm text-ink-2 mt-1 block line-clamp-1 font-medium">
                      {item.focus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.boardExam && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-ink-3 border border-line bg-canvas px-2 py-0.5 rounded">
                      <Award size={11} className="text-bl shrink-0" />
                      <span>{item.boardExam}</span>
                    </span>
                  )}
                  <ChevronDown
                    size={18}
                    className={cn(
                      'text-ink-3 shrink-0 transition-transform duration-200 group-hover:text-bl',
                      isOpen && 'rotate-180 text-bl',
                    )}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-2 sm:px-14 pb-6 pt-2 space-y-4">
                  {/* Focus Banner */}
                  <div className="p-3.5 rounded-md bg-canvas border border-line text-xs sm:text-sm text-ink font-serif italic leading-relaxed">
                    <span className="font-mono not-italic uppercase text-[10px] tracking-wider text-bl font-bold mr-2">
                      FOCAL AIM:
                    </span>
                    {item.focus}
                  </div>

                  {/* 2-Column Floor & Theory Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Technical Elements */}
                    <div className="p-4 rounded-md bg-surface border border-line shadow-2xs">
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-2.5 flex items-center gap-1.5">
                        <Layers size={13} className="text-bl shrink-0" />
                        <span>Technical Elements (On the Floor)</span>
                      </p>
                      <BulletList items={item.technical} variant="technical" />
                    </div>

                    {/* Theoretical & Repertoire */}
                    <div className="p-4 rounded-md bg-surface border border-line shadow-2xs">
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-2.5 flex items-center gap-1.5">
                        <BookOpen size={13} className="text-ink-3 shrink-0" />
                        <span>Theoretical &amp; Repertoire</span>
                      </p>
                      <BulletList items={item.theory} variant="theory" />
                    </div>
                  </div>

                  {/* Learning Outcome & Board Exam Pill */}
                  {item.learningOutcome && (
                    <div className="pt-3 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink-2 font-medium">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="text-bl shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-ink font-bold">Outcome: </strong>
                          {item.learningOutcome}
                        </span>
                      </div>
                      {item.boardExam && (
                        <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider text-ink-3 bg-canvas border border-line px-2 py-0.5 rounded self-start sm:self-auto">
                          Milestone: {item.boardExam}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Key Learning Outcomes Bento Box */}
      <div className="pt-2">
        <div className="mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-bold block">
            CORE MASTERY METRICS
          </span>
          <h3 className="font-anton text-xl sm:text-2xl text-ink uppercase tracking-wide">
            Key Learning Outcomes
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {KATHAK_SYLLABUS.outcomes.map(({ title, text }) => (
            <div
              key={title}
              className="p-5 rounded-md border border-line bg-surface hover:border-bl/40 transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-bl shrink-0" />
                  <p className="font-anton text-base sm:text-lg uppercase tracking-tight text-ink">
                    {title}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-medium">
                  {text}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-ink-3">
                <span>Rhythmzz Academy Certification</span>
                <span className="text-bl font-bold">Lucknow Lineage</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
