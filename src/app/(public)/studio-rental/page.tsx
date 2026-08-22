import { Metadata } from 'next';
import Image from 'next/image';
import { Wind, Maximize, Music, MonitorPlay, CheckCircle2 } from 'lucide-react';
import { StudioRentalForm } from '@/components/public/studio-rental-form';

export const metadata: Metadata = {
  title: 'Dance Studio Rental Secunderabad',
  description: 'Rent our premium dance studios in Secunderabad for rehearsals, workshops, and shoots. Features AC, mirrors, professional floors, and sound systems.',
};

export default function StudioRentalPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-blk text-white py-24 px-6 md:px-16 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-[10px] tracking-[5px] uppercase text-bll mb-4">Premium Spaces</div>
          <h1 className="heading-display text-5xl md:text-7xl mb-6">STUDIO RENTAL</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Need a space to rehearse, shoot a video, or host a workshop? Our state-of-the-art studios in Secunderabad are available for hourly rentals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Info Column */}
        <div className="space-y-12">
          
          <div>
            <h2 className="heading-display text-3xl mb-6">STUDIO FEATURES</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Wind, label: "Fully Air Conditioned" },
                { icon: Maximize, label: "Wall-to-Wall Mirrors" },
                { icon: MonitorPlay, label: "Professional Sprung Floors" },
                { icon: Music, label: "Premium Sound System" },
              ].map((Feature, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-off p-6 rounded-2xl">
                  <Feature.icon className="text-bl shrink-0" size={24} />
                  <span className="text-sm font-bold tracking-wide uppercase">{Feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="heading-display text-3xl mb-6">PRICING</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border-2 border-black/10 rounded-2xl p-6 text-center">
                <div className="text-[11px] font-bold tracking-[2px] uppercase text-mu mb-2">Weekdays</div>
                <div className="text-sm text-blk font-semibold mb-4">(Mon - Fri)</div>
                <div className="text-3xl font-bold heading-display text-bl">₹1000<span className="text-sm text-mu font-sans ml-1">/ hr</span></div>
              </div>
              <div className="border-2 border-bl rounded-2xl p-6 text-center bg-bl/5 relative">
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-bl text-white text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full">Peak</div>
                <div className="text-[11px] font-bold tracking-[2px] uppercase text-mu mb-2">Weekends</div>
                <div className="text-sm text-blk font-semibold mb-4">(Sat - Sun)</div>
                <div className="text-3xl font-bold heading-display text-bl">₹1500<span className="text-sm text-mu font-sans ml-1">/ hr</span></div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="heading-display text-3xl mb-6">RULES & GUIDELINES</h2>
            <ul className="space-y-3">
              {[
                "Outdoor shoes are strictly prohibited inside the studio.",
                "Food and drinks (except water) are not allowed in the studio area.",
                "Booking time includes setup and wrap-up. Please exit on time.",
                "Minimum booking duration is 1 hour.",
                "Full payment required to confirm the booking."
              ].map((rule, idx) => (
                <li key={idx} className="flex gap-3 items-start text-sm text-mu leading-relaxed">
                  <CheckCircle2 className="text-bl shrink-0 mt-0.5" size={16} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:sticky lg:top-24">
          <StudioRentalForm />
        </div>

      </section>
    </div>
  );
}
