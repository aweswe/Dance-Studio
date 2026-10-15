import { Metadata } from 'next';
import Image from 'next/image';
import { Award, Compass, HeartHandshake, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { DanziaInstructorsSection } from '@/components/public/danzia-instructors-section';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionGap, sectionPadAfterTitle, sectionPadLg } from '@/lib/ui/section-layout';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'About Us | Rhythmzz Academy of Dance',
  description:
    'Secunderabad’s IAO-accredited dance & fitness studio founded in 2010 by Nitish Kumar. Over 3,000 students trained across Classical Kuchipudi, Contemporary, Commercial, and Fitness styles.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const FOUNDERS = [
  {
    name: 'Nitish Kumar',
    role: 'Founder & Artistic Director',
    image: '/images/team/nitish-kumar.jpg',
    bio: [
      'Nitish Kumar started dancing professionally at 16 and turned that single decision into one of Secunderabad’s most recognised dance academies. He holds a Diploma in Performance & Dance from ISPTD, Bengaluru, and has spent 15+ years teaching, choreographing, and performing across India and internationally.',
      'He founded Rhythmzz in 2010, registered it as a company in 2013, and opened the studio at Neredmet X Road the same year. In 2014, the academy earned accreditation from the IAO (International Accreditation Organization), USA — a distinction very few dance studios in Telangana hold.',
      'His work has never been confined to one city. Nitish has led dance projects and workshops in Toronto and Ottawa, Canada, represented India at the nATFEST International Contemporary Dance Festival in Sri Lanka (2017), and received recognition from platforms including Art Unites and the Indywood Film Carnival. At the studio, Rhythmzz has trained over 3,000 students.',
    ],
    quote: 'Quality instruction, done with care.',
  },
  {
    name: 'Amulya Rajendran',
    role: 'Co-Founder & Legal Advisor',
    image: '/images/team/amulya-rajendran.jpg',
    bio: [
      'Amulya Rajendran has been part of Rhythmzz since its very beginning — long before the studio had its first student. An Electronics & Communications Engineer by training and a Master’s in Business Law graduate from the National Law School of India University (NLSIU), Bengaluru, she brings a rare combination of strategic thinking and legal clarity to everything she does.',
      'As Co-Founder and Legal Advisor, Amulya oversees the governance, compliance, and long-term direction of the academy. She also leads its content and communication — giving Rhythmzz a consistent, credible voice across its website, social platforms, and events.',
      'While Nitish builds the culture on the studio floor, Amulya ensures the institution behind it stands on solid ground. Together, they’ve grown Rhythmzz from a neighbourhood passion project into one of East Hyderabad’s most trusted names in dance and fitness.',
    ],
    quote: 'Building an institution where artistic excellence and integrity go hand in hand.',
  },
];

const LEADERSHIP_TEAM = [
  {
    name: 'Meghna Menon',
    role: 'Content Creator & Writer',
    image: '/images/team/meghna-menon.jpg',
    bio: 'Meghna Menon has been part of the Rhythmzz family since 2015 — growing from team member to Assistant Manager, and now leading the academy’s content, writing, and social media. A Psychology graduate, she understands people as well as storytelling. Outside Rhythmzz, she is an active digital creator and traveller whose infectious energy reminds the whole team to enjoy every bit of what they do.',
  },
  {
    name: 'Saurabh Sureka',
    role: 'Director of Event Management',
    image: '/images/team/saurabh-sureka.jpg',
    bio: 'Saurabh Sureka brings 20+ years of event management experience to Rhythmzz, overseeing the conceptualisation and execution of academy performances, showcases, and large-scale productions. He is also the Founder & CEO of Celebration Makers, a socio-cultural event company dedicated to identifying and nurturing artistic talent across India.',
  },
  {
    name: 'Swapna Sujit',
    role: 'Studio Operations Manager',
    image: '/images/team/swapna-sujit.jpg',
    bio: 'Swapna Sujit is the operational backbone of Rhythmzz Academy of Dance. Since joining in 2019, she has taken complete charge of day-to-day operations — from scheduling and student management to facilities and coordination. She holds an M.Tech in ECE (VLSI Design) and brings 10 years of academic experience as an Assistant Professor at MLRITM Hyderabad.',
  },
  {
    name: 'Sheel Awasthi',
    role: 'Strategic Partner',
    image: '/images/team/sheel-awasthi.jpg',
    bio: 'Sheel Awasthi and Nitish Kumar go back to their school days in 7th grade. In 2026, that lifelong friendship became a formal strategic partnership. A Solution Engineer and Solution Architect with 14+ years of corporate experience, Sheel brings deep expertise in systems thinking, technology integration, and scalable digital architecture to Rhythmzz.',
  },
];

export default function AboutPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Our story"
        title="About Rhythmzz"
        accent="Academy of Dance"
        description="Secunderabad’s IAO-Accredited Dance & Fitness Studio — building performers, storytellers, and confident individuals since 2010."
      />

      {/* Main Narrative & Story */}
      <HomepageSection className={sectionPadAfterTitle}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 text-ink-2 leading-relaxed text-sm sm:text-base">
            <p className="text-bl font-semibold text-xs uppercase tracking-[0.2em]">
              Secunderabad’s Trusted Dance Institution
            </p>
            <h2 className="font-anton text-2xl sm:text-3xl md:text-4xl uppercase text-ink tracking-tight leading-tight">
              Built on one belief: Dance is the most powerful way to express yourself.
            </h2>
            <p>
              Rhythmzz Academy of Dance was founded by <strong>Nitish Kumar</strong> in 2010. What started as a passion project has grown into one of East Hyderabad’s most trusted dance institutions.
            </p>
            <p>
              In 2013, Rhythmzz became a registered dance company and opened its first studio in Sainikpuri, Secunderabad. As the academy grew, it moved to its current home at Neredmet X Road in 2015. In 2014, it earned prestigious accreditation from the <strong>IAO (International Accreditation Organization), USA</strong> — a distinction very few dance studios in Telangana hold.
            </p>
            <p>
              Today, Rhythmzz trains students from Sainikpuri, AS Rao Nagar, Yapral, Neredmet, Malkajgiri, and across East Hyderabad with a team of accomplished instructors across Classical, Contemporary, Commercial, and Fitness disciplines. Over 3,000 dancers have stepped onto our floors.
            </p>
            <p className="font-semibold text-ink pt-1">
              We don’t just teach dance. We build performers, storytellers, and confident individuals — one class at a time.
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/11] rounded-md overflow-hidden border border-line shadow-lg bg-surface">
            <Image
              src="/images/studio-training/studio-technique.jpg"
              alt="Rhythmzz Academy studio floor training"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </HomepageSection>

      {/* Vision & Mission */}
      <HomepageSection className="py-14 sm:py-16 border-t border-line/60 bg-canvas-muted/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Vision */}
          <div className="rounded-md border border-line bg-surface p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-md bg-bl/10 text-bl flex items-center justify-center mb-4">
                <Target size={20} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bl">Our Vision</p>
              <h3 className="font-anton text-2xl uppercase tracking-tight text-ink mt-1 mb-3">
                Leading Arts Institution
              </h3>
              <p className="text-sm text-ink-2 leading-relaxed">
                To become Hyderabad’s leading institution for dance and performing arts — offering internationally recognised training, certified programmes, and a platform where every student evolves as a performer.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="rounded-md border border-line bg-surface p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-md bg-bl/10 text-bl flex items-center justify-center mb-4">
                <Compass size={20} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bl">Our Mission</p>
              <h3 className="font-anton text-2xl uppercase tracking-tight text-ink mt-1 mb-3">
                Core Commitments
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-ink-2">
                <li className="flex items-start gap-2">
                  <span className="text-bl font-bold">•</span>
                  <span>Deliver quality dance education under qualified, experienced instructors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bl font-bold">•</span>
                  <span>Offer certified Diploma and Degree-level programmes in dance and performing arts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bl font-bold">•</span>
                  <span>Provide training across multiple dance forms under one roof.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bl font-bold">•</span>
                  <span>Create opportunities for students to perform, compete, and grow locally and internationally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bl font-bold">•</span>
                  <span>Collaborate with recognised dance institutions across India and globally.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </HomepageSection>

      {/* Founders Section */}
      <HomepageSection className={sectionPadLg}>
        <HomepageSectionHeading
          eyebrow="Founders"
          title="Leadership & Vision"
          description="The driving vision and institutional stewardship behind Rhythmzz Academy of Dance."
        />

        <div className="space-y-8 sm:space-y-12">
          {FOUNDERS.map((founder, idx) => (
            <div
              key={founder.name}
              className={`rounded-md border border-line bg-surface p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-4 relative aspect-[3/4] rounded-md overflow-hidden border border-line bg-canvas-muted">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover object-top"
                />
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bl">
                    {founder.role}
                  </p>
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-ink mt-1 mb-4">
                    {founder.name}
                  </h3>
                  <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
                    {founder.bio.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                <blockquote className="pt-4 border-t border-line/60 italic text-xs sm:text-sm text-ink font-medium">
                  “{founder.quote}”
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </HomepageSection>

      {/* Management Team (Who We Are) */}
      <HomepageSection className="py-14 sm:py-16 border-t border-line/60 bg-canvas-muted/30">
        <HomepageSectionHeading
          eyebrow="Who We Are"
          title="Management & Strategy"
          description="The creative, operational, and event management leaders powering our studio every day."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {LEADERSHIP_TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-md border border-line bg-surface p-5 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden border border-line bg-canvas-muted mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover object-top"
                  />
                </div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-bl">
                  {member.role}
                </p>
                <h4 className="font-anton text-lg uppercase tracking-tight text-ink mt-0.5 mb-2">
                  {member.name}
                </h4>
                <p className="text-xs text-ink-2 leading-relaxed line-clamp-6">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </HomepageSection>

      {/* Floor Coaches / Teaching Faculty */}
      <DanziaInstructorsSection />

      {/* International Collaborations */}
      <HomepageSection className={sectionPadLg}>
        <HomepageSectionHeading
          eyebrow="International Collaboration"
          title="Natfest Sri Lanka & Global Tours"
          description="Representing India at Natfest Contemporary Dance Festival, Rhythmzz performed “Raasta – The Inside Light” in partnership with Sri Lanka’s Natanda Dance Company, alongside masterclasses in Canada."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { img: '/images/srilanka-tour/srilanka-workshop.jpg', label: 'Colombo Masterclass' },
            { img: '/images/srilanka-tour/raasta-stage-2.jpg', label: 'Raasta Live Performance' },
            { img: '/images/studio-training/studio-batch-portrait.jpg', label: 'Performance Troupe' },
          ].map((item) => (
            <div key={item.label} className="relative h-60 rounded-md overflow-hidden border border-line bg-surface group">
              <Image
                src={item.img}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent p-4 flex items-end">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </HomepageSection>

      <PublicBookTrialCta />
    </PublicPage>
  );
}
