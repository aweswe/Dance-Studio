import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProgrammes, getProgrammeBySlug } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { CheckCircle2, Clock, Calendar, IndianRupee, MapPin } from 'lucide-react';
import { formatTime } from '@/lib/utils/format';
import { SITE_URL } from '@/lib/utils/constants';
import { KuchipudiCurriculum } from '@/components/public/kuchipudi-curriculum';
import { ClassicalCurriculumMatrix } from '@/components/public/classical-curriculum-matrix';
import { LevelCertificationSection } from '@/components/public/level-certification-section';
import {
  KuchipudiRoadmap,
  KuchipudiRepertoireFlow,
  KuchipudiClassFlow,
  KuchipudiFaqAccordion,
} from '@/components/public/kuchipudi-interactive';

import { KuchipudiShowcase } from '@/components/public/kuchipudi-showcase';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'commercial-expressive' },
    { slug: 'mind-body-fitness' },
    { slug: 'classical-dance' },
    { slug: 'kids-dance' },
    { slug: 'adults-dance' },
    { slug: 'kuchipudi' },
    { slug: 'kathak' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme: any = await getProgrammeBySlug(slug);
  
  if (!programme) {
    return {
      title: 'Programme Not Found'
    };
  }
  
  if (slug === 'kuchipudi') {
    return {
      title: 'Kuchipudi Dance Classes for Kids & Adults | Rhythmzz Academy',
      description:
        'Learn Kuchipudi dance from age 5 to professional performance. Structured year-wise curriculum, expert guidance, and flexible batches now enrolling at Rhythmzz Academy.',
      alternates: { canonical: `${SITE_URL}/programmes/kuchipudi` },
    };
  }

  return {
    title: programme.name,
    description: programme.description || `Join our ${programme.name} classes in Secunderabad. Free trial class at Neredmet X Road.`,
    alternates: { canonical: `${SITE_URL}/programmes/${slug}` },
  };
}

const PROGRAMME_NOTES: Record<string, string> = {
  'commercial-expressive':
    'Commercial & Expressive Style at Rhythmzz runs Monday to Wednesday, 5 to 9 PM, divided into dedicated Kids (5–14 yrs) and Adults (15+ yrs) cohorts taught by Nitish, Pranith, Deepak, and Kajal — covering Bollywood, Hip Hop, Contemporary, Tollywood, and Gymnastics with annual recital stage performance opportunities.',
  'mind-body-fitness':
    'Mind & Body Fitness runs weekday mornings, 9:30 to 10:30 AM, with Shailaja — Zumba, Yoga, Pilates, HIIT, strength, Tabata, core and mobility on a rotating weekly schedule.',
  'classical-dance':
    'Structured Level-Based Classical Dance Certification offers certified training in Kuchipudi, Kathak, Bharatnatyam, and Ballet, with active master syllabi for Kuchipudi (Guru Srushti) and Kathak (Guru Poonam). Prohibits casual drop-ins to guarantee rigorous progression toward Rangapravesham solo debuts.',
  'kids-dance':
    'Kids Batch (Ages 5–14) under Commercial & Expressive Style — Bollywood, Hip Hop, Contemporary, and Gymnastics taught step by step.',
  'adults-dance':
    'Adults Batch (Ages 15+) under Commercial & Expressive Style — Bollywood, Commercial Hip Hop, Contemporary, and Tollywood choreography.',
  kuchipudi:
    'Kuchipudi Classical is a level-based, certified programme taught by Srusti on Fridays and Saturdays, 6:30 to 7:30 PM — 10-Year Foundation through Advanced and 6-Year Accelerated Certificate tracks with formal public examination.',
  kathak:
    'Kathak Classical is a Lucknow Gharana certified programme taught by Poonam Nayak Jamwale — Tatkar footwork, Chakkars, Toda-Tukra, and Abhinaya leading to Gandharva Mahavidyalaya Visharad certification.',
};

const PROGRAMME_HERO_IMAGES: Record<string, { src: string; alt: string }> = {
  'commercial-expressive': {
    src: '/images/studio-training/contemporary-conditioning.jpg',
    alt: 'Commercial and Expressive Style dance training at Rhythmzz Academy',
  },
  'mind-body-fitness': {
    src: '/images/studio-training/floorwork-stretch.jpg',
    alt: 'Mind and body fitness, yoga and conditioning at Rhythmzz',
  },
  'classical-dance': {
    src: '/images/classical-certification-dancer.png',
    alt: 'Structured level-based classical dance certification',
  },
  'kids-dance': {
    src: '/images/studio-training/group-circle-drill.jpg',
    alt: 'Kids and youth dance training at Rhythmzz Academy',
  },
  'adults-dance': {
    src: '/images/studio-training/contemporary-conditioning.jpg',
    alt: 'Adults dance batch and contemporary training',
  },
  kuchipudi: {
    src: '/images/classical-certification-dancer.png',
    alt: 'Kuchipudi classical dance posture and hastas',
  },
  kathak: {
    src: '/images/classical-certification-dancer.png',
    alt: 'Kathak classical dance Lucknow Gharana posture',
  },
};

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const [programmeRaw, allBatches] = await Promise.all([getProgrammeBySlug(slug), getBatches()]);
  const programme: any = programmeRaw;

  if (!programme) {
    notFound();
  }

  const programmeBatches = (allBatches ?? []).filter(
    (b: any) => b.programme?.slug === slug || b.programme_id === programme.id,
  );

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": programme.name,
    "description": programme.description,
    "provider": {
      "@type": "Organization",
      "name": "Rhythmzz Academy of Dance",
      "sameAs": SITE_URL
    }
  };

  const includesList = programme.includes ? (typeof programme.includes === 'string' ? JSON.parse(programme.includes) : programme.includes) : [];
  const heroImage = PROGRAMME_HERO_IMAGES[slug] || PROGRAMME_HERO_IMAGES['kids-dance'];

  if (slug === 'kuchipudi') {
    return (
      <div className="bg-canvas text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
        <KuchipudiShowcase />
      </div>
    );
  }

  return (
    <div className="bg-canvas text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* 01: Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-16 border-b border-line bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="mb-2">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-[#7C5CFC] uppercase font-bold">
                  {programme.age_group || 'All Ages'} · CERTIFIED BATCHES
                </span>
              </div>

              <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl text-ink leading-[0.92] tracking-tight uppercase">
                {programme.name}
              </h1>

              <p className="text-ink-2 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl">
                {programme.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/enrol?programme=${programme.slug}`}
                  className="btn-sun px-8 py-3.5 text-xs font-black uppercase tracking-[0.16em] shadow-md flex items-center gap-2 active:scale-[0.96]"
                >
                  <span>Book Free Trial</span>
                </Link>
                {slug === 'kuchipudi' && (
                  <a
                    href="#curriculum"
                    className="px-6 py-3.5 rounded-xl bg-surface border border-line text-xs font-mono font-bold uppercase tracking-wider text-ink hover:border-[#7C5CFC] transition-colors inline-flex items-center gap-2"
                  >
                    <span>View Syllabus</span>
                    <span className="text-[#7C5CFC]">↓</span>
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-80 sm:h-96 w-full bento-card rounded-[32px] overflow-hidden p-0 shadow-xl group border-line-strong">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#F5FB38] uppercase font-bold">STUDIO ARCHIVE</span>
                    <h3 className="font-anton text-2xl text-white uppercase tracking-wide">{programme.name} Masterclass</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02: Content Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* About */}
          <div className="bento-card p-6 sm:p-8 rounded-[28px] space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
                // Programme Scope
              </span>
            </div>
            <h2 className="font-anton text-3xl sm:text-4xl text-ink tracking-tight uppercase">ABOUT THIS DISCIPLINE</h2>
            <div className="text-sm sm:text-base text-ink-2 space-y-4 leading-relaxed">
              <p>{PROGRAMME_NOTES[slug] ?? programme.description}</p>
              <p>
                The studio is at Neredmet X Road, Secunderabad — 8–15 minutes by drive
                from Sainikpuri, AS Rao Nagar and Yapral. Every learner receives one complimentary
                trial class with zero registration fee.
              </p>
            </div>
          </div>

          {/* Includes */}
          {includesList.length > 0 && (
            <div className="bento-card p-6 sm:p-8 rounded-[28px] space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
                  // Curriculum Highlights
                </span>
              </div>
              <h2 className="font-anton text-3xl sm:text-4xl text-ink tracking-tight uppercase">WHAT YOU&apos;LL MASTER</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {includesList.map((item: string, idx: number) => (
                  <div key={idx} className="flex gap-3.5 items-center bg-canvas p-4 rounded-2xl border border-line">
                    <span className="w-6 h-6 rounded-lg bg-[#7C5CFC]/10 text-[#7C5CFC] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batches / Schedule */}
          <div className="bento-card p-6 sm:p-8 rounded-[28px] space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
                // Timetable
              </span>
            </div>
            <h2 className="font-anton text-3xl sm:text-4xl text-ink tracking-tight uppercase">ACTIVE BATCH SCHEDULE</h2>
            {(programmeBatches.length > 0
              ? programmeBatches
              : ((programme.batches ?? []) as any[])
            ).length > 0 ? (
              <div className="space-y-4">
                {(programmeBatches.length > 0
                  ? programmeBatches
                  : ((programme.batches ?? []) as any[])
                ).map((batch: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-canvas border border-line rounded-2xl gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-ink font-semibold text-sm">
                        <Calendar size={16} className="text-[#7C5CFC]" />
                        {Array.isArray(batch.days) ? batch.days.join(', ') : batch.days}
                      </div>
                      <div className="flex items-center gap-2 text-ink-2 text-xs font-mono">
                        <Clock size={14} className="text-ink-3" />
                        {formatTime(batch.time_start)} – {formatTime(batch.time_end)}
                      </div>
                    </div>
                    {batch.instructor && (
                      <div className="flex items-center gap-3">
                        {batch.instructor.photo_url ? (
                          <Image src={batch.instructor.photo_url} alt={batch.instructor.name} width={40} height={40} className="rounded-full object-cover border border-line" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#000000] text-[#F5FB38] flex items-center justify-center text-xs font-bold font-mono">
                            {batch.instructor.name?.charAt(0) || 'I'}
                          </div>
                        )}
                        <div className="text-sm">
                          <div className="text-[10px] text-ink-3 font-mono uppercase tracking-wider">Coach</div>
                          <div className="font-bold text-xs text-ink">{batch.instructor.name}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink-2 bg-canvas p-6 rounded-2xl border border-line text-center text-xs font-mono">Schedule details will be updated soon.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing Card */}
          <div className="bento-card p-6 sm:p-8 rounded-[28px] space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
                Tuition Fee
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-black font-bold bg-[#F5FB38] px-2 py-0.5 rounded-md">
                Zero Admission Fee
              </span>
            </div>

            <div className="space-y-4">
              {programme.fees_monthly && (
                <div className="flex justify-between items-center p-3.5 bg-canvas rounded-2xl border border-line">
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-2 font-semibold">Monthly Plan</span>
                  <div className="flex items-center font-anton text-2xl text-ink">
                    <IndianRupee size={18} className="mr-0.5 text-ink-3" />
                    {programme.fees_monthly}
                  </div>
                </div>
              )}
              {programme.fees_quarterly && (
                <div className="flex justify-between items-center p-3.5 bg-canvas rounded-2xl border border-line">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-ink-2 font-semibold block">Quarterly Plan</span>
                    <span className="text-[10px] font-mono text-[#7C5CFC]">Save 10%</span>
                  </div>
                  <div className="flex items-center font-anton text-2xl text-[#7C5CFC]">
                    <IndianRupee size={18} className="mr-0.5" />
                    {programme.fees_quarterly}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/enrol?programme=${programme.slug}`}
              className="btn-sun w-full py-4 text-xs font-black uppercase tracking-[0.16em] shadow-md flex items-center justify-center gap-2 active:scale-[0.96]"
            >
              <span>Book Trial Class</span>
            </Link>
          </div>

          {/* Location Info */}
          <div className="bento-card p-6 rounded-[28px] border border-line space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 text-[#7C5CFC] flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">Campus Location</h4>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Rhythmzz Academy, Plot 597, 3rd Floor, Neredmet X Road, Secunderabad
                </p>
              </div>
            </div>
            <p className="text-[11px] text-ink-3 font-mono border-t border-line pt-3">
              Near ICICI ATM · 8–15 mins from Sainikpuri, AS Rao Nagar &amp; Yapral.
            </p>
          </div>
        </div>

      </section>

      {/* Embedded Classical Certification Curriculum & Interactive Modules */}
      {(slug === 'classical-dance' ||
        slug === 'kuchipudi' ||
        slug === 'classical-certification' ||
        slug === 'kathak') && (
        <div className="border-t border-line divide-y divide-line">
          {/* Structured Level-Based Certification Overview */}
          <LevelCertificationSection showExploreCurriculum={false} className="py-12 sm:py-16" />

          {/* Master Curriculum Matrix (Kuchipudi & Kathak) */}
          <section id="curriculum" className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
            <ClassicalCurriculumMatrix />
          </section>

          {/* Roadmap to Rangapravesham */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold block">
                The Classical Journey
              </span>
              <h2 className="font-anton tracking-wide uppercase text-3xl sm:text-4xl md:text-5xl text-ink">
                ROADMAP TO RANGAPRAVESHAM
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-ink-2 leading-relaxed">
                From the first Aramandi stamp to the final bow accompanied by a full live Carnatic orchestra — explore the progressive milestones of classical mastery.
              </p>
            </div>
            <KuchipudiRoadmap />
          </section>

          {/* Repertoire Flow */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
            <KuchipudiRepertoireFlow />
          </section>

          {/* Class Ritual Flow */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
            <KuchipudiClassFlow />
          </section>

          {/* FAQ Accordion */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
            <KuchipudiFaqAccordion />
          </section>
        </div>
      )}
    </div>
  );
}

