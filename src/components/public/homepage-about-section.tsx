import Link from 'next/link';
import { HomepageSection } from '@/components/public/homepage-section';
import {
  homepageCardRadius,
  homepageCtaBrand,
  homepageCtaOutlineDark,
  homepageCtaPair,
  homepageCtaPairButton,
} from '@/lib/ui/homepage-cta';
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

interface HomepageAboutSectionProps {
  stats?: { key: string; value: string }[];
}

export function HomepageAboutSection({ stats }: HomepageAboutSectionProps) {
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
      <HomepageSection className="py-16 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-[4rem] items-center">
          <div className="flex flex-col gap-5 sm:gap-6 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-bl-light">
              Our story
            </p>
            <h2 className="font-anton text-[clamp(1.75rem,4.5vw,2.75rem)] uppercase leading-[0.93] tracking-tight text-wh">
              15+ years of teaching
              <br />
              Hyderabad to dance.
            </h2>
            <div className="space-y-5 text-sm text-wh/65 leading-[1.78] max-w-[32rem]">
              <p>
                Rhythmzz Academy of Dance was founded by Nitish at Neredmet X Road, Secunderabad.
                What began with a handful of neighbourhood students has grown into one of East
                Hyderabad&apos;s most trusted dance and fitness academies.
              </p>
              <p>
                We&apos;ve represented India internationally, performed at Amazon and IPL events,
                organised the Hyderabad Dance Premier League with 1,500+ participants, and trained
                over 5,000 students — from 5-year-olds discovering dance for the first time to
                adults rediscovering movement after years away.
              </p>
            </div>
            <div className={cn(homepageCtaPair, 'sm:max-w-none mt-1 sm:mt-2')}>
              <Link href={ROUTES.enrol} className={`${homepageCtaBrand} ${homepageCtaPairButton}`}>
                Join a class
              </Link>
              <Link href={ROUTES.about} className={`${homepageCtaOutlineDark} ${homepageCtaPairButton}`}>
                Learn more
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {highlights.map((item) => (
              <div
                key={item.key}
                className={cn(
                  'text-center px-4 py-7 sm:px-5 sm:py-8',
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
