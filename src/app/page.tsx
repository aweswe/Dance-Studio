import { Suspense } from 'react';
import Link from 'next/link';

// Components
import { Nav } from '@/components/public/nav';
import { Hero } from '@/components/public/hero';
import { Marquee } from '@/components/public/marquee';
import { Stats } from '@/components/public/stats';
import { ProgrammeCard } from '@/components/public/programme-card';
import { ScheduleFilter } from '@/components/public/schedule-filter';
import { InstructorCard } from '@/components/public/instructor-card';
import { TestimonialCard } from '@/components/public/testimonial-card';
import { GalleryGrid } from '@/components/public/gallery-grid';
import { FAQAccordion } from '@/components/public/faq-accordion';
import { MapContact } from '@/components/public/map-contact';
import { Footer } from '@/components/public/footer';
import { WhatsappFloat } from '@/components/public/whatsapp-float';
import { AnnouncementBanner } from '@/components/public/announcement-banner';
import { StructuredData } from '@/components/shared/structured-data';

// Data Fetchers
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { getInstructors } from '@/data/instructors';
import { getGalleryImages } from '@/data/gallery';
import { getStats, getFAQs, getBanner, getTestimonials } from '@/data/content';



export default async function HomePage() {
  // Parallel data fetching for instant load
  const [
    programmes,
    batches,
    instructors,
    galleryImages,
    stats,
    faqsContent,
    bannerContent,
    testimonialsContent
  ] = await Promise.all([
    getProgrammes(),
    getBatches(),
    getInstructors(),
    getGalleryImages(8),
    getStats(),
    getFAQs(),
    getBanner(),
    getTestimonials()
  ]);

  // Try parsing JSON content
  let faqs = [];
  try { if (faqsContent) faqs = JSON.parse(faqsContent); } catch(e) {}
  
  let testimonials = [];
  try { if (testimonialsContent) testimonials = JSON.parse(testimonialsContent); } catch(e) {}

  return (
    <main className="relative bg-white text-blk font-body overflow-x-hidden">
      <StructuredData />
      <AnnouncementBanner content={bannerContent} />
      <Nav />
      <Hero />
      <Marquee />
      <Stats stats={stats} />

      {/* PROGRAMMES SECTION */}
      <section id="programs" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Our Programmes</div>
              <h2 className="heading-display text-4xl md:text-6xl text-blk">FIND YOUR RHYTHM</h2>
              <p className="text-sm text-mu max-w-lg mt-4 leading-relaxed">
                Whether you&apos;re looking to master a classical art form, get fit, or let your kids discover the joy of movement, we have the perfect class for you.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programmes.map((prog: any, i: number) => (
              <ProgrammeCard key={i} programme={prog} />
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section id="schedule" className="py-24 px-6 md:px-16 bg-off border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Class Schedule</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">WHEN WE MOVE</h2>
          </div>
          <ScheduleFilter batches={batches} />
        </div>
      </section>

      {/* INSTRUCTORS SECTION */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3 text-center">Our Team</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">LEARN FROM THE BEST</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((inst: any, i: number) => (
              <InstructorCard key={i} instructor={inst} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-6 md:px-16 bg-light border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Student Stories</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">WHAT THEY SAY</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((test: any, i: number) => (
              <TestimonialCard key={i} testimonial={test} />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Studio Life</div>
              <h2 className="heading-display text-4xl md:text-6xl text-blk">MOMENTS IN MOTION</h2>
            </div>
          </div>
          <GalleryGrid images={galleryImages} />
        </div>
      </section>

      {/* STUDIO RENTAL CTA */}
      <section className="py-20 px-6 md:px-16 bg-blk text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-display text-4xl md:text-5xl mb-6">NEED A SPACE TO PRACTICE?</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Our premium air-conditioned studios with professional sprung floors and mirrors are available for rent.
          </p>
          <Link 
            href="/studio-rental"
            className="inline-block border border-white/20 text-[11px] font-semibold tracking-[2px] uppercase py-4 px-8 hover:bg-white hover:text-black transition-all"
          >
            Book Studio Space
          </Link>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 md:px-16 bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Got Questions?</div>
            <h2 className="heading-display text-4xl md:text-6xl text-blk">FREQUENTLY ASKED</h2>
          </div>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      <MapContact />
      <Footer />
      <WhatsappFloat />
    </main>
  );
}
