import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getInstructors } from '@/data/instructors';
import { SITE_URL, ROUTES } from '@/lib/utils/constants';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Rhythmzz Academy of Dance',
  description:
    'Founded in 2010 by Nitish Kumar, Rhythmzz Academy of Dance is an IAO-accredited dance institute in Secunderabad delivering training across Classical, Contemporary, Commercial, and Fitness styles.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const STATS = [
  { value: '2010', label: 'Founded by Nitish Kumar' },
  { value: 'IAO USA', label: 'Accredited Since 2014' },
  { value: '1,000+', label: 'Dancers Trained' },
  { value: '1,200 SQ FT', label: 'Sprung Hardwood Studio' },
];

export default async function AboutPage() {
  const instructors = await getInstructors();
  const coreInstructors = instructors ?? [];

  return (
    <div className="bg-canvas text-ink">
      {/* 01: Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-14 border-b border-line max-w-[1440px] mx-auto">
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-ink-3 mb-4">
          About Us · Rhythmzz Academy of Dance
        </p>
        <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl text-ink leading-[0.92] tracking-tight uppercase mb-6">
          COMMUNITY.<br />
          DISCIPLINE.<br />
          STAGE MASTERY.
        </h1>
        <p className="text-ink-2 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
          Nitish started Rhythmzz in 2010 above the ICICI ATM at Neredmet X Road.
          We still teach in that room — sprung floor, mirrors, AC, the same number on WhatsApp.
        </p>

        {/* Flat Stat Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 mt-12 border-t border-line">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-anton text-3xl sm:text-4xl text-ink tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 02: The Studio Story */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-14 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Narrative */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3">
              01 · Our Story
            </p>
            <h2 className="font-anton text-3xl sm:text-5xl text-ink tracking-tight uppercase leading-[0.95]">
              FROM PASSION PROJECT TO ACCREDITED ACADEMY
            </h2>
            <div className="text-sm sm:text-base text-ink-2 leading-relaxed space-y-4">
              <p>
                Nitish came back from ISPTD Bengaluru and opened the academy in 2010. In 2014 we took IAO accreditation because parents kept asking for a certificate that wasn’t a printout from CorelDRAW.
              </p>
              <p>
                Class is technique first. Recital is once a year. If you miss two weeks, WhatsApp the desk — don’t ghost the batch.
              </p>
            </div>

            {/* Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-line">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider font-bold text-ink mb-1">
                  Training Standard
                </p>
                <p className="text-xs text-ink-3 leading-relaxed">
                  Rigorous foundational drills, injury-free mechanics, and individual coaching attention.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider font-bold text-ink mb-1">
                  Stage Culture
                </p>
                <p className="text-xs text-ink-3 leading-relaxed">
                  Regular stage performances, video projects, and annual recitals to build real stage confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Photo Pair */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative h-80 sm:h-96 rounded-md overflow-hidden border border-line bg-surface">
              <Image
                src="/images/studio-training/training-collage.jpg"
                alt="Studio training session"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-mono uppercase tracking-widest text-bl">Studio Drill</span>
                <span className="font-anton text-lg text-white uppercase">Technique</span>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 rounded-md overflow-hidden border border-line bg-surface mt-6 sm:mt-10">
              <Image
                src="/images/srilanka-tour/raasta-stage-1.jpg"
                alt="Natfest Sri Lanka stage performance"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-mono uppercase tracking-widest text-bl">International Tour</span>
                <span className="font-anton text-lg text-white uppercase">Live Stage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03: Faculty */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-14 border-t border-line max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-2">
              02 · Faculty
            </p>
            <h2 className="font-anton text-3xl sm:text-5xl text-ink uppercase tracking-tight">
              INSTRUCTORS &amp; COACHES
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-ink-3 uppercase tracking-wider">
            12:1 Student-to-Teacher Ratio
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreInstructors.slice(0, 8).map((coach: any) => (
            <div
              key={coach.id}
              className="flex flex-col border border-line rounded-md overflow-hidden bg-canvas hover:border-ink/30 transition-colors group"
            >
              <div className="relative aspect-[3/3.6] w-full overflow-hidden bg-surface">
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
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-anton text-lg text-ink uppercase tracking-tight">
                  {coach.name}
                </h3>
                <p className="text-[11px] font-mono text-bl uppercase tracking-wider">
                  {coach.role?.split('—')[0] || coach.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04: International Stage Tour */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-14 border-t border-line max-w-[1440px] mx-auto">
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-2">
            03 · International Collaboration
          </p>
          <h2 className="font-anton text-3xl sm:text-5xl text-ink uppercase tracking-tight leading-[0.95]">
            NATFEST SRI LANKA
          </h2>
          <p className="text-sm text-ink-2 mt-3 leading-relaxed">
            Representing India at Natfest Contemporary Dance Festival, Rhythmzz performed &ldquo;Raasta – The Inside Light&rdquo; in collaboration with Sri Lanka&apos;s Natanda Dance Company.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { img: '/images/srilanka-tour/srilanka-workshop.jpg', label: 'Colombo Masterclass' },
            { img: '/images/srilanka-tour/raasta-stage-2.jpg', label: 'Raasta Live Performance' },
            { img: '/images/studio-training/studio-batch-portrait.jpg', label: 'Performance Troupe' },
          ].map((item, i) => (
            <div key={i} className="relative h-60 rounded-md overflow-hidden border border-line bg-surface group">
              <Image
                src={item.img}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent p-4 flex items-end">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-medium">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05: Bottom CTA Strip */}
      <section className="px-4 sm:px-8 md:px-14 pb-20 sm:pb-28 max-w-[1440px] mx-auto">
        <div className="border border-line rounded-md p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-anton text-2xl sm:text-3xl text-ink uppercase tracking-tight">
              DANCE WITH US
            </h2>
            <p className="text-sm text-ink-2 mt-1">
              Your first class is free. Visit our studio at Neredmet X Road, Secunderabad.
            </p>
          </div>
          <Link
            href={ROUTES.enrol}
            className="btn-sun py-3.5 px-8 text-sm font-semibold shrink-0 flex items-center gap-1.5"
          >
            Book free trial <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
