import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Map } from 'lucide-react';
import { ACADEMY, HOURS, AREAS_SERVED, SITE_URL } from '@/lib/utils/constants';
import { formatTime } from '@/lib/utils/format';
import { EnquiryForm } from '@/components/public/enquiry-form';
import { Reveal } from '@/components/motion/reveal';

const hoursLabel = `${HOURS.days[0]} – ${HOURS.days[HOURS.days.length - 1]}: ${formatTime(`${HOURS.opens}:00`)} – ${formatTime(`${HOURS.closes}:00`)}`;

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with Rhythmzz Academy of Dance. Located in ${ACADEMY.address.landmark}, ${ACADEMY.address.city}. Call ${ACADEMY.phoneDisplay} to book a trial class.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

// Reference neighbourhoods — 8–15 minutes by drive from the studio.
const NEARBY_AREAS = [...AREAS_SERVED, 'Secunderabad', 'Hyderabad'];

export default function ContactPage() {
  return (
    <div className="bg-canvas text-ink">
      {/* Header */}
      <section className="bg-blk text-white py-16 sm:py-20 px-4 sm:px-6 md:px-16 text-center">
        <h1 className="heading-display text-3xl sm:text-5xl md:text-7xl mb-3 leading-tight">CONTACT US</h1>
        <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto">
          We&apos;d love to hear from you. Reach out for class inquiries, studio rentals, or just to say hello.
        </p>
      </section>

      {/* Info and Areas */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <Reveal>
        <div>
          <div className="section-label mb-3">Get In Touch</div>
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-6 leading-tight">WE ARE HERE</h2>

          <div className="flex flex-col gap-8 mb-12">
            <div className="flex gap-4 items-start">
              <MapPin className="text-bl shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-xs font-bold tracking-[2px] uppercase mb-2">Address</h4>
                <p className="text-sm text-ink-2 leading-relaxed max-w-sm">
                  {ACADEMY.address.street},<br />
                  {ACADEMY.address.landmark},<br />
                  {ACADEMY.address.city}, {ACADEMY.address.state} {ACADEMY.address.pin}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <Phone className="text-bl shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-xs font-bold tracking-[2px] uppercase mb-2">Call / WhatsApp</h4>
                <p className="text-sm text-ink-2 mb-2">{ACADEMY.phoneDisplay}</p>
                <a
                  href={`https://wa.me/${ACADEMY.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bl-ink text-sm font-semibold hover:text-bl transition-colors rounded-sm focus-visible:focus-ring"
                >
                  Message on WhatsApp &rarr;
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Mail className="text-bl shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-xs font-bold tracking-[2px] uppercase mb-2">Email</h4>
                <p className="text-sm text-ink-2">{ACADEMY.email}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Clock className="text-bl shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-xs font-bold tracking-[2px] uppercase mb-2">Operating Hours</h4>
                <p className="text-sm text-ink-2 leading-relaxed">
                  {hoursLabel}<br />
                  Sunday: By appointment
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[2px] uppercase mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href={ACADEMY.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-line-strong flex items-center justify-center text-ink hover:bg-bl hover:text-white hover:border-bl transition-all focus-visible:focus-ring active:scale-[0.98]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={ACADEMY.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-line-strong flex items-center justify-center text-ink hover:bg-bl hover:text-white hover:border-bl transition-all focus-visible:focus-ring active:scale-[0.98]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/></svg>
              </a>
            </div>
          </div>
        </div>
        </Reveal>

        <Reveal y={20} delay={0.08}>
        <div className="bg-canvas-muted p-8 md:p-12 rounded-card border border-line flex flex-col justify-center">
          <Map className="text-bl mb-6" size={32} />
          <h3 className="heading-display text-3xl mb-4">EASY ACCESS FROM</h3>
          <p className="text-sm text-ink-2 mb-8 leading-relaxed">
            Our studio at Neredmet X Road is 8–15 minutes from most of East Hyderabad by drive.
            Students come to us from Sainikpuri, AS Rao Nagar, Yapral, Malkajgiri, Kapra and
            Hastinapuri every day.
          </p>
          <div className="flex flex-wrap gap-2">
            {NEARBY_AREAS.map((area, idx) => (
              <span key={idx} className="bg-surface border border-line-strong text-ink text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full">
                {area}
              </span>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* Enquiry form */}
      <section className="py-20 px-6 md:px-16 bg-canvas-muted-2">
        <Reveal y={20} className="max-w-xl mx-auto bg-surface rounded-card border border-line p-8 md:p-12">
          <div className="section-label mb-4">Send Us A Message</div>
          <h2 className="heading-display text-4xl mb-4">HAVE A QUESTION?</h2>
          <p className="text-sm text-ink-2 mb-8 leading-relaxed">
            Ask about classes, timings, or a free trial session — we reply within 24 hours.
          </p>
          <EnquiryForm />
        </Reveal>
      </section>

      {/* Full Width Map */}
      <section className="h-[500px] w-full bg-canvas-muted-2 relative">
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
