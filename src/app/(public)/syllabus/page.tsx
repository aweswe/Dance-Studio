import { Metadata } from 'next';
import Link from 'next/link';
import { enrolHref, SITE_URL } from '@/lib/utils/constants';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaBrand, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';

export const metadata: Metadata = {
  title: 'Syllabus adoption',
  description: 'Kuchipudi and Kathak syllabus adoption at Rhythmzz Academy, Neredmet.',
  alternates: { canonical: `${SITE_URL}/syllabus` },
};

const STYLES = [
  {
    href: '/syllabus/kuchipudi',
    name: 'Kuchipudi',
    note: 'Srusti · Fri & Sat 6:30',
    status: 'On the site',
  },
  {
    href: '/syllabus/kathak',
    name: 'Kathak',
    note: 'Poonam · five levels',
    status: 'On the site',
  },
] as const;

export default function SyllabusIndexPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Syllabus"
        title="What we teach, year by year"
        description="Kuchipudi and Kathak — year by year, level by level."
      />

      <HomepageSection className={sectionPadAfterTitle}>
        <div className="flex flex-wrap gap-2.5 mb-10">
          <Link href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })} className={homepageCtaBrand}>
            Enrol — Kuchipudi
          </Link>
          <Link href={enrolHref({ programme: 'classical-dance', intent: 'trial' })} className={homepageCtaOutlineLight}>
            Enrol — Kathak
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl">
          {STYLES.map((style) => (
            <Link
              key={style.href}
              href={style.href}
              className="rounded-md border border-line bg-surface p-6 sm:p-8 hover:border-ink/30 transition-colors"
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-bl">{style.status}</span>
              <h2 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight mt-2 mb-2">{style.name}</h2>
              <p className="text-sm text-ink-2">{style.note}</p>
            </Link>
          ))}
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
