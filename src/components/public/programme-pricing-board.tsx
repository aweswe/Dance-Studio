'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Calendar,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/public/whatsapp-icon';
import { enrolHref } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';
import { formatInr } from '@/lib/programmes/pricing-display';
import { WaitlistModal } from '@/components/public/waitlist-modal';

interface TierFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  id: 'monthly' | 'quarterly' | 'half-yearly';
  name: string;
  periodLabel: string;
  price: number;
  equivalentMonthly?: number;
  savings?: number;
  badge?: string;
  features: TierFeature[];
}

interface ProgrammeTab {
  id: string;
  name: string;
  tabLabel: string;
  tabIcon: string;
  slug: string;
  image?: string;
  headline: string;
  tags: { label: string; highlight?: boolean }[];
  schedule: string;
  dropInFee: number;
  tiers: PricingTier[];
}

const PROGRAMMES: ProgrammeTab[] = [
  {
    id: 'kids-dance',
    name: 'Kids Dance',
    tabLabel: 'Kids Dance',
    tabIcon: '🕺',
    slug: 'kids-dance',
    image: '/images/programmes/kids-programme-cover.jpg',
    headline: 'KIDS DANCE PROGRAMME',
    tags: [
      { label: 'BOLLYWOOD' },
      { label: 'HIP HOP' },
      { label: 'FREESTYLE' },
      { label: 'AGES 3.5 – 12 YRS' },
      { label: 'ALL SKILL LEVELS', highlight: true },
    ],
    schedule: 'Mon - Wed · 5 - 7 PM',
    dropInFee: 300,
    tiers: [
      {
        id: 'monthly',
        name: 'MONTHLY',
        periodLabel: 'per month',
        price: 2000,
        features: [
          { text: '12 classes per month', included: true },
          { text: 'Attendance tracking', included: true },
          { text: 'Performance showcase invite', included: true },
          { text: 'Free uniform kit (after 1 month)', included: false },
        ],
      },
      {
        id: 'quarterly',
        name: 'QUARTERLY',
        periodLabel: 'per 3 months',
        price: 5000,
        equivalentMonthly: 1667,
        savings: 1000,
        badge: 'MOST POPULAR',
        features: [
          { text: '36 classes over 3 months', included: true },
          { text: 'Attendance tracking', included: true },
          { text: 'Performance showcase invite', included: true },
          { text: 'Free uniform kit (after 1 month)', included: true },
        ],
      },
      {
        id: 'half-yearly',
        name: 'HALF-YEARLY',
        periodLabel: 'per 6 months',
        price: 9500,
        equivalentMonthly: 1583,
        savings: 2500,
        badge: 'BEST VALUE',
        features: [
          { text: '72 classes over 6 months', included: true },
          { text: 'Attendance tracking', included: true },
          { text: 'Performance showcase invite', included: true },
          { text: 'Free uniform kit (after 1 month)', included: true },
        ],
      },
    ],
  },
  {
    id: 'adults-dance',
    name: 'Adults Dance',
    tabLabel: 'Adults Dance',
    tabIcon: '💃',
    slug: 'adults-dance',
    image: '/images/programmes/adults-programme-cover.jpg',
    headline: 'ADULTS DANCE PROGRAMME',
    tags: [
      { label: 'BOLLYWOOD' },
      { label: 'HIP HOP' },
      { label: 'CHOREOGRAPHY' },
      { label: 'AGES 13+ YRS' },
      { label: 'BEGINNER TO ADVANCED', highlight: true },
    ],
    schedule: 'Mon - Wed · 7 - 9 PM',
    dropInFee: 300,
    tiers: [
      {
        id: 'monthly',
        name: 'MONTHLY',
        periodLabel: 'per month',
        price: 2500,
        features: [
          { text: '12 classes per month', included: true },
          { text: 'Attendance tracking', included: true },
          { text: 'Performance showcase & shoot invite', included: true },
          { text: 'Studio practice credit', included: false },
          { text: 'Priority workshop access', included: false },
        ],
      },
      {
        id: 'quarterly',
        name: 'QUARTERLY',
        periodLabel: 'per 3 months',
        price: 6000,
        equivalentMonthly: 2000,
        savings: 1500,
        badge: 'MOST POPULAR',
        features: [
          { text: '36 classes over 3 months', included: true },
          { text: 'Attendance tracking', included: true },
          { text: 'Performance showcase & shoot invite', included: true },
          { text: 'Studio practice credit', included: true },
          { text: 'Priority workshop access', included: false },
        ],
      },
      {
        id: 'half-yearly',
        name: 'HALF-YEARLY',
        periodLabel: 'per 6 months',
        price: 11000,
        equivalentMonthly: 1833,
        savings: 4000,
        badge: 'BEST VALUE',
        features: [
          { text: '72 classes over 6 months', included: true },
          { text: 'Attendance tracking', included: true },
          { text: 'Performance showcase & shoot invite', included: true },
          { text: 'Studio practice credit', included: true },
          { text: 'Priority workshop access', included: true },
        ],
      },
    ],
  },
  {
    id: 'mind-body-fitness',
    name: 'Mind & Body Fitness',
    tabLabel: 'Mind & Body Fitness',
    tabIcon: '🔥',
    slug: 'mind-body-fitness',
    image: '/images/studio-training/floorwork-stretch.jpg',
    headline: 'MIND & BODY FITNESS PROGRAMME',
    tags: [
      { label: 'YOGA (1 DAY/WK)' },
      { label: 'ZUMBA (2 DAYS/WK)' },
      { label: 'COMBO PACK (MON-FRI)' },
      { label: 'ALL LEVELS' },
      { label: 'MORNING BATCHES', highlight: true },
    ],
    schedule: 'Mon–Fri 8:30–9:15 AM & 9:30–10:20 AM · Zumba (Mon & Wed) · Yoga (Tue)',
    dropInFee: 300,
    tiers: [
      {
        id: 'monthly',
        name: 'MONTHLY',
        periodLabel: 'per month',
        price: 2500,
        features: [
          { text: 'Complete Mon–Fri Fitness Combo Pack', included: true },
          { text: 'Includes Zumba (2 days) & Yoga (1 day)', included: true },
          { text: 'Cardio, stamina & mobility tracking', included: true },
          { text: 'Morning batches: 8:30 AM & 9:30 AM', included: true },
          { text: 'Monthly guest pass (1 friend)', included: false },
        ],
      },
      {
        id: 'quarterly',
        name: 'QUARTERLY',
        periodLabel: 'per 3 months',
        price: 6000,
        equivalentMonthly: 2000,
        savings: 1500,
        badge: 'MOST POPULAR',
        features: [
          { text: '60+ classes over 3 months', included: true },
          { text: 'Cardio & stamina tracking', included: true },
          { text: 'Mobility & posture drills', included: true },
          { text: '1-on-1 monthly check-in', included: true },
          { text: 'Monthly guest pass (1 friend)', included: true },
        ],
      },
      {
        id: 'half-yearly',
        name: 'HALF-YEARLY',
        periodLabel: 'per 6 months',
        price: 11000,
        equivalentMonthly: 1833,
        savings: 4000,
        badge: 'BEST VALUE',
        features: [
          { text: '120+ classes over 6 months', included: true },
          { text: 'Cardio & stamina tracking', included: true },
          { text: 'Mobility & posture drills', included: true },
          { text: '1-on-1 monthly check-in', included: true },
          { text: 'Monthly guest pass (1 friend)', included: true },
        ],
      },
    ],
  },
  {
    id: 'gymnastics',
    name: 'Gymnastics',
    tabLabel: 'Gymnastics',
    tabIcon: '🤸',
    slug: 'gymnastics',
    image: '/images/team/srikanth-gymnastics-2.jpg',
    headline: 'GYMNASTICS & TUMBLING PROGRAMME',
    tags: [
      { label: 'TUMBLING' },
      { label: 'ACROBATICS' },
      { label: 'FLEXIBILITY' },
      { label: 'AGES 3.5 – 12 YRS' },
      { label: 'SAFETY CERTIFIED', highlight: true },
    ],
    schedule: 'Thu & Sat · 5:15 - 6:15 PM',
    dropInFee: 300,
    tiers: [
      {
        id: 'monthly',
        name: 'MONTHLY',
        periodLabel: 'per month',
        price: 1000,
        features: [
          { text: '8 classes per month (Thu & Sat)', included: true },
          { text: 'Safety-certified tumbling mats', included: true },
          { text: 'Flexibility & balance assessment', included: true },
          { text: 'Acrobatic progression badge', included: false },
          { text: 'Showcase routine slot', included: false },
        ],
      },
      {
        id: 'quarterly',
        name: 'QUARTERLY',
        periodLabel: 'per 3 months',
        price: 2500,
        equivalentMonthly: 833,
        savings: 500,
        badge: 'MOST POPULAR',
        features: [
          { text: '24 classes over 3 months', included: true },
          { text: 'Safety-certified tumbling mats', included: true },
          { text: 'Flexibility & balance assessment', included: true },
          { text: 'Acrobatic progression badge', included: true },
          { text: 'Showcase routine slot', included: false },
        ],
      },
      {
        id: 'half-yearly',
        name: 'HALF-YEARLY',
        periodLabel: 'per 6 months',
        price: 4500,
        equivalentMonthly: 750,
        savings: 1500,
        badge: 'BEST VALUE',
        features: [
          { text: '48 classes over 6 months', included: true },
          { text: 'Safety-certified tumbling mats', included: true },
          { text: 'Flexibility & balance assessment', included: true },
          { text: 'Acrobatic progression badge', included: true },
          { text: 'Showcase routine slot', included: true },
        ],
      },
    ],
  },
];

const KUCHIPUDI_DATA = {
  name: 'KUCHIPUDI CLASSICAL DANCE',
  subtext: 'IAO-Accredited Classical Academy · Fri & Sat · 6:30 - 7:30 PM',
  slug: 'kuchipudi',
  image: '/images/programmes/kuchipudi-programme-cover.jpg',
  kidsTiers: [
    {
      id: 'monthly' as const,
      name: 'MONTHLY',
      periodLabel: 'per month',
      price: 2000,
      features: [
        { text: '8 classes per month', included: true },
        { text: 'Structured syllabus', included: true },
        { text: 'Stage performance access', included: true },
        { text: 'Exam/certification prep', included: false },
        { text: 'Costume guidance', included: false },
      ],
    },
    {
      id: 'quarterly' as const,
      name: 'QUARTERLY',
      periodLabel: 'per 3 months',
      price: 5000,
      equivalentMonthly: 1667,
      savings: 1000,
      badge: 'MOST POPULAR',
      features: [
        { text: '24 classes over 3 months', included: true },
        { text: 'Structured syllabus', included: true },
        { text: 'Stage performance access', included: true },
        { text: 'Exam/certification prep', included: true },
        { text: 'Costume guidance', included: false },
      ],
    },
    {
      id: 'half-yearly' as const,
      name: 'HALF-YEARLY',
      periodLabel: 'per 6 months',
      price: 9500,
      equivalentMonthly: 1583,
      savings: 2500,
      badge: 'BEST VALUE',
      features: [
        { text: '48 classes over 6 months', included: true },
        { text: 'Structured syllabus', included: true },
        { text: 'Stage performance access', included: true },
        { text: 'Exam/certification prep', included: true },
        { text: 'Costume & stage guidance', included: true },
      ],
    },
  ],
  adultsTiers: [
    {
      id: 'monthly' as const,
      name: 'MONTHLY',
      periodLabel: 'per month',
      price: 2500,
      features: [
        { text: '8 classes per month', included: true },
        { text: 'Structured syllabus', included: true },
        { text: 'Stage performance access', included: true },
        { text: 'Exam/certification prep', included: false },
        { text: 'Costume guidance', included: false },
      ],
    },
    {
      id: 'quarterly' as const,
      name: 'QUARTERLY',
      periodLabel: 'per 3 months',
      price: 6000,
      equivalentMonthly: 2000,
      savings: 1500,
      badge: 'MOST POPULAR',
      features: [
        { text: '24 classes over 3 months', included: true },
        { text: 'Structured syllabus', included: true },
        { text: 'Stage performance access', included: true },
        { text: 'Exam/certification prep', included: true },
        { text: 'Costume guidance', included: false },
      ],
    },
    {
      id: 'half-yearly' as const,
      name: 'HALF-YEARLY',
      periodLabel: 'per 6 months',
      price: 11000,
      equivalentMonthly: 1833,
      savings: 4000,
      badge: 'BEST VALUE',
      features: [
        { text: '48 classes over 6 months', included: true },
        { text: 'Structured syllabus', included: true },
        { text: 'Stage performance access', included: true },
        { text: 'Exam/certification prep', included: true },
        { text: 'Costume & stage guidance', included: true },
      ],
    },
  ],
};

export function ProgrammePricingBoard() {
  const [activeTabId, setActiveTabId] = useState<string>('kids-dance');
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistTrack, setWaitlistTrack] = useState('Upcoming Certification Courses');
  const [kuchipudiAgeGroup, setKuchipudiAgeGroup] = useState<'kids' | 'adults'>('kids');
  const activeProgramme = PROGRAMMES.find((p) => p.id === activeTabId) || PROGRAMMES[0];

  const currentKuchipudiTiers =
    kuchipudiAgeGroup === 'kids' ? KUCHIPUDI_DATA.kidsTiers : KUCHIPUDI_DATA.adultsTiers;

  const handleOpenWaitlist = (track?: string) => {
    setWaitlistTrack(track || 'Upcoming Certification Courses');
    setWaitlistOpen(true);
  };

  const isKidsDance = activeProgramme.id === 'kids-dance' || activeProgramme.slug === 'kids-dance';
  const isGymnastics = activeProgramme.id === 'gymnastics' || activeProgramme.slug === 'gymnastics';
  const isAdults = activeProgramme.id === 'adults-dance' || activeProgramme.slug === 'adults-dance';
  const isFitness = activeProgramme.id === 'mind-body-fitness' || activeProgramme.slug === 'mind-body-fitness';
  const siblingFee = isGymnastics ? 1500 : 3500;
  const annualFee = isGymnastics ? 8000 : 18000;
  const annualSavings = isGymnastics ? 4000 : 6000;
  const allAccessFee = isAdults ? 5000 : 2500;

  const dropInWaHref = whatsappLink(
    `Hi Rhythmzz! I'd like to book a Drop-in single class for ${activeProgramme.name} (₹${activeProgramme.dropInFee}). Please confirm upcoming batch timing.`,
  );

  const siblingWaHref = whatsappLink(
    `Hi Rhythmzz! I'd like to enquire about the Sibling Plan for ${activeProgramme.name} (2 kids · ₹${siblingFee.toLocaleString('en-IN')}/month). Please share batch details.`,
  );

  const annualWaHref = whatsappLink(
    `Hi Rhythmzz! I'd like to lock in the Annual Plan for ${activeProgramme.name} (Full year · ₹${annualFee.toLocaleString('en-IN')}). Please share enrolment details.`,
  );

  const allAccessWaHref = whatsappLink(
    `Hi Rhythmzz! I'd like to enquire about the All-Access Pass (Dance + Gymnastics · ₹2,500/month).`,
  );

  const certificationWaHref = whatsappLink(
    `Hi Rhythmzz! I'd like to enquire about the IAO-Accredited Kuchipudi Classical Certification Course. Please share curriculum and admissions info.`,
  );

  const waitlistWaHref = whatsappLink(
    `Hi Rhythmzz! I'd like to join the waitlist for upcoming Certification courses (Kathak, Contemporary, etc.).`,
  );

  const matchmakerWaHref = whatsappLink(
    `Hi Rhythmzz! I'm not sure which dance plan or batch fits me best. Could you help me choose the right programme?`,
  );

  return (
    <section className="w-full bg-white text-neutral-900 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-[1360px] mx-auto select-none">
      {/* ── TOP HEADER ── */}
      <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <p className="text-bl font-mono font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[10px] sm:text-xs mb-2">
          TRANSPARENT · NO HIDDEN FEES · HYDERABAD&apos;S BEST VALUE
        </p>
        <h2 className="font-anton text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-tight sm:leading-[0.95] text-neutral-950">
          PICK A CLASS.{' '}
          <span className="text-bl">PAY YOUR WAY.</span>
        </h2>
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-neutral-700 font-medium max-w-xl mx-auto leading-relaxed">
          Quarterly saves most · Annual locks in the best rate · First class is on us
        </p>

        {/* First class is on us pill */}
        <div className="mt-3.5 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] sm:text-xs font-bold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>First class is on us — no credit card, no commitment</span>
        </div>
      </header>

      {/* ── CATEGORY SWITCHER TABS ── */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8"
        role="tablist"
        aria-label="Dance Programmes"
      >
        {PROGRAMMES.map((prog) => {
          const isSelected = prog.id === activeTabId;
          return (
            <button
              key={prog.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTabId(prog.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4.5 py-2 sm:py-2.5 rounded-md text-[11px] sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[40px] sm:min-h-[42px] ${
                isSelected
                  ? 'bg-neutral-950 text-white border-2 border-neutral-950 shadow-sm'
                  : 'bg-white border-2 border-neutral-200 text-neutral-800 hover:border-neutral-900 hover:text-black shadow-2xs'
              }`}
            >
              <span className="text-sm">{prog.tabIcon}</span>
              <span>{prog.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ── ACTIVE PROGRAMME HEADER BAR ── */}
      <div className="rounded-md border-2 border-neutral-200 bg-neutral-50 p-4 sm:px-6 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {activeProgramme.image && (
            <div className="relative h-14 w-20 sm:h-16 sm:w-24 rounded-md overflow-hidden border border-neutral-300 shadow-2xs shrink-0 bg-neutral-200">
              <Image
                src={activeProgramme.image}
                alt={activeProgramme.name}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-anton text-lg sm:text-xl uppercase tracking-wide text-neutral-950">
              {activeProgramme.headline}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeProgramme.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase border ${
                    tag.highlight
                      ? 'bg-bl/15 border-bl/40 text-neutral-950 font-bold'
                      : 'bg-white border-neutral-300 text-neutral-800'
                  }`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white border border-neutral-300 text-xs text-neutral-900 font-bold self-start md:self-auto shrink-0 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-bl" />
          <span>{activeProgramme.schedule}</span>
        </div>
      </div>

      {/* ── 3 TIER PRICING CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch mb-5">
        {activeProgramme.tiers.map((tier) => {
          const isQuarterly = tier.id === 'quarterly';
          const isHalfYearly = tier.id === 'half-yearly';

          const cardClasses = isQuarterly
            ? 'relative rounded-md border-2 border-bl bg-white p-6 flex flex-col justify-between shadow-[0_4px_24px_-4px_rgba(43,180,216,0.25)] transition-all'
            : isHalfYearly
            ? 'relative rounded-md border-2 border-amber-500 bg-white p-6 flex flex-col justify-between shadow-[0_4px_24px_-4px_rgba(245,158,11,0.25)] transition-all'
            : 'relative rounded-md border-2 border-neutral-200 bg-white p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-neutral-400 hover:shadow-md transition-all';

          return (
            <div key={tier.id} className={cardClasses}>
              {/* Floating Badges */}
              {tier.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm whitespace-nowrap ${
                    isQuarterly ? 'bg-bl text-slate-950 font-extrabold' : 'bg-amber-500 text-neutral-950'
                  }`}
                >
                  {isQuarterly ? '⭐ MOST POPULAR' : '🏆 BEST VALUE'}
                </div>
              )}

              <div>
                <div className="mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 block mb-1">
                    {tier.name}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-anton text-4xl sm:text-5xl text-neutral-950 tracking-tight leading-none">
                      {formatInr(tier.price)}
                    </span>
                    <span className="text-xs text-neutral-600 font-bold ml-0.5">
                      {tier.periodLabel}
                    </span>
                  </div>

                  {tier.equivalentMonthly && (
                    <p className="text-xs text-neutral-700 font-semibold mt-1.5">
                      Equivalent to {formatInr(tier.equivalentMonthly)}/month
                    </p>
                  )}

                  {tier.savings && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-extrabold">
                      + You save {formatInr(tier.savings)}
                    </span>
                  )}
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-2.5 my-5 text-xs sm:text-[13px] border-t border-neutral-200 pt-4">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5">
                      {feat.included ? (
                        <span className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-500 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 stroke-[2]" />
                        </span>
                      )}
                      <span className={feat.included ? 'text-neutral-900 font-medium' : 'text-neutral-500 line-through decoration-neutral-400 font-medium'}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-2">
                <Link
                  href={enrolHref({
                    programme: activeProgramme.slug,
                    intent: 'pay',
                    plan: tier.id,
                    fee: tier.price,
                  })}
                  className={
                    isQuarterly
                      ? 'w-full min-h-[44px] h-11 px-5 rounded-md bg-bl hover:bg-bl-deep text-slate-950 hover:text-slate-950 font-extrabold uppercase text-[11px] tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]'
                      : isHalfYearly
                      ? 'w-full min-h-[44px] h-11 px-5 rounded-md bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold uppercase text-[11px] tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]'
                      : 'w-full min-h-[44px] h-11 px-5 rounded-md bg-neutral-950 hover:bg-black text-white font-bold uppercase text-[11px] tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]'
                  }
                >
                  <span>Book this plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>

                <Link
                  href={enrolHref({ programme: activeProgramme.slug, intent: 'trial' })}
                  className="w-full min-h-[44px] h-11 px-5 rounded-md bg-white hover:bg-neutral-50 border-2 border-neutral-300 text-neutral-900 font-bold uppercase text-[10px] tracking-wider flex items-center justify-center transition-all active:scale-[0.98]"
                >
                  First class is on us
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DROP-IN SINGLE CLASS BAR ── */}
      <div className="rounded-md border-2 border-amber-400 bg-amber-50/50 p-5 sm:px-7 flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900">
              DROP-IN · SINGLE CLASS
            </span>
            <span className="text-neutral-300 font-mono text-xs">/</span>
            <span className="text-[11px] font-bold text-neutral-600">
              No membership required
            </span>
          </div>
          <h4 className="font-anton text-xl sm:text-2xl text-neutral-950 uppercase tracking-tight">
            Try a single class
          </h4>
          <p className="text-xs sm:text-[13px] text-neutral-700 font-medium max-w-2xl leading-relaxed">
            Walk into any regular batch. Pay per class at the desk or online — if you join a plan afterwards, the drop-in fee is adjusted into your fee.
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-amber-200">
          <div className="text-left md:text-right">
            <span className="font-anton text-3xl sm:text-4xl text-neutral-950 leading-none block">
              ₹{activeProgramme.dropInFee}
            </span>
            <span className="text-[11px] text-neutral-600 font-medium">single session</span>
          </div>
          <Link
            href={enrolHref({
              programme: activeProgramme.slug,
              intent: 'pay',
              plan: 'drop-in',
              fee: activeProgramme.dropInFee,
            })}
            className="min-h-[44px] h-11 px-5 rounded-md bg-neutral-950 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap shadow-xs"
          >
            <span>Book Drop-In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── SPECIAL & ALL-ACCESS PLANS ── */}
      <div className="mb-14">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-900 mb-3">
          SPECIAL &amp; ALL-ACCESS PLANS
        </p>
        <div className={isFitness ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" : "grid grid-cols-1 md:grid-cols-3 gap-4"}>
          {isGymnastics ? (
            <>
              {/* 1. Sibling Plan (₹1,500 - Lowest) */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'sibling',
                  fee: siblingFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">👨‍👩‍👧</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Sibling Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    2 kids (3.5 – 12 yrs) from same family · Monthly
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(siblingFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save ₹500/mo
                  </span>
                </div>
              </Link>

              {/* 2. All-Access Pass (₹2,500 - Middle) */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'all-access',
                  fee: allAccessFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎟️</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      All-Access Pass
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    Dance + Gymnastics · Monthly
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(allAccessFee)}
                  </span>
                  <span className="text-[11px] text-neutral-600 font-bold">/month</span>
                </div>
              </Link>

              {/* 3. Annual Plan (₹8,000 - Highest) */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'annual',
                  fee: annualFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Annual Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    Lock in the best rate · Full year
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(annualFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save {formatInr(annualSavings)}
                  </span>
                </div>
              </Link>
            </>
          ) : isAdults ? (
            <>
              {/* Adults: All-Access ₹5,000 */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'all-access',
                  fee: allAccessFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎟️</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      All-Access Pass
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    Unlimited classes in any batches
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(allAccessFee)}
                  </span>
                  <span className="text-[11px] text-neutral-600 font-bold">/month</span>
                </div>
              </Link>

              {/* Adults: Sibling Plan */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'sibling',
                  fee: siblingFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">👨‍👩‍👧</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Sibling Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    2 students from same family · Monthly
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(siblingFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save ₹500/mo
                  </span>
                </div>
              </Link>

              {/* Adults: Annual Plan */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'annual',
                  fee: annualFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Annual Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    Lock in the best rate · Full year
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(annualFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save {formatInr(annualSavings)}
                  </span>
                </div>
              </Link>
            </>
          ) : isFitness ? (
            <>
              {/* Fitness: Yoga standalone (₹1,000 - Smallest) */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'yoga',
                  fee: 1000,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧘</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Yoga
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    1 day a week · Tuesday · 9:30 AM
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(1000)}
                  </span>
                  <span className="text-[11px] text-neutral-600 font-bold">/month</span>
                </div>
              </Link>

              {/* Fitness: Zumba standalone (₹1,500 - Second) */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'zumba',
                  fee: 1500,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">💃</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Zumba
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    2 days a week · Mon &amp; Wed · 8:30 &amp; 9:30 AM
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(1500)}
                  </span>
                  <span className="text-[11px] text-neutral-600 font-bold">/month</span>
                </div>
              </Link>

              {/* Fitness: Sibling Plan */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'sibling',
                  fee: siblingFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">👨‍👩‍👧</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Sibling Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    2 students from same family · Monthly
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(siblingFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save ₹500/mo
                  </span>
                </div>
              </Link>

              {/* Fitness: Annual Plan */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'annual',
                  fee: annualFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Annual Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    Lock in the best rate · Full year
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(annualFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save {formatInr(annualSavings)}
                  </span>
                </div>
              </Link>
            </>
          ) : (
            <>
              {/* Kids Dance: All-Access ₹2,500 + Sibling + Annual */}
              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'all-access',
                  fee: allAccessFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎟️</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      All-Access Pass
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    Dance + Gymnastics · Monthly
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(allAccessFee)}
                  </span>
                  <span className="text-[11px] text-neutral-600 font-bold">/month</span>
                </div>
              </Link>

              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'sibling',
                  fee: siblingFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">👨‍👩‍👧</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Sibling Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    2 kids (3.5 – 12 yrs) from same family · Monthly
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(siblingFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save ₹500/mo
                  </span>
                </div>
              </Link>

              <Link
                href={enrolHref({
                  programme: activeProgramme.slug,
                  intent: 'pay',
                  plan: 'annual',
                  fee: annualFee,
                })}
                className="rounded-md border border-neutral-200 bg-white hover:border-neutral-400 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="text-sm font-bold text-neutral-950 group-hover:text-bl transition-colors">
                      Annual Plan
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1">
                    Lock in the best rate · Full year
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-anton text-2xl text-neutral-950 block leading-tight">
                    {formatInr(annualFee)}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    Save {formatInr(annualSavings)}
                  </span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── CERTIFICATION COURSES SECTION ── */}
      <div className="pt-10 border-t border-neutral-200">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <p className="text-amber-800 font-mono font-bold uppercase tracking-[0.22em] text-[11px] sm:text-xs mb-2">
            IAO-ACCREDITED · LEVELLED SYLLABUS · STAGE PERFORMANCE
          </p>
          <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-[0.95] text-neutral-950">
            CERTIFICATION COURSES
          </h3>
          <p className="mt-3 text-sm sm:text-base text-neutral-700 font-medium max-w-xl mx-auto leading-relaxed">
            Structured programmes that lead to an internationally recognised IAO certificate — for students serious about mastering their art.
          </p>
        </div>

        {/* Kuchipudi Classical Box */}
        <div className="rounded-md border-2 border-neutral-900 bg-white p-6 sm:p-8 relative shadow-sm">
          {/* Box Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-20 sm:h-16 sm:w-24 rounded-md overflow-hidden border border-neutral-300 shadow-2xs shrink-0 bg-neutral-200">
                <Image
                  src={KUCHIPUDI_DATA.image}
                  alt={KUCHIPUDI_DATA.name}
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-anton text-xl sm:text-2xl uppercase tracking-wide text-neutral-950">
                    {KUCHIPUDI_DATA.name}
                  </h4>
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-neutral-950 text-white text-[10px] font-extrabold uppercase tracking-wider">
                      IAO ACCREDITED
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-900 text-[10px] font-bold uppercase tracking-wider">
                      CLASSICAL ART
                    </span>
                  </div>
                </div>
                <p className="text-xs text-neutral-800 font-medium mt-1">
                  {KUCHIPUDI_DATA.subtext}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-neutral-200 pb-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral-900">
                MONTHLY ENROLMENT
              </p>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">
                {kuchipudiAgeGroup === 'kids'
                  ? 'Kids Foundation & Core Batch · Ages 3.5 – 12 yrs'
                  : 'Adults Intensive & Repertoire Batch · Ages 13+ yrs'}
              </p>
            </div>

            {/* Kids / Adults Toggle */}
            <div className="inline-flex items-center p-1 rounded-md bg-neutral-100 border border-neutral-300 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setKuchipudiAgeGroup('kids')}
                className={`px-3.5 py-1.5 rounded text-xs font-extrabold transition-all cursor-pointer ${
                  kuchipudiAgeGroup === 'kids'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950'
                }`}
              >
                Kids (3.5 – 12 yrs)
              </button>
              <button
                type="button"
                onClick={() => setKuchipudiAgeGroup('adults')}
                className={`px-3.5 py-1.5 rounded text-xs font-extrabold transition-all cursor-pointer ${
                  kuchipudiAgeGroup === 'adults'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950'
                }`}
              >
                Adults (13+ yrs)
              </button>
            </div>
          </div>

          {/* Kuchipudi 3 Tiers (Kids or Adults based on toggle) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch mb-6">
            {currentKuchipudiTiers.map((tier) => {
              const isQuarterly = tier.id === 'quarterly';
              const isHalfYearly = tier.id === 'half-yearly';

              const cardClasses = isQuarterly
                ? 'relative rounded-md border-2 border-bl bg-white p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(43,180,216,0.25)]'
                : isHalfYearly
                ? 'relative rounded-md border-2 border-amber-500 bg-white p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(245,158,11,0.25)]'
                : 'relative rounded-md border-2 border-neutral-200 bg-white p-5 sm:p-6 flex flex-col justify-between shadow-2xs';

              return (
                <div key={tier.id} className={cardClasses}>
                  {tier.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm whitespace-nowrap ${
                        isQuarterly ? 'bg-bl text-slate-950 font-extrabold' : 'bg-amber-500 text-neutral-950'
                      }`}
                    >
                      {isQuarterly ? '⭐ MOST POPULAR' : '🏆 BEST VALUE'}
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 block mb-1">
                      {tier.name}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-anton text-3xl sm:text-4xl text-neutral-950 tracking-tight leading-none">
                        {formatInr(tier.price)}
                      </span>
                      <span className="text-xs text-neutral-600 font-bold">
                        {tier.periodLabel}
                      </span>
                    </div>

                    {tier.equivalentMonthly && (
                      <p className="text-xs text-neutral-700 font-semibold mt-1">
                        Equivalent to {formatInr(tier.equivalentMonthly)}/month
                      </p>
                    )}

                    {tier.savings && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold">
                        + You save {formatInr(tier.savings)}
                      </span>
                    )}

                    <ul className="space-y-2 my-5 text-xs border-t border-neutral-200 pt-4">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          {feat.included ? (
                            <span className="w-3.5 h-3.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-500 flex items-center justify-center shrink-0">
                              <X className="w-2.5 h-2.5 stroke-[2]" />
                            </span>
                          )}
                          <span className={feat.included ? 'text-neutral-900 font-medium' : 'text-neutral-500 line-through decoration-neutral-400 font-medium'}>
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Link
                      href={enrolHref({
                        programme: KUCHIPUDI_DATA.slug,
                        intent: 'pay',
                        plan: tier.id,
                        fee: tier.price,
                      })}
                      className={
                        isQuarterly
                          ? 'w-full min-h-[44px] h-11 px-4 rounded-md bg-bl hover:bg-bl-deep text-slate-950 hover:text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]'
                          : isHalfYearly
                          ? 'w-full min-h-[44px] h-11 px-4 rounded-md bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]'
                          : 'w-full min-h-[44px] h-11 px-4 rounded-md bg-neutral-950 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]'
                      }
                    >
                      <span>Book this plan</span>
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </Link>

                    <Link
                      href={enrolHref({ programme: KUCHIPUDI_DATA.slug, intent: 'trial' })}
                      className="w-full min-h-[44px] h-11 px-4 rounded-md bg-white hover:bg-neutral-50 border-2 border-neutral-300 text-neutral-900 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center transition-all active:scale-[0.98]"
                    >
                      First class is on us
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certification CTA */}
          <div className="mt-4 pt-6 border-t border-neutral-200 text-center">
            <a
              href={certificationWaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-[11px] uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm shadow-amber-500/20"
            >
              <span>Enquire about certification</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
            <p className="text-xs text-neutral-600 font-medium mt-2">
              Placement test available · Prior experience considered · Batches fill fast
            </p>
          </div>
        </div>

        {/* Waitlist footer link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => handleOpenWaitlist('Upcoming Certification Courses (Kathak, Contemporary, etc.)')}
            className="text-xs text-neutral-700 hover:text-black font-semibold transition-colors inline-flex items-center gap-1 group cursor-pointer"
          >
            <span>More certification programmes coming soon —</span>
            <span className="text-bl font-bold underline underline-offset-4 group-hover:text-black">
              Join the waitlist →
            </span>
          </button>
        </div>
      </div>

      {/* ── TRUST BADGES STRIP ── */}
      <div className="mt-12 rounded-md border-2 border-neutral-200 bg-neutral-50 py-4 px-6 flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-neutral-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>7-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-700" />
          <span>IAO Accredited since 2014</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-bl" />
          <span>5,000+ students trained</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>Neredmet X Road, Secunderabad</span>
        </div>
      </div>

      {/* ── MATCHMAKER / WHATSAPP CONSULTATION BANNER ── */}
      <div className="mt-6 rounded-md border-2 border-emerald-300 bg-emerald-50 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
        <div>
          <h4 className="font-bold text-base sm:text-lg text-emerald-950">
            Not sure which plan fits you?
          </h4>
          <p className="text-xs sm:text-sm text-emerald-900 font-medium mt-1">
            Message us — we&apos;ll match you to the right programme and batch in under 5 minutes.
          </p>
        </div>

        <a
          href={matchmakerWaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-3 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all active:scale-[0.98] border border-emerald-600/30 shadow-xs whitespace-nowrap"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0 fill-current" />
          <span>WhatsApp Us Now</span>
        </a>
      </div>

      {/* ── FOOTER DISCLAIMER ── */}
      <p className="text-xs text-neutral-600 font-medium text-center mt-8 pb-2 leading-relaxed">
        Fees due by 7th of each month. · No-questions-asked 7-day refund on your first plan · All prices include studio access · Gear available separately
      </p>

      {/* ── REAL INTERACTIVE WAITLIST MODAL ── */}
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        defaultProgramme={waitlistTrack}
      />
    </section>
  );
}
