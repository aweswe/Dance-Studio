import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Map, ArrowRight } from 'lucide-react';
import { ACADEMY, HOURS, AREAS_SERVED, SITE_URL } from '@/lib/utils/constants';
import { formatTime } from '@/lib/utils/format';
import { EnquiryForm } from '@/components/public/enquiry-form';
import { Reveal } from '@/components/motion/reveal';

const hoursLabel = `${HOURS.days[0]} – ${HOURS.days[HOURS.days.length - 1]}: ${formatTime(`${HOURS.opens}:00`)} – ${formatTime(`${HOURS.closes}:00`)}`;

export const metadata: Metadata = {
  title: 'Contact Us | Rhythmzz Academy of Dance',
  description: `Get in touch with Rhythmzz Academy of Dance in Secunderabad. Located at Neredmet X Road. Call ${ACADEMY.phoneDisplay} to book your trial class.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="bg-canvas text-ink">
      {/* Hero with Generous Breathing Space */}
      <section className="relative overflow-hidden py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-16 text-center border-b border-line bg-canvas">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center mb-4 px-3.5 py-1 rounded-full border border-line bg-surface/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              STUDIO HEADQUARTERS · SECUNDERABAD
            </span>
          </div>

          <h1 className="heading-urban text-4xl sm:text-6xl md:text-7xl text-ink mb-6 leading-tight tracking-tight">
            CONNECT WITH THE ACADEMY
          </h1>

          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Have questions about batches, schedules, or our free trial sessions? Reach out directly via WhatsApp or send us an enquiry below.
          </p>
        </div>
      </section>

      {/* Spacious 2-Column Contact & Enquiry Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Direct Studio Coordinates */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bento-card p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-1">
                Studio Location
              </span>
              <h2 className="heading-urban text-2xl sm:text-3xl text-ink">
                VISIT THE STUDIO
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-xl bg-canvas border border-line flex items-center justify-center text-[#FB923C] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-0.5">Address</h4>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                    Plot 597, 3rd Floor, Above ICICI ATM,<br />
                    Neredmet X Road, Secunderabad 500094
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-xl bg-canvas border border-line flex items-center justify-center text-[#FB923C] shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-0.5">Direct Line &amp; WhatsApp</h4>
                  <p className="text-xs sm:text-sm text-ink-2 font-mono mb-1">{ACADEMY.phoneDisplay}</p>
                  <a
                    href={`https://wa.me/${ACADEMY.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FB923C] text-xs font-mono font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Message on WhatsApp</span>
                    <span>──→</span>
                  </a>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-xl bg-canvas border border-line flex items-center justify-center text-[#FB923C] shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-0.5">Timings</h4>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                    {hoursLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-line">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 block mb-2 font-bold">
                Serving Surrounding Areas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AREAS_SERVED.map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 rounded-md bg-canvas border border-line text-[11px] font-medium text-ink-2"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Enquiry Card */}
        <div className="lg:col-span-6 bento-card p-6 sm:p-10 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FB923C] font-bold block mb-1">
            Send Message
          </span>
          <h2 className="heading-urban text-2xl sm:text-3xl text-ink mb-2">
            HAVE A QUESTION?
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 mb-6">
            Leave a message and our team will get back to you within 24 hours.
          </p>
          <EnquiryForm />
        </div>

      </section>

      {/* Embedded Studio Map */}
      <section className="h-[400px] w-full bg-canvas relative border-y border-line">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0270505191834!2d78.50058347596005!3d17.4431478834533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a6225a0a38b%3A0xc3e167389eefab2!2sRhythmzz%20Academy%20of%20Dance!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </section>
    </div>
  );
}
