import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProgrammeBySlug } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { Clock, Calendar, IndianRupee, MapPin, ArrowUpRight } from 'lucide-react';
import { enrolHref, SITE_URL, ROUTES } from '@/lib/utils/constants';
import { getProgrammeSchedule } from '@/lib/schedule/from-batches';
import { KuchipudiShowcase } from '@/components/public/kuchipudi-showcase';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaBrand, homepageCtaOutlineLight, homepageCtaPairButton, homepageCtaPairStack } from '@/lib/ui/homepage-cta';
import { sectionPad, sectionPadAfterTitleLg } from '@/lib/ui/section-layout';
import { cn } from '@/lib/utils/cn';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'kids-dance' },
    { slug: 'adults-dance' },
    { slug: 'mind-body-fitness' },
    { slug: 'kuchipudi' },
    { slug: 'gymnastics' },
    { slug: 'classical-dance' },
    { slug: 'commercial-expressive' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme: any = await getProgrammeBySlug(slug);

  if (!programme) {
    return {
      title: 'Programme Not Found',
    };
  }

  if (slug === 'kids-dance') {
    return {
      title: 'Kids Dance Classes (Ages 3.5–12) | Rhythmzz Academy of Dance',
      description:
        'Foundational dance training for children aged 3.5 to 12 in Secunderabad. Bollywood, hip hop, contemporary, freestyle, and gymnastics. Book your free trial class.',
      alternates: { canonical: `${SITE_URL}/programmes/kids-dance` },
    };
  }

  if (slug === 'adults-dance') {
    return {
      title: 'Adults Dance Classes (13+ Years) | Rhythmzz Academy of Dance',
      description:
        'Discover your rhythm, build confidence, and experience the joy of dance at Rhythmzz Academy of Dance. Explore Bollywood, Hip Hop, and Contemporary dance through energetic choreography and structured training—from your first steps to confident performances. No prior dance experience is required.',
      alternates: { canonical: `${SITE_URL}/programmes/adults-dance` },
    };
  }

  if (slug === 'mind-body-fitness') {
    return {
      title: 'Mind & Body Fitness (13+ Years) | Rhythmzz Academy of Dance',
      description:
        'Build strength, improve flexibility, and feel your best with morning fitness, Zumba, yoga, Pilates, Tabata, and personal training at Neredmet X Road, Secunderabad.',
      alternates: { canonical: `${SITE_URL}/programmes/mind-body-fitness` },
    };
  }

  if (slug === 'gymnastics') {
    return {
      title: 'Gymnastics & Tumbling for Kids (Ages 3.5–12) | Rhythmzz Academy of Dance',
      description:
        'Safety-certified gymnastics, tumbling, agility, and flexibility coaching for kids aged 3.5 to 12 at Neredmet X Road, Secunderabad. Free trial class.',
      alternates: { canonical: `${SITE_URL}/programmes/gymnastics` },
    };
  }

  if (slug === 'kuchipudi') {
    return {
      title: 'Kuchipudi Classical Dance Classes | Rhythmzz Academy of Dance',
      description:
        'Structured classical Kuchipudi training under Guru Srushti Nidhi from foundation to Rangapravesham. Year-wise syllabus and accredited certifications.',
      alternates: { canonical: `${SITE_URL}/programmes/kuchipudi` },
    };
  }

  return {
    title: programme.name,
    description: programme.description || `Join our ${programme.name} classes in Secunderabad. Free trial class at Neredmet X Road.`,
    alternates: { canonical: `${SITE_URL}/programmes/${slug}` },
  };
}

const PROGRAMME_DESCRIPTIONS: Record<string, string> = {
  'adults-dance':
    'Discover your rhythm, build confidence, and experience the joy of dance at Rhythmzz Academy of Dance. Explore Bollywood, Hip Hop, and Contemporary dance through energetic choreography and structured training—from your first steps to confident performances. No prior dance experience is required.',
  'mind-body-fitness':
    'Build strength, improve flexibility, and feel your best with Mind & Body Fitness at Rhythmzz Academy of Dance. From Zumba and aerobics to yoga, Pilates, and strength training, our sessions combine energising workouts and mindful movement to support your fitness journey.',
};

const PROGRAMME_NOTES: Record<string, string> = {
  'kids-dance':
    'Monday to Wednesday, 5:00 to 7:00 PM. Ages 3.5 to 12 years. Foundational technique, rhythm, stage confidence, Bollywood routines, hip hop basics, contemporary expression, and foundational gymnastics tailored specifically for young dancers.',
  'adults-dance':
    'Join our adult dance classes in Neredmet, Secunderabad, every Monday to Wednesday, 7:00–9:00 PM. Learn trending Bollywood choreography, Hip Hop foundations, contemporary movement, freestyle, and musicality in a welcoming, high-energy studio environment designed for beginners and experienced dancers alike.',
  'mind-body-fitness':
    'Join our morning fitness classes in Neredmet, Secunderabad, with sessions designed to help you improve stamina, build strength, enhance mobility, and develop a consistent fitness routine. Explore personal training, Zumba, aerobics, yoga, Pilates, Tabata, circuit training, cardio, and goal-oriented workouts in a supportive studio environment.',
  gymnastics:
    'Thursday and Saturday, 5:15 to 6:15 PM. Ages 3.5 to 12 years. Safety-certified tumbling mats, cartwheels, handstand balance, flexibility, and foundational acrobatics.',
  kuchipudi:
    'Friday and Saturday, 6:30 to 7:30 PM. Certified classical Kuchipudi curriculum under Guru Srushti Nidhi. From foundational adavus to Rangapravesham recital milestones.',
  'classical-dance':
    'Friday and Saturday, 6:30 to 7:30 PM. Certified classical dance certification track.',
  'commercial-expressive':
    'Commercial and expressive style choreography batches for all age pathways.',
};

const PROGRAMME_LOCATION_NOTES: Record<string, string> = {
  'adults-dance':
    'Conveniently located at Neredmet X Road, Rhythmzz Academy of Dance welcomes adults from Sainikpuri, AS Rao Nagar, Yapral, Kapra, and nearby areas. Every new learner receives one complimentary trial class, with zero admission fee.',
  'mind-body-fitness':
    'Located at Neredmet X Road, Rhythmzz Academy of Dance welcomes fitness enthusiasts from Sainikpuri, AS Rao Nagar, Yapral, Kapra, and surrounding areas. Every new learner receives one complimentary trial class, with zero admission fee.',
};

const PROGRAMME_HERO_IMAGES: Record<string, { src: string; alt: string }> = {
  'kids-dance': {
    src: '/images/programmes/kids-programme-cover.jpg',
    alt: 'Kids dance foundation and choreography batch at Rhythmzz Academy',
  },
  'adults-dance': {
    src: '/images/programmes/adults-programme-cover.jpg',
    alt: 'Adults dance batch and commercial choreography at Rhythmzz Academy',
  },
  'mind-body-fitness': {
    src: '/images/studio-training/floorwork-stretch.jpg',
    alt: 'Mind and body fitness, yoga and Zumba at Rhythmzz',
  },
  gymnastics: {
    src: '/images/team/srikanth-gymnastics-2.jpg',
    alt: 'Gymnastics and tumbling training at Rhythmzz Academy',
  },
  kuchipudi: {
    src: '/images/programmes/kuchipudi-programme-cover.jpg',
    alt: 'Kuchipudi classical dance recital and stage performance',
  },
  'classical-dance': {
    src: '/images/programmes/kuchipudi-programme-cover.jpg',
    alt: 'Structured level-based classical dance certification',
  },
  'commercial-expressive': {
    src: '/images/programmes/kids-programme-cover.jpg',
    alt: 'Commercial and Expressive Style dance training at Rhythmzz Academy',
  },
};

const PROGRAMME_CURRICULUM: Record<string, string[]> = {
  'kids-dance': [
    'Dance & Choreography',
    'Foundations & Grooves',
    'Rhythm, Musicality & Beat Recognition',
    'Basic Dance Technique & Body Control',
    'Stage Confidence & Performance Skills',
    'Movement & Creative Expression',
    'Foundational Gymnastics & Movement Skills',
    'Discipline, Focus & Self-Confidence',
  ],
  'adults-dance': [
    'Bollywood Choreography & Trending Music',
    'Hip Hop Foundations & Isolation Techniques',
    'Contemporary Dance Foundation & Creative Expression',
    'Dance Technique, Posture & Body Control',
    'Coordination, Balance & Movement Precision',
    'Confidence, Stage Presence & Performance Skills',
    'Choreography Retention & Step Transitions',
    'Group Routines, Synchronisation & Teamwork',
    'Fitness, Flexibility & Active Movement',
  ],
  'mind-body-fitness': [
    'Personal Training & Individual Fitness Goals',
    'Zumba & Dance-Based Cardio Workouts',
    'Aerobics & Cardiovascular Endurance',
    'Yoga, Flexibility & Mindful Movement',
    'Pilates, Core Strength & Body Control',
    'Tabata & High-Intensity Interval Training',
    'Circuit Training & Full-Body Conditioning',
    'Cardio Workouts & Stamina Development',
    'Goal-Based Workouts & Progress Tracking',
    'Strength Training, Mobility & Functional Fitness',
  ],
};

interface PricingPlanOption {
  id: string;
  name: string;
  price: number;
  period: string;
  badge?: string;
  highlight?: boolean;
  note?: string;
}

function getProgrammePlans(slug: string, programme: any): PricingPlanOption[] {
  if (slug === 'mind-body-fitness') {
    return [
      {
        id: 'monthly',
        name: 'Combo Pack (Monthly)',
        price: 2500,
        period: 'per month',
        badge: 'Mon–Fri 8:30 & 9:30 AM',
        note: 'Complete fitness: Zumba, Yoga, Pilates & HIIT',
      },
      {
        id: 'quarterly',
        name: 'Combo Pack (Quarterly)',
        price: 6000,
        period: 'per 3 months',
        badge: 'Save ₹1,500 · Popular',
        highlight: true,
        note: 'Full 3-month wellness & stamina cycle',
      },
      {
        id: 'half-yearly',
        name: 'Combo Pack (Half-Yearly)',
        price: 11000,
        period: 'per 6 months',
        badge: 'Save ₹4,000 · Best Value',
        note: 'Full 6-month wellness & conditioning cycle',
      },
      {
        id: 'zumba',
        name: 'Zumba Standalone (2 Days/Wk)',
        price: 1500,
        period: 'per month',
        badge: 'Mon & Wed',
        note: 'High-energy Latin dance cardio (8:30 or 9:30 AM)',
      },
      {
        id: 'yoga',
        name: 'Yoga Standalone (1 Day/Wk)',
        price: 1000,
        period: 'per month',
        badge: 'Tuesday 9:30 AM',
        note: 'Flexibility, posture & breathwork conditioning',
      },
      {
        id: 'drop-in',
        name: 'Single Drop-in Session',
        price: 300,
        period: 'per class',
        note: 'Single morning workout session pass',
      },
    ];
  }

  if (slug === 'kids-dance') {
    return [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        price: 2000,
        period: 'per month',
        badge: '12 Classes / Month',
        note: 'Mon–Wed · 5:00–6:00 PM or 6:00–7:00 PM',
      },
      {
        id: 'quarterly',
        name: 'Quarterly Plan',
        price: 5000,
        period: 'per 3 months',
        badge: 'Save ₹1,000 · Most Popular',
        highlight: true,
        note: '36 classes + free academy uniform kit',
      },
      {
        id: 'half-yearly',
        name: 'Half-Yearly Plan',
        price: 9500,
        period: 'per 6 months',
        badge: 'Save ₹2,500 · Best Value',
        note: '72 classes + annual showcase priority',
      },
      {
        id: 'sibling',
        name: 'Sibling Plan',
        price: 3500,
        period: 'per month',
        badge: '2 Kids Enrolled',
        note: 'Save ₹500/mo on joint sibling enrollment',
      },
      {
        id: 'annual',
        name: 'Annual Plan',
        price: 18000,
        period: 'per year',
        badge: 'Save ₹6,000',
        note: 'Full year foundational progression & recitals',
      },
      {
        id: 'drop-in',
        name: 'Single Drop-in Class',
        price: 300,
        period: 'per session',
        note: 'Single trial or practice session pass',
      },
    ];
  }

  if (slug === 'adults-dance') {
    return [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        price: 2500,
        period: 'per month',
        badge: '12 Classes / Month',
        note: 'Mon–Wed · 7:00–8:00 PM or 8:00–9:00 PM',
      },
      {
        id: 'quarterly',
        name: 'Quarterly Plan',
        price: 6000,
        period: 'per 3 months',
        badge: 'Save ₹1,500 · Most Popular',
        highlight: true,
        note: '36 classes + studio shoot video invite',
      },
      {
        id: 'half-yearly',
        name: 'Half-Yearly Plan',
        price: 11000,
        period: 'per 6 months',
        badge: 'Save ₹4,000 · Best Value',
        note: '72 classes + priority workshop access',
      },
      {
        id: 'all-access',
        name: 'All-Access Pass',
        price: 5000,
        period: 'per month',
        badge: 'Unlimited Studio Access',
        note: 'Attend any adult dance & morning fitness batch',
      },
      {
        id: 'annual',
        name: 'Annual Plan',
        price: 18000,
        period: 'per year',
        badge: 'Save ₹12,000',
        note: 'Full 12-month commercial dance immersion',
      },
      {
        id: 'drop-in',
        name: 'Single Drop-in Class',
        price: 300,
        period: 'per session',
        note: 'Single commercial choreography pass',
      },
    ];
  }

  if (slug === 'gymnastics' || slug === 'gymnastic') {
    return [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        price: 1000,
        period: 'per month',
        badge: '8 Classes / Month',
        note: 'Thu & Sat · 5:15–6:15 PM',
      },
      {
        id: 'quarterly',
        name: 'Quarterly Plan',
        price: 2500,
        period: 'per 3 months',
        badge: 'Save ₹500 · Most Popular',
        highlight: true,
        note: '24 classes + progression badge',
      },
      {
        id: 'half-yearly',
        name: 'Half-Yearly Plan',
        price: 4500,
        period: 'per 6 months',
        badge: 'Save ₹1,500 · Best Value',
        note: '48 classes + showcase routine slot',
      },
      {
        id: 'sibling',
        name: 'Sibling Plan',
        price: 1500,
        period: 'per month',
        badge: '2 Kids Enrolled',
        note: 'Save ₹500/mo for two siblings',
      },
      {
        id: 'annual',
        name: 'Annual Plan',
        price: 8000,
        period: 'per year',
        badge: 'Save ₹4,000',
        note: 'Full year tumbling & acrobatic progress',
      },
      {
        id: 'drop-in',
        name: 'Single Drop-in Class',
        price: 300,
        period: 'per session',
        note: 'Single tumbling assessment pass',
      },
    ];
  }

  // Default / Classical Dance
  return [
    {
      id: 'monthly',
      name: 'Kids Monthly',
      price: programme?.fees_monthly || 2000,
      period: 'per month',
      badge: 'Kids: 3.5–12 Years',
      note: 'Fri & Sat · 6:30–7:30 PM',
    },
    {
      id: 'quarterly',
      name: 'Kids Quarterly',
      price: programme?.fees_quarterly || 5000,
      period: 'per 3 months',
      badge: 'Save ₹1,000',
      highlight: true,
      note: 'Full term syllabus & board exams prep',
    },
    {
      id: 'monthly-adult',
      name: 'Adults Monthly',
      price: 2500,
      period: 'per month',
      badge: 'Adults: 13+ Years',
      note: 'Fri & Sat · 6:30–7:30 PM',
    },
    {
      id: 'quarterly-adult',
      name: 'Adults Quarterly',
      price: 6000,
      period: 'per 3 months',
      badge: 'Save ₹1,500',
      note: 'Classical repertoire & abhinaya mastery',
    },
    {
      id: 'half-yearly',
      name: 'Half-Yearly Track',
      price: 9500,
      period: 'per 6 months',
      badge: 'Save ₹2,500 · Best Value',
      note: 'Stage recital & certification milestones',
    },
  ];
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const [programmeRaw, allBatches] = await Promise.all([getProgrammeBySlug(slug), getBatches()]);
  const programme: any = programmeRaw;

  if (!programme) {
    notFound();
  }

  // Fetch active batches directly from the schedule source with full details of trainers, timing, and dates
  const scheduleBatches = await getProgrammeSchedule(slug, allBatches);

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: programme.name,
    description: programme.description,
    provider: {
      '@type': 'Organization',
      name: 'Rhythmzz Academy of Dance',
      sameAs: SITE_URL,
    },
  };

  const includesList =
    PROGRAMME_CURRICULUM[slug] ||
    (programme.includes
      ? typeof programme.includes === 'string'
        ? JSON.parse(programme.includes)
        : programme.includes
      : []);
  const heroImage = PROGRAMME_HERO_IMAGES[slug] || PROGRAMME_HERO_IMAGES['kids-dance'];
  const pricingPlans = getProgrammePlans(slug, programme);

  if (slug === 'kuchipudi') {
    return (
      <PublicPage>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
        <KuchipudiShowcase />
      </PublicPage>
    );
  }

  return (
    <PublicPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <PublicPageTitle
        eyebrow={
          slug === 'adults-dance' || slug === 'mind-body-fitness'
            ? '13+ YEARS'
            : programme.age_group || 'Open batch'
        }
        title={programme.name}
        description={PROGRAMME_DESCRIPTIONS[slug] ?? programme.description}
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="relative h-72 sm:h-96 w-full rounded-md overflow-hidden border border-line">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <HomepageSectionHeading eyebrow="Programme" title="About this discipline" className="mb-0" />
              <div className="text-sm text-ink-2 space-y-4 leading-relaxed">
                <p>{PROGRAMME_NOTES[slug] ?? programme.description}</p>
                <p>
                  {PROGRAMME_LOCATION_NOTES[slug] ??
                    'The studio is located at Neredmet X Road, Secunderabad — 8–15 minutes by drive from Sainikpuri, AS Rao Nagar, and Yapral. Every learner receives one complimentary free trial class with zero admission fee.'}
                </p>
              </div>
            </div>

            {includesList.length > 0 && (
              <div className="flex flex-col gap-3 sm:gap-4">
                <HomepageSectionHeading eyebrow="Curriculum" title="What you'll master" className="mb-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {includesList.map((item: string) => (
                    <div key={item} className="flex gap-3.5 items-center bg-surface p-4 rounded-md border border-line">
                      <span className="w-6 h-6 rounded-md bg-bl/10 text-bl flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </span>
                      <span className="text-sm font-medium text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:gap-4">
              <HomepageSectionHeading eyebrow="Timetable" title="Active batch schedule" className="mb-0" />
              {scheduleBatches.length > 0 ? (
                <div className="space-y-3">
                  {scheduleBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-surface border border-line rounded-md gap-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-ink">
                            {batch.name}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-line/60 text-ink-2 font-medium">
                            {batch.daysShort}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-ink font-semibold text-xs">
                          <Calendar size={15} className="text-bl shrink-0" />
                          <span>{batch.daysDisplay}</span>
                        </div>
                        <div className="flex items-center gap-2 text-ink-2 text-xs">
                          <Clock size={13} className="text-ink-3 shrink-0" />
                          <span>{batch.timeDisplay}</span>
                          <span className="text-ink-3 font-mono">({batch.duration})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {batch.trainer.photoUrl ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-line shrink-0">
                            <Image
                              src={batch.trainer.photoUrl}
                              alt={batch.trainer.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-ink text-bl flex items-center justify-center text-xs font-bold shrink-0">
                            {batch.trainer.initials}
                          </div>
                        )}
                        <div className="text-sm min-w-0">
                          <div className="text-[10px] text-ink-3 font-semibold tracking-wide uppercase">
                            {batch.trainer.role}
                          </div>
                          <div className="font-bold text-xs text-ink truncate">
                            {batch.trainer.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ink-2 bg-surface p-6 rounded-md border border-line text-sm">
                  Schedule details will be updated soon. Contact our desk for upcoming openings.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-md border border-line bg-surface p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <span className="text-xs font-semibold tracking-wide text-bl block">
                    Tuition &amp; Plans
                  </span>
                  <span className="text-xs text-ink-3 font-medium">Official academy rate card</span>
                </div>
                <span className="text-[10px] tracking-wide text-blk font-bold bg-bl px-2.5 py-0.5 rounded-md">
                  Zero Admission Fee
                </span>
              </div>

              {/* Comprehensive, accurate plan suite */}
              <div className="space-y-2.5">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={cn(
                      'p-3.5 rounded-md border transition-all flex flex-col gap-2',
                      plan.highlight
                        ? 'border-bl/50 bg-bl/5'
                        : 'border-line bg-canvas hover:border-line-strong',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold tracking-tight text-ink">
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold',
                                plan.highlight
                                  ? 'bg-bl text-blk font-bold'
                                  : 'bg-surface border border-line text-ink-3',
                              )}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        {plan.note && (
                          <p className="text-[11px] text-ink-3 mt-0.5 leading-snug">{plan.note}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end font-anton text-xl text-ink">
                          <IndianRupee size={14} className="mr-0.5 text-ink-3 inline" />
                          {plan.price.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-ink-3 font-mono block">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-line/60">
                      <Link
                        href={enrolHref({
                          programme: slug,
                          intent: 'pay',
                          plan: plan.id,
                          fee: plan.price,
                        })}
                        className={cn(
                          'w-full min-h-[38px] h-[38px] px-3.5 rounded-md text-xs font-bold tracking-normal flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-xs cursor-pointer',
                          plan.highlight
                            ? 'bg-bl text-slate-950 hover:bg-bl-deep shadow-bl/20'
                            : 'bg-neutral-950 hover:bg-black text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100',
                        )}
                      >
                        <span>Book this plan</span>
                        <ArrowUpRight size={13} strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className={cn(homepageCtaPairStack, 'gap-2.5 pt-2')}>
                <Link
                  href={enrolHref({ programme: slug, intent: 'trial' })}
                  className={cn(homepageCtaBrand, homepageCtaPairButton, 'normal-case text-xs tracking-normal font-bold')}
                >
                  Book Free Trial Class
                </Link>
                <Link
                  href={`/pricing?programme=${slug}`}
                  className={cn(homepageCtaOutlineLight, homepageCtaPairButton, 'normal-case text-xs tracking-normal font-bold')}
                >
                  Compare All Plans &amp; Perks
                </Link>
              </div>
            </div>

            <div className="rounded-md border border-line bg-surface p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold tracking-wide text-ink mb-1">Studio</h3>
                  <p className="text-sm text-ink-2 leading-relaxed">
                    Rhythmzz Academy of Dance, Plot 597, 3rd Floor, Above Jawed Habib, Neredmet X Road, Secunderabad
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-ink-3 border-t border-line pt-3">
                Behind Neredmet X Road Bus Stop · 8–15 mins from Sainikpuri, AS Rao Nagar &amp; Yapral.
              </p>
            </div>
          </div>
        </div>
      </HomepageSection>

      {(slug === 'classical-dance' || slug === 'classical-certification') && (
        <HomepageSection className={sectionPad}>
          <HomepageSectionHeading
            eyebrow="Syllabus"
            title="Kuchipudi, year by year"
            description="Friday and Saturday, 6:30 to 7:30 PM. The full curriculum lives on the syllabus page — not here."
          />
          <Link href={ROUTES.syllabusKuchipudi} className={homepageCtaBrand}>
            Open syllabus
          </Link>
        </HomepageSection>
      )}

      <PublicBookTrialCta />
    </PublicPage>
  );
}
