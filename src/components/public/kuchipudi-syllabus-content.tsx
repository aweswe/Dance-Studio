'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { enrolHref, ROUTES } from '@/lib/utils/constants';
import { SyllabusYears } from '@/components/public/syllabus-years';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { homepageCtaBrand, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { sectionPadLg, sectionPadAfterTitleLg, sectionGap } from '@/lib/ui/section-layout';
import { Reveal } from '@/components/motion/reveal';
import { GuruSrushtinidhiSection } from '@/components/public/guru-srushtinidhi-section';
import { KuchipudiRoadMap } from '@/components/public/kuchipudi-road-map';
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
  HeartHandshake,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ─── Data Definitions ────────────────────────────────────────────────────────

const DIFFERENTIATORS = [
  {
    title: 'Foundational Technique',
    body: 'Correct posture, mandala stance, and adugulu from day one so nothing has to be unlearned later.',
    badge: 'Precision',
  },
  {
    title: 'Abhinaya from the Start',
    body: 'Expression and mudras are developed alongside footwork, not bolted on after years of mechanical practice.',
    badge: 'Expression',
  },
  {
    title: 'Real Rhythmic Training',
    body: 'Students learn to recite sollukattus and count Tala cycles, dancing with the music rather than merely to it.',
    badge: 'Laya & Tala',
  },
  {
    title: 'Stage Performance Pathway',
    body: 'Classroom practice culminates in authentic stage presentations, academy recitals, and formal Rangapravesham.',
    badge: 'Stagecraft',
  },
];

const WHO_CAN_JOIN = [
  {
    title: 'Starting Age (5+)',
    subtitle: 'Foundation Entry',
    body: 'Students may begin from 5 years of age. Year 1 foundation is tailored for developing young bodies safely.',
  },
  {
    title: 'Absolute Beginners',
    subtitle: 'No Experience Needed',
    body: 'No previous dance training required. Year 1 assumes zero prior dance background and builds from scratch.',
  },
  {
    title: 'Continuing Dancers',
    subtitle: 'Placement Evaluation',
    body: 'Prior Kuchipudi or classical training is evaluated by senior faculty for the right stage placement.',
  },
  {
    title: 'Teens & Adults (13+)',
    subtitle: 'Dedicated Batches',
    body: 'Adult beginners and mature learners are welcome, with curriculum paced to adult biomechanics.',
  },
];

const ROADMAP_STAGES = [
  { num: 1, label: 'Foundation', desc: 'Posture, basic mandala stance & initial adugulu' },
  { num: 2, label: 'Basic Technique', desc: 'Core adavus, 28 Asamyukta Hastas & Tala counting' },
  { num: 3, label: 'Intermediate', desc: 'Complex footwork, Jathi recitation & Gejje Pooja' },
  { num: 4, label: 'Advanced', desc: 'Repertoire items, Chaturvidha Abhinaya & Navarasas' },
  { num: 5, label: 'Pre-Rangapravesham', desc: 'Recital preparation & full classical item mastery' },
  { num: 6, label: 'Rangapravesham', desc: 'The solo classical stage debut with complete live orchestra', milestone: true },
  { num: 7, label: 'Post-Rangapravesham', desc: 'Artistic mastery, choreography & faculty teaching' },
];

const AGE_PATHWAYS = [
  {
    age: 'Age 5–7',
    label: 'Discover & Build',
    body: 'Cultivates enjoyment of dance, spatial awareness, coordination, basic posture, and fundamental adugulu.',
    accent: 'Foundation',
  },
  {
    age: 'Age 8–10',
    label: 'Build & Strengthen',
    body: 'Focuses on technical clarity, stamina, accurate footwork, early repertoire, and first demonstration opportunities.',
    accent: 'Technique',
  },
  {
    age: 'Age 11–13',
    label: 'Develop & Refine',
    body: 'Introduces more complex rhythmic patterns, abhinaya nuances, and growing expressive stage maturity.',
    accent: 'Abhinaya',
  },
  {
    age: 'Age 14+ & Adults',
    label: 'Advanced & Perform',
    body: 'Advanced traditional repertoire (Tarangam, Shabdam, Padams), artistic interpretation, and Rangapravesham guidance.',
    accent: 'Mastery',
  },
];

const PILLARS = [
  {
    sanskrit: 'Nritta',
    english: 'Pure Dance',
    body: 'Rhythm, movement, and technical precision for their own sake — exploring form, tempo, and geometry.',
    points: ['Basic Adugulu', 'Sthanakam alignment', 'Crisp rhythmic execution'],
  },
  {
    sanskrit: 'Nritya',
    english: 'Expressive Dance',
    body: 'Movement, music, and emotional meaning combined to tell evocative stories through hand gestures and facial expression.',
    points: ['Asamyukta & Samyukta Hastas', 'Rasa & Bhava integration', 'Poetic interpretation'],
  },
  {
    sanskrit: 'Natya',
    english: 'Dramatic Storytelling',
    body: 'Character and theatrical presentation drawn directly from classical Indian dance-drama traditions.',
    points: ['Character portrayal', 'Theatrical dialogue & gait', 'Mythological lore'],
  },
  {
    sanskrit: 'Abhinaya',
    english: 'The Fourfold Expression',
    body: 'The timeless art of communicating emotion through Angika (body), Vachika (voice/music), Aharya (costume), and Satvika (inner truth).',
    points: ['Facial nuances (Mukhaja)', 'Choreographic narrative', 'Spiritual depth'],
  },
];

const REPERTOIRE_ITEMS = [
  {
    id: '01',
    name: 'Poorvarangam',
    type: 'Invocation & Sanctification',
    focus: 'Shlokam & Pushpanjali',
    description:
      'The sacred ritual opening. Dancers sprinkle scented water, offer flowers to Lord Nataraja and Rangadevatha, and offer prayers for artistic auspiciousness.',
  },
  {
    id: '02',
    name: 'Jatiswaram',
    type: 'Pure Technical Nritta',
    focus: 'Swaras & Sculptural Geometry',
    description:
      'Weaving melodic Carnatic Swaras with crisp Jathi footwork patterns. Void of abhinaya, celebrating rhythmic precision and aesthetic body lines.',
  },
  {
    id: '03',
    name: 'Shabdam',
    type: 'Narrative Verse & Mime',
    focus: 'Bhakti Poetry & Rhythms',
    description:
      'The bridge between pure dance and narrative theatre. Verses praising deities or historical patron kings, alternating with brisk Jathi sequences.',
  },
  {
    id: '04',
    name: 'Vinayaka Kauthuvam',
    type: 'Rhythmic Hymn',
    focus: 'Solkattu Mnemonics',
    description:
      'Ancient temple hymn blending recited rhythmic syllables (Sollukattus) with devotional obeisance to Lord Ganesha, remover of obstacles.',
  },
  {
    id: '05',
    name: 'Keerthana',
    type: 'Devotional Masterpiece',
    focus: 'Sanchari Bhavas & Abhinaya',
    description:
      'Rich devotional composition composed by Saint Thyagaraja or Annamacharya. Dancers interpret complex mythological episodes through nuanced facial mime.',
  },
  {
    id: '06',
    name: 'Tarangam',
    type: 'The Pinnacle Hallmark',
    focus: 'Brass Plate Rhythmic Balance',
    description:
      'Kuchipudi’s most famous virtuoso showcase. The dancer executes intricate rhythmic footwork while balancing upon the raised rim of a brass plate, accompanied by live Mridangam.',
  },
  {
    id: '07',
    name: 'Thillana & Mangalam',
    type: 'Climax & Benediction',
    focus: 'Dynamic Laya & Gratitude',
    description:
      'A joyous technical crescendo of sculpturesque postures and brisk footwork, concluding with the Mangalam prayer thanking the Guru, musicians, and spectators.',
  },
];

const CLASS_STEPS = [
  { n: 1, title: 'Warm-up & Body Conditioning', body: 'Spine articulation, foot stretching, and postural alignment.' },
  { n: 2, title: 'Adavus & Technique', body: 'Sequential footwork units with strict teacher corrections.' },
  { n: 3, title: 'Rhythm, Tala & Clapping', body: 'Counting rhythmic cycles (Tala), reciting bol/sollukattu mnemonics.' },
  { n: 4, title: 'Repertoire & Abhinaya', body: 'Applying technique to authentic compositions and expressive items.' },
  { n: 5, title: 'Review & Home Practice', body: 'Consolidating corrections and setting focal points for the week.' },
];

const THEORY_TOPICS = [
  'Hastas (Single & Double-hand classical mudras)',
  'Natyarambham & Dhyana Slokas',
  'Sapta Tala systems & rhythmic cycles',
  'Origins & history of Kuchipudi in Andhra Pradesh',
  'Chaturvidha Abhinaya (Four forms of expression)',
  'Stage etiquette, arangetram traditions & attire',
];

const FAQS = [
  {
    q: 'What is the minimum age to start Kuchipudi?',
    a: 'Five years. Our Year 1 foundation curriculum is developmentally tailored for children starting at this age, emphasizing playful coordination, posture, and joint safety.',
  },
  {
    q: 'Does my child need previous dance experience?',
    a: 'No previous dance training is required. Most students begin with zero dance background. Year 1 builds every movement sequentially from first principles.',
  },
  {
    q: 'Can adults or teenagers join Kuchipudi?',
    a: 'Yes, absolutely. We have adult and teen learners (13+ years) who follow a structured 6-year accelerated pathway tailored to adult biomechanics and artistic maturity.',
  },
  {
    q: 'What are the batch days and timings?',
    a: 'Kuchipudi batches are held on Friday and Saturday from 6:30 PM to 7:30 PM at our Neredmet X Road studio in Secunderabad.',
  },
  {
    q: 'What are the class fees?',
    a: 'Fees are ₹2,000 per month, or ₹5,000 per quarter (saving ₹1,000 compared to monthly). We maintain transparent pricing with no hidden registration surcharges.',
  },
  {
    q: 'How many years does it take to learn Kuchipudi?',
    a: 'Kuchipudi is a multi-year classical art form. Our foundational syllabus is structured across a 10-year master plan (or 6-year accelerated track for older learners), leading towards certified readiness and Rangapravesham.',
  },
  {
    q: 'What is Rangapravesham and is it compulsory?',
    a: 'Rangapravesham is the dancer\'s formal solo stage debut with a live classical orchestra. While it is a celebrated milestone of artistic maturity, it is not compulsory — many students train for joy, technique, and annual academy recitals.',
  },
  {
    q: 'Can we attend an introductory trial class before enrolling?',
    a: 'Yes! We encourage prospective students and parents to attend an introductory session to meet the faculty, observe the classroom atmosphere, and assess level placement.',
  },
];

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

// ─── Main Component ──────────────────────────────────────────────────────────

export function KuchipudiSyllabusContent() {
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
                {/* Clean Editorial Eyebrow — Kept strictly in one line */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-bl shrink-0" />
                  <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider sm:tracking-[0.16em] text-bl whitespace-nowrap">
                    Structured Classical Curriculum · Ages 5+
                  </p>
                </div>

                {/* Headings */}
                <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink uppercase tracking-tight leading-tight">
                  Structured Kuchipudi Training
                </h1>
                <p className="font-serif italic text-lg sm:text-2xl text-ink-2 font-normal mt-1 mb-4 leading-snug">
                  From First Steps to Rangapravesham
                </p>

                {/* Editorial Lead Paragraph */}
                <p className="text-sm sm:text-base text-ink-2 leading-relaxed max-w-xl font-normal mb-6">
                  Kuchipudi taught as a progressive classical art form, not a series of unrelated classes — for students from age 5 through to the artistic maturity of Rangapravesham.
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
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs"
                  >
                    <span>Enquire About Admissions</span>
                  </Link>
                  <Link
                    href="#curriculum"
                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-line text-ink hover:border-ink/50 bg-surface transition-colors"
                  >
                    <span>Explore Curriculum</span>
                  </Link>
                  <Link
                    href={enrolHref({ programme: 'classical-dance', intent: 'trial' })}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-bl transition-colors py-2 px-1 font-mono font-bold uppercase tracking-wider"
                  >
                    <span>Also view Kathak</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Right Column — Authentic High-Resolution Photography */}
              <div className="lg:col-span-5 w-full">
                <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] max-w-md mx-auto lg:max-w-none w-full rounded-md overflow-hidden border border-line bg-surface shadow-md">
                  <Image
                    src="/images/kuchipudi/hero_kuchipudi_1.jpg"
                    alt="Kuchipudi dancer in traditional classical costume at Rhythmzz Academy"
                    fill
                    priority
                    className="object-cover object-[center_top]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. WHAT MAKES THIS TRAINING DIFFERENT (Editorial Narrative + 4 Bento Cards)
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
                "Learning Kuchipudi well takes more than memorising steps; it takes years of layered training in technique, expression, rhythm, and stagecraft."
              </p>
              <div className="text-sm sm:text-base text-ink-2 space-y-3 leading-relaxed">
                <p>
                  Kuchipudi is one of India&apos;s classical dance traditions — a living blend of rhythm, storytelling, drama,
                  and devotion, passed down through generations of practice.
                </p>
                <p>
                  This programme is built as a long-term learning pathway, not a single drop-in class attended indefinitely.
                  Every student moves through it at their own pace — but the stages along the way are grounded in classical rigour.
                </p>
              </div>
            </div>

            {/* Right Distinct Bento Cards */}
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {DIFFERENTIATORS.map(({ title, body, badge }) => (
                <div
                  key={title}
                  className="bento-card p-5 rounded-md border border-line bg-surface hover:border-bl/40 transition-colors shadow-sm"
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
            description="We welcome beginners and continuing students into age-aligned cohorts with focused instructor attention."
          />

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {WHO_CAN_JOIN.map(({ title, subtitle, body }) => (
              <div
                key={title}
                className="bento-card p-5 rounded-md border border-line bg-surface hover:border-bl/40 transition-colors flex flex-col justify-between shadow-sm h-full"
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
                  href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
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
                Note: Because Kuchipudi is a progressive art form, students are admitted in structured cohorts so that everyone learns sequentially. Small batch sizes ensure hands-on posture corrections from faculty.
              </div>
            </div>
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. YOUR GURU — LEARN UNDER GURU SRUSHTINIDHI
      ═══════════════════════════════════════════════════════════════════════ */}
      <GuruSrushtinidhiSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          5. THE KUCHIPUDI LEARNING ROADMAP (Real Road-Like Structure)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
        <Reveal>
          <KuchipudiRoadMap />
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. YEAR-BY-YEAR CURRICULUM (Interactive Syllabus)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection id="curriculum" className={cn('bg-canvas-muted scroll-mt-20 sm:scroll-mt-24', sectionPadLg)}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Academic Curriculum"
            title="Year-by-year master"
            accent="syllabus"
            description="Select a learning track below to explore practical technique, theory topics, and expected annual learning outcomes."
          />

          {/* Interactive Syllabus Component */}
          <div className="bento-card p-5 sm:p-7 md:p-8 rounded-md bg-surface border border-line shadow-sm mb-8">
            <SyllabusYears />
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
            description="Curriculum depth evolves naturally as students grow in physical strength, coordination, and expressive readiness."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {AGE_PATHWAYS.map(({ age, label, body, accent }) => (
              <div
                key={age}
                className="bento-card p-5 rounded-md border border-line bg-surface flex flex-col justify-between hover:border-bl/40 transition-colors shadow-sm h-full"
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
          7. THE FOUR PILLARS OF KUCHIPUDI
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Classical Core"
            title="The four pillars of"
            accent="Kuchipudi"
            description="Originating in Andhra Pradesh, Kuchipudi weaves rhythmic technique with rich dramatic abhinaya and theatrical expression."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {PILLARS.map(({ sanskrit, english, body, points }) => (
              <div
                key={sanskrit}
                className="bento-card p-6 rounded-md border-t-4 border-t-bl border border-line bg-surface shadow-sm flex flex-col justify-between h-full"
              >
                <div>
                  <p className="font-anton text-2xl sm:text-3xl text-ink uppercase tracking-wide">
                    {sanskrit}
                  </p>
                  <p className="text-xs font-serif italic text-bl font-bold mt-0.5 mb-3">
                    {english}
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
          8. CLASSICAL PHOTO STRIP — Visual Breathing Room
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 p-2 sm:p-4 bg-canvas border-y border-line">
        {[
          { src: '/images/kuchipudi/kuchipudi-classical-03.jpg', alt: 'Kuchipudi classical stance' },
          { src: '/images/kuchipudi/kuchipudi-classical-01.jpg', alt: 'Kuchipudi classical expression' },
          { src: '/images/kuchipudi/kuchipudi-classical-04.jpg', alt: 'Kuchipudi traditional costume' },
          { src: '/images/kuchipudi/kuchipudi-classical-07.jpg', alt: 'Kuchipudi classical performance' },
          { src: '/images/kuchipudi/kuchipudi-classical-05.jpg', alt: 'Kuchipudi dynamic technique' },
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
          9. TRADITIONAL PERFORMANCE REPERTOIRE (The Classical Margam Suite)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={sectionPadLg}>
        <Reveal>
          <HomepageSectionHeading
            eyebrow="Margam Performance Suite"
            title="Traditional performance"
            accent="repertoire"
            description="The classical Kuchipudi Margam — a time-honoured sequential suite progressing from sacred invocations to the virtuoso Tarangam brass plate dance."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {REPERTOIRE_ITEMS.map((item, idx) => {
              const isFinale = idx === REPERTOIRE_ITEMS.length - 1;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'bento-card p-5 sm:p-6 rounded-md border flex flex-col justify-between hover:border-bl/40 hover:shadow-md transition-all group h-full',
                    isFinale
                      ? 'lg:col-span-3 border-bl/40 bg-bl/5 shadow-sm'
                      : 'border-line bg-surface',
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
                    <span>Margam Suite</span>
                    <span className="text-bl font-bold">Stage Classical</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          10. RANGAPRAVESHAM — A Defining Milestone
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Photo Frame */}
            <div className="lg:col-span-5 relative aspect-[3/4] rounded-md overflow-hidden border border-line shadow-lg bg-surface">
              <Image
                src="/images/programmes/kuchipudi-programme-cover.jpg"
                alt="Kuchipudi dancer in Rangapravesham solo stage performance at Rhythmzz Academy"
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
                title="Rangapravesham — Entry to the"
                accent="Stage"
                className="mb-4"
              />
              <p className="text-ink-2 text-sm sm:text-base leading-relaxed font-body mb-3">
                "Entry to the stage" — a dancer&apos;s formal graduation into full artistic maturity. Rangapravesham is a full-length solo performance demonstrating years of accumulated technical skill, expressive depth, and stage stamina.
              </p>
              <p className="text-ink-2 text-sm sm:text-base leading-relaxed font-body mb-6">
                Performed with a complete live classical music ensemble (Vocalist, Mridangist, Flautist, Violinist, and Nattuvanar), it represents the pinnacle of multi-year training.
              </p>

              {/* 6 Pillars of Readiness */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Full traditional repertoire mastery',
                  'Expressive abhinaya maturity',
                  'Performance stamina (2–3 hour solo)',
                  'Live orchestra coordination & tala sync',
                  '12–18 months dedicated rehearsals',
                  'Senior faculty approval & blessings',
                ].map((req) => (
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
          11. CLASS STRUCTURE & THEORY
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
                description="Every 60-minute session follows a disciplined progression ensuring physical safety and steady advancement."
                className="mb-6"
              />
              <div className="space-y-3.5">
                {CLASS_STEPS.map(({ n, title, body }) => (
                  <div key={n} className="flex items-start gap-4 p-4 rounded-md bg-surface border border-line shadow-sm">
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
                description="A serious classical dance education includes cognitive understanding alongside physical practice."
                className="mb-6"
              />
              <div className="p-6 rounded-md border border-line bg-surface space-y-4 shadow-sm">
                <p className="text-xs font-mono uppercase tracking-wider text-bl font-bold mb-1">
                  Key Theoretical Modules
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-ink-2 font-medium">
                  {THEORY_TOPICS.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-bl font-black">◆</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-line text-xs text-ink-3 font-medium leading-relaxed">
                  Students are prepared for certified university examinations and academy-graded evaluations.
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
                description="Have questions about placement or fees? Reach out to our admissions desk anytime."
                className="mb-4"
              />
              <div className="p-4 rounded-md bg-surface border border-line text-xs space-y-2 shadow-sm">
                <p className="font-bold text-ink">Admissions Support</p>
                <p className="text-ink font-semibold">+91 90529 80859</p>
                <p className="text-ink-3">Rhythmzz Academy, Neredmet X Road</p>
              </div>
            </div>

            <div className="border-t border-line">
              {FAQS.map(({ q, a }) => (
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
        accent="Kuchipudi Journey"
        description="Experience the grace, rhythm, and storytelling of classical Kuchipudi. Book an introductory trial class or contact us to discuss age placement."
        primaryHref={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
        primaryLabel="Book Introductory Class"
      />

    </PublicPage>
  );
}
