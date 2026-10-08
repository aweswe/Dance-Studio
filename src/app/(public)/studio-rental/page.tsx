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
  title: 'Book the Space | Dance Studio Rental Secunderabad | Rhythmzz Academy of Dance',
  description:
    'Your Vision. Our Space. A fully equipped dance studio at Neredmet X Road, Secunderabad — available for rehearsals, workshops, auditions, fitness sessions, and private coaching. ₹1,000/hr weekdays, ₹1,500/hr weekends.',
  alternates: { canonical: `${SITE_URL}/studio-rental` },
};

export default function StudioRentalPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Book the Space"
        title="Your Vision."
        accent="Our Space."
        description="A fully equipped dance studio at Neredmet X Road, Secunderabad—available for rehearsals, workshops, auditions, fitness sessions, and private coaching."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {[
            'Washroom',
            'Mirrors',
            'Marley Dance Floor',
            'Bluetooth Sound System',
            'Changing Rooms',
            'Central Location',
            'CCTV-Protected',
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-md border border-line bg-surface p-3.5 text-center flex flex-col items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={16} className="text-bl shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink leading-tight">
                {feature}
              </span>
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

          <div id="rental-form" className="lg:col-span-5 lg:sticky lg:top-24">
            <StudioRentalForm />
          </div>
        </div>
      </HomepageSection>

      <PublicBookTrialCta
        eyebrow="Studio hire"
        title="Need the"
        accent="room?"
        description="WhatsApp preferred date and time — we’ll confirm availability."
        primaryHref="#rental-form"
        primaryLabel="Request a slot"
      />
    </PublicPage>
  );
}
