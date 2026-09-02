'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KUCHIPUDI_10_YEAR_PLAN,
  KUCHIPUDI_6_YEAR_PLAN,
  CurriculumYear,
} from '@/data/kuchipudi';
import {
  BookOpen,
  Activity,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';

export function KuchipudiCurriculum() {
  const [activeTrack, setActiveTrack] = useState<'10-year' | '6-year'>('10-year');
  const [expandedYear, setExpandedYear] = useState<number | null>(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const currentPlan =
    activeTrack === '10-year' ? KUCHIPUDI_10_YEAR_PLAN : KUCHIPUDI_6_YEAR_PLAN;

  const toggleYear = (year: number) => {
    setExpandedYear((prev) => (prev === year ? null : year));
  };

  const filteredYears = currentPlan.years.filter((item: CurriculumYear) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'beginner' && item.level.toLowerCase().includes('beginner'))
      return true;
    if (selectedFilter === 'intermediate' && item.level.toLowerCase().includes('intermediate'))
      return true;
    if (selectedFilter === 'advanced' && item.level.toLowerCase().includes('advanced'))
      return true;
    return true;
  });

  return (
    <div id="curriculum" className="w-full space-y-12 scroll-mt-24">
      {/* Header & Track Selector */}
      <div className="bg-surface border border-line rounded-card p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bl/10 text-bl text-[11px] font-bold tracking-[1.5px] uppercase mb-3">
              <GraduationCap size={14} /> Official Master Syllabus
            </div>
            <h2 className="heading-display text-3xl md:text-5xl text-ink">
              KUCHIPUDI CURRICULUM
            </h2>
            <p className="text-ink-2 text-sm md:text-base max-w-2xl mt-2">
              Structured to prioritize developmental pacing, physical safety, and artistic depth,
              leading up to the recognized Certificate Public Examination.
            </p>
          </div>

          {/* Track Switcher */}
          <div className="flex flex-col sm:flex-row gap-2 bg-canvas-muted p-1.5 rounded-tile border border-line self-start lg:self-center">
            <button
              onClick={() => {
                setActiveTrack('10-year');
                setExpandedYear(1);
                setSelectedFilter('all');
              }}
              className={`px-5 py-3 rounded-control text-xs font-semibold uppercase tracking-[1.5px] transition-all flex items-center gap-2 ${
                activeTrack === '10-year'
                  ? 'bg-blk text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              <Layers size={15} />
              10-Year Master Plan
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-bl/20 text-bl ml-1">
                Ages 5–7
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTrack('6-year');
                setExpandedYear(1);
                setSelectedFilter('all');
              }}
              className={`px-5 py-3 rounded-control text-xs font-semibold uppercase tracking-[1.5px] transition-all flex items-center gap-2 ${
                activeTrack === '6-year'
                  ? 'bg-blk text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              <Zap size={15} />
              6-Year Certificate
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ml-1">
                Fast-Track
              </span>
            </button>
          </div>
        </div>

        {/* Current Track Overview Banner */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-canvas-muted-2 p-5 rounded-tile border border-line/60">
          <div>
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <Sparkles size={16} className="text-bl" />
              {currentPlan.title}
            </h3>
            <p className="text-xs md:text-sm text-ink-2 mt-1">
              {currentPlan.summary}
            </p>
          </div>
          {'targetAudience' in currentPlan && (
            <div className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-surface border border-line text-ink font-medium">
              <span className="text-ink-2">Target Audience:</span> {currentPlan.targetAudience}
            </div>
          )}
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-2 self-center mr-2">
            Filter Stage:
          </span>
          {[
            { id: 'all', label: 'All Years' },
            { id: 'beginner', label: 'Beginner / Foundation' },
            { id: 'intermediate', label: 'Intermediate' },
            ...(activeTrack === '6-year'
              ? [{ id: 'advanced', label: 'Advanced & Exam' }]
              : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                selectedFilter === tab.id
                  ? 'bg-bl text-white border-bl font-semibold'
                  : 'bg-surface border-line text-ink-2 hover:text-ink hover:border-line-strong'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Year-by-Year Syllabus Accordions */}
      <div className="space-y-4">
        {filteredYears.map((item: CurriculumYear) => {
          const isExpanded = expandedYear === item.year;
          return (
            <div
              key={item.year}
              className={`bg-surface border transition-all rounded-card overflow-hidden ${
                isExpanded
                  ? 'border-bl ring-1 ring-bl/20 shadow-md'
                  : 'border-line hover:border-line-strong'
              }`}
            >
              {/* Year Header / Summary Bar */}
              <button
                onClick={() => toggleYear(item.year)}
                className="w-full text-left p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-canvas-muted/40"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-tile bg-canvas-muted border border-line flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-2">Year</span>
                    <span className="text-xl font-extrabold text-bl leading-none">{item.year}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-canvas-muted text-ink">
                        {item.level}
                      </span>
                      {item.stageName && (
                        <span className="text-xs text-ink-2 font-medium">
                          • {item.stageName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-ink mt-1">
                      {item.stageName || `${item.level} — Year ${item.year}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <span className="text-xs text-ink-2 hidden sm:inline-block">
                    {item.theory.length} Theory / {item.practical.length} Practical units
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-transform ${
                      isExpanded
                        ? 'bg-bl text-white border-bl rotate-180'
                        : 'bg-surface border-line text-ink-2'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              </button>

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="px-6 pb-7 md:px-8 md:pb-8 pt-2 border-t border-line/60 bg-canvas/30 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theory Column */}
                    <div className="bg-canvas-muted p-5 rounded-tile border border-line">
                      <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider mb-4 text-bl">
                        <BookOpen size={16} />
                        Theory Syllabus
                      </div>
                      <ul className="space-y-2.5">
                        {item.theory.map((line: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-ink-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-bl mt-2 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Column */}
                    <div className="bg-canvas-muted p-5 rounded-tile border border-line">
                      <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider mb-4 text-emerald-600 dark:text-emerald-400">
                        <Activity size={16} />
                        Practical & Repertoire
                      </div>
                      <ul className="space-y-2.5">
                        {item.practical.map((line: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-ink-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Learning Outcome Banner */}
                  <div className="p-4 md:p-5 rounded-tile bg-bl/5 border border-bl/20 flex items-start gap-3.5">
                    <Award className="text-bl shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-bl mb-1">
                        Expected Learning Outcome
                      </div>
                      <p className="text-xs md:text-sm text-ink font-medium leading-relaxed">
                        {item.learningOutcome}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assessment Matrix & Progression Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        {/* Assessment Criteria Card */}
        <Reveal>
          <div className="bg-surface border border-line rounded-card p-6 md:p-8 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-tile bg-bl/10 text-bl flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="heading-display text-2xl text-ink">
                    ANNUAL ASSESSMENT CRITERIA
                  </h3>
                  <p className="text-xs text-ink-2">
                    Comprehensive Year-End Theory & Practical Evaluation
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(activeTrack === '10-year'
                  ? KUCHIPUDI_10_YEAR_PLAN.assessmentCriteria
                  : KUCHIPUDI_6_YEAR_PLAN.assessmentParameters
                ).map((param: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-tile bg-canvas-muted border border-line"
                  >
                    <div className="font-bold text-xs uppercase tracking-wider text-ink mb-1 flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-bl shrink-0" />
                      {param.title}
                    </div>
                    <p className="text-xs md:text-sm text-ink-2 leading-relaxed">
                      {param.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line text-xs text-ink-2">
              Formal Certificate Awarded upon successful assessment at each level tier.
            </div>
          </div>
        </Reveal>

        {/* Progression & Mastery Guidelines Card */}
        <Reveal delay={0.08}>
          <div className="bg-surface border border-line rounded-card p-6 md:p-8 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-tile bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="heading-display text-2xl text-ink">
                    PROGRESSION & MASTERY MODEL
                  </h3>
                  <p className="text-xs text-ink-2">
                    Merit-based pacing, safety, and individual growth
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(activeTrack === '10-year'
                  ? KUCHIPUDI_10_YEAR_PLAN.progressionModel
                  : KUCHIPUDI_6_YEAR_PLAN.progressAndMastery
                ).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-tile bg-canvas-muted border border-line"
                  >
                    <div className="font-bold text-xs uppercase tracking-wider text-ink mb-1 flex items-center gap-2">
                      <Sparkles size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      {item.title}
                    </div>
                    <p className="text-xs md:text-sm text-ink-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA inside Matrix */}
            <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-ink">Ready to begin your journey?</div>
                <div className="text-[11px] text-ink-2">Free trial class & diagnostic alignment check.</div>
              </div>
              <Link
                href="/enrol?programme=kuchipudi"
                className="w-full sm:w-auto text-center text-[11px] font-semibold tracking-[2px] uppercase py-3 px-6 bg-bl text-white hover:bg-bl-deep transition-all rounded-control focus-visible:focus-ring"
              >
                Enrol In Kuchipudi
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
