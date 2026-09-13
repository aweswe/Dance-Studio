'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KUCHIPUDI_10_YEAR_PLAN,
  KUCHIPUDI_6_YEAR_PLAN,
  CurriculumYear,
} from '@/data/kuchipudi';
import { KATHAK_CURRICULUM_PLAN, KathakCurriculumYear } from '@/data/kathak';
import {
  BookOpen,
  Award,
  ChevronDown,
  GraduationCap,
  Zap,
  Compass,
} from 'lucide-react';

export function ClassicalCurriculumMatrix() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<'kuchipudi' | 'kathak'>('kuchipudi');
  const [activeKuchipudiTrack, setActiveKuchipudiTrack] = useState<'10-year' | '6-year'>('10-year');
  const [expandedYear, setExpandedYear] = useState<number | null>(1);

  const toggleYear = (year: number) => {
    setExpandedYear((prev) => (prev === year ? null : year));
  };

  const currentKuchipudiPlan =
    activeKuchipudiTrack === '10-year' ? KUCHIPUDI_10_YEAR_PLAN : KUCHIPUDI_6_YEAR_PLAN;

  return (
    <div id="curriculum" className="w-full space-y-8 scroll-mt-24">
      {/* Header & Discipline Selector */}
      <div className="bento-card rounded-[28px] sm:rounded-[36px] border border-line p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-line">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
              Official Classical Syllabi
            </p>
            <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-ink tracking-wide uppercase">
              STRUCTURED LEVEL-BASED CERTIFICATION
            </h2>
            <p className="text-ink-2 text-xs sm:text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
              We offer structured certification curriculums across classical arts: <strong>Kuchipudi, Kathak, Bharatnatyam, and Ballet</strong>. Detailed master syllabi are active below for <strong>Kuchipudi</strong> and <strong>Kathak</strong>.
            </p>
          </div>

          {/* Discipline Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline('kuchipudi');
                setExpandedYear(1);
              }}
              className={`px-5 py-3 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                selectedDiscipline === 'kuchipudi'
                  ? 'bg-[#F5FB38] text-black shadow-md shadow-[#F5FB38]/20 ring-2 ring-black/10'
                  : 'bg-canvas text-ink hover:text-[#7C5CFC] border border-line'
              }`}
            >
              <span>Kuchipudi Syllabus</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline('kathak');
                setExpandedYear(1);
              }}
              className={`px-5 py-3 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                selectedDiscipline === 'kathak'
                  ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/20 ring-2 ring-[#7C5CFC]/30'
                  : 'bg-canvas text-ink hover:text-[#7C5CFC] border border-line'
              }`}
            >
              
              <span>Kathak (Lucknow Gharana)</span>
            </button>
          </div>
        </div>

        {/* Discipline Metadata Banner */}
        {selectedDiscipline === 'kuchipudi' ? (
          <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-ink-3 uppercase tracking-wider font-semibold mr-1">
                Kuchipudi Track:
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveKuchipudiTrack('10-year');
                  setExpandedYear(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activeKuchipudiTrack === '10-year'
                    ? 'bg-ink text-canvas shadow-sm'
                    : 'bg-canvas text-ink-2 hover:text-ink border border-line'
                }`}
              >
                10-Year Master (Foundation)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveKuchipudiTrack('6-year');
                  setExpandedYear(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activeKuchipudiTrack === '6-year'
                    ? 'bg-[#7C5CFC] text-white shadow-sm'
                    : 'bg-canvas text-ink-2 hover:text-ink border border-line'
                }`}
              >
                6-Year Certificate (Accelerated)
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-ink-2 bg-canvas px-4 py-2.5 rounded-xl border border-line">
              <span className="w-2 h-2 rounded-full bg-[#7C5CFC] shrink-0" />
              <span>Lineage: Dr. Vempati Chinna Satyam · Guru Srushti</span>
            </div>
          </div>
        ) : (
          <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-ink-2">
              <span className="text-[11px] font-mono text-ink-3 uppercase tracking-wider font-semibold mr-1">
                Tradition:
              </span>
              <span className="px-3 py-1 rounded-lg bg-canvas border border-line text-ink font-bold">
                Lucknow Gharana
              </span>
              <span className="px-3 py-1 rounded-lg bg-canvas border border-line text-ink font-bold">
                Tatkar · Chakkars · Abhinaya
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#7C5CFC]/10 text-[#7C5CFC] border border-[#7C5CFC]/20 font-bold">
                Prarambhik → Visharad
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-ink-2 bg-canvas px-4 py-2.5 rounded-xl border border-line">
              <Award size={16} className="text-[#7C5CFC]" />
              <span>Guru Poonam Nayak Jamwale · Gandharva Mahavidyalaya</span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {selectedDiscipline === 'kuchipudi'
          ? currentKuchipudiPlan.years.map((item: CurriculumYear) => {
              const isExpanded = expandedYear === item.year;
              return (
                <div
                  key={`kuchipudi-${activeKuchipudiTrack}-${item.year}`}
                  className={`bento-card rounded-[24px] border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? 'border-[#7C5CFC]/50 shadow-md ring-1 ring-[#7C5CFC]/20 bg-surface'
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
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-anton text-xl shrink-0 transition-colors ${
                          isExpanded
                            ? 'bg-[#F5FB38] text-black shadow-sm'
                            : 'bg-canvas text-ink border border-line'
                        }`}
                      >
                        Y{item.year}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7C5CFC] font-bold">
                            {item.level}
                          </span>
                          <span className="w-1 h-1 rounded-md bg-line-strong" />
                          <span className="text-[11px] font-mono text-ink-3 uppercase">
                            Kuchipudi Classical
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
                        {/* Theory */}
                        <div className="bg-canvas p-5 rounded-2xl border border-line space-y-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#7C5CFC]">
                            <BookOpen size={16} />
                            <span>Theoretical Knowledge</span>
                          </div>
                          <ul className="space-y-2">
                            {item.theory.map((t, idx) => (
                              <li key={idx} className="text-xs sm:text-sm text-ink-2 flex items-start gap-2 leading-relaxed">
                                <span className="text-[#7C5CFC] font-bold mt-0.5">•</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Practical */}
                        <div className="bg-canvas p-5 rounded-2xl border border-line space-y-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black">
                            <Zap size={16} className="text-[#F5FB38]" />
                            <span className="text-ink">Practical Repertoire</span>
                          </div>
                          <ul className="space-y-2">
                            {item.practical.map((p, idx) => (
                              <li key={idx} className="text-xs sm:text-sm text-ink-2 flex items-start gap-2.5 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] shrink-0 mt-2" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Learning Outcome */}
                      <div className="p-4 bg-canvas rounded-2xl border border-line flex items-start gap-3 text-xs sm:text-sm text-ink-2">
                        <GraduationCap size={18} className="text-[#7C5CFC] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-ink font-semibold uppercase text-[11px] font-mono tracking-wider block mb-0.5">
                            Target Learning Outcome:
                          </strong>
                          <span>{item.learningOutcome}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          : KATHAK_CURRICULUM_PLAN.years.map((item: KathakCurriculumYear) => {
              const isExpanded = expandedYear === item.year;
              return (
                <div
                  key={`kathak-${item.year}`}
                  className={`bento-card rounded-[24px] border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? 'border-[#7C5CFC]/50 shadow-md ring-1 ring-[#7C5CFC]/20 bg-surface'
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
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-anton text-xl shrink-0 transition-colors ${
                          isExpanded
                            ? 'bg-[#7C5CFC] text-white shadow-sm'
                            : 'bg-canvas text-ink border border-line'
                        }`}
                      >
                        Y{item.year}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7C5CFC] font-bold">
                            {item.level}
                          </span>
                          <span className="w-1 h-1 rounded-md bg-line-strong" />
                          <span className="text-[10px] font-mono text-black font-bold bg-[#F5FB38] px-2 py-0.5 rounded-md uppercase">
                            {item.boardCertification}
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
                        {/* Theory */}
                        <div className="bg-canvas p-5 rounded-2xl border border-line space-y-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#7C5CFC]">
                            <BookOpen size={16} />
                            <span>Kathak Shastra &amp; Tala Theory</span>
                          </div>
                          <ul className="space-y-2">
                            {item.theory.map((t, idx) => (
                              <li key={idx} className="text-xs sm:text-sm text-ink-2 flex items-start gap-2 leading-relaxed">
                                <span className="text-[#7C5CFC] font-bold mt-0.5">•</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Practical */}
                        <div className="bg-canvas p-5 rounded-2xl border border-line space-y-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black">
                            <Zap size={16} className="text-[#F5FB38]" />
                            <span className="text-ink">Tatkar, Chakkars &amp; Repertoire</span>
                          </div>
                          <ul className="space-y-2">
                            {item.practical.map((p, idx) => (
                              <li key={idx} className="text-xs sm:text-sm text-ink-2 flex items-start gap-2.5 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] shrink-0 mt-2" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Learning Outcome */}
                      <div className="p-4 bg-canvas rounded-2xl border border-line flex items-start gap-3 text-xs sm:text-sm text-ink-2">
                        <GraduationCap size={18} className="text-[#7C5CFC] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-ink font-semibold uppercase text-[11px] font-mono tracking-wider block mb-0.5">
                            Exam Goal &amp; Learning Outcome:
                          </strong>
                          <span>{item.learningOutcome}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {/* Notice regarding other classical disciplines */}
      <div className="p-6 rounded-[24px] bg-canvas border border-line text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold block">
          Classical Academy Catalog
        </span>
        <p className="text-xs sm:text-sm text-ink-2 max-w-xl mx-auto">
          We offer structured certification tracks for <strong>Kuchipudi, Kathak, Bharatnatyam, and Ballet</strong>. Detailed year-by-year syllabi are active above for <strong>Kuchipudi</strong> and <strong>Kathak</strong>.
        </p>
      </div>
    </div>
  );
}
