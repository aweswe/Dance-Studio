import { Metadata } from 'next';
import Image from 'next/image';
import { getInstructors } from '@/data/instructors';
import { InstructorCard } from '@/components/public/instructor-card';
import { SITE_URL } from '@/lib/utils/constants';
import { Award, Target, Heart, Globe, Building2, ShieldCheck, Users, Sparkles, Mic, Briefcase, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Entrance } from '@/components/motion/entrance';
import { STUDIO_INFO } from '@/data/studio-info';

export const metadata: Metadata = {
  title: 'About Us | Rhythmzz Academy of Dance',
  description:
    'Founded in 2010 by Nitish Kumar, Rhythmzz Academy of Dance is an IAO-accredited dance institute in Secunderabad providing professional training across Classical, Contemporary, Commercial, and Fitness styles.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const STATS = [
  { value: "2010", label: "Founded by Nitish Kumar" },
  { value: "IAO USA", label: "Full Accreditation (2014)" },
  { value: "1,000+", label: "Dancers Trained" },
  { value: "15+", label: "Years Dance Heritage" },
];

export default async function AboutPage() {
  const instructors = await getInstructors();

  return (
    <div className="bg-canvas text-ink">
      {/* Hero */}
      <section className="bg-blk text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <Image
            src="/images/studio-training/training-collage.jpg"
            alt="Rhythmzz Academy History & Training"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blk/80 via-blk/90 to-blk z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-[10px] tracking-[2px] sm:tracking-[5px] uppercase text-bl-light mb-3 font-bold">
            ESTABLISHED 2010 · REGISTERED 2013
          </div>
          <h1 className="heading-display text-3xl sm:text-5xl md:text-7xl mb-6 leading-tight">
            FEEL THE BEAT &amp; VIBE ALONG WITH US
          </h1>
          <Entrance delay={0.1}>
            <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Rhythmzz is a team of passionate dancers who believe that dance is the best way to express oneself. An exceptional educational dance institute with accredited certifications.
            </p>
          </Entrance>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-bl text-blk py-8 sm:py-12 px-4 sm:px-6 md:px-16 border-y border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center p-2">
              <span className="heading-display text-2xl sm:text-3xl md:text-4xl mb-1 font-bold">{stat.value}</span>
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[1.5px] uppercase opacity-75">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* The Story & Heritage */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal>
            <div>
              <div className="text-[11px] font-bold tracking-[2px] uppercase text-bl mb-2">
                Our Genesis &amp; Heritage
              </div>
              <h2 className="heading-display text-2xl sm:text-3xl md:text-5xl mb-6 leading-tight">ABOUT RHYTHMZZ ACADEMY</h2>
              <div className="space-y-4 text-ink-2 leading-relaxed text-sm md:text-base">
                <p>
                  <strong>Rhythmzz Academy of Dance</strong> was founded by <strong>Nitish Kumar in the year 2010</strong> along with Sujaritha, Purnima, and Late Emmanuel as a passion project, which went on to become a registered dance company by 2013.
                </p>
                <p>
                  The first dedicated studio opened on <strong>15th April 2013</strong> (legally registered on 12th July 2013). The following year was a landmark milestone as Rhythmzz was granted <strong>full accreditation by the International Accreditation Organization (IAO), USA in 2014</strong>.
                </p>
                <p>
                  Each instructor brings a balance of musicality, innovative choreography, and technical precision. We believe that <em>&lsquo;Anybody Can Dance&rsquo;</em> — and with the right balance of dance and performing arts, students shape their personality, self-confidence, and artistic voice.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-line">
                <div className="flex gap-3">
                  <Target className="text-bl shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-xs font-bold tracking-[1px] uppercase mb-1">Our Mission</h4>
                    <p className="text-xs text-ink-2">To provide structured training and exposure in Dance &amp; Performing Arts under qualified and international trainers.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="text-bl shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-xs font-bold tracking-[1px] uppercase mb-1">Our Philosophy</h4>
                    <p className="text-xs text-ink-2">&lsquo;Quality instruction done with care&rsquo; — creating not only dancers but credible storytellers.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Authentic Studio & Stage Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-80 rounded-card relative overflow-hidden border border-line group bg-blk">
              <Image
                src="/images/studio-training/training-collage.jpg"
                alt="Studio Training Heritage Collage"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="heading-display text-xl text-white">STUDIO HERITAGE</span>
                <span className="text-[10px] tracking-[2px] uppercase text-bl-light mt-1 font-bold">
                  Teaching Since 2010
                </span>
              </div>
            </div>
            <div className="h-80 rounded-card relative overflow-hidden border border-line group bg-blk sm:mt-8">
              <Image
                src="/images/srilanka-tour/raasta-stage-1.jpg"
                alt="Natfest Sri Lanka International Production"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="heading-display text-xl text-white">GLOBAL PRODUCTIONS</span>
                <span className="text-[10px] tracking-[2px] uppercase text-bl-light mt-1 font-bold">
                  Natfest Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Founders */}
      <section className="py-20 px-6 md:px-16 bg-surface border-y border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-14 text-center">
            <div className="section-label mb-2">Leadership</div>
            <h2 className="heading-display text-4xl">OUR FOUNDERS</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Nitish Kumar */}
            <div className="p-8 rounded-card bg-canvas border border-line">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-bl/20 flex items-center justify-center text-bl font-extrabold text-2xl">
                  NK
                </div>
                <div>
                  <h3 className="heading-display text-2xl">NITISH KUMAR</h3>
                  <p className="text-xs text-bl-ink font-bold uppercase tracking-[1px]">Founder &amp; Artistic Director</p>
                </div>
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">
                Nitish started dancing professionally at age 16. Achieved a Diploma in Performance and Dance from <strong>ISPTD (Indian Society for Performer and Teachers of Dance), Bengaluru</strong>. Contemporary expert, senior instructor, and operations manager at Celebration Makers. Has trained 1,000+ dancers and won awards from Art Unites and Indywood Film Carnival.
              </p>
            </div>

            {/* Amulya Rajendran */}
            <div className="p-8 rounded-card bg-canvas border border-line">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-bl/20 flex items-center justify-center text-bl font-extrabold text-2xl">
                  AR
                </div>
                <div>
                  <h3 className="heading-display text-2xl">AMULYA RAJENDRAN</h3>
                  <p className="text-xs text-bl-ink font-bold uppercase tracking-[1px]">Co-Founder &amp; Legal Advisor</p>
                </div>
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">
                Associated with Rhythmzz since its inception, Amulya is an Electronics &amp; Communications Engineer with a <strong>Master&apos;s in Business Law from the National Law School of India University (NLSIU), Bengaluru</strong>. She brings extensive experience working with MNCs, startups, and event management leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Staff & Management Team (Directly from /about-us/staff-manangement/) */}
      <section className="py-20 px-6 md:px-16 bg-canvas border-b border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-14 text-center">
            <div className="section-label mb-2">Operations &amp; Strategy</div>
            <h2 className="heading-display text-4xl">STAFF &amp; MANAGEMENT</h2>
            <p className="text-ink-2 mt-3 max-w-2xl mx-auto text-sm">
              Our dedicated management and operations team ensuring seamless studio experience, event productions, and digital engagement.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDIO_INFO.staffManagement.map((member) => (
              <div key={member.name} className="p-6 rounded-card bg-surface border border-line flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-bl/15 text-bl-ink font-bold text-lg flex items-center justify-center mb-4">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="heading-display text-xl mb-1">{member.name}</h3>
                  <p className="text-xs text-bl-ink font-semibold uppercase tracking-[1px] mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-ink-2 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty & Instructors */}
      <section className="py-24 px-6 md:px-16 bg-surface border-b border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center">
            <div className="section-label mb-2">Faculty &amp; Trainers</div>
            <h2 className="heading-display text-4xl md:text-5xl">MEET OUR INSTRUCTORS</h2>
            <p className="text-ink-2 mt-3 max-w-xl mx-auto text-sm">
              Meet our team of certified dance instructors and performers who are always ready to feel the beat.
            </p>
          </Reveal>

          <Reveal stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {((instructors ?? []) as any[]).map((instructor: any) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* International Guest Faculty & Advisory (Directly from /about-us/guest-trainers/) */}
      <section className="py-20 px-6 md:px-16 bg-canvas border-b border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-14 text-center">
            <div className="section-label mb-2">Global Masterclasses</div>
            <h2 className="heading-display text-4xl">INTERNATIONAL GUEST TRAINERS</h2>
            <p className="text-ink-2 mt-3 max-w-2xl mx-auto text-sm">
              Dance is an international culture with no boundaries — our students benefit from masterclasses by acclaimed international artistes.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDIO_INFO.internationalGuestTrainers.map((guest) => (
              <div key={guest.name} className="p-6 rounded-card bg-surface border border-line">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-bl px-2.5 py-0.5 rounded bg-bl/10">
                    {guest.country}
                  </span>
                  <Globe size={16} className="text-bl-ink" />
                </div>
                <h3 className="heading-display text-2xl mb-1">{guest.name}</h3>
                <p className="text-xs text-bl-ink font-semibold uppercase tracking-[1px] mb-3">{guest.role}</p>
                <p className="text-xs text-ink-2 leading-relaxed">{guest.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNATIONAL TOUR SPOTLIGHT */}
      <section className="py-20 px-6 md:px-16 bg-canvas-muted border-b border-line">
        <div className="max-w-7xl mx-auto">
          <Reveal className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bl/10 text-bl text-[10px] font-bold tracking-[2px] uppercase mb-3">
              <Globe size={14} /> International Collaboration
            </div>
            <h2 className="heading-display text-3xl md:text-5xl text-ink">
              NATFEST SRI LANKA &amp; NATANDA COLLABORATION
            </h2>
            <p className="text-sm md:text-base text-ink-2 mt-3 leading-relaxed">
              At the <strong>Natfest International Contemporary Dance Festival</strong> in Sri Lanka, Rhythmzz Academy of Dance represented India and showcased <em>&ldquo;Raasta – The Inside Light&rdquo;</em> in contemporary dance form in collaboration with the renowned <strong>Natanda Dance Company Sri Lanka</strong>.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-card overflow-hidden border border-line bg-blk">
              <Image
                src="/images/srilanka-tour/srilanka-workshop.jpg"
                alt="Colombo Masterclass with Natanda Dance Company"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">Colombo Dance Masterclass</span>
              </div>
            </div>

            <div className="relative h-64 rounded-card overflow-hidden border border-line bg-blk">
              <Image
                src="/images/srilanka-tour/raasta-stage-2.jpg"
                alt="Raasta Inside Light Stage Performance"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">Raasta: Inside Light Stage Production</span>
              </div>
            </div>

            <div className="relative h-64 rounded-card overflow-hidden border border-line bg-blk sm:col-span-2 lg:col-span-1">
              <Image
                src="/images/studio-training/studio-batch-portrait.jpg"
                alt="Rhythmzz Performance Troupe"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blk/90 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">Rhythmzz Performance Troupe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Major Historic Milestones - Interactive Timeline */}
      <section className="py-24 px-6 md:px-16 bg-canvas border-b border-line">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="section-label mb-2">Our Journey</div>
            <h2 className="heading-display text-4xl md:text-5xl">HISTORIC MILESTONES</h2>
            <p className="text-ink-2 mt-3 max-w-xl mx-auto text-sm">
              From our first student batch in 2010 to global festival stages and institutional accreditation.
            </p>
          </Reveal>

          <Reveal stagger={0.08} className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-line-strong before:to-transparent">
            {STUDIO_INFO.historicMilestones.map((item, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              >
                {/* Timeline node */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-canvas bg-bl text-blk font-extrabold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-blk" />
                </div>

                {/* Timeline card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-card bg-surface border border-line hover:border-bl transition-colors duration-300 shadow-sm">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-bl/15 text-bl-ink text-[11px] font-black tracking-wider uppercase mb-2">
                    {item.year}
                  </div>
                  <h3 className="heading-display text-xl md:text-2xl mb-2 text-ink">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-ink-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Corporate Clients & Institutional Partners */}
      <section className="py-20 px-6 md:px-16 bg-blk text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-[10px] tracking-[4px] uppercase text-bl-light mb-3 font-bold">
            Trusted By Global Brands &amp; Institutions
          </div>
          <h2 className="heading-display text-3xl md:text-4xl mb-10">CORPORATE &amp; EVENT CLIENTS</h2>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {STUDIO_INFO.corporateClients.map((client) => (
              <span
                key={client}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/15 text-xs font-semibold text-white/90 hover:border-bl-light transition-colors"
              >
                {client}
              </span>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-white/10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mb-3">
              <ShieldCheck className="text-gold" size={30} />
            </div>
            <h4 className="heading-display text-xl text-white">IAO USA ACCREDITED</h4>
            <p className="text-xs text-white/60 mt-1 max-w-md">
              Awarded full institutional accreditation by the International Accreditation Organization (IAO), USA in 2014.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
