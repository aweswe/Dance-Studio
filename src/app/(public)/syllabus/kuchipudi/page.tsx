import { Metadata } from 'next';
import Link from 'next/link';
import { enrolHref, SITE_URL } from '@/lib/utils/constants';
import { SyllabusYears } from '@/components/public/syllabus-years';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaBrand, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';

export const metadata: Metadata = {
  title: 'Kuchipudi syllabus',
  description:
    'Year-wise Kuchipudi syllabus with Srusti at Rhythmzz Academy, Neredmet. Friday and Saturday 6:30 to 7:30.',
  alternates: { canonical: `${SITE_URL}/syllabus/kuchipudi` },
};

export default function KuchipudiSyllabusPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Syllabus"
        title="Kuchipudi"
        description="Srusti. Friday and Saturday, 6:30–7:30. You sit the exam when she says you are ready."
        align="center"
      />

      <HomepageSection className={sectionPadAfterTitle}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            <Link href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })} className={homepageCtaBrand}>
              Enrol — Kuchipudi
            </Link>
            <Link href={enrolHref({ programme: 'classical-dance', intent: 'trial' })} className={homepageCtaOutlineLight}>
              Enrol — Kathak
            </Link>
          </div>
          <SyllabusYears />
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
