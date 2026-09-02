import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProgrammeBySlug } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { CheckCircle2, Clock, Calendar, IndianRupee, MapPin, Award, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { formatTime } from '@/lib/utils/format';
import { SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';
import { KuchipudiCurriculum } from '@/components/public/kuchipudi-curriculum';

export const metadata: Metadata = {
  title: 'Kuchipudi Classical Dance — 10-Year Master Curriculum & 6-Year Certificate | Rhythmzz Academy',
  description:
    'Structured classical Kuchipudi training in Secunderabad: 10-Year Master Curriculum Plan & 6-Year Accelerated Certificate Course. Adavus, Jathis, Hastas, Abhinaya, and Public Examination Certification.',
  alternates: { canonical: `${SITE_URL}/kuchipudi` },
};

export default async function KuchipudiDedicatedPage() {
  const [programme, allBatches] = await Promise.all([
    getProgrammeBySlug('kuchipudi'),
    getBatches(),
  ]);

  const batches = (allBatches ?? []).filter(
    (b: any) => b.programme?.slug === 'kuchipudi' || b.programme_id === programme?.id,
  );

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Kuchipudi Classical Dance Master Curriculum',
    description:
      'Certified 10-Year Master Curriculum and 6-Year Certificate Course in Kuchipudi Classical Dance at Rhythmzz Academy of Dance, Secunderabad.',
    provider: {
      '@type': 'Organization',
      name: 'Rhythmzz Academy of Dance',
      sameAs: SITE_URL,
    },
  };

  return (
    <div className="bg-canvas text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-blk text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <Image
            src="/images/kuchipudi/kuchipudi-natyarambham-posture.jpg"
            alt="Kuchipudi Classical Dance Training"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blk/80 via-blk/90 to-blk z-0" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 bg-bl/20 border border-bl/30 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[2px] uppercase text-bl">
            <Award size={14} /> Certified Classical Dance Programme
          </div>
          <h1 className="heading-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight">
            KUCHIPUDI CLASSICAL
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Traditional Indian Classical Dance training prioritizing developmental pacing, physical safety, and artistic depth — leading to the Certificate Public Examination.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-3 max-w-xs sm:max-w-none mx-auto">
            <Link
              href="/enrol?programme=kuchipudi"
              className="w-full sm:w-auto text-center text-[11px] font-semibold tracking-[2px] uppercase py-4 px-9 bg-bl text-white hover:bg-bl-deep transition-all rounded-control focus-visible:focus-ring active:scale-[0.98] shadow-lg shadow-bl/20"
            >
              Enrol In Kuchipudi
            </Link>
            <a
              href="#curriculum"
              className="w-full sm:w-auto text-center text-[11px] font-semibold tracking-[2px] uppercase py-4 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all rounded-control focus-visible:focus-ring"
            >
              View Master Syllabus ↓
            </a>
          </div>
        </div>
      </section>

      {/* Overview & Visual Tradition Showcase */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <Reveal>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[2px] text-bl">
                  Tradition &amp; Excellence
                </span>
                <h2 className="heading-display text-3xl md:text-4xl">
                  AUTHENTIC KUCHIPUDI IN SECUNDERABAD
                </h2>
                <div className="prose prose-neutral dark:prose-invert text-ink-2 text-sm md:text-base leading-relaxed space-y-4">
                  <p>
                    Kuchipudi at Rhythmzz Academy of Dance is conducted under a rigorous, level-based syllabus taught by <strong>Srusti</strong> on Fridays and Saturdays (6:30 – 7:30 PM). Our pedagogy balances deep classical knowledge with anatomical safety, rhythm drills, and authentic stage presentation.
                  </p>
                  <p>
                    Whether your child is starting at age 5 in the <strong>10-Year Master Foundation</strong> or you are pursuing the <strong>6-Year Accelerated Certificate Course</strong>, students learn the master choreographies of <em>Dr. Vempati Chinna Satyam</em>, Yakshagana traditions, Navarasas, and Tala systems.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Visual Mudra & Abhinaya Showcase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative h-64 rounded-card overflow-hidden border border-line group bg-blk">
                <Image
                  src="/images/kuchipudi/kuchipudi-abhinaya-mudra.jpg"
                  alt="Kuchipudi Abhinaya & Mudra"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-blk/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-bl-light">Pedagogy</span>
                  <h3 className="heading-display text-xl text-white">ABHINAYA &amp; BHAAVAM</h3>
                  <p className="text-xs text-white/70">Expressive facial nuances &amp; Shikhara Mudras</p>
                </div>
              </div>

              <div className="relative h-64 rounded-card overflow-hidden border border-line group bg-blk">
                <Image
                  src="/images/kuchipudi/kuchipudi-anjali-hasta.jpg"
                  alt="Anjali Mudra Invocation"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-blk/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-bl-light">Repertoire</span>
                  <h3 className="heading-display text-xl text-white">HASTAS &amp; SHLOKAS</h3>
                  <p className="text-xs text-white/70">Samyutha &amp; Asamyutha Hasta Mastery</p>
                </div>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface border border-line p-5 rounded-tile">
                <ShieldCheck className="text-bl mb-2" size={24} />
                <h3 className="font-bold text-sm text-ink mb-1">Public Examination</h3>
                <p className="text-xs text-ink-2">Structured preparation for recognized Certificate Exams.</p>
              </div>
              <div className="bg-surface border border-line p-5 rounded-tile">
                <BookOpen className="text-bl mb-2" size={24} />
                <h3 className="font-bold text-sm text-ink mb-1">Theory &amp; Shlokas</h3>
                <p className="text-xs text-ink-2">Comprehensive study of Hastas, Bhedas, and treatises.</p>
              </div>
              <div className="bg-surface border border-line p-5 rounded-tile">
                <Sparkles className="text-bl mb-2" size={24} />
                <h3 className="font-bold text-sm text-ink mb-1">Stage Repertoire</h3>
                <p className="text-xs text-ink-2">Tarangam, Shabdam, Keerthanas, and solo presentations.</p>
              </div>
            </div>
          </div>

          {/* Quick Schedule & Fees Sidebar */}
          <div className="space-y-6">
            <div className="bg-surface border border-line-strong rounded-card p-6 md:p-8 shadow-sm">
              <h3 className="heading-display text-2xl mb-4 border-b border-line pb-3">BATCH DETAILS</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-ink">
                  <Calendar size={18} className="text-bl shrink-0" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-ink-2">Days</div>
                    <div className="font-semibold">Friday &amp; Saturday</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-ink">
                  <Clock size={18} className="text-bl shrink-0" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-ink-2">Timing</div>
                    <div className="font-semibold">6:30 PM – 7:30 PM</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-ink">
                  <MapPin size={18} className="text-bl shrink-0" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-ink-2">Location</div>
                    <div className="font-semibold">Neredmet X Road, Secunderabad</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-ink-2">Monthly Fee</span>
                  <span className="font-bold text-lg text-ink flex items-center">
                    <IndianRupee size={16} /> 2,000
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-ink-2">Quarterly Fee</span>
                  <span className="font-bold text-lg text-bl flex items-center">
                    <IndianRupee size={16} /> 5,000
                  </span>
                </div>

                <Link
                  href="/enrol?programme=kuchipudi"
                  className="block text-center text-[11px] font-semibold tracking-[2px] uppercase py-3.5 bg-bl text-white hover:bg-bl-deep transition-all w-full rounded-control focus-visible:focus-ring mt-4"
                >
                  Book Free Trial Class
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Curriculum Component */}
      <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <KuchipudiCurriculum />
      </section>

      {/* Classical Photography Gallery Showcase */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[2px] text-bl">Classical Gallery</span>
          <h2 className="heading-display text-3xl md:text-4xl mt-1">DISCIPLINE &amp; AHARYA REGALIA</h2>
          <p className="text-xs md:text-sm text-ink-2 mt-2">
            Traditional Kuchipudi Aharya regalia, brass plate Tarangam balance, and classical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1: Aharya Abhinaya */}
          <div className="relative h-80 rounded-card overflow-hidden border border-line group bg-blk">
            <Image
              src="/images/kuchipudi/kuchipudi-traditional-standing.jpg"
              alt="Kuchipudi Aharya Abhinaya standing posture"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blk/95 via-blk/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-[9px] font-extrabold uppercase tracking-[2px] text-bl-light mb-1">
                Aharya Abhinaya
              </span>
              <h4 className="heading-display text-lg text-white leading-tight">
                TRADITIONAL ATTIRE &amp; REGALIA
              </h4>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                Pleated silk fan, Vaddanam belt, temple jewellery &amp; Alta
              </p>
            </div>
          </div>

          {/* Card 2: Natyarambham & Aramandi */}
          <div className="relative h-80 rounded-card overflow-hidden border border-line group bg-blk">
            <Image
              src="/images/kuchipudi/kuchipudi-aramandi-dynamic.jpg"
              alt="Kuchipudi Aramandi stance and Ghungroos"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blk/95 via-blk/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-[9px] font-extrabold uppercase tracking-[2px] text-bl-light mb-1">
                Natyarambham Stance
              </span>
              <h4 className="heading-display text-lg text-white leading-tight">
                ARAMANDI &amp; GHUNGROO FOOTWORK
              </h4>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                Half-seated mandala with ankle bells and Pataka mudra
              </p>
            </div>
          </div>

          {/* Card 3: Alapadma Hasta & Drishti */}
          <div className="relative h-80 rounded-card overflow-hidden border border-line group bg-blk">
            <Image
              src="/images/kuchipudi/kuchipudi-alapadma-hasta.jpg"
              alt="Alapadma Hasta and Drishti Bhedam"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blk/95 via-blk/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-[9px] font-extrabold uppercase tracking-[2px] text-bl-light mb-1">
                Asamyutha Hasta
              </span>
              <h4 className="heading-display text-lg text-white leading-tight">
                ALAPADMA HASTA &amp; DRISHTI
              </h4>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                Blooming lotus hand mudra with expressive upward gaze
              </p>
            </div>
          </div>

          {/* Card 4: Sthanaka & Tala Alignment */}
          <div className="relative h-80 rounded-card overflow-hidden border border-line group bg-blk">
            <Image
              src="/images/kuchipudi/kuchipudi-classical-pose-2.jpg"
              alt="Kuchipudi Sthanaka and Tala posture"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blk/95 via-blk/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-[9px] font-extrabold uppercase tracking-[2px] text-bl-light mb-1">
                Sthanaka Geometry
              </span>
              <h4 className="heading-display text-lg text-white leading-tight">
                TALA &amp; JATHI SYNCHRONIZATION
              </h4>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                Sculptural classical balance in rhythmic Jathi timing
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
