import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/public/whatsapp-icon';
import { getProgrammes, type ProgrammeItem } from '@/data/programmes';
import {
  homepageCtaPairButton,
  homepageCtaPairStack,
  homepageCtaPrimary,
  homepageCtaWhatsApp,
} from '@/lib/ui/homepage-cta';
import { enrolHref } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';
import {
  formatInr,
  pricingMetaForSlug,
  quarterlySavings,
} from '@/lib/programmes/pricing-display';

function programmeWhatsAppMessage(name: string, monthly: number, quarterly: number) {
  return (
    `Hi Rhythmzz! I'd like to enquire about ${name}.\n` +
    `Monthly: ${formatInr(monthly)} · Quarterly: ${formatInr(quarterly)}.\n` +
    `Please share batch timings and how to book.`
  );
}

function Tier({
  label,
  amount,
  save,
  featured = false,
}: {
  label: string;
  amount: string;
  save?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center rounded-md px-2 py-3 text-center min-h-[68px]',
        featured
          ? 'bg-bl text-blk shadow-[0_6px_28px_-8px_rgba(43,180,216,0.55)]'
          : 'bg-canvas-muted border border-line',
      ].join(' ')}
    >
      <span
        className={`font-anton text-lg leading-none tracking-tight ${featured ? 'text-blk' : 'text-ink'}`}
      >
        {amount}
      </span>
      <span
        className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.11em] ${featured ? 'text-blk/65' : 'text-ink-3'}`}
      >
        {label}
      </span>
      {save && (
        <span className={`mt-0.5 text-[8px] font-semibold ${featured ? 'text-blk/55' : 'text-bl-ink'}`}>
          {save}
        </span>
      )}
    </div>
  );
}

function ProgrammePricingCard({ programme }: { programme: ProgrammeItem }) {
  const meta = pricingMetaForSlug(programme.slug, programme.batches_info);
  const showDropIn = meta.dropIn !== null && meta.dropIn !== undefined;
  const dropIn = meta.dropIn ?? undefined;
  const save = quarterlySavings(programme.fees_monthly, programme.fees_quarterly);
  const waHref = whatsappLink(
    programmeWhatsAppMessage(programme.name, programme.fees_monthly, programme.fees_quarterly),
  );

  return (
    <article className="flex flex-col rounded-md border border-line bg-surface-card shadow-lift p-4 sm:p-5">
      <div className="mb-5 min-w-0">
        <h3 className="font-anton text-lg uppercase leading-tight tracking-tight text-ink">
          {programme.name}
        </h3>
        <p className="mt-1 text-[11px] text-ink-3 leading-snug line-clamp-1">
          {programme.tagline || meta.tagline}
        </p>
        {meta.schedule && (
          <p className="mt-2.5 text-[10px] text-ink-3">{meta.schedule}</p>
        )}
      </div>

      <div className={`grid gap-2.5 mb-6 ${showDropIn ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {showDropIn && dropIn != null && <Tier label="Drop-in" amount={formatInr(dropIn)} />}
        <Tier label="Monthly" amount={formatInr(programme.fees_monthly)} />
        <Tier
          label="Quarterly"
          amount={formatInr(programme.fees_quarterly)}
          save={save > 0 ? `Save ${formatInr(save)}` : undefined}
          featured
        />
      </div>

      <div className={`mt-auto pt-1 ${homepageCtaPairStack}`}>
        <Link
          href={enrolHref({ programme: programme.slug, intent: 'pay' })}
          className={`${homepageCtaPrimary} ${homepageCtaPairButton}`}
        >
          Book &amp; pay
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${homepageCtaWhatsApp} ${homepageCtaPairButton}`}
        >
          <WhatsAppIcon className="size-3.5 shrink-0" />
          WhatsApp enquire
        </a>
      </div>
    </article>
  );
}

const PRICING_CARDS: ProgrammeItem[] = [
  {
    id: 'p-kids',
    name: 'Kids Dance',
    slug: 'kids-dance',
    tagline: 'Bollywood · Hip hop · Contemporary · Ages 5+',
    description: 'Foundational movement, rhythm, and stage confidence for young dancers.',
    styles_highlight: ['Bollywood', 'Hip Hop', 'Contemporary'],
    includes: [],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: 'Ages 5–14',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'p-adults',
    name: 'Adults Dance',
    slug: 'adults-dance',
    tagline: 'Bollywood · Hip hop · Choreography · Ages 16+',
    description: 'Energetic choreography, commercial grooves, and stage performance.',
    styles_highlight: ['Bollywood', 'Hip Hop', 'Choreography'],
    includes: [],
    fees_monthly: 2500,
    fees_quarterly: 6500,
    age_group: 'Ages 15+',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'p-fitness',
    name: 'Mind & Body Fitness',
    slug: 'mind-body-fitness',
    tagline: 'Yoga · Zumba · Dance Fitness · Core Conditioning',
    description: 'Weekday morning workouts to build endurance, strength, and mobility.',
    styles_highlight: ['Yoga', 'Zumba', 'Dance Fitness'],
    includes: [],
    fees_monthly: 2500,
    fees_quarterly: 6500,
    age_group: 'All Levels',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'p-kuchipudi',
    name: 'Kuchipudi Classical',
    slug: 'kuchipudi',
    tagline: 'Level syllabus · Exams · Stage work',
    description: 'Classical Indian dance curriculum with board certifications.',
    styles_highlight: ['Kuchipudi'],
    includes: [],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: 'Ages 5+ to Adults',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'p-gymnastics',
    name: 'Gymnastic',
    slug: 'gymnastics',
    tagline: 'Foundational Tumbling & Acrobatics · Age 4+',
    description: 'Tumbling, core agility, flexibility, and athletic movement.',
    styles_highlight: ['Gymnastics', 'Tumbling', 'Acrobatics'],
    includes: [],
    fees_monthly: 1200,
    fees_quarterly: 3000,
    age_group: 'Ages 4+',
    sort_order: 5,
    is_active: true,
  },
];

export async function ProgrammePricingBoard() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 pt-12 sm:pt-14 md:pt-16 pb-8 sm:pb-10 max-w-[1440px] mx-auto">
      <div className="px-0 sm:px-10 lg:px-12 xl:px-14">
        <header className="mb-7 sm:mb-8 max-w-md">
          <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-ink">
            Pick a class.{' '}
            <span className="text-bl">Pay your way.</span>
          </h2>
          <p className="mt-2.5 text-sm text-ink-3">
            Quarterly saves most · First class is on us
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {PRICING_CARDS.map((programme) => (
            <ProgrammePricingCard key={programme.id} programme={programme} />
          ))}
        </div>
      </div>
    </section>
  );
}
