import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/utils/constants';

// Components
import { Hero } from '@/components/public/hero';
import { Marquee } from '@/components/public/marquee';
import { Stats } from '@/components/public/stats';
import { ProgrammeCard } from '@/components/public/programme-card';
import { ScheduleFilter } from '@/components/public/schedule-filter';
import { InstructorCard } from '@/components/public/instructor-card';
import { TestimonialCard } from '@/components/public/testimonial-card';
import { GalleryGrid } from '@/components/public/gallery-grid';
import { JoinCTA } from '@/components/public/join-cta';
import { FAQAccordion } from '@/components/public/faq-accordion';
import { MapContact } from '@/components/public/map-contact';
import { StructuredData } from '@/components/shared/structured-data';

// Data Fetchers
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { getInstructors } from '@/data/instructors';
import { getGalleryImages } from '@/data/gallery';
import { getStats, getFAQs, getTestimonials } from '@/data/content';

// Utils
import { scheduleFor } from '@/lib/utils/schedule';

// Motion
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

// Homepage runs 7 Supabase queries per request — cache it for an hour so
// public traffic doesn't hammer the DB. Content changes land within the hour.
export const revalidate = 3600;

export default async function HomePage() {
  // Parallel data fetching for instant load
  const [
    programmes,
    batches,
    instructors,
    galleryImages,
    stats,
    faqsContent,
    testimonialsContent,
  ] = await Promise.all([
    getProgrammes(),
    getBatches(),
    getInstructors(),
    getGalleryImages(8),
    getStats(),
    getFAQs(),
    getTestimonials(),
  ]);

  // Try parsing JSON content
  let faqs = [];
  try { if (faqsContent) faqs = JSON.parse(faqsContent); } catch {}

  let testimonials = [];
  try { if (testimonialsContent) testimonials = JSON.parse(testimonialsContent); } catch {}

  return (
    <div className="relative bg-canvas text-ink font-body overflow-x-hidden">
      <StructuredData />
      <Hero />
      <Marquee />
      <Stats stats={stats} />

      {/* PROGRAMMES SECTION */}
      <section id="programs" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <div className="section-label mb-3">Four Programmes · One Studio</div>
              <h2 className="heading-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">KIDS · ADULTS · FITNESS · CLASSICAL</h2>
              <p className="text-sm sm:text-base text-ink-2 max-w-lg mt-3 leading-relaxed">
                Fees from ₹2,000 a month. No registration fee. Your first class is on us — book a free trial at Neredmet X Road, Secunderabad.
              </p>
            </div>
          </Reveal>

          <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programmes.map((prog: any, i: number) => (
              <ProgrammeCard key={i} programme={prog} schedule={scheduleFor(prog, batches)} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section id="schedule" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-canvas-muted-2 border-y border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-10 sm:mb-12">
            <div className="section-label mb-3">Weekly Schedule</div>
            <h2 className="heading-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">CLASSES AT NEREDMET X ROAD</h2>
            <p className="text-sm sm:text-base text-ink-2 max-w-lg mt-3 leading-relaxed">
              Monday to Saturday, 6 AM to 9 PM — find the batch that fits your week.
            </p>
          </Reveal>

          {/* Quick Discipline Timetable Visual Segments */}
          <Reveal stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="group relative h-48 rounded-card overflow-hidden border border-line bg-blk flex flex-col justify-end p-5">
              <Image
                src="/images/studio-training/floorwork-stretch.jpg"
                alt="Morning Fitness at Rhythmzz"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/40 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-bl-light px-2 py-0.5 rounded bg-bl/20 inline-block mb-1.5">
                  6:00 – 10:30 AM
                </span>
                <h4 className="heading-display text-xl text-white">MIND &amp; BODY FITNESS</h4>
                <p className="text-[11px] text-white/70">Zumba · Yoga · Pilates · HIIT</p>
              </div>
            </div>

            <div className="group relative h-48 rounded-card overflow-hidden border border-line bg-blk flex flex-col justify-end p-5">
              <Image
                src="/images/studio-training/group-circle-drill.jpg"
                alt="Kids Dance at Rhythmzz"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/40 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20 inline-block mb-1.5">
                  5:00 – 7:00 PM
                </span>
                <h4 className="heading-display text-xl text-white">KIDS DANCE BATCHES</h4>
                <p className="text-[11px] text-white/70">Bollywood · Hip Hop · Foundation</p>
              </div>
            </div>

            <div className="group relative h-48 rounded-card overflow-hidden border border-line bg-blk flex flex-col justify-end p-5">
              <Image
                src="/images/studio-training/contemporary-conditioning.jpg"
                alt="Adults Dance at Rhythmzz"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/40 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 inline-block mb-1.5">
                  7:00 – 9:00 PM
                </span>
                <h4 className="heading-display text-xl text-white">ADULTS DANCE BATCHES</h4>
                <p className="text-[11px] text-white/70">Choreography · Contemporary · Street</p>
              </div>
            </div>

            <div className="group relative h-48 rounded-card overflow-hidden border border-line bg-blk flex flex-col justify-end p-5">
              <Image
                src="/images/kuchipudi/kuchipudi-natyarambham-posture.jpg"
                alt="Kuchipudi Classical at Rhythmzz"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/40 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 inline-block mb-1.5">
                  Fri &amp; Sat · 6:30 PM
                </span>
                <h4 className="heading-display text-xl text-white">KUCHIPUDI CLASSICAL</h4>
                <p className="text-[11px] text-white/70">10 &amp; 6-Year Public Exam Tracks</p>
              </div>
            </div>
          </Reveal>

          <Reveal y={20}>
            <ScheduleFilter batches={batches} />
          </Reveal>
        </div>
      </section>

      {/* INSTRUCTORS SECTION */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-12 sm:mb-16 text-center">
            <div className="section-label mb-3 text-center">The Instructors</div>
            <h2 className="heading-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">TRAINED, CERTIFIED, ON STAGE</h2>
            <p className="text-sm sm:text-base text-ink-2 max-w-lg mt-3 mx-auto leading-relaxed">
              Led by founder Nitish — ISPTD-certified, nATFEST International Festival Sri Lanka 2017, teaching for 15+ years.
            </p>
          </Reveal>
          <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((inst: any, i: number) => (
              <InstructorCard key={i} instructor={inst} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-canvas-muted border-y border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-12 sm:mb-16 text-center">
            <div className="section-label mb-3">From Our Students</div>
            <h2 className="heading-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">5,000+ STUDENTS. HERE ARE THREE.</h2>
          </Reveal>
          <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((test: any, i: number) => (
              <TestimonialCard key={i} testimonial={test} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* KUCHIPUDI MASTER CURRICULUM SPOTLIGHT BANNER */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 md:px-16 bg-gradient-to-r from-canvas-muted to-surface border-y border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="bg-canvas border border-line-strong rounded-card p-6 sm:p-8 md:p-12 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bl/10 text-bl text-[10px] font-bold tracking-[2px] uppercase">
                  Classical Excellence · Certificate Examination
                </div>
                <h2 className="heading-display text-2xl sm:text-3xl md:text-5xl text-ink leading-tight">
                  KUCHIPUDI 10-YEAR &amp; 6-YEAR MASTER CURRICULUM
                </h2>
                <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
                  Structured classical training from age 5 to advanced repertoire — Adavus, Jathis, Hastas, Chaturvidha Abhinaya, and Dr. Vempati Chinna Satyam Master Garu choreographies leading to the Certificate Public Examination.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs font-semibold text-ink pt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-bl" /> 10-Year Foundation Plan (Ages 5–7)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> 6-Year Accelerated Certificate
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
                <Link
                  href="/kuchipudi"
                  className="text-center text-[11px] font-semibold tracking-[2px] uppercase py-4 px-8 bg-bl text-white hover:bg-bl-deep transition-all rounded-control focus-visible:focus-ring active:scale-[0.98] shadow-md shadow-bl/20"
                >
                  Explore Master Syllabus
                </Link>
                <Link
                  href="/enrol?programme=kuchipudi"
                  className="text-center text-[11px] font-semibold tracking-[2px] uppercase py-4 px-8 border border-line-strong hover:border-bl hover:text-bl transition-all rounded-control focus-visible:focus-ring"
                >
                  Book Free Trial
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTERNATIONAL TOURS & STAGE PRODUCTIONS */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-blk text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="mb-12 sm:mb-16">
            <div className="text-[10px] tracking-[2px] sm:tracking-[4px] uppercase text-bl-light mb-3 font-semibold">Global Footprint &amp; Stage Repertory</div>
            <h2 className="heading-display text-3xl sm:text-4xl md:text-6xl text-white leading-tight">
              INTERNATIONAL STAGE PRODUCTIONS
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-2xl mt-4 leading-relaxed">
              From Neredmet X Road to the international stage — performing original choreographies like <em>&ldquo;Raasta: Inside Light&rdquo;</em> in Sri Lanka and training alongside international artistes at Natfest Colombo.
            </p>
          </Reveal>

          <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative h-80 rounded-card overflow-hidden border border-white/10 bg-white/5">
              <Image
                src="/images/srilanka-tour/raasta-stage-1.jpg"
                alt="Raasta Inside Light Stage Performance"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] tracking-[2px] uppercase text-bl-light font-bold mb-1">Production</span>
                <h3 className="heading-display text-2xl text-white">RAASTA: INSIDE LIGHT</h3>
                <p className="text-xs text-white/70 mt-1">Staged with Natanda Dance Company, Sri Lanka</p>
              </div>
            </div>

            <div className="group relative h-80 rounded-card overflow-hidden border border-white/10 bg-white/5">
              <Image
                src="/images/srilanka-tour/srilanka-workshop.jpg"
                alt="International Dance Workshop Sri Lanka"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] tracking-[2px] uppercase text-bl-light font-bold mb-1">Exchange</span>
                <h3 className="heading-display text-2xl text-white">NATFEST COLOMBO</h3>
                <p className="text-xs text-white/70 mt-1">Cross-cultural masterclasses &amp; technique exchange</p>
              </div>
            </div>

            <div className="group relative h-80 rounded-card overflow-hidden border border-white/10 bg-white/5">
              <Image
                src="/images/srilanka-tour/raasta-stage-2.jpg"
                alt="International Stage Ensemble"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] tracking-[2px] uppercase text-bl-light font-bold mb-1">Tour Ensemble</span>
                <h3 className="heading-display text-2xl text-white">STAGE REPERTORY</h3>
                <p className="text-xs text-white/70 mt-1">Professional troupe performances &amp; festivals</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 px-6 md:px-16 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="section-label mb-3">Inside the Studio</div>
              <h2 className="heading-display text-4xl md:text-6xl text-ink">CLASS DAYS &amp; SHOW NIGHTS</h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-bold uppercase tracking-[2px] text-bl hover:text-bl-deep transition-colors"
            >
              View Full Photo Gallery →
            </Link>
          </Reveal>
          <Reveal y={20}>
            <GalleryGrid images={galleryImages} />
          </Reveal>
        </div>
      </section>

      {/* JOIN CTA */}
      <JoinCTA />

      {/* STUDIO RENTAL CTA */}
      <section className="py-20 px-6 md:px-16 bg-blk text-center text-white">
        <Reveal y={20} className="max-w-3xl mx-auto">
          <h2 className="heading-display text-4xl md:text-5xl mb-6">NEED A SPACE TO PRACTICE?</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Air-conditioned studio with mirrors, sprung floor and sound at Neredmet X Road — ₹1,000/hr weekdays, ₹1,500/hr weekends.
          </p>
          <Link
            href="/studio-rental"
            className="inline-block border border-white/20 text-[11px] font-semibold tracking-[2px] uppercase py-4 px-8 hover:bg-white hover:text-black transition-all focus-visible:focus-ring active:scale-[0.98]"
          >
            Book Studio Space
          </Link>
        </Reveal>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 md:px-16 bg-canvas-muted">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center">
            <div className="section-label mb-3">FAQ</div>
            <h2 className="heading-display text-4xl md:text-6xl text-ink">QUESTIONS WE GET AT THE STUDIO</h2>
          </Reveal>
          <Reveal y={20}>
            <FAQAccordion faqs={faqs} />
          </Reveal>
        </div>
      </section>

      <MapContact />
    </div>
  );
}
