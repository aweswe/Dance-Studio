import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getInstructors } from '@/data/instructors';
import { SITE_URL, ROUTES } from '@/lib/utils/constants';
import { Target, Heart, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { STUDIO_INFO } from '@/data/studio-info';

export const metadata: Metadata = {
  title: 'About Us | Rhythmzz Academy of Dance',
  description:
    'Founded in 2010 by Nitish Kumar, Rhythmzz Academy of Dance is an IAO-accredited dance institute in Secunderabad delivering training across Classical, Contemporary, Commercial, and Fitness styles.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const STATS = [
  { value: "2010", label: "Founded by Nitish Kumar" },
  { value: "IAO USA", label: "Accredited Since 2014" },
  { value: "1,000+", label: "Dancers Trained" },
  { value: "1,200 SQ FT", label: "Sprung Hardwood Floor" },
];

export default async function AboutPage() {
  const instructors = await getInstructors();
  const coreInstructors = (instructors ?? []).slice(0, 6);

  return (
    <div className="bg-canvas text-ink">
      {/* 01: Hero with Generous Breathing Space */}
      <section className="relative overflow-hidden py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-16 text-center border-b border-line bg-canvas">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center mb-4 px-3.5 py-1 rounded-full border border-line bg-surface/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              ESTABLISHED 2010 · IAO USA ACCREDITED
            </span>
          </div>

          <h1 className="heading-urban text-4xl sm:text-6xl md:text-7xl text-ink mb-6 leading-[1.05] tracking-tight">
            COMMUNITY. DISCIPLINE. <br className="hidden sm:inline" />
            STAGE MASTERY.
          </h1>

          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Rhythmzz Academy of Dance was established in 2010 by Nitish Kumar at Neredmet X Road, Secunderabad. We nurture confident performers through accredited syllabi, physical conditioning, and genuine stage opportunities.
          </p>
        </div>
      </section>

      {/* 02: Metric Tiles Bar */}
      <section className="bg-surface text-ink py-10 sm:py-12 px-4 sm:px-6 md:px-16 border-b border-line">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="heading-urban text-3xl sm:text-4xl md:text-5xl text-[#FB923C] mb-1">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[1.5px] uppercase text-ink-3">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 03: Story & Director Spotlight in Spacious Bento Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Text Column: Concise & Grounded */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#FB923C]">
              Genesis &amp; Heritage
            </div>
            
            <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              FROM A PASSION PROJECT TO ACCREDITED INSTITUTION
            </h2>

            <p className="text-ink-2 text-sm md:text-base leading-relaxed">
              Achieving a Diploma in Movement Arts from ISPTD Bengaluru, founder <strong className="text-ink">Nitish Kumar</strong> started Rhythmzz in 2010. By 2014, the academy earned formal accreditation from the <strong className="text-ink">International Accreditation Organization (IAO), USA</strong>.
            </p>

            <p className="text-ink-2 text-sm md:text-base leading-relaxed">
              Every class balances anatomical alignment, musical rhythm, and stage projection. We uphold that anybody can dance with dedicated coaching and safe technique.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bento-card p-4 flex gap-3 items-start">
                <Target className="text-[#FB923C] shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-0.5">Mission</h4>
                  <p className="text-[11px] text-ink-2">Disciplined training that builds physical agility and expressive stage confidence.</p>
                </div>
              </div>

              <div className="bento-card p-4 flex gap-3 items-start">
                <Heart className="text-[#FB923C] shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-0.5">Philosophy</h4>
                  <p className="text-[11px] text-ink-2">Quality instruction done with care — creating lifelong storytellers and artistes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative h-72 sm:h-80 bento-card overflow-hidden p-0 group">
              <Image
                src="/images/studio-training/training-collage.jpg"
                alt="Studio heritage training archive"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#FB923C] font-bold">Studio Since 2010</span>
                <span className="heading-urban text-lg text-white">TECHNIQUE DRILLS</span>
              </div>
            </div>

            <div className="relative h-72 sm:h-80 bento-card overflow-hidden p-0 group mt-6 sm:mt-8">
              <Image
                src="/images/srilanka-tour/raasta-stage-1.jpg"
                alt="Natfest Sri Lanka International Tour"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#FB923C] font-bold">Global Stage</span>
                <span className="heading-urban text-lg text-white">NATFEST TOUR</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 04: Core Faculty Grid (Clean, Spacious Portrait Cards) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-2">
                Certified Coaches
              </span>
              <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
                INSTRUCTIONAL FACULTY
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-2 max-w-sm">
              Trained at premier national and international academies with a verified 12:1 student ratio.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-6">
            {coreInstructors.map((coach: any) => (
              <div
                key={coach.id}
                className="bento-card p-5 flex flex-col justify-between group hover:border-line-strong transition-all"
              >
                <div>
                  <div className="relative w-full aspect-[4/4.5] rounded-xl overflow-hidden mb-4 bg-canvas border border-line">
                    <Image
                      src={
                        coach.name.includes('Nitish')
                          ? '/images/studio-training/studio-technique.jpg'
                          : coach.name.includes('Pranith')
                          ? '/images/class-2.jpg'
                          : coach.name.includes('Kajal')
                          ? '/images/class-1.jpg'
                          : coach.name.includes('Srushti')
                          ? '/images/kuchipudi/kuchipudi-traditional-standing.jpg'
                          : coach.name.includes('Poonam')
                          ? '/images/studio-training/alignment-drills-1.jpg'
                          : '/images/studio-training/contemporary-movement-1.jpg'
                      }
                      alt={coach.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                        {coach.role?.split('—')[0] || coach.role}
                      </span>
                    </div>
                  </div>

                  <h3 className="heading-urban text-xl sm:text-2xl text-ink mb-1 group-hover:text-[#FB923C] transition-colors">
                    {coach.name}
                  </h3>
                  <p className="text-xs text-ink-2 line-clamp-2 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>

                {Array.isArray(coach.certifications) && coach.certifications.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-line flex flex-wrap gap-1">
                    <span className="text-[9px] font-mono tracking-wider uppercase text-[#FB923C]">
                      {coach.certifications[0]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05: International Stage Production (Visual 3-Tile Feature) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-line text-[#FB923C] text-[10px] font-mono font-bold tracking-[2px] uppercase mb-3">
            <Globe size={14} /> International Production
          </div>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            NATFEST SRI LANKA COLLABORATION
          </h2>
          <p className="text-sm md:text-base text-ink-2 mt-3 leading-relaxed">
            Representing India at the Natfest International Contemporary Dance Festival, Rhythmzz performed <strong className="text-ink">&ldquo;Raasta – The Inside Light&rdquo;</strong> in collaboration with Sri Lanka&apos;s renowned Natanda Dance Company.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="relative h-56 rounded-2xl overflow-hidden bento-card p-0 group">
            <Image
              src="/images/srilanka-tour/srilanka-workshop.jpg"
              alt="Colombo Masterclass"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white">Colombo Dance Masterclass</span>
            </div>
          </div>

          <div className="relative h-56 rounded-2xl overflow-hidden bento-card p-0 group">
            <Image
              src="/images/srilanka-tour/raasta-stage-2.jpg"
              alt="Raasta Stage Performance"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white">Raasta: The Inside Light</span>
            </div>
          </div>

          <div className="relative h-56 rounded-2xl overflow-hidden bento-card p-0 group">
            <Image
              src="/images/studio-training/studio-batch-portrait.jpg"
              alt="Performance Troupe"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white">Rhythmzz Performance Troupe</span>
            </div>
          </div>
        </div>
      </section>

      {/* 06: Institutional Partners & Booking CTA */}
      <section className="py-20 px-4 sm:px-6 md:px-16 bg-surface border-t border-line text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <div className="text-[10px] font-mono tracking-[3px] uppercase text-[#FB923C] mb-2 font-bold">
              Trusted Across Corporate &amp; Educational Institutions
            </div>
            <h2 className="heading-urban text-3xl sm:text-4xl text-ink">
              CLIENTS &amp; ACCREDITATIONS
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {STUDIO_INFO.corporateClients.slice(0, 10).map((client) => (
              <span
                key={client}
                className="px-4 py-2 rounded-full bg-canvas border border-line text-xs font-mono font-semibold text-ink-2"
              >
                {client}
              </span>
            ))}
          </div>

          <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-ink-2">
              <ShieldCheck className="text-[#FB923C]" size={18} />
              <span>Full Accreditation by IAO USA (2014)</span>
            </div>
            <Link
              href={ROUTES.enrol}
              className="btn-peach px-6 py-3 text-xs font-black uppercase tracking-[0.16em] shadow-md flex items-center gap-2 active:scale-[0.96]"
            >
              <span>Book A Free Trial Class</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
