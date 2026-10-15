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
        description="Friday and Saturday, 6:30 to 7:30. From age 5. You sit the exam when faculty assesses readiness — not before."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-bl block">
                Foundational Classical Art · Ages 5+
              </span>
              <h2 className="font-anton text-3xl sm:text-4xl text-ink uppercase tracking-wide leading-tight">
                Authentic Kuchipudi Training in Secunderabad
              </h2>
              <p className="text-sm sm:text-base text-ink-2 leading-relaxed font-body">
                Kuchipudi at Rhythmzz Academy is taught as a progressive classical discipline — blending rhythmic precision (Nritta), poetic expressive mime (Abhinaya), and theatrical storytelling (Natya). Students learn in small cohorts with direct posture guidance from senior faculty.
              </p>
            </div>

            <dl className="divide-y divide-line border-y border-line mb-8">
              {[
                ['Days', 'Friday & Saturday (2 sessions / week)'],
                ['Timings', '6:30 – 7:30 PM (Evening Cohort)'],
                ['Fees', '₹2,000 / month · ₹5,000 / quarter (Save ₹1,000)'],
                ['Eligibility', 'Ages 5+ (Kids, Teens & Adults) · No prior experience needed'],
                ['Location', 'Neredmet X Road Studio, Secunderabad'],
              ].map(([k, v]) => (
                <div key={k} className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                  <dt className="text-[11px] uppercase tracking-widest text-ink-3 w-28 shrink-0 font-mono font-bold">{k}</dt>
                  <dd className="text-sm text-ink font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-3">
              <Link href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })} className={homepageCtaBrand}>
                Book a Free Trial Class
              </Link>
              <Link href={ROUTES.syllabusKuchipudi} className={homepageCtaOutlineLight}>
                View Full Syllabus
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/5] rounded-md overflow-hidden bg-canvas-muted border border-line shadow-sm">
            <Image
              src="/images/classical-certification-dancer.png"
              alt="Kuchipudi at Rhythmzz"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
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
