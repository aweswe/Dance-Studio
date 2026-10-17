'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  CheckCircle2,
  ZoomIn,
  Newspaper,
  Award,
  Globe,
  HeartHandshake,
  GraduationCap,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  ACHIEVEMENT_STATS,
  ACADEMIC_PARTNERSHIPS,
  PRESS_ITEMS,
  SOCIAL_CHANNELS,
  PressItem,
} from '@/data/events-achievements';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { Reveal } from '@/components/motion/reveal';
import { sectionPadLg } from '@/lib/ui/section-layout';
import { cn } from '@/lib/utils/cn';
import { enrolHref } from '@/lib/utils/constants';

// Milestone Groups with punchy scannable bullet points (no text walls)
const TRACK_RECORD_SECTIONS = [
  {
    category: 'International & Major Stages',
    icon: Globe,
    items: [
      {
        title: 'nATFEST 2017 International Contemporary Dance Festival (Sri Lanka)',
        subtitle: 'Selected to represent India on the international stage',
        year: '2017',
        tag: 'International Tour',
        points: [
          'Represented India at the International Contemporary Dance Festival in Sri Lanka',
          'Showcased original contemporary production "Raasta – The Inside Light"',
          'Conducted cross-cultural movement workshops and international artist exchanges',
        ],
      },
      {
        title: 'Hyderabad Dance Premier League (HDPL 2015)',
        subtitle: "Organised Hyderabad's biggest national dance competition ever",
        year: '2015',
        tag: 'State Championship',
        points: [
          'Conceived, organized, and hosted by Rhythmzz Academy of Dance',
          'Over 1,500 participants across unified Andhra Pradesh and Telangana',
          'The largest open dance championship held in Hyderabad history',
        ],
      },
      {
        title: 'War of Dance Championship — Grand Finalists',
        subtitle: "Twist 'n' Turn — Harihar Kala Bhavan, Secunderabad",
        year: '2009',
        tag: 'Milestone Finalist',
        points: [
          'Finalists at Hyderabad’s most competitive dance championship',
          'Held at the historic Harihar Kala Bhavan in Secunderabad',
          'Ranked among the premier urban crews in the state',
        ],
      },
    ],
  },
  {
    category: 'Corporate Launches & MNC Choreography',
    icon: Building2,
    items: [
      {
        title: "Amazon World's Largest Campus Office Launch",
        subtitle: 'Client: Wizcraft India PVT. LTD & Amazon',
        year: '2019',
        tag: 'Global Inauguration',
        points: [
          "Inaugurated Amazon's world-largest campus office building in Hyderabad",
          'High-energy synchronization flash mob with 50+ performers',
          'Executed under the direction of premier agency Wizcraft India',
        ],
      },
      {
        title: 'Indian Premier League (IPL) & Sony Entertainment Television',
        subtitle: 'Promotional stadium flash mob supporting Sunrisers Hyderabad',
        year: 'IPL Season',
        tag: 'Broadcast Event',
        points: [
          'Televised flash mob for Sony Entertainment Television cricket campaign',
          'Stadium crowd performance supporting the Sunrisers Hyderabad IPL team',
          'Featured in national televised promotional broadcasts',
        ],
      },
      {
        title: 'High-Impact Brand & Product Launches',
        subtitle: 'Airtel 4G, Uninor-Telenor, Tata Sky & Bharat Biotech',
        year: 'Corporate Events',
        tag: 'Commercial Launches',
        points: [
          'Airtel 4G Official Launch in Hyderabad',
          'Uninor-to-Telenor telecommunications brand conversion launch',
          'Tata Sky "Active Fitness" promotional launch choreography',
          '4-Day grand pharmaceutical product launch for Bharat Biotech',
        ],
      },
      {
        title: 'Fortune 500 MNC Family & Annual Days',
        subtitle: 'Intellect Tech, Wipro, Amazon, CSK & Infosys',
        year: 'Corporate Choreography',
        tag: 'Corporate Gala',
        points: [
          'Choreographed Annual Days & Family Days for Wipro Technologies and Intellect Tech',
          'Directed cultural choreography for visiting international foreign delegates at Infosys',
          'Promotional dance choreography for Chennai Super Kings (CSK) & Amazon corporate',
        ],
      },
    ],
  },
  {
    category: 'Collegiate Championships & Community Philanthropy',
    icon: Trophy,
    items: [
      {
        title: 'Inter-College Championship Sweeps Across India',
        subtitle: 'IIT Guwahati, NIFT, Badruka, CBIT, St. Mary’s, Sreenidhi, VJIM',
        year: 'Multi-Year Wins',
        tag: 'Podium Champions',
        points: [
          'Won 1st place in group and duet categories across top colleges',
          'Titles at IIT Guwahati, NIFT Hyderabad, Badruka College of Commerce, and CBIT',
          'Trophies at St. Mary’s College, Sreenidhi Engineering, VJIM & Vivekananda Youth Front',
        ],
      },
      {
        title: 'Jallosh 2k15 — Cancer Patient Fundraiser Showcase',
        subtitle: 'In collaboration with Mount Litera Zee School',
        year: '2015',
        tag: 'Charity Production',
        points: [
          'Organised "Jallosh 2k15" student dance presentation in January 2015',
          '100% fundraiser event supporting cancer patient treatment and care',
          'Showcased hundreds of student performers in partnership with Mount Litera Zee School',
        ],
      },
      {
        title: 'Sachin Tendulkar Birthday Tribute Flash Mob',
        subtitle: 'In association with Army Public School, Secunderabad',
        year: 'Public Event',
        tag: 'Youth Tribute',
        points: [
          'Massive public flash mob tribute to cricket legend Sachin Tendulkar on his birthday',
          'Promoted youth fitness and sports inspiration in association with Army Public School',
          'Choreographed for students and junior athletes in Secunderabad',
        ],
      },
    ],
  },
];

export function EventsAchievementsContent() {
  const [activeTab, setActiveTab] = useState<'track_record' | 'academic' | 'press'>('track_record');
  const [pressFilter, setPressFilter] = useState<'all' | 'newspaper' | 'stage'>('all');
  const [activePressModal, setActivePressModal] = useState<PressItem | null>(null);

  const filteredPress = useMemo(() => {
    if (pressFilter === 'all') return PRESS_ITEMS;
    return PRESS_ITEMS.filter((item) => {
      if (pressFilter === 'newspaper') return item.category === 'newspaper';
      return item.category === 'stage' || item.category === 'showcase';
    });
  }, [pressFilter]);

  return (
    <div className="w-full">
      {/* ═══════════════════════════════════════════════════════════════════════
          1. STATS BANNER
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className="pt-2 pb-8 sm:pb-12">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {ACHIEVEMENT_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'p-5 sm:p-6 rounded-md border border-line bg-surface relative overflow-hidden transition-all duration-200 hover:border-bl/40 shadow-xs flex flex-col justify-between',
                  i === 0 && 'border-bl/30 bg-bl/5'
                )}
              >
                <div>
                  <span className="font-anton text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight block">
                    {stat.number}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-ink uppercase tracking-wider mt-1.5 font-mono">
                    {stat.label}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-ink-3 font-medium mt-3 leading-relaxed border-t border-line/60 pt-2.5">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. SMART NAVIGATION SWITCHER (Track Record / Academic / Press)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className="pt-0 pb-6">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center p-1 rounded-md border border-line bg-surface shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('track_record')}
              className={cn(
                'min-h-[40px] px-4 sm:px-6 rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2',
                activeTab === 'track_record'
                  ? 'bg-ink text-surface shadow-xs'
                  : 'text-ink-3 hover:text-ink hover:bg-canvas'
              )}
            >
              <Trophy size={14} className={activeTab === 'track_record' ? 'text-bl' : 'text-ink-3'} />
              <span>Events &amp; Milestones</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academic')}
              className={cn(
                'min-h-[40px] px-4 sm:px-6 rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2',
                activeTab === 'academic'
                  ? 'bg-ink text-surface shadow-xs'
                  : 'text-ink-3 hover:text-ink hover:bg-canvas'
              )}
            >
              <GraduationCap size={14} className={activeTab === 'academic' ? 'text-bl' : 'text-ink-3'} />
              <span>Academic Partnerships</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('press')}
              className={cn(
                'min-h-[40px] px-4 sm:px-6 rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2',
                activeTab === 'press'
                  ? 'bg-ink text-surface shadow-xs'
                  : 'text-ink-3 hover:text-ink hover:bg-canvas'
              )}
            >
              <Newspaper size={14} className={activeTab === 'press' ? 'text-bl' : 'text-ink-3'} />
              <span>In the Press ({PRESS_ITEMS.length})</span>
            </button>
          </div>
        </div>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 1: TRACK RECORD — PUNCHY SCANNABLE MILESTONES (Zero text walls)
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'track_record' && (
        <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
          <Reveal>
            <div className="space-y-12 sm:space-y-16">
              {TRACK_RECORD_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div key={sec.category} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 border-b border-line pb-3">
                      <div className="p-2 rounded bg-bl/10 text-bl">
                        <Icon size={18} />
                      </div>
                      <h3 className="font-anton text-xl sm:text-2xl text-ink uppercase tracking-wide">
                        {sec.category}
                      </h3>
                    </div>

                    {/* Milestone Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {sec.items.map((item) => (
                        <div
                          key={item.title}
                          className="p-5 sm:p-6 rounded-md border border-line bg-surface hover:border-bl/40 transition-colors shadow-2xs flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-bl font-bold bg-bl/10 border border-bl/20 px-2 py-0.5 rounded">
                                {item.tag}
                              </span>
                              <span className="text-[11px] font-mono font-bold text-ink-3">
                                {item.year}
                              </span>
                            </div>

                            <h4 className="font-bold text-base sm:text-lg text-ink leading-snug mb-1">
                              {item.title}
                            </h4>
                            <p className="text-xs font-mono text-ink-3 mb-4">{item.subtitle}</p>
                          </div>

                          <div className="border-t border-line/60 pt-3.5 space-y-2">
                            {item.points.map((pt) => (
                              <div key={pt} className="flex items-start gap-2 text-xs text-ink-2 font-medium">
                                <CheckCircle2 size={13} className="text-bl shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </HomepageSection>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 2: ACADEMIC & INSTITUTIONAL PARTNERSHIPS
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'academic' && (
        <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
          <Reveal>
            <div className="max-w-3xl mb-8">
              <HomepageSectionHeading
                eyebrow="Academic Accreditation & Training"
                title="Institutional"
                accent="Partnerships"
                description="Delivering formal dance curriculum, student certification, and professional diploma coursework in leading colleges and schools since 2010."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {ACADEMIC_PARTNERSHIPS.map((acad) => (
                <div
                  key={acad.id}
                  className="p-5 rounded-md border border-line bg-surface hover:border-bl/40 transition-colors shadow-2xs flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={cn(
                          'text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold',
                          acad.isOngoing
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-canvas text-ink-3 border border-line'
                        )}
                      >
                        {acad.tenure}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-ink mb-1 leading-snug">
                      {acad.institution}
                    </h4>

                    <span className="text-xs font-mono font-bold text-bl block mb-2.5">
                      {acad.role}
                    </span>

                    <p className="text-xs text-ink-2 leading-relaxed font-medium">
                      {acad.description}
                    </p>
                  </div>

                  {acad.location && (
                    <div className="mt-4 pt-3 border-t border-line/60 flex items-center gap-1 text-[11px] font-mono text-ink-3">
                      <MapPin size={11} className="text-bl shrink-0" />
                      <span className="truncate">{acad.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </HomepageSection>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 3: IN THE PRESS — MEDIA ARCHIVE & NEWSPAPER CLIPPINGS
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'press' && (
        <HomepageSection className={cn('bg-canvas-muted', sectionPadLg)}>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <HomepageSectionHeading
                  eyebrow="Print Media & Publications"
                  title="In the"
                  accent="PRESS"
                  description="Verified newspaper features, state competition articles, and published event coverage."
                />
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-surface p-1 rounded-md border border-line">
                {[
                  { id: 'all', label: `All Press (${PRESS_ITEMS.length})` },
                  { id: 'newspaper', label: 'Newspaper Clippings' },
                  { id: 'stage', label: 'Photo Archives' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPressFilter(tab.id as 'all' | 'newspaper' | 'stage')}
                    className={cn(
                      'px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer',
                      pressFilter === tab.id
                        ? 'bg-ink text-surface shadow-xs'
                        : 'text-ink-3 hover:text-ink hover:bg-canvas'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Press Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredPress.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActivePressModal(item)}
                  className="group relative rounded-md border border-line bg-surface overflow-hidden cursor-pointer shadow-xs hover:border-bl/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
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
                        <ZoomIn size={14} /> View
                      </span>
                    </div>
                  </div>

                  <div className="p-3 border-t border-line/60 bg-surface">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-bl font-bold block truncate">
                      {item.publication}
                    </span>
                    <h4 className="font-bold text-xs text-ink truncate mt-0.5">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </HomepageSection>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION: OFFICIAL SOCIAL MEDIA & COMMUNITY HUB (From original page)
      ═══════════════════════════════════════════════════════════════════════ */}
      <HomepageSection className={sectionPadLg}>
        <Reveal>
          <div className="rounded-md border border-line bg-surface p-6 sm:p-10 shadow-sm">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
              <span className="text-[11px] font-mono uppercase tracking-widest text-bl font-bold block">
                Connect &amp; Follow
              </span>
              <h2 className="font-anton text-2xl sm:text-3xl md:text-4xl text-ink uppercase tracking-tight">
                Spread the Dance Revolution
              </h2>
              <p className="text-xs sm:text-sm text-ink-2 font-medium leading-relaxed">
                Follow us on the below social platforms and give us a shoutout to spread the dance revolution across Hyderabad and beyond.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOCIAL_CHANNELS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-md border border-line bg-canvas hover:border-bl/60 hover:bg-surface transition-all duration-200 group flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-ink group-hover:text-bl transition-colors">
                        {social.name}
                      </span>
                      <ExternalLink size={14} className="text-ink-3 group-hover:text-bl transition-colors" />
                    </div>

                    <span className="text-xs font-mono text-bl font-bold block mb-2">
                      {social.handle}
                    </span>

                    <p className="text-xs text-ink-3 font-medium leading-relaxed">
                      {social.description}
                    </p>
                  </div>

                  {social.badge && (
                    <div className="mt-4 pt-2.5 border-t border-line/60">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 font-bold">
                        {social.badge}
                      </span>
                    </div>
                  )}
                </a>
              ))}
            </div>

            {/* Direct Studio Admissions Bar */}
            <div className="mt-8 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-anton text-lg text-ink uppercase tracking-wide">
                  Experience Rhythmzz Studio First-Hand
                </h4>
                <p className="text-xs text-ink-3 font-medium">
                  Complimentary trial class for every new learner · Zero admission fees
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href={enrolHref({ intent: 'trial' })}
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs w-full sm:w-auto"
                >
                  <span>Book Free Trial Class</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-line text-ink hover:border-ink/50 bg-surface transition-colors w-full sm:w-auto"
                >
                  <span>Contact Desk</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </HomepageSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL: HIGH-RESOLUTION PRESS ITEM VIEWER
      ═══════════════════════════════════════════════════════════════════════ */}
      {activePressModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActivePressModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface border border-line rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-canvas">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-bold block">
                  {activePressModal.publication}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-ink leading-tight">
                  {activePressModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePressModal(null)}
                className="p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-surface border border-line transition-colors cursor-pointer"
                aria-label="Close press article"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] max-h-[60vh] bg-canvas flex items-center justify-center p-2">
              <div className="relative w-full h-full min-h-[300px] sm:min-h-[420px]">
                <Image
                  src={activePressModal.image}
                  alt={activePressModal.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 border-t border-line bg-surface flex items-center justify-between gap-4">
              <p className="text-xs text-ink-2 font-medium leading-relaxed">
                {activePressModal.description}
              </p>
              <button
                type="button"
                onClick={() => setActivePressModal(null)}
                className="shrink-0 min-h-[36px] px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-canvas border border-line text-ink hover:border-ink/50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
