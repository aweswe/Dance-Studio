'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Phone, Plus, Minus } from 'lucide-react';

/* -------------------------------------------------------------------------
   CONTENT DATA — unchanged
   ------------------------------------------------------------------------- */

const VALUE_ITEMS = [
  {
    title: 'Correct Foundation',
    desc: "Technique that's right from day one, so nothing has to be unlearned later.",
  },
  {
    title: 'Expression, Early',
    desc: 'Abhinaya developed alongside movement, not bolted on afterward.',
  },
  {
    title: 'Real Musicality',
    desc: 'Rhythm and musical understanding, so students dance with the music, not just to it.',
  },
  {
    title: 'A Performance Path',
    desc: 'Classroom learning regularly tested and celebrated on stage.',
  },
];

const WHO_CAN_JOIN = [
  {
    title: 'Starting Age',
    desc: 'Students may begin from 5 years of age.',
  },
  {
    title: 'Beginners',
    desc: "No previous dance experience needed — Year 1 assumes a fresh start.",
  },
  {
    title: 'Continuing Students',
    desc: "Prior Kuchipudi or classical dance training? You'll be assessed for placement at the right level.",
  },
  {
    title: 'Older Beginners',
    desc: 'Teens and adults new to Kuchipudi are welcome, subject to batch availability.',
  },
];

const ROADMAP_ROW1 = [
  'Age 5+',
  'Foundation',
  'Basic Technique',
  'Intermediate',
  'Advanced',
];

const ROADMAP_ROW2 = [
  { label: 'Pre-Rangapravesha', highlight: false },
  { label: 'Rangapravesha', highlight: true },
  { label: 'Advanced Performance', highlight: false },
];

const CURRICULUM_YEARS = [
  {
    year: 1,
    title: 'Foundation',
    age: 'Suggested age 5–7',
    focus: 'Body awareness, posture, the basic Kuchipudi stance, and classroom discipline.',
    technique: 'Basic standing postures (Sthanakam), simple steps, first hand gestures (Asamyukta Hastas — single-hand gestures).',
    abhinaya: 'Basic facial expressions (Mukhaja Abhinaya); first taste of storytelling through face and hands.',
    rhythm: 'Introduction to rhythmic cycles (Tala) through clapping and simple patterns.',
    theory: 'What Kuchipudi is, where it comes from, and classroom vocabulary.',
    repertoire: 'Simple movement sequences set to music; first introduction to invocation pieces (Pushpanjali).',
    outcome: 'Basic coordination, rhythm awareness, and comfort with foundational vocabulary.',
  },
  {
    year: 2,
    title: 'Basic Technique',
    age: 'Suggested age 6–8',
    focus: 'Building the core movement vocabulary.',
    technique: 'Adavus (basic movement units), footwork fundamentals, gesture accuracy.',
    abhinaya: 'Simple expressive gestures (Angika Abhinaya — expression through the body) paired with basic storytelling.',
    rhythm: 'Simple rhythmic syllable patterns (Jatis), stronger tala awareness.',
    theory: 'Introduction to hastas (hand gestures) and their meanings.',
    repertoire: 'First fully choreographed piece, often a simple Shabdam.',
    outcome: 'Consistent execution of basic adavus and confidence in simple repertoire.',
  },
  {
    year: 3,
    title: 'Developing Technique',
    age: 'Suggested age 7–9',
    focus: 'Strengthening technique and combining movements.',
    technique: 'Combined adavu sequences, increased footwork complexity.',
    abhinaya: 'Expression exercises within short storytelling pieces.',
    rhythm: 'Increased rhythmic complexity with an introduction to pure dance-and-melody pieces (Jatiswaram), layered counting exercises.',
    theory: 'Continued hasta vocabulary and basic tala terms.',
    repertoire: 'Introductory group compositions; first stage presentations.',
    outcome: 'A stronger technical base and early comfort performing for an audience.',
  },
  {
    year: 4,
    title: 'Intermediate',
    age: 'Suggested age 8–10',
    focus: 'Technical refinement and performance discipline.',
    technique: 'Refined adavus, more complex rhythmic footwork.',
    abhinaya: 'Character-based expression, often introduced through the classic Manduka Shabdam (the playful "frog" storytelling piece).',
    rhythm: 'More complex rhythmic structures, better musical listening.',
    theory: 'Continued classical vocabulary and cultural context.',
    repertoire: 'Expanded repertoire; academy-level performance opportunities.',
    outcome: 'Technical consistency, and the first signs of individual artistry.',
  },
  {
    year: 5,
    title: 'Intermediate / Performance Development',
    age: 'Suggested age 9–11',
    focus: 'Integrating technique, rhythm, and storytelling.',
    technique: 'Advanced movement combinations; combined hand gestures (Samyukta Hastas — double-hand gestures).',
    abhinaya: 'Introduction to Nritya (expressive dance) pieces.',
    rhythm: 'Deeper musical understanding across varied talas.',
    theory: 'Introduction to Nritta, Nritya, and Natya as concepts.',
    repertoire: 'Solo repertoire introduced alongside group pieces.',
    outcome: 'Growing stage confidence and the ability to sustain a short solo.',
  },
  {
    year: 6,
    title: 'Advanced Foundation',
    age: 'Suggested age 10–12',
    focus: 'Technical depth and individual correction.',
    technique: 'Complex jatis, refined adavu execution.',
    abhinaya: 'Deeper abhinaya work; exploring mood and emotion (Bhava and Rasa).',
    rhythm: 'Advanced rhythmic training.',
    theory: 'Cultural and historical context behind the repertoire.',
    repertoire: 'Individual correction and refinement of existing pieces.',
    outcome: 'Technical polish and more mature artistic interpretation.',
  },
  {
    year: 7,
    title: 'Advanced',
    age: 'Suggested age 11–14',
    focus: 'Performance maturity and independent practice.',
    technique: 'Advanced combinations; building performance stamina.',
    abhinaya: 'Detailed characterization work, exploring the nine classical emotions (Navarasa).',
    rhythm: 'Complex rhythmic and musical coordination.',
    theory: 'Deeper study of repertoire and stagecraft.',
    repertoire: 'Introduction to the Varnam — the technically and emotionally demanding centerpiece of the repertoire.',
    outcome: 'Performance maturity and readiness for full-length repertoire work.',
  },
  {
    year: 8,
    title: 'Pre-Rangapravesham',
    age: 'Suggested age 12–15',
    focus: 'Repertoire consolidation and performance readiness.',
    technique: 'Technical polishing across the full repertoire.',
    abhinaya: 'Expression refinement across longer, lyrical pieces (Padam).',
    rhythm: 'Full musical coordination across a complete program.',
    theory: 'Performance etiquette, stagecraft, and production basics.',
    repertoire: "Full-length practice pieces; introduction to the Tarangam, Kuchipudi's signature plate dance.",
    outcome: 'Readiness to begin final preparation for Rangapravesham.',
  },
  {
    year: 9,
    title: 'Rangapravesham Preparation',
    age: 'Suggested age 13+',
    focus: 'Final preparation and readiness assessment.',
    technique: 'Final refinement of the complete Rangapravesham repertoire.',
    abhinaya: 'Deep, internalised expression (Satvika Abhinaya) across the full program.',
    rhythm: 'Full coordination with accompanying musicians.',
    theory: 'Performance and production coordination.',
    repertoire: 'Full program and stage rehearsals, typically closing with a Tillana; final readiness assessment.',
    outcome: 'Rangapravesham — reached when the student is ready, as assessed by the instructor.',
  },
];

const RANGAPRAVESHAM_CRITERIA = [
  'Full repertoire technical preparation',
  'Abhinaya (expressive) maturity',
  'Performance stamina',
  'Musical coordination',
  'Years of consistent practice',
  'Guru guidance and approval',
];

const PARENTS_EXPECTATIONS = [
  'Structured, progressive learning rather than unconnected classes',
  'Regular practice expectations between classes',
  'Ongoing instructor feedback',
  'Gradual, age-appropriate repertoire development',
  'Performance opportunities as readiness allows',
  'A long-term view of artistic development',
];

const FAQS = [
  {
    q: 'What is the minimum age to start Kuchipudi?',
    a: 'Five years. Our Year 1 foundation curriculum is built for beginners starting at this age.',
  },
  {
    q: 'Can my 5-year-old join?',
    a: 'Yes — five is our starting age, and the foundation year assumes no prior experience at all.',
  },
  {
    q: 'Does my child need previous dance experience?',
    a: 'No. Most students begin with no background in dance whatsoever.',
  },
  {
    q: 'Can an older child or teen start Kuchipudi?',
    a: 'Yes. Older beginners are welcome and are placed appropriately based on age, ability, and current batch availability.',
  },
  {
    q: 'How many years does it take to learn Kuchipudi?',
    a: 'It varies by student. The roadmap on this page shows the stages every student moves through — pacing depends on age, consistency, and individual readiness rather than a fixed number of years.',
  },
  {
    q: 'When can a student perform Rangapravesham?',
    a: "When the instructor assesses that the student has reached the necessary technical, artistic, and performance readiness — not at a fixed year or age.",
  },
  {
    q: 'Is Rangapravesham compulsory?',
    a: "No. It's a significant milestone many serious students work toward, but continuing to train and perform without it is also a valid path.",
  },
  {
    q: 'How are students moved from one level to another?',
    a: 'Based on attendance, technical development, and instructor assessment — not simply time spent in a batch.',
  },
  {
    q: 'How often should students practice at home?',
    a: 'Short, regular practice between classes — even 15–20 minutes a few times a week — makes a real difference alongside the twice-weekly classes.',
  },
  {
    q: 'Are theory lessons included?',
    a: 'Yes. Terminology, hastas, tala, rhythm, and cultural context are woven into training alongside the practical technique.',
  },
  {
    q: 'Will students get performance opportunities?',
    a: 'Yes, as readiness allows — from small classroom demonstrations to academy performances and, eventually, larger stage presentations.',
  },
  {
    q: 'What days are classes held?',
    a: 'Friday and Saturday, 6:30 PM to 7:30 PM.',
  },
  {
    q: 'What are the fees?',
    a: '₹2,000 per month, or ₹5,000 per quarter — the quarterly option saves ₹1,000 over paying monthly.',
  },
  {
    q: 'What happens if my child has prior Kuchipudi training?',
    a: "They're assessed for placement at an appropriate level rather than restarting from the beginning.",
  },
  {
    q: 'Can students join mid-term?',
    a: 'Students are enrolled according to current batch availability and curriculum progression. Because learning is sequential, we assess where a new student best fits before placement rather than admitting into ongoing topics without preparation.',
  },
  {
    q: 'What should parents know before enrolling?',
    a: "That Kuchipudi is a progressive, multi-year art form best learned through consistent attendance — and we're happy to talk through what to expect before you commit.",
  },
];

/* -------------------------------------------------------------------------
   DESIGN TOKENS
   ------------------------------------------------------------------------- */
const C = {
  dark:      '#1C0808',
  maroon:    '#5C1010',
  cream:     '#F4EDE0',
  creamCard: '#FFFFFF',
  creamBorder: '#E2D4C0',
  gold:      '#C8A84B',
  darkText:  '#1A0505',
  bodyText:  '#4A3530',
  mutedText: '#C4AFA0',
};

const serif = { fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' };
const sans  = { fontFamily: 'system-ui, -apple-system, sans-serif' };

/* -------------------------------------------------------------------------
   COMPONENT
   ------------------------------------------------------------------------- */
export function KuchipudiShowcase() {
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);

  return (
    <div style={{ ...serif, color: C.darkText }}>
      
<style jsx global>{`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap');
  .font-playfair {
    font-family: 'Playfair Display', Georgia, serif;
  }
`}</style>


      {/* ── STICKY NAV ─────────────────────────────────────────── */}
      <nav style={{ background: C.dark, borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
            <Image src="/images/kuchipudi/artifact_img_0.png" alt="Rhythmzz" fill className="object-cover" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            {[['#curriculum','Curriculum'],['#rangapravesha','Rangapravesha'],['#guru','Instructor'],['#faq','FAQ']].map(([href,label]) => (
              <a key={href} href={href} style={{ ...sans, color: '#C4AFA0', fontSize: 14, textDecoration: 'none' }}
                className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
          <Link href="/enrol?programme=kuchipudi"
            style={{ ...sans, background: C.gold, color: C.dark, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', padding: '10px 24px', borderRadius: 6, textDecoration: 'none', textTransform: 'uppercase' }}
            className="hover:opacity-90 transition-opacity">
            Enquire Now
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ background: C.dark, minHeight: '90vh', position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Dancer image right side */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%' }} className="hidden md:block">
          <Image src="/images/kuchipudi/artifact_img_1.jpg" alt="Kuchipudi dancer" fill priority className="object-cover object-top" />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${C.dark} 0%, ${C.dark}BB 25%, ${C.dark}55 55%, transparent 100%)` }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${C.dark} 0%, transparent 45%)` }} />
        </div>
        {/* Mobile: full-width image with heavy overlay */}
        <div style={{ position: 'absolute', inset: 0 }} className="md:hidden">
          <Image src="/images/kuchipudi/artifact_img_1.jpg" alt="Kuchipudi dancer" fill priority className="object-cover object-top" />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,8,8,0.82)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1152, margin: '0 auto', padding: '96px 32px' }}>
          <div style={{ maxWidth: 580 }}>
            <p style={{ ...sans, color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
              Rhythmzz Academy of Dance
            </p>
            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.08, marginBottom: 20 }}>
              Structured Kuchipudi Training — From First Steps to{' '}
              <span style={{ color: C.gold }}>Rangapravesha</span>
            </h1>
            <p style={{ ...sans, color: C.mutedText, fontSize: 16, lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
              Kuchipudi taught as a progressive classical art form — not a series of unrelated classes. Every stage builds on the one before it, guided by consistent, structured training under Guru Srushtinidhi.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
              <Link href="/enrol?programme=kuchipudi"
                style={{ ...sans, background: C.gold, color: C.dark, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', padding: '16px 32px', borderRadius: 6, textDecoration: 'none', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' }}
                className="hover:opacity-90 transition-opacity">
                Enquire About Admissions
              </Link>
              <a href="#curriculum"
                style={{ ...sans, color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', padding: '14px 32px', borderRadius: 6, textDecoration: 'none', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' }}
                className="hover:bg-white/10 transition-colors">
                Explore the Curriculum
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${C.gold}`, padding: '8px 20px', borderRadius: 6, ...sans, color: C.gold, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em' }}>
              <span>✦</span> Starting Age: 5 Years+
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES TRAINING DIFFERENT ──────────────────────── */}
      <section style={{ background: C.cream, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Why Rhythmzz</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>
            What Makes Kuchipudi Training Here Different
          </h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 20 }} />
          <p style={{ ...sans, color: C.bodyText, lineHeight: 1.8, maxWidth: 580, marginBottom: 48, fontSize: 15 }}>
            Kuchipudi is one of India&apos;s classical dance traditions — a living blend of rhythm, storytelling, drama and devotion built over generations. Learning it well takes more than memorising steps; it takes years of layered training in technique, expression, rhythm and stagecraft. This is designed as a long-term learning pathway, not a single class attended indefinitely.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {VALUE_ITEMS.map((item, idx) => (
              <div key={idx} style={{ background: C.creamCard, border: `1px solid ${C.creamBorder}`, borderRadius: 8, padding: '24px 20px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: 16 }}>{item.title}</h4>
                <p style={{ ...sans, color: C.bodyText, lineHeight: 1.7, fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO CAN JOIN ────────────────────────────────────────── */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Getting Started</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Who Can Join?</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {WHO_CAN_JOIN.map((item, idx) => (
              <div key={idx} style={{ background: C.creamCard, border: `1px solid ${C.creamBorder}`, borderRadius: 8, padding: '24px 20px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: 16 }}>{item.title}</h4>
                <p style={{ ...sans, color: C.bodyText, lineHeight: 1.7, fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADMISSIONS ──────────────────────────────────────────── */}
      <section style={{ background: C.dark, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Admissions</p>
          <h2 style={{ color: C.gold, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 32 }}>
            Batch-Based Admissions
          </h2>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Class Days',   value: 'Fri & Sat',      italic: true  },
              { label: 'Class Timing', value: '6:30 – 7:30 PM', italic: true  },
              { label: 'Per Month',    value: '₹2,000',          italic: false },
              { label: 'Per Quarter',  value: '₹5,000',          italic: false },
            ].map(({ label, value, italic }) => (
              <div key={label} style={{ background: C.maroon, border: `1px solid ${C.gold}30`, borderRadius: 8, padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ color: C.gold, fontWeight: 700, fontSize: 20, fontStyle: italic ? 'italic' : 'normal', marginBottom: 6 }}>{value}</div>
                <div style={{ ...sans, color: '#B8A090', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
          {/* Bullet list */}
          <div style={{ border: `1px solid ${C.gold}40`, borderRadius: 8, padding: '28px 28px' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                "New students are enrolled according to current batch availability.",
                "Classes follow a structured, sequential curriculum — students don't join mid-topic the way they might in a drop-in class.",
                "Progression through levels is based on training, attendance, readiness and instructor assessment — not simply time elapsed.",
                "No fixed batch size cap — group sizes are kept comfortably small so every student gets individual attention.",
                "New admissions may include a short introductory session so we can understand the student's starting point.",
              ].map((pt, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <span style={{ color: C.gold, fontSize: 14, flexShrink: 0, marginTop: 3 }}>•</span>
                  <span style={{ ...sans, color: '#D4C4B0', fontSize: 15, lineHeight: 1.75 }}>{pt}</span>
                </li>
              ))}
            </ul>
            <div style={{ border: `1px solid ${C.gold}45`, borderRadius: 6, padding: '16px 20px', marginTop: 20 }}>
              <p style={{ color: '#C0AFA0', fontStyle: 'italic', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                &ldquo;Because Kuchipudi is a progressive classical art form, students are encouraged to remain consistent with their training rather than treating classes as drop-in sessions.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARNING ROADMAP ────────────────────────────────────── */}
      <section style={{ background: C.cream, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>The Journey</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10, textAlign: 'center' }}>The Kuchipudi Learning Roadmap</h2>
          <div style={{ width: 48, height: 3, background: C.gold, margin: '0 auto 40px' }} />

          {/* Row 1 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
            {ROADMAP_ROW1.map((label, idx) => (
              <React.Fragment key={idx}>
                <div style={{ background: C.creamCard, border: `1px solid ${C.creamBorder}`, borderRadius: 6, padding: '10px 20px', ...sans, fontSize: 14, fontWeight: 600, color: C.darkText }}>{label}</div>
                <span style={{ color: '#A09080', fontSize: 18 }}>→</span>
              </React.Fragment>
            ))}
          </div>

          {/* Row 2 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
            {ROADMAP_ROW2.map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{
                  background: step.highlight ? C.maroon : C.creamCard,
                  border: `1px solid ${step.highlight ? C.gold : C.creamBorder}`,
                  borderRadius: 6,
                  padding: '10px 20px',
                  ...sans,
                  fontSize: 14,
                  fontWeight: 700,
                  color: step.highlight ? C.gold : C.darkText,
                }}>{step.label}</div>
                {idx < ROADMAP_ROW2.length - 1 && (
                  <span style={{ color: '#A09080', fontSize: 18 }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <p style={{ ...sans, color: C.bodyText, fontStyle: 'italic', textAlign: 'center', maxWidth: 560, margin: '0 auto', lineHeight: 1.75, fontSize: 14 }}>
            The number of years required varies by student — starting age, consistency, natural ability and instructor assessment all play a role. This shows the stages every student passes through, not a fixed timeline everyone completes identically.
          </p>
        </div>
      </section>

      {/* ── YEAR-BY-YEAR CURRICULUM ─────────────────────────────── */}
      <section id="curriculum" style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Curriculum</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Year-Wise Kuchipudi Curriculum</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 16 }} />
          <p style={{ ...sans, color: C.bodyText, fontSize: 14, lineHeight: 1.7, marginBottom: 36 }}>
            A suggested progressive framework — not a guaranteed fixed-duration program. Tap a year to expand.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CURRICULUM_YEARS.map((yr) => {
              const isOpen = openYear === yr.year;
              return (
                <div key={yr.year} style={{ background: C.creamCard, border: `1px solid ${isOpen ? C.gold : C.creamBorder}`, borderRadius: 8, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  <button
                    onClick={() => setOpenYear(isOpen ? null : yr.year)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ background: C.maroon, color: C.gold, ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 4, flexShrink: 0, textTransform: 'uppercase' }}>
                        Year {yr.year}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: C.darkText }}>{yr.title}</div>
                        <div style={{ ...sans, color: C.bodyText, fontSize: 12, marginTop: 2 }}>{yr.age}</div>
                      </div>
                    </div>
                    <div style={{ color: C.gold, flexShrink: 0 }}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: `1px solid ${C.creamBorder}`, padding: '20px 24px', background: '#FAF5EE' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
                        {[
                          ['Training Focus', yr.focus],
                          ['Technique & Adavus', yr.technique],
                          ['Abhinaya & Expression', yr.abhinaya],
                          ['Rhythm & Tala', yr.rhythm],
                          ['Theory & Context', yr.theory],
                          ['Repertoire', yr.repertoire],
                        ].map(([label, content]) => (
                          <div key={label} style={{ background: C.creamCard, border: `1px solid ${C.creamBorder}`, borderRadius: 6, padding: '14px 16px' }}>
                            <div style={{ ...sans, color: C.gold, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                            <p style={{ ...sans, color: C.bodyText, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{content}</p>
                          </div>
                        ))}
                      </div>
                      {/* Outcome */}
                      <div style={{ background: `${C.maroon}18`, border: `1px solid ${C.gold}50`, borderRadius: 6, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: C.gold, flexShrink: 0, marginTop: 2 }}>✦</span>
                        <div>
                          <span style={{ ...sans, color: C.maroon, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 8 }}>Expected Outcome:</span>
                          <span style={{ ...sans, color: C.bodyText, fontSize: 13, lineHeight: 1.65 }}>{yr.outcome}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BY AGE ──────────────────────────────────────────────── */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>By Age</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Kuchipudi Training by Age</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { range: '5–7', title: 'Discover & Build', desc: 'Enjoyment of dance, coordination, rhythm, basic posture, fundamental movements, simple expressions.' },
              { range: '8–10', title: 'Build & Strengthen', desc: 'Technique, footwork, early repertoire, rhythm training, first performance opportunities.' },
              { range: '11–13', title: 'Develop & Refine', desc: 'More complex technique, abhinaya development, expanding repertoire, growing performance maturity.' },
              { range: '14+', title: 'Advanced & Perform', desc: 'Advanced repertoire, artistic interpretation, performance readiness, Rangapravesha preparation.' },
            ].map(({ range, title, desc }) => (
              <div key={range} style={{ background: C.maroon, borderRadius: 8, padding: '28px 22px' }}>
                <div style={{ color: C.gold, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{range}</div>
                <div style={{ color: C.gold, fontStyle: 'italic', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>{title}</div>
                <p style={{ ...sans, color: 'rgba(255,255,255,0.78)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUR PILLARS ────────────────────────────────────────── */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>The Framework</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>The Four Pillars of Kuchipudi</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { abbr: 'Nt', name: 'Nritta', desc: 'Pure dance — rhythm, movement and technical precision, danced for its own beauty.' },
              { abbr: 'Ny', name: 'Nritya', desc: 'Expressive dance combining movement, music and meaning to convey emotion.' },
              { abbr: 'Na', name: 'Natya', desc: 'Dramatic storytelling — character and theatrical presentation on stage.' },
              { abbr: 'Ab', name: 'Abhinaya', desc: 'The art of expression — storytelling, emotion and interpretation through the face and hands.' },
            ].map(({ abbr, name, desc }) => (
              <div key={abbr} style={{ background: C.creamCard, border: `1px solid ${C.creamBorder}`, borderRadius: 8, padding: '28px 20px', textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  border: `2px solid ${C.gold}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: C.darkText,
                  fontWeight: 700, fontSize: 14,
                }}>
                  {abbr}
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{name}</div>
                <p style={{ ...sans, color: C.bodyText, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GURU — LEARN UNDER GURU SRUSHTINIDHI ────────────────── */}
      <section id="guru" style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Your Guru</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Learn Under Guru Srushtinidhi</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 40 }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'start' }}>
            <div style={{ position: 'relative', height: 360, borderRadius: 8, overflow: 'hidden', minWidth: 260 }}>
              <Image src="/images/kuchipudi/artifact_img_1.jpg" alt="Guru Srushtinidhi" fill className="object-cover object-top" />
            </div>

            <div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Guru Srushtinidhi</h3>
              <p style={{ ...sans, color: C.gold, fontStyle: 'italic', fontSize: 14, marginBottom: 20 }}>
                Kuchipudi Dance Guru, Rhythmzz Academy of Dance
              </p>
              <p style={{ ...sans, color: C.bodyText, lineHeight: 1.8, fontSize: 15, marginBottom: 14 }}>
                Every student at Rhythmzz trains directly under Guru Srushtinidhi, whose approach centers on building correct technique early, developing genuine expression alongside movement, and guiding each student toward their own Rangapravesha milestone at a pace that respects their individual readiness.
              </p>
              <p style={{ ...sans, color: C.bodyText, lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>
                From a child&apos;s very first class to the final rehearsals before Rangapravesha, the same guiding hand shapes every stage of the journey.
              </p>

              <div style={{ border: `1px solid ${C.creamBorder}`, borderRadius: 6, padding: '14px 18px', background: '#FAF5EE' }}>
                <p style={{ ...sans, color: C.bodyText, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  Srushti Nidhi is a trained Kuchipudi and contemporary dancer with 16 years of training under Guru Smt. Lakshmi Shankar. She is a Doordarshan Certified B-Grade artist, holds a certificate in Kuchipudi from Telugu University, and completed her Rangapravesham at Ravindra Bharathi, Hyderabad — conferred the title <strong>Nruthyadeekshamani</strong>. Currently a Dance Facilitator at The Gaudium School, and co-founder of Saanjhi and Srushti Sthithi Laya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THEORY & CULTURAL EDUCATION ─────────────────────────── */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Beyond Movement</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Theory & Cultural Education</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 20 }} />
          <p style={{ ...sans, color: C.bodyText, lineHeight: 1.8, maxWidth: 680, marginBottom: 28, fontSize: 15 }}>
            A serious classical dance education includes theoretical understanding alongside practical training. Theory is woven into every year of the curriculum, not taught separately.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Terminology', 'Hastas (hand gestures)', 'Tala & Rhythm', 'Musical awareness', 'Abhinaya concepts', 'Kuchipudi history', 'Classical vocabulary', 'Performance etiquette', 'Cultural context'].map((tag) => (
              <span key={tag} style={{ ...sans, fontSize: 13, color: C.darkText, border: `1px solid ${C.creamBorder}`, borderRadius: 6, padding: '7px 16px', background: C.creamCard }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE DEVELOPMENT ─────────────────────────────── */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>On Stage</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Performance Development</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 40 }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            {['Classroom Practice', 'Small Demonstrations', 'Academy Performances', 'Repertoire Presentation'].map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ background: C.creamCard, border: `1px solid ${C.creamBorder}`, borderRadius: 6, padding: '10px 20px', ...sans, fontSize: 14, fontWeight: 600, color: C.darkText }}>{step}</div>
                <span style={{ color: '#A09080', fontSize: 18 }}>→</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Advanced Performances', highlight: false },
              { label: 'Rangapravesha', highlight: true },
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ background: step.highlight ? C.maroon : C.creamCard, border: `1px solid ${step.highlight ? C.gold : C.creamBorder}`, borderRadius: 6, padding: '10px 20px', ...sans, fontSize: 14, fontWeight: 700, color: step.highlight ? C.gold : C.darkText }}>{step.label}</div>
                {idx === 0 && <span style={{ color: '#A09080', fontSize: 18 }}>→</span>}
              </React.Fragment>
            ))}
          </div>

          <p style={{ ...sans, color: C.bodyText, fontStyle: 'italic', fontSize: 13, lineHeight: 1.7, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
            Performance opportunities depend on student readiness and academy programming, and aren&apos;t guaranteed every year.
          </p>
        </div>
      </section>

      {/* ── RANGAPRAVESHA ───────────────────────────────────────── */}
      <section id="rangapravesha" style={{ background: C.dark, padding: '80px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>The Milestone</p>
          <h2 style={{ color: C.gold, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
            Rangapravesha — A Milestone in the Kuchipudi Journey
          </h2>
          <p style={{ ...sans, color: '#C4AFA0', lineHeight: 1.8, fontSize: 15, maxWidth: 620, margin: '0 auto 40px' }}>
            Rangapravesha — literally, &ldquo;entry to the stage&rdquo; — marks a dancer&apos;s formal graduation into full artistic maturity: a solo performance demonstrating years of accumulated technical skill, expressive depth and stage readiness.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 32, textAlign: 'left' }}>
            {[
              'Technical preparation across the full repertoire',
              'Repertoire memorization',
              'Abhinaya (expressive) maturity',
              'Performance stamina',
              'Musical coordination with accompaniment',
              'Stage experience from earlier performances',
              'Consistent, sustained practice over years',
              "Guru's guidance and final approval",
            ].map((crit, idx) => (
              <div key={idx} style={{ background: C.maroon, border: `1px solid ${C.gold}25`, borderRadius: 6, padding: '14px 16px' }}>
                <span style={{ ...sans, color: '#D4C4B0', fontSize: 13, lineHeight: 1.65 }}>{crit}</span>
              </div>
            ))}
          </div>

          <div style={{ border: `1px solid ${C.gold}50`, borderRadius: 6, padding: '20px 28px' }}>
            <p style={{ color: C.gold, fontStyle: 'italic', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              &ldquo;Rangapravesha is not determined solely by age or number of years studied. Eligibility and timing are based on the student&apos;s preparedness, consistency, technical proficiency and artistic maturity, as assessed by Guru Srushtinidhi.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── STUDENT PROGRESSION & ASSESSMENT ───────────────────── */}
      <section style={{ background: C.cream, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Moving Forward</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Student Progression & Assessment</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 20 }} />
          <p style={{ ...sans, color: C.bodyText, lineHeight: 1.8, maxWidth: 640, marginBottom: 32, fontSize: 15 }}>
            Progression is based on readiness, not simply time spent in a batch. Assessment considers:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {['Attendance', 'Consistent practice', 'Technical development', 'Rhythm & coordination', 'Abhinaya', 'Repertoire mastery', 'Understanding of theory', 'Performance readiness'].map((item) => (
              <div key={item} style={{ background: C.creamCard, border: `1px solid ${C.creamBorder}`, borderRadius: 6, padding: '14px 16px' }}>
                <span style={{ ...sans, color: C.darkText, fontSize: 14, fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE WEEKLY TRAINING STRUCTURE ────────────────────── */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.creamBorder}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>A Typical Class</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Sample Weekly Training Structure</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 32 }} />
          <div style={{ position: 'relative', borderLeft: `2px solid ${C.gold}`, paddingLeft: 24, marginLeft: 8, marginBottom: 28 }}>
            {['Warm-up & body preparation', 'Technique / Adavus', 'Rhythm & Tala', 'Repertoire', 'Abhinaya', 'Theory / Cultural learning', 'Revision & practice'].map((item, idx, arr) => (
              <div key={item} style={{ position: 'relative', marginBottom: idx === arr.length - 1 ? 0 : 22, display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: -29, width: 10, height: 10, borderRadius: '50%', background: C.gold }} />
                <span style={{ ...sans, color: C.darkText, fontSize: 16, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ ...sans, color: C.bodyText, fontStyle: 'italic', fontSize: 13, lineHeight: 1.7, textAlign: 'right' }}>
            Classes run Friday & Saturday, 6:30–7:30 PM. Structure is adapted to each batch&apos;s level.
          </p>
        </div>
      </section>

      {/* ── WHAT PARENTS CAN EXPECT ─────────────────────────────── */}
      <section style={{ background: C.dark, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>For Families</p>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>What Parents Can Expect</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 40 }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 28 }}>
            {[
              'Structured, progressive learning rather than unconnected classes',
              'Regular practice expectations between classes',
              'Ongoing instructor feedback',
              'Gradual, age-appropriate repertoire development',
              'Performance preparation and opportunities as readiness allows',
              'A long-term view of artistic development',
            ].map((item, idx) => (
              <div key={idx} style={{ background: C.maroon, border: `1px solid ${C.gold}20`, borderRadius: 8, padding: '18px 16px' }}>
                <span style={{ ...sans, color: '#D4C4B0', fontSize: 14, lineHeight: 1.7 }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ border: `1px solid ${C.gold}50`, borderRadius: 6, padding: '20px 24px' }}>
            <p style={{ color: C.gold, fontStyle: 'italic', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              &ldquo;Classical dance is a long-term learning journey. Progress is individual, and students develop at different rates — our role is to guide each student&apos;s pace, not force a single timeline on everyone.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" style={{ background: C.cream, padding: '80px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ ...sans, color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>Questions</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>Frequently Asked Questions</h2>
          <div style={{ width: 48, height: 3, background: C.gold, marginBottom: 40 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} style={{ borderBottom: `1px solid ${C.creamBorder}` }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ ...sans, color: C.darkText, fontWeight: 600, fontSize: 15, paddingRight: 16 }}>{faq.q}</span>
                    <div style={{ color: C.gold, flexShrink: 0 }}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ paddingBottom: 20, paddingRight: 32 }}>
                      <p style={{ ...sans, color: C.bodyText, lineHeight: 1.75, fontSize: 14, margin: 0 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section style={{ background: C.dark, padding: '80px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: C.gold, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
            Begin Your Kuchipudi Journey
          </h2>
          <p style={{ ...sans, color: C.mutedText, lineHeight: 1.75, maxWidth: 440, margin: '0 auto 36px', fontSize: 15 }}>
            Whether your child is taking their first dance class or you&apos;re an adult drawn to classical Indian art, we&apos;ll help you find the right starting point.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
            <Link href="/enrol?programme=kuchipudi"
              style={{ ...sans, background: C.gold, color: C.dark, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', padding: '16px 32px', borderRadius: 6, textDecoration: 'none', textTransform: 'uppercase' }}
              className="hover:opacity-90 transition-opacity">
              Enquire About Batches
            </Link>
            <Link href="/enrol?programme=kuchipudi&type=intro"
              style={{ ...sans, color: '#FFFFFF', border: `2px solid ${C.gold}`, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', padding: '14px 32px', borderRadius: 6, textDecoration: 'none', textTransform: 'uppercase' }}
              className="hover:bg-white/5 transition-colors">
              Book an Introductory Class
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 48 }}>
            <span style={{ ...sans, color: '#B8A090', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={14} style={{ color: C.gold }} /> 9052980859
            </span>
            <span style={{ ...sans, color: '#B8A090', fontSize: 14 }}>📍 Neredmet X Road, Secunderabad</span>
            <span style={{ ...sans, color: '#B8A090', fontSize: 14 }}>🌐 www.rhythmzzdance.com</span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
            <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 8, overflow: 'hidden', margin: '0 auto 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Image src="/images/kuchipudi/artifact_img_0.png" alt="Rhythmzz" fill className="object-cover" />
            </div>
            <p style={{ ...sans, color: '#B8A090', fontSize: 13, marginBottom: 8 }}>
              Rhythmzz Academy of Dance · Neredmet X Road, Secunderabad · 9052980859
            </p>
            <p style={{ ...sans, color: 'rgba(255,255,255,0.3)', fontSize: 11, lineHeight: 1.6 }}>
              This is a sample layout built to demonstrate structure and content — final copy, photography and policies to be confirmed before publishing.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
