import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProgrammeBySlug } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  ShieldCheck,
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Heart,
  Flame,
  Music,
  ArrowRight,
} from 'lucide-react';
import { SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';
import { KuchipudiCurriculum } from '@/components/public/kuchipudi-curriculum';
import {
  KuchipudiRoadmap,
  KuchipudiRepertoireFlow,
  KuchipudiClassFlow,
  KuchipudiFaqAccordion,
} from '@/components/public/kuchipudi-interactive';

export const metadata: Metadata = {
  title: 'Kuchipudi Dance Classes for Kids & Adults in Secunderabad | Rhythmzz Academy',
  description:
    'Structured Kuchipudi training from age 5 to sacred Rangapravesham solo debuts. 10-Year Master Curriculum, 6-Year Certificate Track, expert guidance by Guru Srusti, and batches open at Neredmet X Road, Secunderabad.',
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
    name: 'Kuchipudi Classical Dance Master Curriculum & Certificate Programme',
    description:
      'Structured Kuchipudi classical training from age 5 to Rangapravesham solo debut at Rhythmzz Academy of Dance, Secunderabad.',
    provider: {
      '@type': 'Organization',
      name: 'Rhythmzz Academy of Dance',
      sameAs: SITE_URL,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'In-person',
      location: 'Neredmet X Road, Secunderabad',
      schedule: 'Friday & Saturday 6:30 PM – 7:30 PM',
    },
  };

  return (
    <div className="bg-canvas text-ink selection:bg-[#FB923C]/20 selection:text-[#FB923C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* 1. HERO SECTION WITH FLUID TYPOGRAPHY & TACTILE CTAS */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 text-center border-b border-line bg-canvas">
        {/* Subtle Ambient Radial Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-[#FB923C]/5 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-line bg-surface/80 backdrop-blur-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              STRUCTURED CLASSICAL TRAINING · AGE 5 TO RANGAPRAVESHAM
            </span>
          </div>

          <h1 className="heading-urban text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight">
            KUCHIPUDI CLASSICAL DANCE
          </h1>

          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
            Traditional Indian Classical Dance training prioritizing developmental pacing, physical safety, and artistic depth — leading to recognized Certificate Public Examinations and sacred Rangapravesham solo debuts under the lineage of Dr. Vempati Chinna Satyam.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-xs sm:max-w-none mx-auto">
            <Link
              href="/enrol?programme=kuchipudi"
              className="btn-peach px-8 py-3.5 text-xs font-black tracking-[0.18em] shadow-lg shadow-[#FB923C]/10 w-full sm:w-auto active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas transition-all"
            >
              Book a Free Trial Class ──→
            </Link>
            <a
              href="#curriculum"
              className="px-7 py-3.5 rounded-full text-center text-xs font-mono font-bold tracking-[0.15em] uppercase bg-surface hover:bg-canvas text-ink border border-line hover:border-[#FB923C]/50 transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] w-full sm:w-auto shadow-sm"
            >
              Explore Master Syllabus ↓
            </a>
            <a
              href="#guru"
              className="px-6 py-3.5 rounded-full text-center text-xs font-mono font-bold tracking-[0.15em] uppercase bg-surface hover:bg-canvas text-ink border border-line hover:border-[#FB923C]/50 transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] w-full sm:w-auto shadow-sm"
            >
              Meet Your Guru
            </a>
          </div>

          {/* Quick Trust / Feature Pills with Concentric Radii */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono text-ink-2">
            <span className="px-3.5 py-1.5 rounded-full bg-surface border border-line shadow-2xs">
              ✓ 10-Year Master Foundation
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-surface border border-line shadow-2xs">
              ✓ 6-Year Certificate Track
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-surface border border-line shadow-2xs">
              ✓ Public Board Exam Accreditation
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-surface border border-line shadow-2xs">
              ✓ Live Orchestra Rangapravesham
            </span>
          </div>
        </div>
      </section>

      {/* 2. TRADITION OVERVIEW & BENTO HIGHLIGHTS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Reveal>
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
                  Tradition &amp; Pedagogy
                </span>
                <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
                  AUTHENTIC KUCHIPUDI IN SECUNDERABAD
                </h2>
                <div className="text-ink-2 text-sm sm:text-base leading-relaxed space-y-4 max-w-prose">
                  <p>
                    Kuchipudi at Rhythmzz Academy of Dance is conducted under a rigorous, level-based syllabus mentored by <strong>Guru Srusti</strong> on Fridays and Saturdays (6:30 – 7:30 PM) at our Neredmet X Road studio. Our pedagogy balances deep classical knowledge with anatomical safety, rhythm drills, and authentic stage presentation.
                  </p>
                  <p>
                    Rooted in the Yakshagana theatrical traditions of Andhra Pradesh and formalized through the master choreographies of <em>Dr. Vempati Chinna Satyam</em>, students master pure rhythmic footwork (Nritta), expressive facial storytelling (Abhinaya), complex Tala systems, and the breathtaking hallmark Tarangam dance on the rim of a brass plate.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Visual Mudra & Abhinaya Showcase Cards with Concentric Radii */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative h-64 bento-card overflow-hidden p-0 group">
                <Image
                  src="/images/kuchipudi/kuchipudi-abhinaya-mudra.jpg"
                  alt="Kuchipudi Abhinaya & Mudra"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-[#FB923C]">Pedagogy</span>
                  <h3 className="heading-urban text-xl text-ink">ABHINAYA &amp; BHAAVAM</h3>
                  <p className="text-xs text-ink-2">Expressive facial nuances, Navarasas &amp; Shikhara Mudras</p>
                </div>
              </div>

              <div className="relative h-64 bento-card overflow-hidden p-0 group">
                <Image
                  src="/images/kuchipudi/kuchipudi-anjali-hasta.jpg"
                  alt="Anjali Mudra Invocation"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-[#FB923C]">Repertoire</span>
                  <h3 className="heading-urban text-xl text-ink">HASTAS &amp; SHLOKAS</h3>
                  <p className="text-xs text-ink-2">Samyutha &amp; Asamyutha Hasta Mastery &amp; Shlokas</p>
                </div>
              </div>
            </div>

            {/* Feature Badges with Concentric Radii */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bento-card p-5 hover:border-[#FB923C]/40 transition-colors">
                <ShieldCheck className="text-[#FB923C] mb-2" size={24} />
                <h3 className="font-bold text-sm text-ink mb-1">Public Examination</h3>
                <p className="text-xs text-ink-2 leading-relaxed">Structured preparation for recognized Certificate &amp; Diploma board exams.</p>
              </div>
              <div className="bento-card p-5 hover:border-[#FB923C]/40 transition-colors">
                <BookOpen className="text-[#FB923C] mb-2" size={24} />
                <h3 className="font-bold text-sm text-ink mb-1">Theory &amp; Treatises</h3>
                <p className="text-xs text-ink-2 leading-relaxed">Study of Natyashastra, Abhinaya Darpana, Bhedas, and Tala systems.</p>
              </div>
              <div className="bento-card p-5 hover:border-[#FB923C]/40 transition-colors">
                <Flame className="text-[#FB923C] mb-2" size={24} />
                <h3 className="font-bold text-sm text-ink mb-1">Tarangam Plate Balance</h3>
                <p className="text-xs text-ink-2 leading-relaxed">Dancing complex Jathis upon the rim of a brass plate with live Mridangam.</p>
              </div>
            </div>
          </div>

          {/* Quick Schedule & Fees Sidebar */}
          <div className="space-y-6">
            <div className="bento-card p-6 md:p-8 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FB923C] block mb-1">
                Admissions Open
              </span>
              <h3 className="heading-urban text-2xl mb-4 border-b border-line pb-3 text-ink">
                BATCH &amp; FEE DETAILS
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-ink">
                  <Calendar size={18} className="text-[#FB923C] shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ink-3">Weekly Schedule</div>
                    <div className="font-semibold text-ink">Friday &amp; Saturday</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-ink">
                  <Clock size={18} className="text-[#FB923C] shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ink-3">Timing</div>
                    <div className="font-semibold text-ink">6:30 PM – 7:30 PM (Evening)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-ink">
                  <MapPin size={18} className="text-[#FB923C] shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ink-3">Studio Location</div>
                    <div className="font-semibold text-ink">Neredmet X Road, Secunderabad</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-2">Monthly Fee</span>
                  <span className="heading-urban text-xl text-ink flex items-center">
                    <IndianRupee size={16} /> 2,000
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-ink-2 block">Quarterly Fee</span>
                    <span className="text-[11px] text-[#FB923C] font-mono">Save ₹1,000 every 3 months</span>
                  </div>
                  <span className="heading-urban text-xl text-[#FB923C] flex items-center">
                    <IndianRupee size={16} /> 5,000
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-line/60 pt-3">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-ink-2 block">Annual Option</span>
                    <span className="text-[11px] text-ink-3 font-mono">12 Months Dedicated Training</span>
                  </div>
                  <span className="heading-urban text-xl text-ink flex items-center">
                    <IndianRupee size={16} /> 18,000
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-canvas border border-line text-[11px] text-ink-2 space-y-1">
                  <div className="font-semibold text-ink">One-Time Registration: ₹1,500</div>
                  <div>Includes practice uniform guidelines, ghungroo sizing, syllabus handbook &amp; assessment record.</div>
                </div>

                <Link
                  href="/enrol?programme=kuchipudi"
                  className="btn-peach block text-center text-xs tracking-[0.18em] py-3.5 w-full mt-4 shadow-sm active:scale-[0.96]"
                >
                  Book Free Trial Class ──→
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO CAN JOIN (4 LEARNER PATHWAYS) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
            Tailored Pathways
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            WHO CAN JOIN THE KUCHIPUDI PARAMPARA
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-ink-2 leading-relaxed">
            Classical dance at Rhythmzz is structured with distinct pedagogical tracks tailored to developmental stages and prior experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FB923C] block mb-2">
                Ages 5–8 Years
              </span>
              <h3 className="heading-urban text-xl text-ink mb-2">
                YOUNG BEGINNERS
              </h3>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                Carefully paced for young bodies. Focuses on motor coordination, basic rhythm (Laya), Aramandi posture alignment, foundational Adugulu, and storytelling through Hastas without anatomical strain.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line text-[11px] font-mono text-ink-3">
              10-Year Master Foundation
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FB923C] block mb-2">
                Ages 9–14 Years
              </span>
              <h3 className="heading-urban text-xl text-ink mb-2">
                SCHOOL STUDENTS
              </h3>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                Rapid technical assimilation. Combines complex Sapta Tala Jathis, Samyutha &amp; Asamyutha Hastas, Navarasas, and full choreographic items alongside structured board examination preparation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line text-[11px] font-mono text-ink-3">
              6-Year Accelerated Track
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FB923C] block mb-2">
                Ages 15+ &amp; Adults
              </span>
              <h3 className="heading-urban text-xl text-ink mb-2">
                COLLEGE &amp; ADULTS
              </h3>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                No prior dance background required. Dedicated adult-friendly pacing balancing classical rigor with core stamina, joint flexibility, stress relief, and deep artistic fulfillment.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line text-[11px] font-mono text-ink-3">
              Adult Classical Cohort
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FB923C] block mb-2">
                Prior Dancers
              </span>
              <h3 className="heading-urban text-xl text-ink mb-2">
                TRANSFER &amp; RE-ENTRY
              </h3>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                For dancers who previously trained and took a hiatus. Prior learning is respected; students are evaluated via a diagnostic skill check and seamlessly placed into their appropriate syllabus tier.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line text-[11px] font-mono text-ink-3">
              Skill-Based Placement
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROADMAP TO RANGAPRAVESHAM */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
            The Classical Journey
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            ROADMAP TO RANGAPRAVESHAM
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-ink-2 leading-relaxed">
            From the first Aramandi stamp to the final bow accompanied by a full live Carnatic orchestra — explore the 5 progressive milestones of Kuchipudi mastery.
          </p>
        </div>

        <KuchipudiRoadmap />
      </section>

      {/* 5. INTERACTIVE MASTER CURRICULUM */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <KuchipudiCurriculum />
      </section>

      {/* 6. FOUR CLASSICAL PILLARS OF KUCHIPUDI */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
            Natyashastra Foundations
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            THE FOUR PILLARS OF KUCHIPUDI
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-ink-2 leading-relaxed">
            Classical Kuchipudi is a composite theatrical art form uniting rhythmic geometry, poetic sentiment, dramatic tradition, and ornate visual regalia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-3xl font-black heading-urban text-[#FB923C] block mb-1">
                NRITTA
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3 block mb-3">
                Pure Rhythmic Footwork
              </span>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                Sculptural physical lines, rapid footwork (Adugulu), and geometric arm movements executed strictly to metric syllables (Sollukattus) without narrative mime or emotional interpretation.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-line text-[11px] text-ink-3 font-mono">
              Vilamba · Madhyama · Dhruta Laya
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-3xl font-black heading-urban text-[#FB923C] block mb-1">
                NRITYA
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3 block mb-3">
                Expressive Abhinaya
              </span>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                The manifestation of sentiment (Rasa) and emotion (Bhava) through Chaturvidha Abhinaya: Angika (body), Vachika (song/lyrics), Aharya (costume), and Satvika (authentic inner emotion).
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-line text-[11px] text-ink-3 font-mono">
              Navarasas &amp; Sanchari Bhavas
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-3xl font-black heading-urban text-[#FB923C] block mb-1">
                NATYA
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3 block mb-3">
                Classical Dance-Drama
              </span>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                The theatrical storytelling heritage rooted in historic Yakshagana village theatre, male actor-dancers (Bhagavatulu), and landmark classical dance-dramas such as Bhama Kalapam and Prahlada Charitam.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-line text-[11px] text-ink-3 font-mono">
              Yakshagana &amp; Drama Heritage
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between hover:border-[#FB923C]/50 hover:-translate-y-1 transition-all duration-300">
            <div>
              <span className="text-3xl font-black heading-urban text-[#FB923C] block mb-1">
                AHARYA
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3 block mb-3">
                Attire &amp; Temple Regalia
              </span>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                The visual spectacle: dazzling pleated silk dance saree, gold-embossed Vaddanam waist belt, temple jewellery (Surya/Chandra), ankle bells (Ghungroos), fresh jasmine veni, and red Alta dye.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-line text-[11px] text-ink-3 font-mono">
              Sacred Adornment &amp; Alta
            </div>
          </div>
        </div>
      </section>

      {/* 7. PERFORMANCE REPERTOIRE FLOW (MARGAM SUITE) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
            Classical Margam
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            THE PERFORMANCE REPERTOIRE SUITE
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-ink-2 leading-relaxed">
            The traditional sequence of a full Kuchipudi concert presentation, balancing sacred invocation, energetic footwork, lyrical devotion, and the iconic Tarangam brass plate balance.
          </p>
        </div>

        <KuchipudiRepertoireFlow />
      </section>

      {/* 8. THEORY, SHLOKAS & TREATISES */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
              Sanskrit Pedagogy
            </span>
            <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
              THEORY, SHLOKAS &amp; SCRIPTURAL TREATISES
            </h2>
            <div className="text-ink-2 text-xs sm:text-sm leading-relaxed space-y-4 max-w-prose">
              <p>
                A true classical dancer is both an athlete and a scholar. At Rhythmzz, students do not merely memorize steps; they master the underlying Sanskrit treatises, metric Tala mathematics, and aesthetic treatises.
              </p>
              <p>
                Training references the fundamental tenets of the <em>Natyashastra</em> composed by sage Bharata Muni and the <em>Abhinaya Darpana</em> of Nandikeshvara, ensuring students understand the etymology, anatomical direction, and spiritual significance of every movement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-[#FB923C]/30 space-y-2 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FB923C] block">
                The Natyarambham Shlokam
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-ink leading-relaxed">
                &ldquo;Yato Hastas Tato Drishtir, Yato Drishtis Tato Manah,<br />
                Yato Manas Tato Bhavo, Yato Bhavas Tato Rasah.&rdquo;
              </p>
              <p className="text-[11px] text-ink-3">
                &ldquo;Where the hand moves, the gaze follows; where the gaze goes, the mind follows; where the mind goes, emotion arises; and where emotion arises, true aesthetic sentiment is born.&rdquo;
              </p>
            </div>
          </div>

          {/* Theory Topics Tag Cloud Bento with Concentric Radii */}
          <div className="bento-card p-6 md:p-8 space-y-6">
            <h3 className="heading-urban text-xl text-ink border-b border-line pb-3">
              THEORETICAL DOMAINS MASTERED
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {[
                'Natyarambham Shlokam',
                '28 Asamyutha Hastas (Single Hand)',
                '24 Samyutha Hastas (Combined Hand)',
                '8 Siro Bhedas (Head Movements)',
                '4 Griva Bhedas (Neck Movements)',
                '8 Drishti Bhedas (Eye Glances)',
                'Pada Bhedas (Foot Positions)',
                'Navarasas (Nine Emotions)',
                'Chaturvidha Abhinaya',
                'Sapta Tala System (7 Metric Cycles)',
                '5 Jathi Rhythms (Tisra, Chaturasra, Khanda, Misra, Sankeerna)',
                'Dr. Vempati Chinna Satyam Lineage',
                'Siddhendra Yogi & Narayana Teertha',
                'Yakshagana & Bhagavatula Mela',
                'Bhama Kalapam & Satyabhama Lore',
                'Lokadharmi vs. Natyadharmi',
                'Saint Thyagaraja & Annamacharya Keerthanas',
                'Tarangam Brass Plate Balance Principles',
              ].map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-canvas border border-line text-ink-2 hover:text-ink hover:border-[#FB923C] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-line text-xs text-ink-3 flex items-center justify-between">
              <span>Comprehensive written &amp; oral viva exams conducted annually.</span>
              <span className="text-[#FB923C] font-mono font-bold">100% Pass Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. RANGAPRAVESHAM FEATURE SECTION WITH ELEVATED BENTO DEPTH */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="bento-card p-8 sm:p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-surface via-surface to-surface/90 border-[#FB923C]/40 shadow-xl">
          <div className="max-w-3xl space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
              The Solo Pinnacle
            </span>
            <h2 className="heading-urban text-3xl sm:text-5xl md:text-6xl text-ink leading-tight">
              RANGAPRAVESHAM: ASCENDING THE SACRED STAGE
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-ink-2 leading-relaxed max-w-prose">
              The word <em>Rangapravesham</em> literally translates to &ldquo;entering the stage&rdquo; — the sacred solo debut that marks the transformation of an earnest disciple into an autonomous classical artiste. It is the culmination of years of rigorous physical conditioning, rhythmic enunciation, and emotional abhinaya maturity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-canvas border border-line space-y-2 hover:border-[#FB923C]/40 transition-colors">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FB923C] block">
                  Live Carnatic Orchestra
                </span>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Performed exclusively with a live ensemble: Guru Srusti (Nattuvangam &amp; rhythm direction), Mridangist, Classical Carnatic Vocalist, Violinist, and Flautist.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-canvas border border-line space-y-2 hover:border-[#FB923C]/40 transition-colors">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FB923C] block">
                  Full Margam Repertoire
                </span>
                <p className="text-xs text-ink-2 leading-relaxed">
                  The dancer presents a complete 2.5-hour solo classical Margam: Invocation, Jatiswaram, Shabdam, complex Keerthana, Tarangam plate balance, and Thillana.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-canvas border border-line space-y-2 hover:border-[#FB923C]/40 transition-colors">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FB923C] block">
                  Distinguished Evaluation
                </span>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Conducted before an invited auditorium of classical connoisseurs, senior dance critics, family, and esteemed guest examiners.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-canvas border border-line space-y-2 hover:border-[#FB923C]/40 transition-colors">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FB923C] block">
                  Lifelong Credential
                </span>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Bestows formal certification, traditional blessings, and eligibility for national cultural scholarships, university diplomas, and international concert stages.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/enrol?programme=kuchipudi"
                className="btn-peach px-8 py-3.5 text-xs font-black tracking-[0.18em] shadow-md w-full sm:w-auto text-center active:scale-[0.96]"
              >
                Begin Your Path to Rangapravesham ──→
              </Link>
              <span className="text-xs text-ink-3 font-mono">
                Guidance from Year 1 to Stage Debut.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. GURU PROFILE (SRUSTI) */}
      <section id="guru" className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line scroll-mt-24">
        <div className="bento-card p-6 sm:p-10 md:p-12 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-line">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#FB923C] block mb-1">
                Faculty Leadership
              </span>
              <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
                GURU SRUSTI
              </h2>
              <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-ink-3 mt-1">
                Senior Kuchipudi Exponent &amp; Head of Classical Pedagogy
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-canvas border border-line text-xs font-mono text-ink shadow-2xs">
                ✓ Dr. Vempati Chinna Satyam Parampara
              </span>
            </div>
          </div>

          {/* Guru Statistics Strip with Concentric Radii */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            <div className="p-5 rounded-2xl bg-canvas border border-line text-center hover:border-[#FB923C]/40 transition-colors">
              <div className="heading-urban text-3xl sm:text-4xl text-[#FB923C]">12+</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mt-1">
                Years Teaching
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-canvas border border-line text-center hover:border-[#FB923C]/40 transition-colors">
              <div className="heading-urban text-3xl sm:text-4xl text-ink">100+</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mt-1">
                Disciples Mentored
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-canvas border border-line text-center hover:border-[#FB923C]/40 transition-colors">
              <div className="heading-urban text-3xl sm:text-4xl text-[#FB923C]">10-Yr</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mt-1">
                Structured Syllabus
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-canvas border border-line text-center hover:border-[#FB923C]/40 transition-colors">
              <div className="heading-urban text-3xl sm:text-4xl text-ink">100%</div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mt-1">
                Board Exam Pass
              </div>
            </div>
          </div>

          {/* Editorial Commentary Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-ink-2 leading-relaxed pt-2">
            <div className="space-y-4">
              <p>
                Guru Srusti represents the quintessential blend of uncompromising classical rigor and compassionate, modern pedagogy. Having trained extensively in the revered lineage of Padma Bhushan Dr. Vempati Chinna Satyam, she brings an authentic aesthetic purity to every session.
              </p>
              <p>
                Her instruction emphasizes anatomical safety, correct spine and knee alignment in Aramandi, and rhythmic accuracy. Srusti ensures that young dancers develop strong joint stability, avoiding the fatigue or improper postural habits that frequently occur in casual dance training.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Under her dedicated mentorship, students at Rhythmzz Academy of Dance have successfully cleared government certificate examinations, won prestigious interstate classical competitions, and performed at prominent cultural festivals across Hyderabad and Secunderabad.
              </p>
              <p>
                Whether nurturing a shy 5-year-old taking their very first steps in Natyarambham or refining the nuanced Sanchari Bhavas of an advanced Tarangam soloist, Srusti provides personalized, eye-level corrections that bring out the true artistic spirit of every dancer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CLASS FLOW & WEEKLY RHYTHM */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
            The Studio Experience
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            ANATOMY OF A 60-MINUTE KUCHIPUDI CLASS
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-ink-2 leading-relaxed">
            Every session at Rhythmzz follows a time-tested sequence engineered for physical conditioning, rhythm mastery, and expressive fulfillment.
          </p>
        </div>

        <KuchipudiClassFlow />
      </section>

      {/* 12. CLASSICAL PHOTOGRAPHY GALLERY SHOWCASE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
            Visual Heritage
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            DISCIPLINE &amp; AHARYA REGALIA
          </h2>
          <p className="text-xs sm:text-sm text-ink-2">
            Traditional Kuchipudi Aharya regalia, brass plate Tarangam balance, and sculptural classical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1: Aharya Abhinaya */}
          <div className="relative h-80 bento-card overflow-hidden p-0 group">
            <Image
              src="/images/kuchipudi/kuchipudi-traditional-standing.jpg"
              alt="Kuchipudi Aharya Abhinaya standing posture"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[2px] text-[#FB923C] mb-1">
                Aharya Abhinaya
              </span>
              <h4 className="heading-urban text-lg text-ink leading-tight">
                TRADITIONAL ATTIRE &amp; REGALIA
              </h4>
              <p className="text-[11px] text-ink-2 mt-1 leading-snug">
                Pleated silk fan, Vaddanam belt, temple jewellery &amp; Alta
              </p>
            </div>
          </div>

          {/* Card 2: Natyarambham & Aramandi */}
          <div className="relative h-80 bento-card overflow-hidden p-0 group">
            <Image
              src="/images/kuchipudi/kuchipudi-aramandi-dynamic.jpg"
              alt="Kuchipudi Aramandi stance and Ghungroos"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[2px] text-[#FB923C] mb-1">
                Natyarambham Stance
              </span>
              <h4 className="heading-urban text-lg text-ink leading-tight">
                ARAMANDI &amp; GHUNGROO FOOTWORK
              </h4>
              <p className="text-[11px] text-ink-2 mt-1 leading-snug">
                Half-seated mandala with ankle bells and Pataka mudra
              </p>
            </div>
          </div>

          {/* Card 3: Alapadma Hasta & Drishti */}
          <div className="relative h-80 bento-card overflow-hidden p-0 group">
            <Image
              src="/images/kuchipudi/kuchipudi-alapadma-hasta.jpg"
              alt="Alapadma Hasta and Drishti Bhedam"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[2px] text-[#FB923C] mb-1">
                Asamyutha Hasta
              </span>
              <h4 className="heading-urban text-lg text-ink leading-tight">
                ALAPADMA HASTA &amp; DRISHTI
              </h4>
              <p className="text-[11px] text-ink-2 mt-1 leading-snug">
                Blooming lotus hand mudra with expressive upward gaze
              </p>
            </div>
          </div>

          {/* Card 4: Sthanaka & Tala Alignment */}
          <div className="relative h-80 bento-card overflow-hidden p-0 group">
            <Image
              src="/images/kuchipudi/kuchipudi-classical-pose-2.jpg"
              alt="Kuchipudi Sthanaka and Tala posture"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[2px] text-[#FB923C] mb-1">
                Sthanaka Geometry
              </span>
              <h4 className="heading-urban text-lg text-ink leading-tight">
                TALA &amp; JATHI SYNCHRONIZATION
              </h4>
              <p className="text-[11px] text-ink-2 mt-1 leading-snug">
                Sculptural classical balance in rhythmic Jathi timing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. COMPREHENSIVE FAQ ACCORDION */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 max-w-4xl mx-auto border-t border-line scroll-mt-24">
        <div className="text-center mb-12 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block">
            Frequently Asked Questions
          </span>
          <h2 className="heading-urban text-3xl sm:text-4xl md:text-5xl text-ink">
            EVERYTHING YOU NEED TO KNOW
          </h2>
          <p className="text-xs sm:text-sm text-ink-2">
            Detailed answers regarding age, certifications, attire, trial classes, and Rangapravesham debuts.
          </p>
        </div>

        <KuchipudiFaqAccordion />
      </section>

      {/* 14. FINAL CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 md:px-16 bg-gradient-to-r from-[#FB923C] via-[#F97316] to-[#EA580C] text-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-mono font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full bg-black/15 inline-flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-black inline-block mr-2" />
            ADMISSIONS NOW OPEN · LIMITED BATCH CAPACITY
          </span>

          <h2 className="heading-urban text-4xl sm:text-6xl md:text-7xl leading-tight">
            BEGIN YOUR CLASSICAL KUCHIPUDI JOURNEY
          </h2>

          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium text-black/85 leading-relaxed">
            Reserve your child&rsquo;s complimentary trial class or join our dedicated adult cohort. Experience the transformative grace, discipline, and cultural depth of classical Indian dance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/enrol?programme=kuchipudi"
              className="px-9 py-4 rounded-full bg-black text-white hover:bg-neutral-900 text-xs font-mono font-black tracking-[0.2em] uppercase transition-all duration-200 shadow-xl w-full sm:w-auto active:scale-[0.96]"
            >
              Enrol Online Now ──→
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-white/20 hover:bg-white/30 text-black border border-black/30 text-xs font-mono font-black tracking-[0.2em] uppercase transition-all duration-200 w-full sm:w-auto active:scale-[0.96]"
            >
              Visit Our Studio
            </Link>
          </div>

          <div className="pt-8 border-t border-black/20 flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-bold text-black/80">
            <span>📍 Neredmet X Road, Secunderabad</span>
            <span>📅 Friday &amp; Saturday 6:30 PM – 7:30 PM</span>
            <span>📞 Direct Guidance by Guru Srusti</span>
          </div>
        </div>
      </section>
    </div>
  );
}
