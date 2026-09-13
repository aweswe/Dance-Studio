import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getInstructors } from '@/data/instructors';
import { SITE_URL, ROUTES } from '@/lib/utils/constants';
import { Target, Heart, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { STUDIO_INFO } from '@/data/studio-info';

export const metadata: Metadata = {
  title: 'About Us | Rhythmzz Academy of Dance',
  description:
    'Founded in 2010 by Nitish Kumar, Rhythmzz Academy of Dance is an IAO-accredited dance institute in Secunderabad delivering training across Classical, Contemporary, Commercial, and Fitness styles.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const STATS = [
  { value: "2010", label: "Founded by Nitish Kumar", sub: "15+ Years Active" },
  { value: "IAO USA", label: "Accredited Since 2014", sub: "Global Standards" },
  { value: "1,000+", label: "Dancers Trained", sub: "All Age Groups" },
  { value: "1,200 SQ FT", label: "Sprung Hardwood Floor", sub: "Professional Spec" },
];

export default async function AboutPage() {
  const instructors = await getInstructors();
  const coreInstructors = instructors ?? [];

  return (
    <div className="bg-canvas text-ink">
      {/* 01: Hero with Generous Breathing Space */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-16 border-b border-line bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-[#7C5CFC] uppercase font-bold mb-4">
              ESTABLISHED 2010 · IAO USA ACCREDITED
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl text-ink mb-6 leading-[0.92] tracking-tight uppercase">
              COMMUNITY. DISCIPLINE. <br className="hidden sm:inline" />
              <span className="text-[#7C5CFC]">STAGE MASTERY.</span>
            </h1>

            <p className="text-ink-2 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Rhythmzz Academy of Dance was established in 2010 by Nitish Kumar at Neredmet X Road, Secunderabad. We nurture confident performers through accredited syllabi, physical conditioning, and genuine stage opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* 02: Metric Tiles Bar in Bento Form */}
      <section className="bg-surface text-ink py-12 sm:py-24 px-4 sm:px-6 md:px-16 border-b border-line">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bento-card p-6 sm:p-6 flex flex-col items-center text-center justify-center rounded-[24px] hover:border-line-strong transition-all"
            >
              <span className="font-anton text-3xl sm:text-4xl md:text-5xl text-[#7C5CFC] mb-1.5 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink mb-0.5">
                {stat.label}
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-ink-3">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 03: Story & Director Spotlight in Spacious Bento Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#7C5CFC]">
              Genesis &amp; Heritage
            </div>
            
            <h2 className="font-anton text-3xl sm:text-5xl text-ink leading-[0.95] tracking-tight uppercase">
              FROM A PASSION PROJECT TO ACCREDITED INSTITUTION
            </h2>

            <p className="text-ink-2 text-sm sm:text-base leading-relaxed">
              Achieving a Diploma in Movement Arts from ISPTD Bengaluru, founder <strong className="text-ink">Nitish Kumar</strong> started Rhythmzz in 2010. By 2014, the academy earned formal accreditation from the <strong className="text-ink">International Accreditation Organization (IAO), USA</strong>.
            </p>

            <p className="text-ink-2 text-sm sm:text-base leading-relaxed">
              Every class balances anatomical alignment, musical rhythm, and stage projection. We uphold that anybody can dance with dedicated coaching and safe technique.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bento-card p-6 rounded-[22px] flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center shrink-0">
                  <Target className="text-[#7C5CFC]" size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">Mission</h4>
                  <p className="text-xs text-ink-2 leading-relaxed">Disciplined training that builds physical agility and expressive stage confidence.</p>
                </div>
              </div>

              <div className="bento-card p-6 rounded-[22px] flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center shrink-0">
                  <Heart className="text-[#7C5CFC]" size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">Philosophy</h4>
                  <p className="text-xs text-ink-2 leading-relaxed">Quality instruction done with care — creating lifelong storytellers and artistes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative h-80 sm:h-96 bento-card rounded-[28px] overflow-hidden p-0 group">
              <Image
                src="/images/studio-training/training-collage.jpg"
                alt="Studio heritage training archive"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#F5FB38] font-bold">Studio Since 2010</span>
                <span className="font-anton text-xl sm:text-2xl text-white tracking-wide uppercase">TECHNIQUE DRILLS</span>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 bento-card rounded-[28px] overflow-hidden p-0 group mt-6 sm:mt-10">
              <Image
                src="/images/srilanka-tour/raasta-stage-1.jpg"
                alt="Natfest Sri Lanka International Tour"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#F5FB38] font-bold">Global Stage</span>
                <span className="font-anton text-xl sm:text-2xl text-white tracking-wide uppercase">NATFEST TOUR</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 04: Core Faculty Grid (Clean, Spacious Portrait Cards) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-14">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
                  02 · Leadership, Management &amp; Faculty
                </span>
              </div>
              <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl text-ink tracking-tight uppercase">
                LEADERSHIP, MANAGEMENT &amp; FACULTY
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-2 max-w-sm">
              Trained at premier national and international academies with a verified 12:1 student-to-teacher ratio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreInstructors.map((coach: any) => (
              <div
                key={coach.id}
                className="bento-card p-6 flex flex-col justify-between rounded-[28px] group hover:border-line-strong transition-all"
              >
                <div>
                  <div className="relative w-full aspect-[4/4.5] rounded-2xl overflow-hidden mb-5 bg-canvas border border-line">
                    <Image
                      src={
                        coach.photo_url ||
                        (coach.name.includes('Amulya')
                          ? '/images/amulya-rajendran.jpg'
                          : coach.name.includes('Sheel')
                          ? '/images/sheel-awasthi.png'
                          : coach.name.includes('Saurabh') || coach.name.includes('Sureka')
                          ? '/images/saurabh-sureka.png'
                          : coach.name.includes('Meghna')
                          ? '/images/meghna-menon.png'
                          : coach.name.includes('Nitish')
                          ? '/images/studio-training/studio-technique.jpg'
                          : coach.name.includes('Pranith')
                          ? '/images/pranith-nair.png'
                          : coach.name.includes('Kajal')
                          ? '/images/kajal-devi.png'
                          : coach.name.includes('Srikanth')
                          ? '/images/srikanth-gymnastics.png'
                          : coach.name.includes('Srushti')
                          ? '/images/kuchipudi/kuchipudi-traditional-standing.jpg'
                          : coach.name.includes('Poonam')
                          ? '/images/studio-training/alignment-drills-1.jpg'
                          : '/images/studio-training/contemporary-movement-1.jpg')
                      }
                      alt={coach.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-black font-bold bg-[#F5FB38] px-2.5 py-1 rounded-md shadow-sm inline-block">
                        {coach.role?.split('—')[0] || coach.role}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-anton text-2xl sm:text-3xl text-ink mb-1.5 group-hover:text-[#7C5CFC] transition-colors tracking-wide uppercase">
                    {coach.name}
                  </h3>
                  <p className="text-xs text-ink-2 line-clamp-3 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>

                {Array.isArray(coach.certifications) && coach.certifications.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-line flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-[#7C5CFC] font-semibold">
                      [{coach.certifications[0]}]
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05: International Stage Production (Visual 3-Tile Feature) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto border-t border-line">
        <div className="max-w-3xl mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#7C5CFC] mb-3">
            International Stage Tour · Natfest Sri Lanka
          </p>
          <h2 className="font-anton text-3xl sm:text-5xl md:text-6xl text-ink tracking-tight uppercase leading-[0.95]">
            NATFEST SRI LANKA COLLABORATION
          </h2>
          <p className="text-sm sm:text-base text-ink-2 mt-4 leading-relaxed">
            Representing India at the Natfest International Contemporary Dance Festival, Rhythmzz performed <strong className="text-ink">&ldquo;Raasta – The Inside Light&rdquo;</strong> in collaboration with Sri Lanka&apos;s renowned Natanda Dance Company.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="relative h-64 rounded-[26px] overflow-hidden bento-card p-0 group">
            <Image
              src="/images/srilanka-tour/srilanka-workshop.jpg"
              alt="Colombo Masterclass"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <span className="text-sm font-bold text-white tracking-wide">Colombo Masterclass</span>
            </div>
          </div>

          <div className="relative h-64 rounded-[26px] overflow-hidden bento-card p-0 group">
            <Image
              src="/images/srilanka-tour/raasta-stage-2.jpg"
              alt="Raasta Stage Performance"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <span className="text-sm font-bold text-white tracking-wide">Raasta: The Inside Light</span>
            </div>
          </div>

          <div className="relative h-64 rounded-[26px] overflow-hidden bento-card p-0 group">
            <Image
              src="/images/studio-training/studio-batch-portrait.jpg"
              alt="Performance Troupe"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <span className="text-sm font-bold text-white tracking-wide">Rhythmzz Performance Troupe</span>
            </div>
          </div>
        </div>
      </section>

      {/* 06: Institutional Partners & Booking CTA */}
      <section className="py-20 px-4 sm:px-6 md:px-16 bg-surface border-t border-line text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <div className="text-[10px] font-mono tracking-[3px] uppercase text-[#7C5CFC] mb-2 font-bold">
              Trusted Across Corporate &amp; Educational Institutions
            </div>
            <h2 className="font-anton text-3xl sm:text-5xl text-ink tracking-tight uppercase">
              CLIENTS &amp; ACCREDITATIONS
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {STUDIO_INFO.corporateClients.slice(0, 10).map((client) => (
              <span
                key={client}
                className="px-4 py-2 rounded-md bg-canvas border border-line text-xs font-mono font-semibold text-ink-2 hover:border-[#7C5CFC]/40 transition-colors"
              >
                {client}
              </span>
            ))}
          </div>

          <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-center gap-5">
            <div className="flex items-center gap-2 text-xs font-mono text-ink-2">
              <ShieldCheck className="text-[#7C5CFC]" size={18} />
              <span>Full Accreditation by IAO USA (2014)</span>
            </div>
            <Link
              href={ROUTES.enrol}
              className="btn-sun px-7 py-3.5 text-xs font-black uppercase tracking-[0.16em] shadow-md flex items-center gap-2 active:scale-[0.96]"
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
