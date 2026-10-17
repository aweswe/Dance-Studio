'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { enrolHref } from '@/lib/utils/constants';
import { KATHAK_SYLLABUS } from '@/data/kathak-syllabus';
import { KathakSyllabusLevels } from '@/components/public/kathak-syllabus-levels';
import { KathakRoadMap } from '@/components/public/kathak-road-map';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { sectionPadLg } from '@/lib/ui/section-layout';
import { Reveal } from '@/components/motion/reveal';
import {
  ChevronDown,
  Clock,
  IndianRupee,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 sm:py-5 text-left group cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-bold text-sm sm:text-base text-ink group-hover:text-bl transition-colors leading-snug">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={cn('text-ink-3 shrink-0 transition-transform duration-200', open && 'rotate-180 text-bl')}
        />
      </button>
      {open && (
        <div className="pb-5 pt-1 text-sm text-ink-2 leading-relaxed max-w-3xl pr-4 font-normal">
          <p>{a}</p>
        </div>
      )}
    </div>
  );
}

export function KathakSyllabusContent() {
  return (
    <PublicPage>
      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO SECTION — Clean Editorial Classical Presentation
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-canvas text-ink border-b border-line">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
          <div className="px-0 sm:px-10 lg:px-12 xl:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column — Clean Copy & Actions */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-bl shrink-0" />
                  <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider sm:tracking-[0.16em] text-bl whitespace-nowrap">
                    Structured Classical Curriculum · Ages 5+ &amp; Adults
                  </p>
                </div>

                <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink uppercase tracking-tight leading-tight">
                  Structured Kathak Training
                </h1>
                <p className="font-serif italic text-lg sm:text-2xl text-ink-2 font-normal mt-1 mb-4 leading-snug">
                  From Foundational Rhythm to Masterful Stage Performance
                </p>

                <p className="text-sm sm:text-base text-ink-2 leading-relaxed max-w-xl font-normal mb-6">
                  {KATHAK_SYLLABUS.intro}
                </p>

                {/* Clean Studio Metadata Chips */}
                <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-7">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-line text-xs text-ink font-mono font-medium shadow-2xs">
                    <Clock size={13} className="text-bl shrink-0" />
                    <span>Fri &amp; Sat · 6:30–7:30 PM</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-line text-xs text-ink font-mono font-medium shadow-2xs">
                    <MapPin size={13} className="text-bl shrink-0" />
                    <span>Neredmet X Road Studio</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-line text-xs text-ink font-mono font-medium shadow-2xs">
                    <IndianRupee size={13} className="text-bl shrink-0" />
                    <span>₹2,000 / mo · ₹5,000 / qtr</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-line text-xs text-ink font-mono font-medium shadow-2xs">
                    <Award size={13} className="text-bl shrink-0" />
                    <span>Gandharva Mahavidyalaya Track</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={enrolHref({ programme: 'classical-dance', intent: 'trial' })}
                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs"
                  >
                    <span>Enquire About Admissions</span>
                  </Link>
                  <Link
                    href="#curriculum"
                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-line text-ink hover:border-ink/50 bg-surface transition-colors"
                  >
                    <span>Explore 5-Level Syllabus</span>
                  </Link>
                  <Link
                    href="/syllabus/kuchipudi"
                    className="inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-bl transition-colors py-2 px-1 font-mono font-bold uppercase tracking-wider"
                  >
                    <span>Also view Kuchipudi</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Right Column — Authentic Architectural Classical Showcase Card (Zero AI images) */}
              <div className="lg:col-span-5 w-full">
                <div className="relative rounded-md border border-line bg-surface p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-bold block">
                        LUCKNOW &amp; JAIPUR LINEAGE
                      </span>
                      <h3 className="font-anton text-xl sm:text-2xl text-ink uppercase tracking-wide">
                        Kathak Classical Foundations
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-bl/10 border border-bl/20 text-bl text-[10px] font-mono font-bold uppercase">
                      5 Levels
                    </span>
                  </div>

                  {/* Teental Metric Cycle Visual Box */}
                  <div className="p-4 rounded-md bg-canvas border border-line space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ink">
                      <span>TEENTAL METRIC CYCLE</span>
                      <span className="text-bl font-mono">16 BEATS</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px] font-semibold">
                      <div className="p-2 rounded bg-surface border border-line text-ink">
                        <span className="block text-[9px] text-bl font-bold">SAM (1)</span>
                        Dha Dhin Dhin Dha
                      </div>
                      <div className="p-2 rounded bg-surface border border-line text-ink">
                        <span className="block text-[9px] text-ink-3">TAALI (5)</span>
                        Dha Dhin Dhin Dha
                      </div>
                      <div className="p-2 rounded bg-surface border border-line text-ink">
                        <span className="block text-[9px] text-ink-3">KHALI (9)</span>
                        Dha Tin Tin Ta
                      </div>
                      <div className="p-2 rounded bg-surface border border-line text-ink">
                        <span className="block text-[9px] text-ink-3">TAALI (13)</span>
                        Ta Dhin Dhin Dha
                      </div>
                    </div>
                    <p className="text-[10px] text-ink-3 font-mono pt-1">
                      Tatkar Footwork Formula: Ta · Thei · Thei · Tat | Aa · Thei · Thei · Tat
                    </p>
                  </div>

                  {/* 3 Core Technical Highlights */}
                  <div className="space-y-2.5 text-xs text-ink-2 font-medium">
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-bl shrink-0 mt-1.5" />
                      <span>
                        <strong className="text-ink">Ghungroo Progression: </strong>
                        50 ankle bells in Foundation advancing to 150–200 bells for virtuoso sound resonance.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-bl shrink-0 mt-1.5" />
                      <span>
                        <strong className="text-ink">Chakkars (Spins): </strong>
                        Systematic spot-fixation drills from 1-foot balance to 27 rapid continuous pirouettes.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-bl shrink-0 mt-1.5" />
                      <span>
                        <strong className="text-ink">Padhant Recitation: </strong>
                        Mastery of oral bol recitation with hands marking metric claps before floor execution.
                      </span>
                    </div>
                  </div>

                  {/* Bottom Note */}
                  <div className="pt-3 border-t border-line flex items-center justify-between text-[11px] font-mono text-ink-3">
                    <span>Ages 5+ to Adults</span>
                    <span className="text-bl font-bold">Zero Admission Fee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. PHILOSOPHY & PEDAGOGY (What Makes This Training Different)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={sectionPadLg}>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
            {/* Left Narrative */}
            <div>
              <HomepageSectionHeading
                eyebrow="Philosophy & Pedagogy"
                title="What makes this training"
                accent="different"
                className="mb-4"
              />
              <p className="font-serif italic text-lg sm:text-xl text-ink leading-snug font-semibold mb-4">
                &ldquo;Kathak is the living pulse of rhythm, speed, and subtle emotional nuance. We teach dancers to master the mathematics of Tala and the soul of Abhinaya.&rdquo;
              </p>
              <div className="text-sm sm:text-base text-ink-2 space-y-3 leading-relaxed">
                <p>
                  Kathak derives its name from the Sanskrit word <em>Katha</em>, meaning story — &ldquo;Katha kahe so Kathak kahave&rdquo; (He who tells a story is a Kathak). Originating in the temples of North India and later refined in royal courts, it unites mathematical rhythmic footwork with delicate, soulful theatrical mime.
                </p>
                <p>
                  Our curriculum at Rhythmzz Academy is structured as a clear, sequential path. Dancers develop crisp footwork, effortless pirouette control, oral rhythmic recitation, and nuanced characterization across each graded milestone.
                </p>
              </div>
            </div>

            {/* Right Distinct Bento Cards */}
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {KATHAK_SYLLABUS.differentiators.map(({ title, body, badge }) => (
                <div
                  key={title}
                  className="p-5 rounded-md border border-line bg-surface hover:border-bl/40 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-base text-ink">{title}</h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-bl bg-bl/10 border border-bl/20 px-2 py-0.5 rounded font-bold">
                      {badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-medium">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. WHO CAN JOIN & BATCH ADMISSIONS BOX
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Admissions & Batches"
            title="Who can join & batch"
            accent="schedule"
            description="We welcome beginners and continuing students into age-aligned cohorts with dedicated faculty attention."
          />

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {KATHAK_SYLLABUS.whoCanJoin.map(({ title, subtitle, body }) => (
              <div
                key={title}
                className="p-5 rounded-md border border-line bg-surface hover:border-bl/40 transition-colors flex flex-col justify-between shadow-2xs h-full"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-bl font-bold block mb-1">
                    {subtitle}
                  </span>
                  <h4 className="font-bold text-base text-ink mb-2">{title}</h4>
                  <p className="text-xs text-ink-2 leading-relaxed font-medium">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Clean High-Contrast Batch Admissions Box */}
          <div className="rounded-md bg-surface text-ink border border-line p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-bl block mb-1">
                    ◆ BATCH-BASED ADMISSIONS
                  </span>
                  <h3 className="font-anton text-2xl sm:text-3xl text-ink uppercase tracking-wide">
                    Now Enrolling: Regular &amp; Weekend Classical Batches
                  </h3>
                </div>
                <Link
                  href={enrolHref({ programme: 'classical-dance', intent: 'trial' })}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shrink-0 shadow-xs"
                >
                  Book Introductory Class
                </Link>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="p-4 rounded-md bg-canvas border border-line text-center">
                  <p className="font-anton text-xl sm:text-2xl text-ink tracking-wide">Fri &amp; Sat</p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-bl font-bold mt-1">2 Days / Week</p>
                </div>
                <div className="p-4 rounded-md bg-canvas border border-line text-center">
                  <p className="font-anton text-xl sm:text-2xl text-ink tracking-wide">6:30 – 7:30 PM</p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-bl font-bold mt-1">Evening Timing</p>
                </div>
                <div className="p-4 rounded-md bg-canvas border border-line text-center">
                  <p className="font-anton text-xl sm:text-2xl text-ink tracking-wide">₹2,000</p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-bl font-bold mt-1">Per Month (or ₹5k/qtr)</p>
                </div>
                <div className="p-4 rounded-md bg-canvas border border-line text-center">
                  <p className="font-anton text-xl sm:text-2xl text-ink tracking-wide">Ages 5+</p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-bl font-bold mt-1">Kids &amp; Adults</p>
                </div>
              </div>

              <div className="p-4 rounded-md bg-canvas border border-line text-xs sm:text-sm text-ink-2 leading-relaxed font-serif italic">
                Note: Because classical Kathak is a progressive rhythmic discipline, students are admitted in structured cohorts so that everyone learns sequentially. Small batch sizes ensure hands-on posture, spin, and footwork corrections from faculty.
              </div>
            </div>
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. THE KATHAK ROADMAP (Racetrack Progression Component)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={sectionPadLg}>
        <Reveal>
          <KathakRoadMap />
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. COMPREHENSIVE COURSE STRUCTURE — 5 GRADED LEVELS
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection id="curriculum" className={cn('bg-canvas-muted scroll-mt-20 sm:scroll-mt-24', sectionPadLg)}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Academic Curriculum"
            title="Comprehensive course"
            accent="structure"
            description="Explore our five graded levels: from foundational body posture and Teental footwork to pre-professional improvisation and solo masterclass performance."
          />

          {/* Interactive Syllabus Explorer */}
          <div className="p-5 sm:p-7 md:p-8 rounded-md bg-surface border border-line shadow-sm mb-8">
            <KathakSyllabusLevels />
          </div>


        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. TRAINING BY AGE PATHWAYS
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={sectionPadLg}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Age Pacing"
            title="Training by age"
            accent="pathways"
            description="Curriculum pacing evolves naturally as students grow in physical stamina, rhythmic coordination, and expressive readiness."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {KATHAK_SYLLABUS.agePathways.map(({ age, label, body, accent }) => (
              <div
                key={age}
                className="p-5 rounded-md border border-line bg-surface flex flex-col justify-between hover:border-bl/40 transition-colors shadow-2xs h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                      {age}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-canvas border border-line text-bl px-2 py-0.5 rounded font-bold">
                      {accent}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-ink mb-2">{label}</h3>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-medium">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. THE FOUR PILLARS OF KATHAK
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Classical Core"
            title="The four pillars of"
            accent="Kathak"
            description="The complete technical and expressive architecture of classical Kathak dance."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {KATHAK_SYLLABUS.pillars.map(({ title, subtitle, body, points }) => (
              <div
                key={title}
                className="p-6 rounded-md border-t-4 border-t-bl border border-line bg-surface shadow-2xs flex flex-col justify-between h-full"
              >
                <div>
                  <p className="font-anton text-2xl sm:text-3xl text-ink uppercase tracking-wide">
                    {title}
                  </p>
                  <p className="text-xs font-serif italic text-bl font-bold mt-0.5 mb-3">
                    {subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-medium mb-4">{body}</p>
                </div>
                <ul className="space-y-1.5 border-t border-line pt-3">
                  {points.map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs text-ink-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-bl shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. AUTHENTIC STUDIO TRAINING PHOTO STRIP
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 p-2 sm:p-4 bg-canvas border-y border-line">
        {[
          { src: '/images/kathak/kathak-photo-1.jpg', alt: 'Indian Kathak classical dancer in traditional Lucknow gharana posture' },
          { src: '/images/kathak/kathak-photo-2.jpg', alt: 'Classical Kathak brass ghungroos and Tatkar footwork' },
          { src: '/images/kathak/kathak-photo-3.jpg', alt: 'Indian Kathak dancer executing Hastak and classical Abhinaya' },
          { src: '/images/kathak/kathak-photo-4.jpg', alt: 'Live classical sitar and tabla musical accompaniment for Kathak' },
          { src: '/images/kathak/kathak-photo-5.jpg', alt: 'Dynamic Kathak Chakkar pirouette spin with swirling dupatta' },
        ].map((item, idx) => (
          <div key={idx} className="relative aspect-[3/4] rounded-md overflow-hidden border border-line bg-surface group shadow-2xs">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              loading="lazy"
              className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. TRADITIONAL PERFORMANCE REPERTOIRE (The Kathak Manch Suite)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={sectionPadLg}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Classical Manch Suite"
            title="Traditional performance"
            accent="repertoire"
            description="The complete classical Kathak concert sequence progressing from sacred invocation and courtly entry pieces to rapid technical compositions and the climactic Tatkar Jugalbandi."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {KATHAK_SYLLABUS.repertoire.map((item, idx) => {
              const isFinale = idx === KATHAK_SYLLABUS.repertoire.length - 1;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'p-5 sm:p-6 rounded-md border flex flex-col justify-between hover:border-bl/40 hover:shadow-md transition-all group h-full',
                    isFinale
                      ? 'border-bl/40 bg-bl/5 shadow-2xs'
                      : 'border-line bg-surface shadow-2xs',
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black font-anton tracking-wide uppercase text-ink">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-canvas border border-line text-bl font-bold uppercase tracking-wider">
                        {item.focus}
                      </span>
                    </div>
                    <h3 className="font-anton tracking-wide uppercase text-lg sm:text-xl text-ink mb-1 group-hover:text-bl transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3 font-semibold block mb-2.5">
                      {item.type}
                    </span>
                    <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[10px] font-mono text-ink-3 font-semibold">
                    <span>Kathak Repertoire</span>
                    <span className="text-bl font-bold">Classical Manch</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          10. MANCH PRAVESH — The Solo Stage Debut
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Visual Frame using Authentic Stage / Bento Asset */}
            <div className="lg:col-span-5 relative aspect-[3/4] rounded-md overflow-hidden border border-line shadow-lg bg-surface">
              <Image
                src="/images/kathak/kathak-manch-pravesh.jpg"
                alt="Kathak Manch Pravesh solo stage debut performance at Rhythmzz Academy"
                fill
                loading="lazy"
                className="object-cover object-[center_top]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>

            {/* Text Editorial */}
            <div className="lg:col-span-7">
              <HomepageSectionHeading
                eyebrow="Solo Graduation"
                title="Manch Pravesh — Entry to the"
                accent="Stage"
                className="mb-4"
              />
              <p className="text-ink-2 text-sm sm:text-base leading-relaxed mb-3 font-medium">
                &ldquo;Entry to the stage&rdquo; — a Kathak dancer&apos;s formal graduation into artistic maturity and solo performance. Manch Pravesh represents years of accumulated technical stamina, speed, rhythm mathematics, and expressive depth.
              </p>
              <p className="text-ink-2 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Performed with a complete live classical ensemble (Tabla, Harmonium, Vocalist, and Padhant recitation), it demonstrates full artistic independence under the guidance of senior faculty.
              </p>

              {/* 6 Pillars of Readiness */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {KATHAK_SYLLABUS.manchPraveshPillars.map((req) => (
                  <div key={req} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink font-medium">
                    <CheckCircle2 size={16} className="text-bl shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          11. CLASS STRUCTURE & ACADEMIC RIGOUR
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={sectionPadLg}>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Inside a class */}
            <div>
              <HomepageSectionHeading
                eyebrow="Classroom Experience"
                title="Inside a typical"
                accent="class"
                description="Every 60-minute session follows a disciplined progression ensuring joint safety, rhythm conditioning, and steady advancement."
                className="mb-6"
              />
              <div className="space-y-3.5">
                {KATHAK_SYLLABUS.classSteps.map(({ n, title, body }) => (
                  <div key={n} className="flex items-start gap-4 p-4 rounded-md bg-surface border border-line shadow-2xs">
                    <span className="font-mono text-xl font-black text-bl w-7 shrink-0">
                      {String(n).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-ink">{title}</p>
                      <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-medium mt-0.5">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Theory & Culture */}
            <div>
              <HomepageSectionHeading
                eyebrow="Academic Rigour"
                title="Theory & cultural"
                accent="education"
                description="A serious classical dance education includes cognitive understanding of Indian rhythmic structures and aesthetic treatises."
                className="mb-6"
              />
              <div className="p-6 rounded-md border border-line bg-surface space-y-4 shadow-2xs">
                <p className="text-xs font-mono uppercase tracking-wider text-bl font-bold mb-1">
                  Key Theoretical Modules
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-ink-2 font-medium">
                  {KATHAK_SYLLABUS.theoryTopics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-bl font-black">◆</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-line text-xs text-ink-3 font-medium leading-relaxed">
                  Students are prepared for certified board examinations with Gandharva Mahavidyalaya and accredited university degrees.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          12. FREQUENTLY ASKED QUESTIONS
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-14">
            <div>
              <HomepageSectionHeading
                eyebrow="Common Inquiries"
                title="Frequently asked"
                accent="questions"
                description="Have questions about age placement, ghungroos, or batch admissions? Reach out to our admissions desk anytime."
                className="mb-4"
              />
              <div className="p-4 rounded-md bg-surface border border-line text-xs space-y-2 shadow-2xs">
                <p className="font-bold text-ink">Admissions Support</p>
                <p className="text-ink font-semibold">+91 90529 80859</p>
                <p className="text-ink-3">Rhythmzz Academy, Neredmet X Road</p>
              </div>
            </div>

            <div className="border-t border-line">
              {KATHAK_SYLLABUS.faqs.map(({ q, a }) => (
                <FaqAccordionItem key={q} q={q} a={a} />
              ))}
            </div>
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          13. FINAL ENROLMENT CTA
      ═══════════════════════════════════════════════════════════════════════ */}
      <PublicBookTrialCta
        eyebrow="Classical Admissions"
        title="Begin Your"
        accent="Kathak Journey"
        description="Experience the rhythmic power, grace, and storytelling of classical Kathak. Book an introductory trial class or contact our admissions desk to discuss batch placement."
        primaryHref={enrolHref({ programme: 'classical-dance', intent: 'trial' })}
        primaryLabel="Book Introductory Class"
      />
    </PublicPage>
  );
}
