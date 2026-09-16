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
  ChevronDown,
  Calendar,
  Layers,
  GraduationCap,
  Zap,
  Compass,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';

export function KuchipudiCurriculum() {
  const [activeTrack, setActiveTrack] = useState<'10-year' | '6-year'>('10-year');
  const [expandedYear, setExpandedYear] = useState<number | null>(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const currentPlan =
    activeTrack === '10-year' ? KUCHIPUDI_10_YEAR_PLAN : KUCHIPUDI_6_YEAR_PLAN;
  const currentTrackInfo = {
    title: currentPlan.title,
    description: currentPlan.summary,
    pacing: 'targetAudience' in currentPlan ? currentPlan.targetAudience : 'Fast-track',
  };

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
    <div id="curriculum" className="w-full space-y-8 scroll-mt-24">
      {/* Header & Track Selector Card with Concentric Radii */}
      <div className="bento-card rounded-md sm:rounded-md border border-line p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-line">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
              Official Master Syllabus
            </p>
            <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-ink tracking-wide uppercase">
              YEAR-WISE MASTER CURRICULUM
            </h2>
            <p className="text-ink-2 text-xs sm:text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              Structured classical training prioritizing developmental pacing, physical safety, and artistic depth — leading to recognized Certificate Public Examinations.
            </p>
          </div>

          {/* Track Switcher with Tactile Press & Clear Focus */}
          <div className="flex flex-col sm:flex-row gap-2 bg-canvas p-2 rounded-md border border-line self-start lg:self-center shadow-inner">
            <button
              onClick={() => {
                setActiveTrack('10-year');
                setExpandedYear(1);
                setSelectedFilter('all');
              }}
              className={`px-5 py-3 rounded-md text-xs font-mono font-bold uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl cursor-pointer ${
                activeTrack === '10-year'
                  ? 'bg-bl text-blk font-black shadow-md'
                  : 'text-ink-2 hover:text-ink hover:bg-surface/50'
              }`}
            >
              
              10-Year Master Plan
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/15 text-current ml-1 font-bold">
                Ages 5–7
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTrack('6-year');
                setExpandedYear(1);
                setSelectedFilter('all');
              }}
              className={`px-5 py-3 rounded-md text-xs font-mono font-bold uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl cursor-pointer ${
                activeTrack === '6-year'
                  ? 'bg-bl text-blk font-black shadow-md'
                  : 'text-ink-2 hover:text-ink hover:bg-surface/50'
              }`}
            >
              
              6-Year Certificate
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/15 text-current ml-1 font-bold">
                Fast-Track
              </span>
            </button>
          </div>
        </div>

        {/* Current Track Overview Banner */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-canvas p-5 rounded-md border border-line">
          <div>
            <h3 className="font-anton text-base sm:text-lg text-ink flex items-center gap-2 tracking-wide uppercase">
              <Compass size={16} className="text-bl" />
              {currentTrackInfo.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-2 mt-1">
              {currentTrackInfo.description}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-ink-3">Pacing:</span>
            <span className="px-3 py-1 rounded-md bg-surface border border-line text-xs font-mono font-bold text-bl">
              {currentTrackInfo.pacing}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-line">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3 self-center mr-2">
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
              className={`text-xs font-mono px-3.5 py-1.5 rounded-md border transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-bl text-blk border-bl font-bold shadow-sm'
                  : 'bg-canvas border-line text-ink-2 hover:text-ink hover:border-bl/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Year-by-Year Syllabus Accordions with Concentric Radii */}
      <div className="space-y-3">
        {filteredYears.map((item: CurriculumYear) => {
          const isExpanded = expandedYear === item.year;
          return (
            <div
              key={item.year}
              className={`bento-card rounded-md transition-all duration-300 overflow-hidden p-0 ${
                isExpanded
                  ? 'border-bl ring-1 ring-bl/20 shadow-md'
                  : 'border-line hover:border-bl/40'
              }`}
            >
              {/* Year Header / Summary Bar */}
              <button
                onClick={() => toggleYear(item.year)}
                className="w-full text-left p-5 sm:p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-canvas/40 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-canvas border border-line flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-3">Year</span>
                    <span className="text-xl font-anton text-bl leading-none">{item.year}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-canvas border border-line text-ink">
                        {item.level}
                      </span>
                      {item.stageName && (
                        <span className="text-xs text-ink-3 font-medium">
                          • {item.stageName}
                        </span>
                      )}
                    </div>
                    <h3 className="font-anton text-lg md:text-xl text-ink mt-1 tracking-wide">
                      {item.stageName || `${item.level} — Year ${item.year}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <span className="text-xs font-mono text-ink-3 hidden sm:inline-block">
                    {item.theory.length} Theory / {item.practical.length} Practical units
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-transform duration-300 ease-out ${
                      isExpanded
                        ? 'bg-bl text-blk border-bl rotate-180'
                        : 'bg-surface border-line text-ink-2'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              </button>

              {/* Detailed Breakdown with Smooth Fade In */}
              {isExpanded && (
                <div className="px-5 pb-6 md:px-8 md:pb-8 pt-2 border-t border-line/60 bg-canvas/30 space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theory Column */}
                    <div className="bg-canvas p-5 rounded-md border border-line">
                      <div className="flex items-center gap-2 text-ink font-bold text-xs font-mono uppercase tracking-wider mb-4 text-bl">
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
                    <div className="bg-canvas p-5 rounded-md border border-line">
                      <div className="flex items-center gap-2 text-ink font-bold text-xs font-mono uppercase tracking-wider mb-4 text-bl">
                        <Activity size={16} />
                        Practical &amp; Repertoire
                      </div>
                      <ul className="space-y-2.5">
                        {item.practical.map((line: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-ink-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-bl mt-2 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Learning Outcome Banner with Concentric Radius */}
                  <div className="p-5 rounded-md bg-canvas border border-bl/30 flex items-start gap-3.5 shadow-sm">
                    <Award className="text-bl shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-bl mb-1">
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

      {/* Assessment Matrix & Progression Guidelines Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Assessment Criteria Card */}
        <Reveal>
          <div className="bento-card rounded-md p-6 md:p-8 h-full flex flex-col justify-between hover:border-bl/40 transition-colors border border-line">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-md bg-bl/10 text-bl flex items-center justify-center border border-bl/20">
                  
                </div>
                <div>
                  <h3 className="font-anton text-2xl text-ink tracking-wide uppercase">
                    ANNUAL ASSESSMENT CRITERIA
                  </h3>
                  <p className="text-xs text-ink-2">
                    Comprehensive Year-End Theory &amp; Practical Evaluation
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(activeTrack === '10-year'
                  ? KUCHIPUDI_10_YEAR_PLAN.assessmentCriteria
                  : KUCHIPUDI_6_YEAR_PLAN.assessmentParameters
                ).map((param: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-md bg-canvas border border-line hover:border-bl/30 transition-colors"
                  >
                    <div className="font-bold text-xs font-mono uppercase tracking-wider text-ink mb-1 flex items-center gap-2">
                      <Award size={15} className="text-bl shrink-0" />
                      {param.title}
                    </div>
                    <p className="text-xs md:text-sm text-ink-2 leading-relaxed">
                      {param.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line text-xs text-ink-3">
              Formal Certificate Awarded upon successful assessment at each level tier.
            </div>
          </div>
        </Reveal>

        {/* Progression & Mastery Guidelines Card */}
        <Reveal delay={0.08}>
          <div className="bento-card rounded-md p-6 md:p-8 h-full flex flex-col justify-between hover:border-bl/40 transition-colors border border-line">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-md bg-bl/10 text-bl flex items-center justify-center border border-bl/20">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="font-anton text-2xl text-ink tracking-wide uppercase">
                    PROGRESSION &amp; MASTERY MODEL
                  </h3>
                  <p className="text-xs text-ink-2">
                    Merit-based pacing, safety, and individual growth
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(activeTrack === '10-year'
                  ? KUCHIPUDI_10_YEAR_PLAN.progressionModel
                  : KUCHIPUDI_6_YEAR_PLAN.progressAndMastery
                ).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-md bg-canvas border border-line hover:border-bl/30 transition-colors"
                  >
                    <div className="font-bold text-xs font-mono uppercase tracking-wider text-ink mb-1 flex items-center gap-2">
                      <Award size={15} className="text-bl shrink-0" />
                      {item.title}
                    </div>
                    <p className="text-xs md:text-sm text-ink-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA inside Matrix with Tactile Button */}
            <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-ink">Ready to begin your journey?</div>
                <div className="text-[11px] text-ink-2">Free trial class &amp; diagnostic alignment check.</div>
              </div>
              <Link
                href="/enrol?programme=kuchipudi"
                className="btn-sun w-full sm:w-auto text-center text-xs font-black uppercase tracking-[0.18em] py-3.5 px-6 shadow-sm active:scale-[0.96]"
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
