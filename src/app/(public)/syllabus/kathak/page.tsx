import { Metadata } from 'next';
import Link from 'next/link';
import { enrolHref, SITE_URL } from '@/lib/utils/constants';
import { KathakSyllabusLevels } from '@/components/public/kathak-syllabus-levels';
import { KATHAK_SYLLABUS } from '@/data/kathak-syllabus';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaBrand, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';

export const metadata: Metadata = {
  title: 'Kathak syllabus',
  description:
    'Five-level Kathak syllabus at Rhythmzz Academy, Neredmet. Foundation through masterclass with Poonam.',
  alternates: { canonical: `${SITE_URL}/syllabus/kathak` },
};

export default function KathakSyllabusPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Syllabus"
        title="Kathak"
        description={`${KATHAK_SYLLABUS.intro} ${KATHAK_SYLLABUS.guru} holds the batch — WhatsApp the desk for days and fees.`}
        align="center"
      />

      <HomepageSection className={sectionPadAfterTitle}>
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex flex-wrap justify-center gap-2.5">
            <Link href={enrolHref({ programme: 'classical-dance', intent: 'trial' })} className={homepageCtaBrand}>
              Enrol — Kathak
            </Link>
            <Link href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })} className={homepageCtaOutlineLight}>
              Enrol — Kuchipudi
            </Link>
          </div>
          <HomepageSectionHeading eyebrow="Five levels" title="The path" className="mb-6 mx-auto text-center" />
          <KathakSyllabusLevels />
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
