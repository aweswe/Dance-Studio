import { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { StudioRentalForm } from '@/components/public/studio-rental-form';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionGap, sectionPadAfterTitleLg, sectionPadLg } from '@/lib/ui/section-layout';
import { SITE_URL } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = {
  title: 'Dance Studio Rental Secunderabad | Rhythmzz Academy',
  description:
    'Rent our professional dance studio at Neredmet X Road, Secunderabad — ₹1,000/hr weekdays, ₹1,500/hr weekends. Sprung hardwood floor, mirrors, and high-fidelity sound.',
  alternates: { canonical: `${SITE_URL}/studio-rental` },
};

export default function StudioRentalPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="1,200 sq. ft. rehearsal space"
        title="Studio rental"
        description="A fully air-conditioned, shock-absorbing sprung floor at Neredmet X Road. Available for rehearsals, workshops, auditions, and private video shoots."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: '1,200 SQ FT', label: 'Sprung hardwood floor' },
            { value: 'Full mirrors', label: 'Floor-to-ceiling glass' },
            { value: 'Acoustic audio', label: 'Bluetooth & aux sound' },
            { value: 'Climate control', label: '100% air-conditioned' },
          ].map((item) => (
            <div key={item.value} className="rounded-md border border-line bg-surface p-5 text-center">
              <p className="font-anton text-xl sm:text-2xl text-ink uppercase tracking-tight">{item.value}</p>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-ink-3 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </HomepageSection>

      <HomepageSection className={sectionPadLg}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className={cn('lg:col-span-7 flex flex-col', sectionGap)}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative h-60 sm:h-72 rounded-md overflow-hidden border border-line">
                <Image
                  src="/images/studio-training/studio-practice-mirrors.jpg"
                  alt="Mirrored rehearsal hall"
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-60 sm:h-72 rounded-md overflow-hidden border border-line">
                <Image
                  src="/images/studio-training/floorwork-stretch.jpg"
                  alt="Sprung floor mobility area"
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-md border border-line bg-surface p-6 text-center">
                <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-bl block mb-1">
                  Weekdays (Mon – Fri)
                </span>
                <p className="font-anton text-4xl text-ink tracking-tight">
                  ₹1,000<span className="text-xs text-ink-3 font-body ml-1 uppercase font-normal">/ hour</span>
                </p>
              </div>
              <div className="rounded-md border border-bl/40 bg-surface p-6 text-center">
                <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-bl block mb-1">
                  Weekends (Sat – Sun)
                </span>
                <p className="font-anton text-4xl text-ink tracking-tight">
                  ₹1,500<span className="text-xs text-ink-3 font-body ml-1 uppercase font-normal">/ hour</span>
                </p>
              </div>
            </div>

            <div className="rounded-md border border-line bg-surface p-6 space-y-3">
              <HomepageSectionHeading eyebrow="Studio rules" title="Before you book" className="mb-0" />
              <ul className="space-y-2.5">
                {[
                  'Clean indoor dance shoes or bare feet only (outdoor footwear strictly prohibited).',
                  'Advance slot reservation required to lock booking date and time.',
                  'Minimum booking duration is 1 hour; includes equipment setup and vacate time.',
                ].map((rule) => (
                  <li key={rule} className="flex gap-2.5 items-start text-sm text-ink-2">
                    <CheckCircle2 className="text-bl shrink-0 mt-0.5" size={14} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <StudioRentalForm />
          </div>
        </div>
      </HomepageSection>

      <PublicBookTrialCta
        eyebrow="Studio hire"
        title="Need the"
        accent="room?"
        description="WhatsApp preferred date and time — we’ll confirm availability."
      />
    </PublicPage>
  );
}
