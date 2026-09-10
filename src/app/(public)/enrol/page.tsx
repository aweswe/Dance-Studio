import { Metadata } from 'next';
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { EnrolForm } from '@/components/public/enrol-form';
import { SITE_URL, ACADEMY } from '@/lib/utils/constants';
import { CheckCircle2, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Enrol — Free Trial Class | Rhythmzz Academy',
  description:
    'Book your free trial class at Rhythmzz Academy of Dance, Neredmet X Road, Secunderabad. Kids Dance, Adults Dance, Mind & Body Fitness and Kuchipudi. No registration fee.',
  alternates: { canonical: `${SITE_URL}/enrol` },
};

export default async function EnrolPage({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string }>;
}) {
  const [programmes, batches, { programme }] = await Promise.all([
    getProgrammes(),
    getBatches(),
    searchParams,
  ]);

  return (
    <div className="bg-canvas min-h-screen py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 text-ink">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Spacious Form */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <EnrolForm programmes={programmes} batches={batches} defaultProgramme={programme} />
        </div>

        {/* Right Column: Airy Value Proposition */}
        <Reveal className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">
          <div>
            <div className="inline-flex items-center mb-3 px-3.5 py-1 rounded-full border border-line bg-surface/80 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
                FIRST LESSON IS FREE · ZERO ADMISSION FEE
              </span>
            </div>
            <h1 className="heading-urban text-4xl sm:text-5xl text-ink mb-4 leading-tight">
              BOOK YOUR FIRST CLASS
            </h1>
            <p className="text-ink-2 text-sm sm:text-base leading-relaxed">
              Every dancer starts with one complimentary trial session at Neredmet X Road, Secunderabad.
            </p>
          </div>

          {/* 3 Crisp Assurance Tiles */}
          <div className="space-y-3">
            <div className="bento-card p-4 flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-lg bg-canvas border border-line flex items-center justify-center text-[#FB923C] shrink-0 font-mono font-bold text-xs">
                01
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">100% Free Trial</h4>
                <p className="text-[11px] text-ink-2 mt-0.5 leading-relaxed">
                  No admission or registration fee. Experience the coaching before deciding.
                </p>
              </div>
            </div>

            <div className="bento-card p-4 flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-lg bg-canvas border border-line flex items-center justify-center text-[#FB923C] shrink-0 font-mono font-bold text-xs">
                02
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">WhatsApp Coordination</h4>
                <p className="text-[11px] text-ink-2 mt-0.5 leading-relaxed">
                  Our front desk confirms your batch timing and sends directions immediately.
                </p>
              </div>
            </div>

            <div className="bento-card p-4 flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-lg bg-canvas border border-line flex items-center justify-center text-[#FB923C] shrink-0 font-mono font-bold text-xs">
                03
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">Sprung Floor Studio</h4>
                <p className="text-[11px] text-ink-2 mt-0.5 leading-relaxed">
                  1,200 sq. ft. air-conditioned rehearsal floor with full-length mirrors.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bento-card p-5 border-[#FB923C]/30 bg-surface flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 block">Need Guidance?</span>
              <p className="text-xs font-bold text-ink">Call or WhatsApp us directly</p>
            </div>
            <a
              href={`https://wa.me/${ACADEMY.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-canvas border border-line text-xs font-mono font-bold text-[#FB923C] hover:border-[#FB923C] transition-colors"
            >
              Chat ──→
            </a>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
