import { MapPin, Phone, Mail } from 'lucide-react';
import { ACADEMY } from '@/lib/utils/constants';

export function MapContact() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 bg-canvas">
      <div className="h-[400px] md:h-auto bg-canvas-muted-2 relative">
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
      </div>
      <div className="p-12 md:p-20 bg-blk text-white flex flex-col justify-center">
        <div className="text-[10px] tracking-[5px] uppercase text-bl-light mb-4">Visit Us</div>
        <h2 className="heading-display text-4xl md:text-5xl mb-8 text-white">GET IN TOUCH</h2>
        
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex gap-4 items-start">
            <MapPin className="text-bl shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-[11px] font-bold tracking-[2px] uppercase mb-1">{ACADEMY.address.landmark}</h4>
              <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                {ACADEMY.address.street},<br />
                {ACADEMY.address.city}, {ACADEMY.address.state} {ACADEMY.address.pin}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <Phone className="text-bl shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-[11px] font-bold tracking-[2px] uppercase mb-1">Call / WhatsApp</h4>
              <p className="text-sm text-white/50">{ACADEMY.phoneDisplay}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <Mail className="text-bl shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-[11px] font-bold tracking-[2px] uppercase mb-1">Email</h4>
              <p className="text-sm text-white/50">{ACADEMY.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-bold tracking-[2px] uppercase mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href={ACADEMY.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-bl hover:border-bl transition-all focus-visible:focus-ring active:scale-95">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href={ACADEMY.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-bl hover:border-bl transition-all focus-visible:focus-ring active:scale-95">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
