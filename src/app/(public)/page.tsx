import Link from 'next/link';
import type { Metadata } from 'next';

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
  alternates: { canonical: 'https://www.rhythmzzdance.com' },
};

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
  try { if (faqsContent) faqs = JSON.parse(faqsContent); } catch(e) {}

  let testimonials = [];
  try { if (testimonialsContent) testimonials = JSON.parse(testimonialsContent); } catch(e) {}

  return (
    <div className="relative bg-white text-blk font-body overflow-x-hidden">
      <StructuredData />
      <Hero />
      <Marquee />
      <Stats stats={stats} />

      {/* PROGRAMMES SECTION */}
      <section id="programs" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Four Programmes · One Studio</div>
              <h2 className="heading-display text-4xl md:text-6xl text-blk">KIDS · ADULTS · FITNESS · CLASSICAL</h2>
              <p className="text-sm text-mu max-w-lg mt-4 leading-relaxed">
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
      <section id="schedule" className="py-24 px-6 md:px-16 bg-off border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Weekly Schedule</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">CLASSES AT NEREDMET X ROAD</h2>
            <p className="text-sm text-mu max-w-lg mt-4 leading-relaxed">
              Monday to Saturday, 6 AM to 9 PM — find the batch that fits your week.
            </p>
          </Reveal>
          <Reveal y={20}>
            <ScheduleFilter batches={batches} />
          </Reveal>
        </div>
      </section>

      {/* INSTRUCTORS SECTION */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3 text-center">The Instructors</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">TRAINED, CERTIFIED, ON STAGE</h2>
            <p className="text-sm text-mu max-w-lg mt-4 mx-auto leading-relaxed">
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
      <section className="py-24 px-6 md:px-16 bg-light border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">From Our Students</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">5,000+ STUDENTS. HERE ARE THREE.</h2>
          </Reveal>
          <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((test: any, i: number) => (
              <TestimonialCard key={i} testimonial={test} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Inside the Studio</div>
              <h2 className="heading-display text-4xl md:text-6xl text-blk">CLASS DAYS &amp; SHOW NIGHTS</h2>
            </div>
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
            className="inline-block border border-white/20 text-[11px] font-semibold tracking-[2px] uppercase py-4 px-8 hover:bg-white hover:text-black transition-all"
          >
            Book Studio Space
          </Link>
        </Reveal>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 md:px-16 bg-light">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">FAQ</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">QUESTIONS WE GET AT THE STUDIO</h2>
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
