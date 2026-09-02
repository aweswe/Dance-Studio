import { Metadata } from 'next';
import Image from 'next/image';
import { Wind, Maximize, Music, MonitorPlay, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StudioRentalForm } from '@/components/public/studio-rental-form';
import { SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Dance Studio Rental Secunderabad',
  description: 'Rent our dance studio at Neredmet X Road, Secunderabad — ₹1,000/hr weekdays, ₹1,500/hr weekends. Air-conditioned with mirrors, sprung floor and sound.',
  alternates: { canonical: `${SITE_URL}/studio-rental` },
};

export default function StudioRentalPage() {
  return (
    <div className="bg-canvas text-ink">
      {/* Hero */}
      <section className="bg-blk text-white py-24 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <Image
            src="/images/studio-training/studio-practice-mirrors.jpg"
            alt="Rhythmzz Dance Studio Space"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blk/80 via-blk/90 to-blk z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-[10px] tracking-[5px] uppercase text-bl-light mb-4">Book The Space</div>
          <h1 className="heading-display text-5xl md:text-7xl mb-6">STUDIO RENTAL</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            A fully-equipped dance and fitness studio at Neredmet X Road, Secunderabad — available
            for rehearsals, workshops, auditions, fitness sessions, and private coaching.
            Air-conditioned, mirrored, and ready when you are.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Info Column */}
        <div className="space-y-12">

          <Reveal>
            <div>
              <h2 className="heading-display text-3xl mb-6">STUDIO FEATURES</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wind, label: "Fully Air Conditioned" },
                  { icon: Maximize, label: "Floor-to-Ceiling Mirrors" },
                  { icon: MonitorPlay, label: "Sprung Dance Floor" },
                  { icon: Music, label: "Bluetooth Sound System" },
                  { icon: ShieldCheck, label: "Changing & Restrooms" },
                  { icon: Maximize, label: "Neredmet X Road Main" },
                ].map((Feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-canvas-muted-2 p-5 rounded-card border border-line">
                    <Feature.icon className="text-bl shrink-0" size={22} />
                    <span className="text-xs font-bold tracking-wide uppercase">{Feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Authentic Studio Photography */}
          <Reveal y={20}>
            <div>
              <h2 className="heading-display text-2xl mb-4">INSIDE THE SPACE</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-44 rounded-tile overflow-hidden border border-line">
                  <Image
                    src="/images/studio-training/studio-practice-mirrors.jpg"
                    alt="Mirrored studio rehearsal space"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-44 rounded-tile overflow-hidden border border-line">
                  <Image
                    src="/images/studio-training/floorwork-stretch.jpg"
                    alt="Conditioning and floor mobility area"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal y={20}>
            <div>
              <h2 className="heading-display text-3xl mb-6">PRICING</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border-2 border-line-strong rounded-card p-6 text-center bg-surface">
                  <div className="text-[11px] font-bold tracking-[2px] uppercase text-ink-2 mb-2">Weekdays</div>
                  <div className="text-sm text-ink font-semibold mb-4">(Mon - Fri)</div>
                  <div className="text-3xl font-bold heading-display text-bl">₹1000<span className="text-sm text-ink-2 font-sans ml-1">/ hr</span></div>
                </div>
                <div className="border-2 border-bl rounded-card p-6 text-center bg-bl/5 relative">
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-bl text-white text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full">Peak</div>
                  <div className="text-[11px] font-bold tracking-[2px] uppercase text-ink-2 mb-2">Weekends</div>
                  <div className="text-sm text-ink font-semibold mb-4">(Sat - Sun)</div>
                  <div className="text-3xl font-bold heading-display text-bl">₹1500<span className="text-sm text-ink-2 font-sans ml-1">/ hr</span></div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal y={20}>
            <div>
              <h2 className="heading-display text-3xl mb-6">RULES &amp; GUIDELINES</h2>
              <ul className="space-y-3">
                {[
                  "Outdoor shoes are strictly prohibited inside the studio dance floor.",
                  "Food and drinks (except water) are not allowed in the studio area.",
                  "Booking time includes setup and wrap-up. Please exit on time.",
                  "Minimum booking duration is 1 hour.",
                  "Full advance payment required to confirm the slot reservation.",
                ].map((rule, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm text-ink-2 leading-relaxed">
                    <CheckCircle2 className="text-bl shrink-0 mt-0.5" size={16} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Form Column */}
        <div className="lg:sticky lg:top-24">
          <StudioRentalForm />
        </div>

      </section>
    </div>
  );
}

