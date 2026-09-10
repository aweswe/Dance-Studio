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
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
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
      <div className="bento-card p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FB923C]/10 text-[#FB923C] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-3 border border-[#FB923C]/20">
              <GraduationCap size={15} /> Official Master Syllabus
            </div>
            <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
              YEAR-WISE MASTER CURRICULUM
            </h2>
            <p className="text-ink-2 text-xs sm:text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              Structured classical training prioritizing developmental pacing, physical safety, and artistic depth — leading to recognized Certificate Public Examinations.
            </p>
          </div>

          {/* Track Switcher with Tactile Press & Clear Focus */}
          <div className="flex flex-col sm:flex-row gap-2 bg-canvas p-2 rounded-2xl border border-line self-start lg:self-center shadow-inner">
            <button
              onClick={() => {
                setActiveTrack('10-year');
                setExpandedYear(1);
                setSelectedFilter('all');
              }}
              className={`px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] ${
                activeTrack === '10-year'
                  ? 'btn-peach shadow-md'
                  : 'text-ink-2 hover:text-ink hover:bg-surface/50'
              }`}
            >
              <Layers size={15} />
              10-Year Master Plan
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 text-current ml-1">
                Ages 5–7
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTrack('6-year');
                setExpandedYear(1);
                setSelectedFilter('all');
              }}
              className={`px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] ${
                activeTrack === '6-year'
                  ? 'btn-peach shadow-md'
                  : 'text-ink-2 hover:text-ink hover:bg-surface/50'
              }`}
            >
              <Zap size={15} />
              6-Year Certificate
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 text-current ml-1">
                Fast-Track
              </span>
            </button>
          </div>
        </div>

        {/* Current Track Overview Banner */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-canvas p-5 rounded-2xl border border-line">
          <div>
            <h3 className="heading-urban text-base sm:text-lg text-ink flex items-center gap-2">
              <Compass size={16} className="text-[#FB923C]" />
              {currentPlan.title}
            </h3>
            <p className="text-xs md:text-sm text-ink-2 mt-1 leading-relaxed">
              {currentPlan.summary}
            </p>
          </div>
          {'targetAudience' in currentPlan && (
            <div className="shrink-0 text-xs px-4 py-1.5 rounded-full bg-surface border border-line text-ink font-medium">
              <span className="text-ink-3">Audience:</span> {currentPlan.targetAudience}
            </div>
          )}
        </div>

        {/* Level Filters with Tactile Feedback */}
        <div className="flex flex-wrap gap-2 mt-6">
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
              className={`text-xs font-mono px-3.5 py-1.5 rounded-full border transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] ${
                selectedFilter === tab.id
                  ? 'bg-[#FB923C] text-black border-[#FB923C] font-bold shadow-sm'
                  : 'bg-canvas border-line text-ink-2 hover:text-ink hover:border-[#FB923C]/50'
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
              className={`bento-card transition-all duration-300 overflow-hidden p-0 ${
                isExpanded
                  ? 'border-[#FB923C] ring-1 ring-[#FB923C]/20 shadow-md shadow-[#FB923C]/5'
                  : 'border-line hover:border-[#FB923C]/40'
              }`}
            >
              {/* Year Header / Summary Bar */}
              <button
                onClick={() => toggleYear(item.year)}
                className="w-full text-left p-5 sm:p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-canvas/40 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C]"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-canvas border border-line flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-3">Year</span>
                    <span className="text-xl font-black heading-urban text-[#FB923C] leading-none">{item.year}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-canvas border border-line text-ink">
                        {item.level}
                      </span>
                      {item.stageName && (
                        <span className="text-xs text-ink-3 font-medium">
                          • {item.stageName}
                        </span>
                      )}
                    </div>
                    <h3 className="heading-urban text-lg md:text-xl text-ink mt-1">
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
                        ? 'bg-[#FB923C] text-black border-[#FB923C] rotate-180'
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
                    <div className="bg-canvas p-5 rounded-xl border border-line">
                      <div className="flex items-center gap-2 text-ink font-bold text-xs font-mono uppercase tracking-wider mb-4 text-[#FB923C]">
                        <BookOpen size={16} />
                        Theory Syllabus
                      </div>
                      <ul className="space-y-2.5">
                        {item.theory.map((line: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-ink-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] mt-2 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Column */}
                    <div className="bg-canvas p-5 rounded-xl border border-line">
                      <div className="flex items-center gap-2 text-ink font-bold text-xs font-mono uppercase tracking-wider mb-4 text-[#FB923C]">
                        <Activity size={16} />
                        Practical &amp; Repertoire
                      </div>
                      <ul className="space-y-2.5">
                        {item.practical.map((line: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-ink-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] mt-2 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Learning Outcome Banner with Concentric Radius */}
                  <div className="p-5 rounded-xl bg-canvas border border-[#FB923C]/30 flex items-start gap-3.5 shadow-sm">
                    <Award className="text-[#FB923C] shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FB923C] mb-1">
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
          <div className="bento-card p-6 md:p-8 h-full flex flex-col justify-between hover:border-[#FB923C]/30 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FB923C]/10 text-[#FB923C] flex items-center justify-center border border-[#FB923C]/20">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="heading-urban text-2xl text-ink">
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
                    className="p-4 rounded-xl bg-canvas border border-line hover:border-[#FB923C]/30 transition-colors"
                  >
                    <div className="font-bold text-xs font-mono uppercase tracking-wider text-ink mb-1 flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-[#FB923C] shrink-0" />
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
          <div className="bento-card p-6 md:p-8 h-full flex flex-col justify-between hover:border-[#FB923C]/30 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FB923C]/10 text-[#FB923C] flex items-center justify-center border border-[#FB923C]/20">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="heading-urban text-2xl text-ink">
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
                    className="p-4 rounded-xl bg-canvas border border-line hover:border-[#FB923C]/30 transition-colors"
                  >
                    <div className="font-bold text-xs font-mono uppercase tracking-wider text-ink mb-1 flex items-center gap-2">
                      <Award size={15} className="text-[#FB923C] shrink-0" />
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
                className="btn-peach w-full sm:w-auto text-center text-xs tracking-[0.18em] py-3 px-6 shadow-sm active:scale-[0.96]"
              >
                Enrol In Kuchipudi ──→
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
