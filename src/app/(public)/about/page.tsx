import { Metadata } from 'next';
import { getInstructors } from '@/data/instructors';
import { InstructorCard } from '@/components/public/instructor-card';
import { SITE_URL } from '@/lib/utils/constants';
import { Award, Target, Heart } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Entrance } from '@/components/motion/entrance';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Rhythmzz Academy of Dance — teaching dance at Neredmet X Road, Secunderabad since 2010. Founded in 2013 by Nitish. 5,000+ students trained across 4 programmes.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const STATS = [
  { value: "15+", label: "Years Teaching" },
  { value: "5000+", label: "Students Trained" },
  { value: "4", label: "Programmes" },
  { value: "3", label: "International Awards" },
];

const TIMELINE = [
  { year: "2010", title: "Teaching Begins", desc: "Nitish starts teaching dance in Secunderabad — a young dancer, a crew, and a first batch of students." },
  { year: "2013", title: "The Academy Opens", desc: "Rhythmzz Academy of Dance is founded at Neredmet X Road, with structured classes in multiple styles." },
  { year: "2014", title: "First International Honour", desc: "The academy earns recognition at IAO USA for its choreography and performance work." },
  { year: "2017", title: "The International Stage", desc: "Nitish represents India at the nATFEST International Contemporary Dance Festival in Sri Lanka." },
  { year: "Today", title: "Four Programmes, One Studio", desc: "Kids, Adults, Fitness and Kuchipudi — classes six days a week, 6 AM to 9 PM, at Neredmet X Road." },
];

const AWARDS = [
  { name: "IAO USA", year: "2014" },
  { name: "Art Unites", year: null },
  { name: "Indywood", year: null },
];

export default async function AboutPage() {
  const instructors = await getInstructors();

  return (
    <div className="bg-canvas text-ink">
      {/* Hero */}
      <section className="bg-blk text-white py-24 px-6 md:px-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-[10px] tracking-[5px] uppercase text-bl-light mb-4">Our Story</div>
          <h1 className="heading-display text-5xl md:text-7xl mb-6">
            FROM A DANCE CREW TO SECUNDERABAD&apos;S OWN ACADEMY
          </h1>
          <Entrance delay={0.1}>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Teaching since 2010, founded in 2013 — 5,000+ students trained across four programmes
              at Neredmet X Road, Secunderabad.
            </p>
          </Entrance>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-bl/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* The Vision */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <h2 className="heading-display text-4xl mb-6">OUR VISION</h2>
              <div className="space-y-4 text-ink-2 leading-relaxed">
              <p>
                Rhythmzz Academy of Dance began in 2010, when Nitish started teaching dance in
                Secunderabad as a young dancer with a crew and a handful of students. In 2013 it
                became a full academy at Neredmet X Road — and today it is the studio where
                thousands of students across Secunderabad learn to move.
              </p>
              <p>
                From a 5-year-old taking a first dance class to a working professional unwinding
                with Zumba, every student gets structured, level-based training — and, when they
                are ready, a place on the stage.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="flex gap-4">
                <Target className="text-bl shrink-0" size={24} />
                <div>
                  <h4 className="text-[11px] font-bold tracking-[1px] uppercase mb-1">Mission</h4>
                  <p className="text-xs text-ink-2">To train every student to perform, not just to learn steps.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Heart className="text-bl shrink-0" size={24} />
                <div>
                  <h4 className="text-[11px] font-bold tracking-[1px] uppercase mb-1">Values</h4>
                  <p className="text-xs text-ink-2">Passion, discipline, community, and joy.</p>
                </div>
              </div>
            </div>
          </div>
          </Reveal>

          {/* Brand tiles — stand-ins for studio photography */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 rounded-2xl relative overflow-hidden bg-blk flex flex-col items-center justify-center text-center p-6 mt-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(43,180,216,0.28)_0%,transparent_70%)]" />
              <span className="heading-display text-3xl text-white relative z-10">THE STUDIO</span>
              <span className="text-[10px] tracking-[2px] uppercase text-bl-light relative z-10 mt-2">
                Mirrors · Sprung Floor · Sound
              </span>
            </div>
            <div className="h-64 rounded-2xl relative overflow-hidden bg-blk flex flex-col items-center justify-center text-center p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(138,92,246,0.3)_0%,transparent_70%)]" />
              <span className="heading-display text-3xl text-white relative z-10">THE STAGE</span>
              <span className="text-[10px] tracking-[2px] uppercase text-white/40 relative z-10 mt-2">
                Shows &amp; Festivals Since 2014
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bl text-blk py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-black/10 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="heading-display text-4xl md:text-5xl mb-2">{stat.value}</span>
              <span className="text-[10px] font-bold tracking-[2px] uppercase opacity-70">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 md:px-16 bg-canvas-muted">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="section-label mb-3">Since 2010</div>
            <h2 className="heading-display text-4xl">OUR JOURNEY</h2>
          </Reveal>

          <Reveal stagger={0.08} className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-line before:to-transparent">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-canvas-muted bg-bl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-card bg-surface border border-line">
                  <div className="text-bl-ink font-bold tracking-wider mb-1">{item.year}</div>
                  <h3 className="heading-display text-2xl mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 px-6 md:px-16 bg-canvas border-t border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center">
            <div className="section-label mb-3">The Instructors</div>
            <h2 className="heading-display text-4xl md:text-5xl">MEET OUR INSTRUCTORS</h2>
            <p className="text-ink-2 mt-4 max-w-xl mx-auto">
              Certified professionals with years of training, stage experience, and teaching
              expertise.
            </p>
          </Reveal>

          <Reveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {((instructors ?? []) as any[]).map((instructor: any) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 px-6 md:px-16 bg-blk text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="heading-display text-3xl mb-10">AWARDS &amp; RECOGNITION</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {AWARDS.map((a) => (
              <div key={a.name} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mb-4">
                  <Award className="text-gold" size={32} />
                </div>
                <div className="text-[11px] font-bold tracking-[2px] uppercase">{a.name}</div>
                {a.year && (
                  <div className="text-[10px] tracking-[2px] uppercase text-white/40 mt-1">{a.year}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
