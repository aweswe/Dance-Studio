'use client';

import Image from 'next/image';
import Link from 'next/link';
import { enrolHref } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';
import { HomepageSection } from '@/components/public/homepage-section';
import { Reveal } from '@/components/motion/reveal';
import { sectionPadLg } from '@/lib/ui/section-layout';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface GuruSectionProps {
  className?: string;
  showCta?: boolean;
}

const CREDENTIALS = [
  '16 Years of Kuchipudi training',
  'Trained under Guru Smt. Lakshmi Shankar',
  'Doordarshan Certified B-Grade Artist',
  'Certificate in Kuchipudi — Telugu University',
  'Rangapravesham at Ravindra Bharathi, Hyderabad',
  'Conferred title: Nruthyadeekshamani (post-Rangapravesham)',
];

export function GuruSrushtinidhiSection({ className, showCta = true }: GuruSectionProps) {
  const whatsappUrl = whatsappLink(
    'Hello, I would like to enquire about classical Kuchipudi classes under Guru Srushti Nidhi.'
  );

  return (
    <HomepageSection className={cn('bg-canvas border-b border-line', sectionPadLg, className)}>
      <Reveal>
        <div className="max-w-5xl mx-auto">

          {/* Eyebrow & Title */}
          <div className="mb-6 sm:mb-8">
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-ink-3 mb-2">
              Your Guru
            </p>
            <h2 className="font-anton text-2xl sm:text-3xl md:text-4xl text-ink uppercase tracking-tight">
              Learn Under Guru Srushti Nidhi
            </h2>
            <div className="w-14 h-0.5 bg-gold mt-3" />
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Image + Quick Stats */}
            <div className="lg:col-span-4 w-full space-y-3">
              <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border border-line bg-surface shadow-sm">
                <Image
                  src="/images/kuchipudi/artifact_img_2.jpg"
                  alt="Guru Srushti Nidhi in classical Kuchipudi pose — Rhythmzz Academy"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              {/* Quick Credential Strip */}
              <div className="p-4 rounded-md bg-surface border border-line space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-3 mb-2">
                  Credentials
                </p>
                {CREDENTIALS.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-ink-2 font-medium">
                    <CheckCircle2 size={13} className="text-bl shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Full Bio */}
            <div className="lg:col-span-8 flex flex-col justify-start">

              {/* Name & Title */}
              <div className="mb-4">
                <h3 className="font-anton text-xl sm:text-2xl text-ink uppercase tracking-wide">
                  Srushti Nidhi
                </h3>
                <p className="font-serif italic text-sm sm:text-base text-ink-2 mt-0.5">
                  Kuchipudi &amp; Contemporary Dance Guru, Rhythmzz Academy of Dance
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div className="text-xs sm:text-sm text-ink-2 space-y-3 leading-relaxed font-normal mb-5">
                <p>
                  Srushti Nidhi is a trained Kuchipudi and contemporary dancer, teacher, performer, and choreographer based in Hyderabad. She has dedicated 16 years to learning Kuchipudi under the guidance of Guru Smt. Lakshmi Shankar, and has also received contemporary dance training under Mr. Nitish Kumar.
                </p>
                <p>
                  She is a Doordarshan Certified B-Grade artist, holds a certificate in Kuchipudi from Telugu University, and completed her Rangapravesham at Ravindra Bharathi, Hyderabad — later being conferred the title <strong className="text-ink font-semibold">Nruthyadeekshamani</strong>.
                </p>
                <p>
                  She is currently working as a Dance Facilitator at The Gaudium School, where she guides students in dance education, performance, creativity, and artistic expression. Alongside her artistic practice, Srushti is the co-founder of <strong className="text-ink font-semibold">Saanjhi</strong>, a non-profit initiative centred around art, compassion, and responsibility.
                </p>
              </div>

              {/* Highlighted: Srushti Sthithi Laya — the key callout */}
              <div className="rounded-md border border-gold/50 bg-gold/5 p-4 sm:p-5 mb-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold rounded-l-md" />
                <div className="pl-2">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-ink mb-1.5">
                    ◆ Founded in 2025
                  </p>
                  <h4 className="font-anton text-base sm:text-lg text-ink uppercase tracking-wide mb-1.5">
                    Srushti Sthithi Laya
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed font-medium">
                    In 2025, she began her own dance classes under the name <strong className="text-ink">Srushti Sthithi Laya</strong> — inspired by{' '}
                    <em className="text-gold-ink font-semibold not-italic">Srushti</em> (creation),{' '}
                    <em className="text-gold-ink font-semibold not-italic">Sthithi</em> (stability &amp; preservation), and{' '}
                    <em className="text-gold-ink font-semibold not-italic">Laya</em>, which she interprets as rhythm: the meeting point of creation, stability, and rhythm through dance.
                  </p>
                  <p className="text-xs text-ink-3 font-medium mt-2 leading-relaxed">
                    Her students and ensemble recently performed in Vijayawada, marking another step in the journey of Srushti Sthithi Laya.
                  </p>
                </div>
              </div>



              {/* Actions */}
              {showCta && (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
                    className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-2xs"
                  >
                    Book Trial Class
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider border border-line bg-surface text-ink hover:border-ink/50 transition-colors"
                  >
                    Enquire on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </HomepageSection>
  );
}
