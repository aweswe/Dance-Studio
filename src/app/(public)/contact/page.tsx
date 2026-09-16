import { Metadata } from 'next';
import { MapPin, Phone, Clock } from 'lucide-react';
import { ACADEMY, HOURS, AREAS_SERVED, SITE_URL } from '@/lib/utils/constants';
import { formatTime } from '@/lib/utils/format';
import { EnquiryForm } from '@/components/public/enquiry-form';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaWhatsApp } from '@/lib/ui/homepage-cta';
import { sectionGap, sectionPadAfterTitleLg, sectionPadLg } from '@/lib/ui/section-layout';
import { cn } from '@/lib/utils/cn';

const hoursLabel = `${HOURS.days[0]} – ${HOURS.days[HOURS.days.length - 1]}: ${formatTime(`${HOURS.opens}:00`)} – ${formatTime(`${HOURS.closes}:00`)}`;

export const metadata: Metadata = {
  title: 'Contact Us | Rhythmzz Academy of Dance',
  description: `Get in touch with Rhythmzz Academy of Dance in Secunderabad. Located at Neredmet X Road. Call ${ACADEMY.phoneDisplay} to book your trial class.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Contact"
        title="Get in touch"
        description="WhatsApp +91 90529 80859. Or fill the form — we reply the same day if it isn’t a class hour."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-4">
          <div className={cn('flex min-h-0 flex-col', sectionGap, 'lg:grid lg:grid-rows-subgrid lg:row-span-2 lg:gap-y-4')}>
            <HomepageSectionHeading
              eyebrow="Studio"
              title="Visit us"
              description="Neredmet X Road — sprung floor, above the ICICI ATM."
              className="mb-0 [&>p:last-child]:min-h-[2.75rem]"
            />

            <div className="flex h-full flex-col rounded-md border border-line bg-surface p-6 sm:p-8 space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-md bg-bl/10 flex items-center justify-center text-bl shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink mb-1">Address</h3>
                  <p className="text-sm text-ink-2 leading-relaxed">
                    Plot 597, 3rd Floor, Above ICICI ATM,
                    <br />
                    Neredmet X Road, Secunderabad 500094
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-md bg-bl/10 flex items-center justify-center text-bl shrink-0">
                  <Phone size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink mb-1">Phone & WhatsApp</h3>
                  <p className="text-sm text-ink-2 mb-2">{ACADEMY.phoneDisplay}</p>
                  <a
                    href={ACADEMY.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={homepageCtaWhatsApp}
                  >
                    WhatsApp us
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-md bg-bl/10 flex items-center justify-center text-bl shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink mb-1">Timings</h3>
                  <p className="text-sm text-ink-2 leading-relaxed">{hoursLabel}</p>
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-line">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-3">Areas we serve</p>
                <div className="flex flex-wrap gap-2">
                  {AREAS_SERVED.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 rounded-md bg-canvas border border-line text-xs font-medium text-ink-2"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={cn('flex min-h-0 flex-col', sectionGap, 'lg:grid lg:grid-rows-subgrid lg:row-span-2 lg:gap-y-4')}>
            <HomepageSectionHeading
              eyebrow="Message"
              title="Have a question?"
              description="Leave a message and the desk will get back to you within 24 hours."
              className="mb-0 [&>p:last-child]:min-h-[2.75rem]"
            />
            <div className="flex h-full flex-col rounded-md border border-line bg-surface p-6 sm:p-8">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </HomepageSection>

      <HomepageSection className={sectionPadLg}>
        <div className="relative h-[420px] w-full overflow-hidden rounded-md border border-line">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0270505191834!2d78.50058347596005!3d17.4431478834533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a6225a0a38b%3A0xc3e167389eefab2!2sRhythmzz%20Academy%20of%20Dance!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            title="Rhythmzz Academy of Dance on Google Maps"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </HomepageSection>

      <PublicBookTrialCta />
    </PublicPage>
  );
}
