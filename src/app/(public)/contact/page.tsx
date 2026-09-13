import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { ACADEMY, HOURS, AREAS_SERVED, SITE_URL } from '@/lib/utils/constants';
import { formatTime } from '@/lib/utils/format';
import { EnquiryForm } from '@/components/public/enquiry-form';

const hoursLabel = `${HOURS.days[0]} – ${HOURS.days[HOURS.days.length - 1]}: ${formatTime(`${HOURS.opens}:00`)} – ${formatTime(`${HOURS.closes}:00`)}`;

export const metadata: Metadata = {
  title: 'Contact Us | Rhythmzz Academy of Dance',
  description: `Get in touch with Rhythmzz Academy of Dance in Secunderabad. Located at Neredmet X Road. Call ${ACADEMY.phoneDisplay} to book your trial class.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="bg-canvas text-ink">
      {/* 01: Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-16 border-b border-line bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-5">
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-[#7C5CFC] uppercase font-bold">
                DIRECT COMMUNICATIONS DESK
              </span>
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl text-ink mb-6 leading-[0.92] tracking-tight uppercase">
              CONNECT WITH <br className="hidden sm:inline" />
              <span className="text-[#7C5CFC]">THE ACADEMY.</span>
            </h1>

            <p className="text-ink-2 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              WhatsApp +91 90529 80859. Or fill the form — we reply the same day if it isn’t a class hour.
            </p>
          </div>
        </div>
      </section>

      {/* 02: Spacious 2-Column Contact & Enquiry Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Direct Studio Coordinates */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bento-card p-6 sm:p-8 rounded-[28px] space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
                  {"// Studio Location"}
                </span>
              </div>
              <h2 className="font-anton text-3xl sm:text-4xl text-ink uppercase tracking-wide">
                VISIT THE STUDIO
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 items-start p-3.5 rounded-2xl bg-canvas border border-line">
                <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center text-[#7C5CFC] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">Address</h4>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                    Plot 597, 3rd Floor, Above ICICI ATM,<br />
                    Neredmet X Road, Secunderabad 500094
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3.5 rounded-2xl bg-canvas border border-line">
                <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center text-[#7C5CFC] shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">Direct Line &amp; WhatsApp</h4>
                  <p className="text-xs sm:text-sm text-ink-2 font-mono mb-2">{ACADEMY.phoneDisplay}</p>
                  <a
                    href={`https://wa.me/${ACADEMY.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7C5CFC] hover:text-[#7C5CFC]/80 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>[Message on WhatsApp]</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3.5 rounded-2xl bg-canvas border border-line">
                <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center text-[#7C5CFC] shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1">Timings</h4>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-mono">
                    {hoursLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-line">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 block mb-3 font-bold">
                Serving Surrounding Localities
              </span>
              <div className="flex flex-wrap gap-2">
                {AREAS_SERVED.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 rounded-md bg-canvas border border-line text-xs font-medium text-ink-2 hover:border-[#7C5CFC]/30 transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Enquiry Card */}
        <div className="lg:col-span-6 bento-card p-6 sm:p-10 rounded-[28px] shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
              {"// Send Message"}
            </span>
          </div>
          <h2 className="font-anton text-3xl sm:text-4xl text-ink uppercase tracking-wide mb-2">
            HAVE A QUESTION?
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 mb-8">
            Leave a message and our admissions team will get back to you within 24 hours.
          </p>
          <EnquiryForm />
        </div>

      </section>

      {/* Embedded Studio Map */}
      <section className="h-[420px] w-full bg-canvas relative border-y border-line">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0270505191834!2d78.50058347596005!3d17.4431478834533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a6225a0a38b%3A0xc3e167389eefab2!2sRhythmzz%20Academy%20of%20Dance!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
        ></iframe>
      </section>
    </div>
  );
}
