import Link from 'next/link';
import { HomepageSection } from '@/components/public/homepage-section';
import {
  homepageCardRadius,
  homepageCtaBrand,
  homepageCtaOutlineDark,
  homepageCtaPair,
  homepageCtaPairButton,
} from '@/lib/ui/homepage-cta';
import { sectionPad } from '@/lib/ui/section-layout';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const STORY_STATS = [
  {
    key: 'festival',
    value: '2017',
    label: ['Represented India', 'International Festival'],
    accent: true,
  },
  {
    key: 'performances',
    value: '200+',
    label: ['Stage', 'Performances'],
    accent: false,
  },
  {
    key: 'stats_students',
    value: '5000+',
    label: ['Students', 'Trained'],
    accent: false,
  },
  {
    key: 'stats_years',
    value: '15+',
    label: ['Years', 'Teaching'],
    accent: true,
  },
] as const;

const BLOCK_GAP = 'gap-4 sm:gap-5';
const COL_GAP = 'gap-12 lg:gap-24 xl:gap-28';

interface HomepageAboutSectionProps {
  stats?: { key: string; value: string }[];
  showLearnMore?: boolean;
}

export function HomepageAboutSection({ stats, showLearnMore = true }: HomepageAboutSectionProps) {
  const valueByKey = (stats ?? []).reduce<Record<string, string>>((acc, item) => {
    if (item?.key) acc[item.key] = String(item.value ?? '');
    return acc;
  }, {});

  const highlights = STORY_STATS.map((item) => ({
    ...item,
    value: valueByKey[item.key] || item.value,
  }));

  return (
    <section id="about" className="bg-blk text-wh w-full">
      <HomepageSection className={sectionPad}>
        <div className={cn('grid grid-cols-1 lg:grid-cols-2 items-stretch', COL_GAP)}>
          {/* Copy — title top, CTAs bottom (matches stats grid height) */}
          <div className="flex min-w-0 flex-col gap-6 lg:gap-0 lg:justify-between">
            <div className={cn('flex flex-col', BLOCK_GAP)}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl-light">
                Our story
              </p>
              <h2 className="font-anton text-[clamp(1.75rem,4.5vw,2.75rem)] uppercase leading-[0.93] tracking-tight text-wh">
                15+ years teaching
                <br />
                Hyderabad to <span className="text-bl">dance.</span>
              </h2>
              <div className="space-y-4 text-sm text-wh/65 leading-[1.75] max-w-[34rem]">
                <p>
                  Nitish started Rhythmzz at Neredmet X Road — one room above the ICICI ATM, a
                  handful of neighbourhood kids, and a sprung floor he built himself.
                </p>
                <p>
                  Since then: representing India abroad, Amazon and IPL stages, the Hyderabad Dance
                  Premier League with 1,500+ dancers, and 5,000+ students — from five-year-olds in
                  their first class to adults coming back after years away.
                </p>
              </div>
            </div>

            <div className={cn(homepageCtaPair, 'w-full')}>
              <Link href={ROUTES.enrol} className={`${homepageCtaBrand} ${homepageCtaPairButton}`}>
                Join a class
              </Link>
              {showLearnMore ? (
                <Link href={ROUTES.about} className={`${homepageCtaOutlineDark} ${homepageCtaPairButton}`}>
                  Learn more
                </Link>
              ) : (
                <Link href={ROUTES.contact} className={`${homepageCtaOutlineDark} ${homepageCtaPairButton}`}>
                  Visit us
                </Link>
              )}
            </div>
          </div>

          {/* Stats — stretched to row height so left CTAs meet this baseline */}
          <div className="grid h-full min-h-[17rem] sm:min-h-[19rem] grid-cols-2 auto-rows-fr gap-3 sm:gap-4">
            {highlights.map((item) => (
              <div
                key={item.key}
                className={cn(
                  'flex flex-col items-center justify-center text-center px-4 py-6 sm:px-5 sm:py-7',
                  homepageCardRadius,
                  item.accent
                    ? 'bg-bl/10 border border-bl/20'
                    : 'bg-white/[0.04] border border-white/[0.08]',
                )}
              >
                <p
                  className={cn(
                    'font-anton text-[clamp(2rem,5vw,2.625rem)] leading-none tracking-tight',
                    item.accent ? 'text-bl' : 'text-wh',
                  )}
                >
                  {item.value}
                </p>
                <p className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-wh/40 leading-snug">
                  {item.label[0]}
                  <br />
                  {item.label[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </HomepageSection>
    </section>
  );
}
