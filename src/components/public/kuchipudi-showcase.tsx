import Link from 'next/link';
import Image from 'next/image';
import { enrolHref, ROUTES } from '@/lib/utils/constants';
import { HomepageSection } from '@/components/public/homepage-section';
import { KuchipudiCurriculum } from '@/components/public/kuchipudi-curriculum';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaBrand, homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { sectionPadAfterTitleLg, sectionPadLg } from '@/lib/ui/section-layout';

export function KuchipudiShowcase() {
  return (
    <>
      <PublicPageTitle
        eyebrow="Classical · Fri & Sat"
        title="Kuchipudi"
        description="Srusti, 6:30 to 7:30. From age 5. Exam when she says you are ready — not before."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <dl className="divide-y divide-line border-y border-line mb-8">
              {[
                ['Days', 'Friday & Saturday'],
                ['Time', '6:30 – 7:30 pm'],
                ['Fee', '₹2,000 / month · ₹5,000 / quarter'],
              ].map(([k, v]) => (
                <div key={k} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                  <dt className="text-[11px] uppercase tracking-widest text-ink-3 w-24 shrink-0">{k}</dt>
                  <dd className="text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2.5">
              <Link href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })} className={homepageCtaBrand}>
                Book a trial
              </Link>
              <Link href={ROUTES.syllabusKuchipudi} className={homepageCtaOutlineLight}>
                Syllabus
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-canvas-muted border border-line">
            <Image
              src="/images/classical-certification-dancer.png"
              alt="Kuchipudi at Rhythmzz"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </HomepageSection>

      <HomepageSection className={sectionPadLg}>
        <KuchipudiCurriculum />
      </HomepageSection>

      <PublicBookTrialCta />
    </>
  );
}
