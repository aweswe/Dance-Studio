import { Metadata } from 'next';
import Image from 'next/image';
import { Wind, Maximize, Music, MonitorPlay, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { StudioRentalForm } from '@/components/public/studio-rental-form';
import { SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Dance Studio Rental Secunderabad | Rhythmzz Academy',
  description: 'Rent our professional dance studio at Neredmet X Road, Secunderabad — ₹1,000/hr weekdays, ₹1,500/hr weekends. Sprung hardwood floor, mirrors, and high-fidelity sound.',
  alternates: { canonical: `${SITE_URL}/studio-rental` },
};

export default function StudioRentalPage() {
  return (
    <div className="bg-canvas text-ink">
      {/* Hero with Generous Breathing Space */}
      <section className="relative overflow-hidden py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-16 text-center border-b border-line bg-canvas">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center mb-4 px-3.5 py-1 rounded-full border border-line bg-surface/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              1,200 SQ. FT. REHEARSAL &amp; PRODUCTION SPACE
            </span>
          </div>

          <h1 className="heading-urban text-4xl sm:text-6xl md:text-7xl text-ink mb-6 leading-tight tracking-tight">
            STUDIO SPACE RENTAL
          </h1>

          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            A fully air-conditioned, shock-absorbing sprung floor rehearsal space at Neredmet X Road, Secunderabad. Available for dance rehearsals, fitness workshops, auditions, and private video shoots.
          </p>
        </div>
      </section>

      {/* 4 Clean Spec Metric Tiles */}
      <section className="bg-surface py-10 sm:py-12 px-4 sm:px-6 md:px-16 border-b border-line">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="heading-urban text-2xl sm:text-3xl text-ink mb-1">1,200 SQ FT</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-ink-3">Sprung Hardwood Floor</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="heading-urban text-2xl sm:text-3xl text-ink mb-1">FULL MIRRORS</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-ink-3">Floor-to-Ceiling Glass</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="heading-urban text-2xl sm:text-3xl text-ink mb-1">ACOUSTIC AUDIO</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-ink-3">Bluetooth &amp; Aux Sound</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="heading-urban text-2xl sm:text-3xl text-ink mb-1">CLIMATE CONTROL</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-ink-3">100% Air-Conditioned</span>
          </div>
        </div>
      </section>

      {/* Main Spacious 2-Column Content */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        
        {/* Left Column: Visuals, Pricing & Guidelines */}
        <div className="lg:col-span-7 space-y-8">
          {/* Dual Studio Imagery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-60 sm:h-72 bento-card overflow-hidden p-0 group">
              <Image
                src="/images/studio-training/studio-practice-mirrors.jpg"
                alt="Mirrored rehearsal hall"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">Full-Length Practice Mirrors</span>
              </div>
            </div>

            <div className="relative h-60 sm:h-72 bento-card overflow-hidden p-0 group">
              <Image
                src="/images/studio-training/floorwork-stretch.jpg"
                alt="Sprung floor mobility area"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">Shock-Absorbing Sprung Floor</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards with Concentric Radii */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bento-card p-6 text-center">
              <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-[#FB923C] block mb-1">
                Weekdays (Mon – Fri)
              </span>
              <div className="heading-urban text-4xl text-ink mt-2">
                ₹1,000<span className="text-xs text-ink-3 font-mono ml-1 uppercase font-normal">/ hour</span>
              </div>
              <p className="text-[11px] text-ink-3 mt-2">Ideal for private rehearsals &amp; auditions</p>
            </div>

            <div className="bento-card p-6 text-center border-[#FB923C]/40 bg-surface">
              <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-[#FB923C] block mb-1">
                Weekends (Sat – Sun)
              </span>
              <div className="heading-urban text-4xl text-ink mt-2">
                ₹1,500<span className="text-xs text-ink-3 font-mono ml-1 uppercase font-normal">/ hour</span>
              </div>
              <p className="text-[11px] text-ink-3 mt-2">High-demand workshop &amp; shoot slots</p>
            </div>
          </div>

          {/* Essential Guidelines (De-Noised) */}
          <div className="bento-card p-6 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-ink-3 block">
              Essential Studio Rules
            </span>
            <ul className="space-y-2.5">
              {[
                "Clean indoor dance shoes or bare feet only (outdoor footwear strictly prohibited).",
                "Advance slot reservation required to lock booking date and time.",
                "Minimum booking duration is 1 hour; includes equipment setup and vacate time."
              ].map((rule, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs text-ink-2">
                  <CheckCircle2 className="text-[#FB923C] shrink-0 mt-0.5" size={14} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <StudioRentalForm />
        </div>

      </section>
    </div>
  );
}
