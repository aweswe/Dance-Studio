'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { enrolHref, ROUTES } from '@/lib/utils/constants';
import { SyllabusYears } from '@/components/public/syllabus-years';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { homepageCtaBrand, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { Reveal } from '@/components/motion/reveal';
import {
  ChevronDown,
  Clock,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ─── Data Definitions ────────────────────────────────────────────────────────

const DIFFERENTIATORS = [
  {
    title: 'Foundational technique',
    body: 'Correct from day one, so nothing has to be unlearned later.',
    badge: 'Precision',
  },
  {
    title: 'Abhinaya from the start',
    body: 'Expression is developed alongside movement, not bolted on afterward.',
    badge: 'Expression',
  },
  {
    title: 'Real rhythmic training',
    body: 'Students learn to dance with the music, not just to it.',
    badge: 'Laya & Tala',
  },
  {
    title: 'A genuine performance pathway',
    body: 'Classroom learning is regularly tested and celebrated on stage.',
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
  { num: 1, label: 'Foundation', desc: 'Posture & basic stance' },
  { num: 2, label: 'Basic Technique', desc: 'Core adavus & hastas' },
  { num: 3, label: 'Intermediate', desc: 'Complex footwork & tala' },
  { num: 4, label: 'Advanced', desc: 'Repertoire & abhinaya' },
  { num: 5, label: 'Pre-Rangapravesham', desc: 'Recital preparation' },
  { num: 6, label: 'Rangapravesham', desc: 'Solo debut on stage', milestone: true },
  { num: 7, label: 'Post-Rangapravesham', desc: 'Artistic mastery & teaching' },
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
  { n: 1, title: 'Warm-up & Body Conditioning', body: 'Spine articulation, foot stretching, and posture alignment.' },
  { n: 2, title: 'Adavus & Technique', body: 'Sequential footwork units with strict teacher corrections.' },
  { n: 3, title: 'Rhythm, Tala & Clapping', body: 'Counting rhythmic cycles (Tala), reciting bol/sollukattu.' },
  { n: 4, title: 'Repertoire & Abhinaya', body: 'Applying technique to authentic compositions and items.' },
  { n: 5, title: 'Review & Home Practice', body: 'Consolidating corrections and setting focal points for the week.' },
];

const THEORY_TOPICS = [
  'Hastas (Single & Double-hand gestures)',
  'Natyarambham & Dhyana Slokas',
  'Tala systems & rhythmic cycles',
  'Origins & history of Kuchipudi in Andhra Pradesh',
  'Chaturvidha Abhinaya (Four forms of expression)',
  'Stage etiquette, arangetram traditions & attire',
];

const FAQS = [
  {
    q: 'What is the minimum age to start Kuchipudi?',
    a: 'Five years. Our Year 1 foundation curriculum is developmentally tailored for children starting at this age, emphasizing playful coordination, posture, and safety.',
  },
  {
    q: 'Does my child need previous dance experience?',
    a: 'No previous dance training is required. Most students begin with zero dance background. Year 1 builds every movement from first principles.',
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
    a: 'Fees are ₹2,000 per month, or ₹5,000 per quarter (which saves ₹1,000 compared to monthly). We maintain transparent pricing with no hidden registration surcharges.',
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

// ─── UI Helper Components ────────────────────────────────────────────────────

function GoldEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.22em] text-[#78350F] mb-3">
      <span className="text-[#92400E] font-black">✦</span>
      <span>{children}</span>
    </div>
  );
}

function SectionH2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-anton text-2xl sm:text-3xl md:text-4xl text-slate-950 tracking-tight uppercase leading-[0.95]', className)}>
      {children}
    </h2>
  );
}

function SectionRule() {
  return <hr className="border-t border-slate-200 my-0" />;
}

function ContentSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('px-4 sm:px-6 lg:px-8 py-16 md:py-22 max-w-5xl mx-auto', className)}>
      {children}
    </section>
  );
}

function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 sm:py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-sky-800 transition-colors leading-snug">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={cn('text-slate-600 shrink-0 transition-transform duration-200', open && 'rotate-180 text-sky-800')}
        />
      </button>
      {open && (
        <div className="pb-5 pt-1 text-sm text-slate-700 leading-relaxed max-w-3xl pr-4 font-normal">
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
          1. HERO SECTION — Zero Text Overlap, High-Contrast Classical Elegance
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full bg-[#160508] text-[#FAF6EE] overflow-hidden border-b border-[#D4AF37]/30">

        {/* Right-anchored dancer image on desktop, with seamless gradient scrim */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[48%] pointer-events-none select-none z-0">
          <Image
            src="/images/kuchipudi/hero_kuchipudi_1.jpg"
            alt="Kuchipudi dancer in traditional classical costume"
            fill
            priority
            className="object-cover object-[70%_15%] opacity-35 lg:opacity-85 mix-blend-luminosity lg:mix-blend-normal"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Subtle gold-tint vignette over image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#160508] via-transparent to-[#160508]/60 lg:to-transparent" />
          {/* Horizontal fade from left into dancer image */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#160508] via-[#160508]/70 to-transparent" />
        </div>

        {/* Hero Content Column — Guaranteed Non-overlapping Layout */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-16 md:pb-24">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/20 text-[#FDE68A] text-xs font-mono font-bold uppercase tracking-wider mb-5 backdrop-blur-sm">
              <Sparkles size={13} className="text-[#FDE68A]" />
              <span>Structured Classical Curriculum · Ages 5+</span>
            </div>

            {/* Hero Headings */}
            <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF6EE] uppercase tracking-tight leading-[0.95] mb-2">
              Structured Kuchipudi Training
            </h1>
            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#E8C468] font-normal leading-snug mb-5">
              From First Steps to Rangapravesham
            </p>

            {/* Editorial Lead Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-[#EDE1CE] leading-relaxed mb-6 font-sans">
              Kuchipudi taught as a progressive classical art form, not a series of unrelated classes — for students from age 5 through to the artistic maturity of Rangapravesham.
            </p>

            {/* Quick Metadata Badges */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-xs text-white font-mono font-semibold">
                <Clock size={12} className="text-[#FDE68A]" />
                <span>Fri &amp; Sat · 6:30–7:30 PM</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-xs text-white font-mono font-semibold">
                <MapPin size={12} className="text-[#FDE68A]" />
                <span>Neredmet X Road Studio</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-xs text-white font-mono font-semibold">
                <IndianRupee size={12} className="text-[#FDE68A]" />
                <span>₹2,000 / month (or ₹5,000 / qtr)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
                className="inline-flex items-center justify-center px-6 py-3 rounded text-sm font-bold uppercase tracking-wider bg-[#D4AF37] text-slate-950 hover:bg-[#E8C468] transition-colors shadow-lg shadow-[#D4AF37]/30"
              >
                <span>Enquire About Admissions</span>
              </Link>
              <Link
                href="#curriculum"
                className="inline-flex items-center justify-center px-6 py-3 rounded text-sm font-semibold uppercase tracking-wider border-2 border-[#FAF6EE]/60 text-[#FAF6EE] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                <span>Explore the Curriculum</span>
              </Link>
              <Link
                href={enrolHref({ programme: 'classical-dance', intent: 'trial' })}
                className="inline-flex items-center gap-1.5 text-xs text-[#EDE1CE] hover:text-[#D4AF37] transition-colors py-2 px-1 font-mono font-bold uppercase tracking-wider"
              >
                <span>Also view Kathak</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. WHAT MAKES THIS TRAINING DIFFERENT (Editorial Narrative + 4 Cards)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection>
        <ContentSection>
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
              {/* Left narrative */}
              <div>
                <GoldEyebrow>Philosophy &amp; Pedagogy</GoldEyebrow>
                <SectionH2>What makes this training different</SectionH2>
                <p className="mt-4 font-serif italic text-lg sm:text-xl text-[#78350F] leading-snug font-semibold">
                  "Learning Kuchipudi well takes more than memorising steps; it takes years of layered training in technique, expression, rhythm, and stagecraft."
                </p>
                <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                  Kuchipudi is one of India&apos;s classical dance traditions — a living blend of rhythm, storytelling, drama,
                  and devotion, passed down through generations of practice.
                </p>
                <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                  This programme is built as a long-term learning pathway, not a single drop-in class attended indefinitely.
                  Every student moves through it at their own pace — but the stages along the way are grounded in classical rigour.
                </p>
              </div>

              {/* Right distinct cards with crisp accents */}
              <div className="flex flex-col gap-4">
                {DIFFERENTIATORS.map(({ title, body, badge }) => (
                  <div
                    key={title}
                    className="p-5 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-400 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-base text-slate-950">{title}</h3>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-bold">
                        {badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. WHO CAN JOIN & BATCH ADMISSIONS BOX (High-Impact Callout)
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection className="bg-slate-50/60">
        <ContentSection>
          <Reveal>
            <GoldEyebrow>Admissions &amp; Batches</GoldEyebrow>
            <SectionH2>Who can join &amp; batch schedule</SectionH2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed font-medium">
              We welcome beginners and continuing students into age-aligned batches with focused instructor attention.
            </p>

            {/* 4 Cards Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {WHO_CAN_JOIN.map(({ title, subtitle, body }) => (
                <div
                  key={title}
                  className="p-5 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-400 transition-colors flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-sky-900 font-extrabold block mb-1">
                      {subtitle}
                    </span>
                    <h4 className="font-bold text-base text-slate-950 mb-2">{title}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* High-Impact Batch Admissions Box */}
            <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#3A0E14] via-[#2A080E] to-[#160407] text-[#FAF6EE] border-2 border-[#D4AF37]/50 p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FDE68A] block mb-1">
                      ◆ BATCH-BASED ADMISSIONS
                    </span>
                    <h3 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight">
                      Now Enrolling: Regular &amp; Weekend Classical Batches
                    </h3>
                  </div>
                  <Link
                    href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-slate-950 hover:bg-[#E8C468] transition-colors shrink-0 shadow-md"
                  >
                    Book Introductory Class
                  </Link>
                </div>

                {/* 4 Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="p-3.5 sm:p-4 rounded-lg bg-black/40 border-2 border-white/20 text-center shadow-inner">
                    <p className="font-anton text-xl sm:text-2xl text-white font-black tracking-tight">Fri &amp; Sat</p>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold mt-1">2 Days / Week</p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-lg bg-black/40 border-2 border-white/20 text-center shadow-inner">
                    <p className="font-anton text-xl sm:text-2xl text-white font-black tracking-tight">6:30 – 7:30 PM</p>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold mt-1">Evening Timing</p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-lg bg-black/40 border-2 border-white/20 text-center shadow-inner">
                    <p className="font-anton text-xl sm:text-2xl text-white font-black tracking-tight">₹2,000</p>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold mt-1">Per Month (or ₹5k/qtr)</p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-lg bg-black/40 border-2 border-white/20 text-center shadow-inner">
                    <p className="font-anton text-xl sm:text-2xl text-white font-black tracking-tight">Ages 5+</p>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold mt-1">Kids &amp; Adults</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/30 border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FDF6EC] leading-relaxed font-serif italic">
                  Note: Because Kuchipudi is a progressive art form, students are admitted in structured cohorts so that everyone learns sequentially. Small batch sizes ensure hands-on posture corrections from faculty.
                </div>
              </div>
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. THE KUCHIPUDI LEARNING ROADMAP (Crisp, High-Contrast 7-Stage Journey)
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection>
        <ContentSection>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <GoldEyebrow>Milestone Pathways</GoldEyebrow>
              <SectionH2 className="text-center">The Kuchipudi learning roadmap</SectionH2>
              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Every student passes through the same foundational stages — the pace is individual and respects readiness.
              </p>
            </div>

            {/* 7-Step Progression Nodes with High-Contrast Typography */}
            <div className="relative pt-6 pb-2">
              <div className="hidden lg:block absolute top-[46px] left-[7%] right-[7%] h-[3px] bg-slate-300 -z-0" />
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 relative z-10">
                {ROADMAP_STAGES.map((stage) => (
                  <div
                    key={stage.num}
                    className={cn(
                      'p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1',
                      stage.milestone
                        ? 'bg-gradient-to-b from-[#2E0B10] via-[#22070B] to-[#120305] text-white border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/40'
                        : 'bg-white border-slate-200 text-slate-950'
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm font-bold mb-2.5 shadow-sm',
                        stage.milestone
                          ? 'bg-[#D4AF37] text-slate-950 font-black'
                          : 'bg-slate-900 text-white font-bold'
                      )}
                    >
                      {stage.num}
                    </div>
                    <span
                      className={cn(
                        'font-bold text-xs uppercase tracking-tight leading-snug',
                        stage.milestone ? 'text-white font-black' : 'text-slate-950 font-extrabold'
                      )}
                    >
                      {stage.label}
                    </span>
                    <span
                      className={cn(
                        'text-xs mt-1.5 leading-snug',
                        stage.milestone ? 'text-amber-100 font-semibold' : 'text-slate-700 font-semibold'
                      )}
                    >
                      {stage.desc}
                    </span>
                    {stage.milestone && (
                      <span className="mt-2.5 text-[10px] font-mono uppercase tracking-wider bg-[#D4AF37] text-slate-950 px-2 py-0.5 rounded font-black shadow-sm">
                        Debut Milestone
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. YEAR-BY-YEAR CURRICULUM — Kept & Elevated (Interactive Syllabus)
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection id="curriculum" className="bg-slate-50/60">
        <ContentSection>
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
              {/* Left Column: Interactive Syllabus Component */}
              <div>
                <GoldEyebrow>Academic Curriculum</GoldEyebrow>
                <SectionH2>Year-by-year syllabus</SectionH2>
                <p className="mt-3 mb-6 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Select a track below and explore each stage&apos;s practical technique, theory topics, and expected learning outcome.
                </p>

                {/* The core interactive syllabus component */}
                <div className="p-4 sm:p-6 rounded-xl bg-white border-2 border-slate-200 shadow-sm">
                  <SyllabusYears />
                </div>
              </div>

              {/* Right Column: Visual Photographic Cards */}
              <div className="hidden lg:flex flex-col gap-4 sticky top-28">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-slate-200 shadow-md">
                  <Image
                    src="/images/kuchipudi/kuchipudi-natyarambham-posture.jpg"
                    alt="Kuchipudi Natyarambham posture"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 300px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs font-mono font-semibold text-white">Natyarambham posture &amp; body alignment</p>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-slate-200 shadow-md">
                  <Image
                    src="/images/kuchipudi/kuchipudi-abhinaya-mudra.jpg"
                    alt="Kuchipudi abhinaya mudra"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 300px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs font-mono font-semibold text-white">Asamyukta &amp; Samyukta Hastas (hand gestures)</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. TRAINING BY AGE PATHWAYS
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection>
        <ContentSection>
          <Reveal>
            <div className="max-w-2xl mb-8">
              <GoldEyebrow>Age Pacing</GoldEyebrow>
              <SectionH2>Training by age pathways</SectionH2>
              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Curriculum depth evolves naturally as students grow in physical strength, coordination, and expressive readiness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {AGE_PATHWAYS.map(({ age, label, body, accent }) => (
                <div
                  key={age}
                  className="p-5 rounded-xl border-2 border-slate-200 bg-white flex flex-col justify-between hover:border-slate-400 transition-colors shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-950">
                        {age}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                        {accent}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-950 mb-2">{label}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. THE FOUR PILLARS OF KUCHIPUDI
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection className="bg-slate-50/60">
        <ContentSection>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <GoldEyebrow>Classical Core</GoldEyebrow>
              <SectionH2 className="text-center">The four pillars of Kuchipudi</SectionH2>
              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Originating in Andhra Pradesh, Kuchipudi weaves rhythmic technique with rich dramatic abhinaya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map(({ sanskrit, english, body, points }) => (
                <div
                  key={sanskrit}
                  className="p-6 rounded-xl border-t-4 border-t-[#D4AF37] border-2 border-slate-200 bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <p className="font-anton text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
                      {sanskrit}
                    </p>
                    <p className="text-xs font-serif italic text-amber-900 font-bold mt-0.5 mb-3">
                      {english}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-4">{body}</p>
                  </div>
                  <ul className="space-y-1.5 border-t border-slate-200 pt-3">
                    {points.map((pt, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. CLASSICAL PHOTO STRIP — Visual Breathing Room
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1.5 bg-[#160508]">
        {[
          { src: '/images/kuchipudi/kuchipudi-classical-02.jpg', label: 'Classical Adavus' },
          { src: '/images/kuchipudi/kuchipudi-aramandi-dynamic.jpg', label: 'Aramandi Posture' },
          { src: '/images/kuchipudi/kuchipudi-classical-03.jpg', label: 'Mudra & Abhinaya' },
          { src: '/images/kuchipudi/kuchipudi-classical-pose-2.jpg', label: 'Stage Presentation' },
          { src: '/images/kuchipudi/kuchipudi-traditional-standing.jpg', label: 'Traditional Attire' },
        ].map((item, idx) => (
          <div key={idx} className="relative aspect-[3/4] overflow-hidden group">
            <Image
              src={item.src}
              alt={item.label}
              fill
              loading="lazy"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="text-xs font-mono font-bold text-white">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. TRADITIONAL PERFORMANCE REPERTOIRE (The Classical Margam Suite)
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection>
        <ContentSection>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <GoldEyebrow>Margam Performance Suite</GoldEyebrow>
              <SectionH2 className="text-center">Traditional performance repertoire</SectionH2>
              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                The classical Kuchipudi Margam — a time-honoured sequential suite progressing from sacred invocations and geometric footwork to dramatic mime and the virtuoso Tarangam brass plate dance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {REPERTOIRE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-xl border-2 border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black font-anton tracking-wide uppercase text-slate-950">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-800 font-bold uppercase tracking-wider">
                        {item.focus}
                      </span>
                    </div>
                    <h3 className="font-anton tracking-wide uppercase text-lg text-slate-950 mb-1 group-hover:text-sky-900 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-900 font-bold block mb-2.5">
                      {item.type}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-600 font-semibold">
                    <span>Margam Suite</span>
                    <span className="text-sky-900 font-bold">Stage Classical</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          10. RANGAPRAVESHAM — A Defining Milestone
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection>
        <ContentSection>
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 lg:gap-16 items-center">
              {/* Photo Frame */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl">
                <Image
                  src="/images/kuchipudi/hero_kuchipudi_2.jpg"
                  alt="Kuchipudi dancer in Rangapravesham costume"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#FDE68A] font-bold block">
                      Solo Stage Debut
                    </span>
                    <p className="font-anton text-xl uppercase font-bold">Rangapravesham</p>
                  </div>
                </div>
              </div>

              {/* Text Editorial */}
              <div>
                <GoldEyebrow>Solo Graduation</GoldEyebrow>
                <SectionH2>Rangapravesham — Entry to the Stage</SectionH2>
                <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                  "Entry to the stage" — a dancer&apos;s formal graduation into full artistic maturity. Rangapravesham is a full-length solo performance demonstrating years of accumulated technical skill, expressive depth, and stage stamina.
                </p>
                <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                  Performed with a complete live classical music ensemble (Vocalist, Mridangist, Flautist, Violinist, and Nattuvanar), it represents the pinnacle of multi-year training.
                </p>

                {/* 6 Pillars of Readiness */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Full traditional repertoire mastery',
                    'Expressive abhinaya maturity',
                    'Performance stamina (2–3 hour solo)',
                    'Live orchestra coordination & tala sync',
                    '12–18 months dedicated rehearsals',
                    'Senior faculty approval & blessings',
                  ].map((req) => (
                    <div key={req} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          11. CLASS STRUCTURE & THEORY
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection className="bg-slate-50/60">
        <ContentSection>
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Inside a class */}
              <div>
                <GoldEyebrow>Classroom Experience</GoldEyebrow>
                <SectionH2>Inside a typical class</SectionH2>
                <p className="mt-3 mb-6 text-sm text-slate-700 leading-relaxed font-medium">
                  Every 60-minute session follows a disciplined progression ensuring physical safety and steady advancement.
                </p>
                <div className="space-y-4">
                  {CLASS_STEPS.map(({ n, title, body }) => (
                    <div key={n} className="flex items-start gap-4 p-4 rounded-lg bg-white border-2 border-slate-200 shadow-sm">
                      <span className="font-mono text-xl font-black text-slate-900 w-7 shrink-0">
                        {String(n).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-bold text-sm text-slate-950">{title}</p>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mt-0.5">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theory & Culture */}
              <div>
                <GoldEyebrow>Academic Rigour</GoldEyebrow>
                <SectionH2>Theory &amp; cultural education</SectionH2>
                <p className="mt-3 mb-6 text-sm text-slate-700 leading-relaxed font-medium">
                  A serious classical dance education includes cognitive understanding alongside physical practice.
                </p>
                <div className="p-6 rounded-xl border-2 border-slate-200 bg-white space-y-4 shadow-sm">
                  <p className="text-xs font-mono uppercase tracking-wider text-sky-950 font-bold mb-1">
                    Key Theoretical Modules
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                    {THEORY_TOPICS.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-[#92400E] font-black">◆</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-700 font-medium leading-relaxed">
                    Students are prepared for certified university examinations and academy-graded evaluations.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          12. FREQUENTLY ASKED QUESTIONS
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionRule />
      <HomepageSection>
        <ContentSection>
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-14">
              <div>
                <GoldEyebrow>Common Inquiries</GoldEyebrow>
                <SectionH2>Frequently asked questions</SectionH2>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed font-medium">
                  Have questions about placement or fees? Reach out to our admissions desk anytime.
                </p>
                <div className="mt-6 p-4 rounded-lg bg-white border-2 border-slate-200 text-xs space-y-2 shadow-sm">
                  <p className="font-bold text-slate-950">Admissions Support</p>
                  <p className="text-slate-800 font-semibold">+91 90529 80859</p>
                  <p className="text-slate-600 font-medium">Rhythmzz Academy, Neredmet X Road</p>
                </div>
              </div>

              <div className="border-t border-slate-200">
                {FAQS.map(({ q, a }) => (
                  <FaqAccordionItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          </Reveal>
        </ContentSection>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          13. FINAL ENROLMENT CTA — Atmospheric Classical Banner
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative bg-[#160508] text-[#FAF6EE] overflow-hidden border-t border-[#D4AF37]/30">
        <Image
          src="/images/kuchipudi/kuchipudi-classical-07.jpg"
          alt="Kuchipudi dance performance finale"
          fill
          loading="lazy"
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-26 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/20 text-xs font-mono font-bold uppercase tracking-wider text-[#FDE68A] mb-4">
            <Sparkles size={12} className="text-[#FDE68A]" />
            <span>Admissions Open For New Batches</span>
          </div>

          <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-white tracking-tight uppercase leading-tight mb-4 font-bold">
            Begin Your Kuchipudi Journey
          </h2>
          <p className="text-sm sm:text-base text-[#EDE1CE] max-w-xl mx-auto leading-relaxed mb-8 font-medium">
            Experience the grace, rhythm, and storytelling of classical Kuchipudi. Book an introductory class or contact us to discuss age placement.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3">
            <Link
              href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded text-sm font-bold uppercase tracking-wider bg-[#D4AF37] text-slate-950 hover:bg-[#E8C468] transition-colors shadow-lg shadow-[#D4AF37]/30"
            >
              Book Introductory Class
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded text-sm font-semibold uppercase tracking-wider border-2 border-white/60 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
            >
              Contact Admissions
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs font-mono text-[#EDE1CE]/80 font-semibold">
            <span>Friday &amp; Saturday, 6:30–7:30 PM</span>
            <span>·</span>
            <span>Neredmet X Road, Secunderabad</span>
            <span>·</span>
            <span>+91 90529 80859</span>
          </div>
        </div>
      </div>

    </PublicPage>
  );
}
