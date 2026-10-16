import { Metadata } from 'next';
import { MapPin, Phone, Clock, Navigation, Star, ArrowUpRight, Bus, Car } from 'lucide-react';
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
              description="Neredmet X Road — sprung floor, above Jawed Habib."
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
                    Plot 597, 3rd Floor, Above Jawed Habib,
                    <br />
                    Defence Colony, Jawahar Nagar, Behind Neredmet X Road Bus Stop,
                    <br />
                    Secunderabad, Telangana 500094
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
        <div className="space-y-6">
          <HomepageSectionHeading
            eyebrow="Location"
            title="Find us on the map"
            description="Conveniently situated at Neredmet X Road, Secunderabad — easily accessible from Sainikpuri, AS Rao Nagar, and ECIL."
          />

          <div className="rounded-md border-2 border-slate-900 bg-surface shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Panel: Studio Overview & Quick Actions */}
            <div className="lg:col-span-5 xl:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white border-b-2 lg:border-b-0 lg:border-r-2 border-slate-900">
              <div className="space-y-5">
                {/* Status Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                    </span>
                    Open Today · {HOURS.opens} – {HOURS.closes}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded">
                    Est. 2010
                  </span>
                </div>

                {/* Studio Name & Badge */}
                <div>
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-slate-950">
                    {ACADEMY.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    IAO Accredited Studio · Professional Sprung Dance Floor
                  </p>
                </div>

                {/* Google Rating */}
                <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-xs">
                  <div className="flex items-center text-amber-500">
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                  </div>
                  <span className="font-bold text-slate-900">{ACADEMY.googleRating}</span>
                  <span className="text-slate-600 text-[11px]">({ACADEMY.googleReviewCount}+ verified Google reviews)</span>
                </div>

                {/* Address Details */}
                <div className="space-y-2 text-xs text-slate-800 border-t border-slate-200 pt-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={18} className="text-bl shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <p className="font-bold text-slate-950 text-sm">{ACADEMY.address.street}</p>
                      <p className="text-slate-700 font-medium">{ACADEMY.address.landmark}</p>
                      <p className="text-slate-600">{ACADEMY.address.city}, {ACADEMY.address.state} {ACADEMY.address.pin}</p>
                    </div>
                  </div>
                </div>

                {/* Landmarks & Transit */}
                <div className="rounded-md bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-xs">
                  <p className="font-mono font-bold uppercase tracking-wider text-[10px] text-slate-600">Transit & Access</p>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Bus size={14} className="text-bl shrink-0" />
                      <span>Behind Neredmet X Road Bus Stop (1 min walk)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car size={14} className="text-bl shrink-0" />
                      <span>8–12 mins drive from Sainikpuri &amp; AS Rao Nagar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={ACADEMY.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-md bg-slate-950 text-white hover:bg-black font-bold uppercase text-[11px] tracking-wider transition-all shadow-sm active:scale-[0.98]"
                >
                  <Navigation size={14} className="text-bl" />
                  <span>Get Directions</span>
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={`tel:${ACADEMY.phone}`}
                  className="flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-md bg-bl text-slate-950 hover:bg-bl-deep font-bold uppercase text-[11px] tracking-wider transition-all shadow-sm active:scale-[0.98]"
                >
                  <Phone size={14} />
                  <span>Call Studio</span>
                </a>
              </div>
            </div>

            {/* Right Panel: Clean, Unobstructed Interactive Map */}
            <div className="lg:col-span-7 xl:col-span-7 relative w-full h-[380px] sm:h-[460px] lg:h-auto min-h-[460px] bg-slate-100">
              <iframe
                src="https://maps.google.com/maps?q=Rhythmzz+Academy+of+Dance,+Plot+597,+3rd+Floor,+Above+Jawed+Habib,+Defence+Colony,+Jawahar+Nagar,+Behind+Neredmet+X+Road+Bus+Stop,+Secunderabad,+Telangana+500094&t=&z=16&ie=UTF8&iwloc=&output=embed"
                title="Rhythmzz Academy of Dance location on Google Maps"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[380px] lg:min-h-[460px]"
              />
            </div>
          </div>
        </div>
      </HomepageSection>

      <PublicBookTrialCta />
    </PublicPage>
  );
}
