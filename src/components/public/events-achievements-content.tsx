'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  ZoomIn,
  Building2,
  Trophy,
  Globe,
  GraduationCap,
  Newspaper,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  ACHIEVEMENT_STATS,
  PRESS_ITEMS,
  PressItem,
} from '@/data/events-achievements';
import { enrolHref } from '@/lib/utils/constants';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinktreeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SocialIconLinks() {
  return (
    <div className="flex items-center gap-2">
      <a
        href="https://www.instagram.com/rhythmzzdance.live"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Rhythmzz on Instagram"
        className="w-8 h-8 rounded-full border border-line bg-surface hover:border-bl hover:text-bl text-ink-2 flex items-center justify-center transition-colors"
      >
        <InstagramIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href="https://www.facebook.com/rhythmzzdance"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Rhythmzz on Facebook"
        className="w-8 h-8 rounded-full border border-line bg-surface hover:border-bl hover:text-bl text-ink-2 flex items-center justify-center transition-colors"
      >
        <FacebookIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href="https://linktr.ee/rhythmzzdance.in"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Rhythmzz Linktree Hub"
        className="w-8 h-8 rounded-full border border-line bg-surface hover:border-bl hover:text-bl text-ink-2 flex items-center justify-center transition-colors"
      >
        <LinktreeIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href="https://wa.me/919052980859"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Rhythmzz on WhatsApp"
        className="w-8 h-8 rounded-full border border-line bg-surface hover:border-bl hover:text-bl text-ink-2 flex items-center justify-center transition-colors"
      >
        <WhatsAppIcon className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

export function EventsAchievementsContent() {
  const [activePressModal, setActivePressModal] = useState<PressItem | null>(null);

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 lg:py-20 text-ink">
      {/* ═══════════════════════════════════════════════════════════════════════
          1. HEADER & EDITORIAL BYLINE
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="space-y-6 pb-10 sm:pb-12 border-b border-line/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-bl/10 text-bl border border-bl/20">
              Archival Retrospective
            </span>
            <span className="text-xs font-mono text-ink-3">2010 – Present</span>
          </div>

          {/* Simple small social icons only */}
          <SocialIconLinks />
        </div>

        <h1 className="font-anton text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-ink leading-[1.06]">
          Events, Historic Milestones &amp; Press Archive
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-ink-3">
          <span>Rhythmzz Academy of Dance</span>
          <span>·</span>
          <span>Secunderabad, Telangana</span>
          <span>·</span>
          <span>Established 2010</span>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. EDITORIAL LEAD / QUOTE WITH BREATHING ROOM
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="my-10 sm:my-14 pl-6 sm:pl-8 border-l-2 border-bl/80 py-1">
        <p className="font-serif italic text-lg sm:text-2xl text-ink leading-relaxed font-normal">
          &ldquo;From conducting contemporary dance workshops across Toronto and Ottawa, Canada, to representing Team India at international festivals in Sri Lanka, organizing Hyderabad’s largest dance tournament with 1,500+ dancers, choreographing for Amazon, and certifying collegiate students across universities since 2010.&rdquo;
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. KEY METRICS STRIP (AIRY & FLOATING)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="my-12 sm:my-16 py-8 sm:py-10 border-y border-line/40 grid grid-cols-2 md:grid-cols-4 gap-8">
        {ACHIEVEMENT_STATS.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <span className="font-anton text-3xl sm:text-4xl text-ink tracking-tight block">
              {stat.number}
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-bl block">
              {stat.label}
            </span>
            <p className="text-xs text-ink-3 leading-relaxed">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. FIRST EVENT: INTERNATIONAL PRESENCE & CREATIVE COLLABORATIONS – CANADA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="my-14 sm:my-20 pt-10 sm:pt-14 border-t border-line/40 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-bl font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Chapter I · International Presence &amp; Creative Collaborations</span>
          </div>

          <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-wide text-ink">
            International Presence &amp; Creative Collaborations – Canada
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 text-base sm:text-lg text-ink-2 leading-relaxed sm:leading-loose space-y-6 font-normal">
            <p>
              Extending Rhythmzz Academy of Dance beyond borders, founder <strong>Nitish Kumar</strong> conducted multiple contemporary dance workshops for dancers in <strong>Toronto and Ottawa, Canada</strong>, between <strong>2024 and 2026</strong>. These workshops explored contemporary movement, musicality, improvisation, and innovative choreography, fostering artistic growth and creative exchange within the dance community.
            </p>

            <p>
              Further expanding Rhythmzz’s creative footprint, Nitish choreographed a music video in <strong>2023</strong> for <strong>Magic Mist Media</strong>, a Toronto-based short film production company, blending expressive movement with visual storytelling. These milestones reflect Rhythmzz’s growing international presence, cross-cultural collaborations, and commitment to pushing creative boundaries through dance.
            </p>

            {/* Canadian Tour Milestones */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-bl uppercase tracking-wider block">
                  2024 – 2026 · Toronto &amp; Ottawa
                </span>
                <h4 className="font-bold text-ink">Contemporary Dance Workshops</h4>
                <p className="text-xs text-ink-3 leading-relaxed">
                  Movement exploration, musicality, improvisation, and cross-border creative exchange.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-bl uppercase tracking-wider block">
                  2023 · Magic Mist Media
                </span>
                <h4 className="font-bold text-ink">Music Video Choreography</h4>
                <p className="text-xs text-ink-3 leading-relaxed">
                  Expressive choreography and visual movement direction for Toronto short film production.
                </p>
              </div>
            </div>
          </div>

          {/* Authentic Workshop Poster Card */}
          <div className="md:col-span-4">
            <div
              onClick={() =>
                setActivePressModal({
                  id: 'canada-workshop-poster',
                  title: 'Contemporary Dance Workshops – Toronto & Ottawa, Canada',
                  publication: 'International Tour Archive',
                  category: 'showcase',
                  image: '/images/canada-workshop-poster.jpg',
                  description:
                    'Official tour poster: Contemporary dance intensives conducted by founder Nitish Kumar across Toronto and Ottawa, Canada (2024–2026).',
                })
              }
              className="group relative rounded-md border border-line bg-surface overflow-hidden cursor-pointer hover:border-bl/60 hover:shadow-md transition-all duration-200"
            >
              <div className="relative aspect-[3/4] w-full bg-canvas overflow-hidden">
                <Image
                  src="/images/canada-workshop-poster.jpg"
                  alt="Contemporary Dance Workshops Canada - Nitish Kumar"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                <div className="absolute inset-0 bg-ink/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-surface/90 text-ink shadow-md backdrop-blur-xs flex items-center gap-1 text-[11px] font-mono font-bold">
                    <ZoomIn size={13} /> Enlarge Poster
                  </span>
                </div>
              </div>
              <div className="p-3 border-t border-line/50 bg-surface">
                <span className="text-[9px] font-mono uppercase tracking-wider text-bl font-bold block">
                  Official Tour Poster
                </span>
                <h4 className="font-bold text-xs text-ink truncate mt-0.5">
                  Canada Contemporary Series
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. CHAPTER II: GLOBAL & NATIONAL CHAMPIONSHIPS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="my-14 sm:my-20 pt-10 sm:pt-14 border-t border-line/40 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-bl font-mono text-xs font-bold uppercase tracking-widest">
            <Globe size={14} />
            <span>Chapter II · Global &amp; National Championship Stages</span>
          </div>

          <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-wide text-ink">
            Representing India &amp; Organizing Hyderabad&apos;s Biggest Dance Tournament
          </h2>
        </div>

        <div className="text-base sm:text-lg text-ink-2 leading-relaxed sm:leading-loose space-y-6 font-normal">
          <p>
            In <strong>2017</strong>, Rhythmzz Academy of Dance represented India on the international stage at the <strong>nATFEST International Contemporary Dance Festival in Sri Lanka</strong>. Our ensemble showcased the full-length original production <em>&ldquo;Raasta – The Inside Light&rdquo;</em> in contemporary dance form, earning accolades for Indian contemporary choreographic storytelling.
          </p>

          <p>
            Two years prior, in <strong>2015</strong>, Rhythmzz took the lead as organizers and hosts of <strong>Hyderabad Dance Premier League (HDPL)</strong> — the biggest national-level dance competition ever held in Hyderabad. The championship brought together more than <strong>1,500 participants</strong> from across unified Andhra Pradesh and Telangana, spanning solo, duet, and crew battles before eminent adjudicators and packed auditoriums.
          </p>

          <p>
            Our competitive legacy stretches back to <strong>2009</strong>, when Rhythmzz emerged as celebrated <strong>Finalists of War of Dance</strong>, organized by Twist &apos;n&apos; Turn Dance Institute at the historic Harihar Kala Bhavan in Secunderabad — cementing our roots as one of East Hyderabad&apos;s pioneering crews.
          </p>
        </div>

        {/* Spacious Milestones Row */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-bl uppercase tracking-wider block">
              2017 · Colombo, Sri Lanka
            </span>
            <h4 className="font-bold text-ink">nATFEST Team India Showcase</h4>
            <p className="text-xs text-ink-3 leading-relaxed">
              Full-length contemporary production &ldquo;Raasta – The Inside Light&rdquo; staged internationally.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-bl uppercase tracking-wider block">
              2015 · Hyderabad
            </span>
            <h4 className="font-bold text-ink">Hyderabad Dance Premier League</h4>
            <p className="text-xs text-ink-3 leading-relaxed">
              1,500+ dancers across Andhra Pradesh and Telangana in Hyderabad’s biggest tournament.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-bl uppercase tracking-wider block">
              2009 · Secunderabad
            </span>
            <h4 className="font-bold text-ink">War of Dance Finalists</h4>
            <p className="text-xs text-ink-3 leading-relaxed">
              Grand finale battle at Harihar Kala Bhavan, marking the founding era of Rhythmzz.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. CHAPTER III: CORPORATE MEGA-LAUNCHES & BROADCASTS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="my-14 sm:my-20 pt-10 sm:pt-14 border-t border-line/40 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-bl font-mono text-xs font-bold uppercase tracking-widest">
            <Building2 size={14} />
            <span>Chapter III · Commercial Mega-Launches &amp; Televised Broadcasts</span>
          </div>

          <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-wide text-ink">
            Amazon World Campus Launch, Sony IPL &amp; High-Profile Brand Activations
          </h2>
        </div>

        <div className="text-base sm:text-lg text-ink-2 leading-relaxed sm:leading-loose space-y-6 font-normal">
          <p>
            In <strong>2019</strong>, Rhythmzz was mandated by premier entertainment event company <strong>Wizcraft India PVT. LTD</strong> to inaugurate the <strong>world&apos;s biggest Amazon office campus in Hyderabad</strong> with a high-energy flash mob, energizing international executives and global employees.
          </p>

          <p>
            Across multiple sports broadcast seasons, our dancers performed stadium flash mobs and televised promotional sequences for <strong>Sony Entertainment Television&apos;s &ldquo;Indian Premier League of Cricket Screen&rdquo;</strong> in support of the Sunrisers Hyderabad cricket franchise.
          </p>

          <p>
            Our commercial choreography portfolio includes major product rollouts and network inaugurations:
          </p>

          {/* Clean 2-Column Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-bl shrink-0 mt-1" />
              <div>
                <strong className="text-ink">Airtel 4G Launch:</strong>
                <p className="text-xs text-ink-3 mt-0.5">Official high-speed network rollout in Hyderabad</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-bl shrink-0 mt-1" />
              <div>
                <strong className="text-ink">Tata Sky Active Fitness:</strong>
                <p className="text-xs text-ink-3 mt-0.5">Promotional fitness dance campaign showcase</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-bl shrink-0 mt-1" />
              <div>
                <strong className="text-ink">Bharat Biotech:</strong>
                <p className="text-xs text-ink-3 mt-0.5">Intensive 4-day pharmaceutical product launch</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-bl shrink-0 mt-1" />
              <div>
                <strong className="text-ink">Uninor-Telenor:</strong>
                <p className="text-xs text-ink-3 mt-0.5">Commercial brand conversion and market launch</p>
              </div>
            </div>
          </div>

          <p>
            Additionally, Rhythmzz has regularly choreographed Family Days and Annual Galas for leading MNCs including <strong>Wipro Technologies, Intellect Tech, Chennai Super Kings (CSK), Amazon corporate</strong>, and directed exclusive Indian cultural performances for visiting foreign delegates at <strong>Infosys</strong>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. CHAPTER IV: COLLEGIATE SWEEPS & SOCIAL PHILANTHROPY
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="my-14 sm:my-20 pt-10 sm:pt-14 border-t border-line/40 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-bl font-mono text-xs font-bold uppercase tracking-widest">
            <Trophy size={14} />
            <span>Chapter IV · Collegiate Dominance &amp; Philanthropy</span>
          </div>

          <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-wide text-ink">
            Podium Victories Across India &amp; Dance for a Cause
          </h2>
        </div>

        <div className="text-base sm:text-lg text-ink-2 leading-relaxed sm:leading-loose space-y-6 font-normal">
          <p>
            Rhythmzz competitive squads have commanded top podium wins across premier collegiate festivals in India, capturing 1st-place trophies in group, duet, and solo competitions at:
          </p>

          {/* Clean flowing college pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'IIT Guwahati',
              'NIFT Hyderabad',
              'Badruka College of Commerce',
              'CBIT Engineering College',
              'St. Mary’s College Hyderabad',
              'Sreenidhi Engineering College',
              'VJIM Management Institute',
              'Vivekananda Youth Front',
            ].map((college) => (
              <span
                key={college}
                className="px-3 py-1 rounded text-xs font-mono font-medium text-ink bg-surface border border-line/70"
              >
                {college}
              </span>
            ))}
          </div>

          <p className="pt-2">
            Beyond trophies, we believe dance carries a profound responsibility to give back to society:
          </p>

          {/* Philanthropic causes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm">
            <div className="space-y-1.5 p-5 rounded-md border border-line/60 bg-surface/50">
              <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-bold block">
                Jan 2015 · Cancer Patient Benefit
              </span>
              <h4 className="font-bold text-ink text-base">Jallosh 2k15 Charity Production</h4>
              <p className="text-xs text-ink-3 leading-relaxed">
                Full-scale student dance production organized in collaboration with <strong>Mount Litera Zee School</strong>, raising charitable contributions for cancer patient treatment and hospital care.
              </p>
            </div>

            <div className="space-y-1.5 p-5 rounded-md border border-line/60 bg-surface/50">
              <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-bold block">
                Sports Cause · Youth Tribute
              </span>
              <h4 className="font-bold text-ink text-base">Sachin Tendulkar Birthday Flash Mob</h4>
              <p className="text-xs text-ink-3 leading-relaxed">
                Staged a public flash mob tribute in proud association with <strong>Army Public School, Secunderabad</strong> to inspire youth athletic dedication and sportsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. CHAPTER V: ACADEMIC CURRICULUMS & FORMAL CERTIFICATION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="my-14 sm:my-20 pt-10 sm:pt-14 border-t border-line/40 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-bl font-mono text-xs font-bold uppercase tracking-widest">
            <GraduationCap size={14} />
            <span>Chapter V · Academic Curriculums &amp; University Partnerships</span>
          </div>

          <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-wide text-ink">
            Teaching Dance as Curriculum Since 2010
          </h2>
        </div>

        <div className="text-base sm:text-lg text-ink-2 leading-relaxed sm:leading-loose space-y-6 font-normal">
          <p>
            Since <strong>2010</strong>, Rhythmzz Academy has taught dance as a credit-bearing curriculum across respected schools and degree colleges, officially evaluating and certifying hundreds of students every academic year.
          </p>

          {/* Academic partnerships grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
            <div className="p-4 rounded-md border border-line/60 bg-surface/40 space-y-1">
              <span className="text-emerald-600 font-mono text-[11px] font-bold block">
                2016 – Present · Old Alwal
              </span>
              <h4 className="font-bold text-ink">Loyola Degree College, Hyderabad</h4>
              <p className="text-xs text-ink-3">Professional Certificate Course Director</p>
            </div>

            <div className="p-4 rounded-md border border-line/60 bg-surface/40 space-y-1">
              <span className="text-emerald-600 font-mono text-[11px] font-bold block">
                2017 – Present · Sainikpuri
              </span>
              <h4 className="font-bold text-ink">Bhavan’s Sri Aurobindo College</h4>
              <p className="text-xs text-ink-3">Professional Certificate Course Director</p>
            </div>

            <div className="p-4 rounded-md border border-line/60 bg-surface/40 space-y-1">
              <span className="text-emerald-600 font-mono text-[11px] font-bold block">
                2018 – Present · Sainikpuri
              </span>
              <h4 className="font-bold text-ink">Bhavan’s Degree College, Sainikpuri</h4>
              <p className="text-xs text-ink-3">Professional Certificate Faculty</p>
            </div>

            <div className="p-4 rounded-md border border-line/60 bg-surface/40 space-y-1">
              <span className="text-ink-3 font-mono text-[11px] font-bold block">
                2010 – 2013 · Secunderabad
              </span>
              <h4 className="font-bold text-ink">Bhavan’s Vivekananda Degree College</h4>
              <p className="text-xs text-ink-3">Official Dance Instructor</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-ink-3">
            Additional institutional engagements include summer dance intensive camps at <em>Bhavan’s Sri Ramakrishna Vidyalaya School</em> and <em>Children&apos;s House School</em>, official choreography for <em>Rockwood High School&apos;s</em> District Inter-Sports Opening Ceremony at Lal Bahadur Stadium, Annual Day choreography for <em>Bhavan’s Aurobindo Junior College (2017 &amp; 2018)</em>, and continuous masterclasses with acclaimed international guest instructors.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. IN THE PRESS — MEDIA ARCHIVE & NEWSPAPER CLIPPINGS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="my-14 sm:my-20 pt-10 sm:pt-14 border-t border-line/40 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-bl font-mono text-xs font-bold uppercase tracking-widest">
              <Newspaper size={14} />
              <span>Media Archive</span>
            </div>
            <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-wide text-ink">
              In the PRESS
            </h2>
          </div>

          <span className="text-xs font-mono text-ink-3">
            Click any clipping to enlarge
          </span>
        </div>

        <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
          Explore authentic newspaper clippings from <em>Deccan Chronicle</em>, <em>The Hans India</em>, state competition front-page articles, and historical event archives documenting Rhythmzz Academy across print media.
        </p>

        {/* Clean Responsive Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {PRESS_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePressModal(item)}
              className="group relative rounded-md border border-line bg-surface overflow-hidden cursor-pointer hover:border-bl/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full bg-canvas overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-ink/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-surface/90 text-ink shadow-md backdrop-blur-xs flex items-center gap-1 text-[11px] font-mono font-bold">
                    <ZoomIn size={13} /> View
                  </span>
                </div>
              </div>

              <div className="p-2.5 border-t border-line/50 bg-surface">
                <span className="text-[9px] font-mono uppercase tracking-wider text-bl font-bold block truncate">
                  {item.publication}
                </span>
                <h4 className="font-bold text-[11px] text-ink truncate mt-0.5">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          10. CONNECT & ACTION STRIP (CLEAN, MINIMAL, NO CLUTTER)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="my-14 sm:my-20 pt-10 sm:pt-14 border-t border-line/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-3">
            Connect:
          </span>
          <SocialIconLinks />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href={enrolHref({ intent: 'trial' })}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep transition-colors shadow-xs w-full sm:w-auto text-center"
          >
            <span>Book Free Trial</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-line text-ink hover:border-ink/50 bg-surface transition-colors w-full sm:w-auto text-center"
          >
            <span>Contact Us</span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL: HIGH-RESOLUTION PRESS CLIPPING VIEWER
      ═══════════════════════════════════════════════════════════════════════ */}
      {activePressModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActivePressModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface border border-line rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-line bg-canvas">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-bold block truncate">
                  {activePressModal.publication}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-ink truncate">
                  {activePressModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePressModal(null)}
                className="p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-surface border border-line transition-colors cursor-pointer shrink-0"
                aria-label="Close image"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative flex-1 min-h-[280px] sm:min-h-[420px] max-h-[65vh] bg-canvas flex items-center justify-center p-2">
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[420px]">
                <Image
                  src={activePressModal.image}
                  alt={activePressModal.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-line bg-surface flex items-center justify-between gap-3">
              <p className="text-[11px] sm:text-xs text-ink-2 font-medium line-clamp-2">
                {activePressModal.description}
              </p>
              <button
                type="button"
                onClick={() => setActivePressModal(null)}
                className="shrink-0 min-h-[36px] px-4 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-canvas border border-line text-ink hover:border-ink/50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
