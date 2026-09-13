'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Award,
  Clock,
  Music,
  Compass,
  Flame,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';

// --- 1. ROADMAP TO RANGAPRAVESHAM DATA ---
interface RoadmapStep {
  step: number;
  phase: string;
  title: string;
  age: string;
  duration: string;
  milestones: string[];
  outcome: string;
  badge: string;
}

const ROADMAP_STEPS: RoadmapStep[] = [
  {
    step: 1,
    phase: 'Phase 01',
    title: 'Adugulu & Postural Geometry',
    age: 'Ages 5–7 / Beginner',
    duration: 'Years 1 – 2',
    badge: 'Foundation',
    milestones: [
      'Natyarambham posture & deep Aramandi mandala stance',
      'First Half Steps (basic adugulu in 3 speeds on Tala)',
      '28 Asamyutha Hastas (single-hand classical mudras)',
      'Natyarambham shlokam & foundational body alignment',
    ],
    outcome:
      'Grounded anatomical alignment, natural sense of Laya (rhythm), and core joint stability without skeletal strain.',
  },
  {
    step: 2,
    phase: 'Phase 02',
    title: 'Tala Systems & Jathi Recitation',
    age: 'Ages 8–10 / Intermediate',
    duration: 'Years 3 – 4',
    badge: 'Rhythm Mastery',
    milestones: [
      'Chaturasra, Tisra, Khanda, Misra & Sankeerna Jathis',
      'Sapta Tala rhythmic framework and metric counting',
      'Siro, Griva, and Drishti Bhedas (head, neck & eye glances)',
      'Gejje Pooja (sacred ankle bells consecration ceremony)',
    ],
    outcome:
      'Command over complex rhythmic speeds (Vilamba, Madhyama, Dhruta) and introduction of ankle bells.',
  },
  {
    step: 3,
    phase: 'Phase 03',
    title: 'Traditional Repertoire & Abhinaya',
    age: 'Ages 11–13 / Upper Intermediate',
    duration: 'Years 5 – 6',
    badge: 'Expressive Arts',
    milestones: [
      'Master choreographies of Dr. Vempati Chinna Satyam',
      'Jathiswaram, Vinayaka Kauthuvam & Januta Shabdam',
      'Chaturvidha Abhinaya (Angika, Vachika, Aharya, Satvika)',
      'Navarasas (exploration of the 9 classical sentiments)',
    ],
    outcome:
      'Expressive facial depth, graceful lyrical transitions, and first solo stage showcases.',
  },
  {
    step: 4,
    phase: 'Phase 04',
    title: 'Tarangam & Technical Virtuosity',
    age: 'Ages 14+ / Advanced',
    duration: 'Years 7 – 8',
    badge: 'Virtuoso Technique',
    milestones: [
      'Brass plate balance: Dancing on the rim with complex Jathis',
      'Keerthanas of Saint Thyagaraja, Annamacharya & Ramadasu',
      'Mandooka Shabdam (frog narrative) & Dasavatara Shabdam',
      'Government / Board Public Examination Certification',
    ],
    outcome:
      'Unshakeable physical balance, stamina, and formal Certificate / Diploma public accreditation.',
  },
  {
    step: 5,
    phase: 'Phase 05',
    title: 'Rangapravesham: The Solo Debut',
    age: 'Graduation Milestone',
    duration: 'Years 9 – 10 / Mastery',
    badge: 'Artist Consecration',
    milestones: [
      'Complete 2.5-hour solo classical Margam repertoire',
      'Live Carnatic orchestra accompaniment (Nattuvangam, Mridangam, Vocal, Violin, Flute)',
      'Solo performance before an invited public audience of scholars and connoisseurs',
      'Consecration as an independent performing Kuchipudi artiste',
    ],
    outcome:
      'The sacred graduation from disciple to master exponent, blessed by Guru Srusti.',
  },
];

export function KuchipudiRoadmap() {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="space-y-6">
      {/* 5-Step Horizontal Navigation Bar with Concentric Radii and Touch Target Sizing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ROADMAP_STEPS.map((s) => {
          const isActive = activeStep === s.step;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 min-h-[5.5rem] flex flex-col justify-between active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas group ${
                isActive
                  ? 'bg-surface border-[#7C5CFC] shadow-lg shadow-[#7C5CFC]/10 ring-1 ring-[#7C5CFC]'
                  : 'bg-surface/70 border-line hover:border-[#7C5CFC]/40 hover:bg-surface'
              }`}
              aria-selected={isActive}
              role="tab"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#7C5CFC]">
                  {s.phase}
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                    isActive
                      ? 'bg-[#7C5CFC] text-white'
                      : 'bg-canvas border border-line text-ink-2 group-hover:text-ink'
                  }`}
                >
                  0{s.step}
                </span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-ink line-clamp-1 group-hover:text-[#7C5CFC] transition-colors">
                  {s.title}
                </h4>
                <span className="text-[11px] font-mono text-ink-3 block mt-0.5">
                  {s.duration}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Showcase Card with Staggered Transition & Concentric Radii */}
      {ROADMAP_STEPS.filter((s) => s.step === activeStep).map((s) => (
        <div
          key={s.step}
          className="bento-card p-6 sm:p-8 md:p-10 border-l-4 border-l-[#7C5CFC] relative overflow-hidden transition-all duration-300"
          role="tabpanel"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-line">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
                  {s.phase} · {s.duration}
                </span>
                <span className="text-xs text-ink-3">({s.age})</span>
              </div>
              <h3 className="font-anton tracking-wide uppercase text-2xl sm:text-3xl md:text-4xl text-ink">
                {s.title}
              </h3>
            </div>
            <div className="shrink-0">
              <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-[#7C5CFC]">
                {s.badge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-ink-3">
                Curriculum Benchmarks &amp; Training Focus
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {s.milestones.map((m, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-canvas border border-line text-xs sm:text-sm text-ink-2 hover:border-[#7C5CFC]/40 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] shrink-0 mt-2" />
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-canvas border border-line flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7C5CFC] block mb-2">
                  Artistic Outcome
                </span>
                <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed">
                  {s.outcome}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line text-[11px] text-ink-3 font-mono">
                Verified through annual evaluations and faculty viva voce.
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- 2. PERFORMANCE REPERTOIRE FLOW ---
interface RepertoireItem {
  id: string;
  name: string;
  type: string;
  focus: string;
  description: string;
}

const REPERTOIRE_ITEMS: RepertoireItem[] = [
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

export function KuchipudiRepertoireFlow() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {REPERTOIRE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bento-card p-6 flex flex-col justify-between hover:border-[#7C5CFC]/50 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-anton tracking-wide uppercase text-[#7C5CFC]">
                  {item.id}
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-canvas border border-line text-ink-2 uppercase tracking-wider">
                  {item.focus}
                </span>
              </div>
              <h4 className="font-anton tracking-wide uppercase text-lg sm:text-xl text-ink mb-1 group-hover:text-[#7C5CFC] transition-colors">
                {item.name}
              </h4>
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3 block mb-3">
                {item.type}
              </span>
              <p className="text-xs text-ink-2 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-ink-3">
              <span>Margam Suite</span>
              <span className="text-[#7C5CFC] font-semibold">Stage Classical</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. CLASS FLOW & WEEKLY RHYTHM ---
const CLASS_FLOW_STEPS = [
  {
    time: '15 Mins',
    phase: 'Segment 01',
    title: 'Body Conditioning & Natyarambham',
    desc: 'Yogic warm-up, hamstring flexibility, knee alignment, core stabilization, and precise Aramandi mandala posture.',
  },
  {
    time: '20 Mins',
    phase: 'Segment 02',
    title: 'Adugulu Drills & Speed Cycles',
    desc: 'Repetition of foundational footwork through 1st (Vilamba), 2nd (Madhyama), and 3rd (Dhruta) speeds on Tala.',
  },
  {
    time: '15 Mins',
    phase: 'Segment 03',
    title: 'Jathi Recitation & Hasta Coordination',
    desc: 'Vocal enunciation of Sollukattus paired with single and double-hand gestures (Asamyutha & Samyutha Hastas).',
  },
  {
    time: '08 Mins',
    phase: 'Segment 04',
    title: 'Choreography & Abhinaya Refinement',
    desc: 'Item practice (Jatiswaram, Shabdam, Tarangam), eye-line coordination (Drishti Bheda), and facial expression.',
  },
  {
    time: '02 Mins',
    phase: 'Segment 05',
    title: 'Cool-Down, Prayer & Namaskaram',
    desc: 'Joint decompression, breathing regulation, and concluding traditional prostration to Mother Earth and the Guru.',
  },
];

export function KuchipudiClassFlow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {CLASS_FLOW_STEPS.map((s, idx) => (
        <div
          key={idx}
          className="bento-card p-5 flex flex-col justify-between hover:border-[#7C5CFC]/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#7C5CFC]">
                {s.phase}
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-canvas border border-line text-ink font-semibold">
                {s.time}
              </span>
            </div>
            <h4 className="font-anton tracking-wide uppercase text-base text-ink mb-2 leading-snug">
              {s.title}
            </h4>
            <p className="text-xs text-ink-2 leading-relaxed">{s.desc}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60 text-[10px] font-mono text-ink-3">
            Step 0{idx + 1} of 05
          </div>
        </div>
      ))}
    </div>
  );
}

// --- 4. COMPREHENSIVE FAQ ACCORDION WITH FILTER PILLS & SMOOTH TRANSITIONS ---
interface FaqItem {
  tag: string;
  q: string;
  a: string;
}

const KUCHIPUDI_FAQS: FaqItem[] = [
  {
    tag: 'Admissions',
    q: 'At what age can my child begin learning classical Kuchipudi?',
    a: 'Children can start at age 5 in our 10-Year Master Foundation curriculum. At this young age, training focuses on physical coordination, playful rhythm drills, Aramandi posture alignment, and foundational hand gestures (Hastas) through expressive mythological storytelling without anatomical strain.',
  },
  {
    tag: 'Curriculum',
    q: 'What is the difference between the 10-Year Master Plan and the 6-Year Certificate Course?',
    a: 'The 10-Year Master Plan is specifically tailored for children ages 5–7, offering an unhurried, physiologically safe progression that allows young skeletal and muscular systems to develop optimal grace and strength. The 6-Year Accelerated Certificate Course is designed for older children (8+), teenagers, and adults who can assimilate complex Jathis, Tala theory, and choreographies at a faster pace.',
  },
  {
    tag: 'Examinations',
    q: 'Do you prepare students for official government and university board exams?',
    a: 'Yes! Our syllabus strictly aligns with recognized classical dance examining boards and university diploma syllabi (including Certificate and Diploma levels). We conduct mock written theory tests, practical repertoire demonstrations, and viva voce preparation so students clear public exams with distinction.',
  },
  {
    tag: 'Adults',
    q: 'Can adults with zero prior classical dance experience join the classes?',
    a: 'Absolutely! Our adult cohorts range from college students to working corporate professionals and homemakers. Classical Kuchipudi offers extraordinary core strengthening, spinal alignment, emotional mindfulness, and cultural immersion. Adult training is carefully paced to honor adult anatomy while maintaining classical fidelity.',
  },
  {
    tag: 'Rangapravesham',
    q: 'What is a Rangapravesham, and when can a student perform it?',
    a: 'A Rangapravesham (literally "ascending the stage") is the traditional full-length solo debut marking a disciple’s graduation to an independent classical exponent. It requires mastering a 2.5-hour Margam repertoire performed with a full live Carnatic orchestra. Students typically undertake this milestone after completing their advanced 8th to 10th year of training with Guru Srusti’s endorsement.',
  },
  {
    tag: 'Attire',
    q: 'What is the required dress code for regular studio classes?',
    a: 'For weekly training, students wear comfortable cotton salwar kameez or traditional dance practice sarees with a dupatta neatly pinned around the torso. Hair must be tied securely in a high bun or braid with fresh jasmine flowers. Cleanliness, modesty, and postural visibility are emphasized.',
  },
  {
    tag: 'Tradition',
    q: 'When are Ghungroos (ankle bells) introduced in training?',
    a: 'Ankle bells are sacred instruments in Indian classical dance and are never worn casually on day one. Students earn their bells only after mastering foundational Adugulu footwork in three speeds with accurate Tala. We conduct the traditional Gejje Pooja ceremony (consecration of ankle bells) in the second year before they are first worn.',
  },
  {
    tag: 'Schedule',
    q: 'What are the batch timings, class size, and trial policy?',
    a: 'Kuchipudi batches run on Fridays and Saturdays from 6:30 PM to 7:30 PM at our Neredmet X Road studio in Secunderabad. We maintain strictly capped batch sizes so Guru Srusti can provide individual postural correction, eye-level alignment, and personal guidance. Complimentary trial classes are available upon prior booking.',
  },
];

export function KuchipudiFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', 'Admissions', 'Curriculum', 'Examinations', 'Adults', 'Rangapravesham'];

  const filteredFaqs = KUCHIPUDI_FAQS.filter((faq) => {
    if (activeFilter === 'all') return true;
    return faq.tag.toLowerCase() === activeFilter.toLowerCase();
  });

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Pills with Tactile Scale */}
      <div className="flex flex-wrap gap-2 justify-center pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveFilter(cat);
              setOpenIndex(0);
            }}
            className={`text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] ${
              activeFilter === cat
                ? 'bg-[#F5FB38] text-black border-[#F5FB38] font-bold shadow-sm'
                : 'bg-surface border-line text-ink-2 hover:text-ink hover:border-[#7C5CFC]/50'
            }`}
          >
            {cat === 'all' ? 'All Questions' : cat}
          </button>
        ))}
      </div>

      {/* Accordion Stack */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bento-card transition-all duration-300 overflow-hidden p-0 ${
                isOpen ? 'border-[#7C5CFC]/60 shadow-md shadow-[#7C5CFC]/5 ring-1 ring-[#7C5CFC]/20' : 'border-line'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-canvas/50 transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC]"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7C5CFC] block">
                    {faq.tag}
                  </span>
                  <h4 className="font-anton tracking-wide uppercase text-base sm:text-lg text-ink">
                    {faq.q}
                  </h4>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 ease-out ${
                    isOpen
                      ? 'bg-ink text-canvas border-ink rotate-180'
                      : 'bg-surface border-line text-ink-2'
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-ink-2 leading-relaxed border-t border-line/60 bg-canvas/30 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
