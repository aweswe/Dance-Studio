import { Metadata } from 'next';
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { EnrolForm } from '@/components/public/enrol-form';
import { SITE_URL, ACADEMY } from '@/lib/utils/constants';
import { ArrowRight } from 'lucide-react';

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
    <div className="bg-canvas min-h-screen pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 md:px-16 text-ink">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Spacious Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <EnrolForm programmes={programmes} batches={batches} defaultProgramme={programme} />
          </div>

          {/* Right Column: Airy Value Proposition */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="mb-3">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-[#7C5CFC] uppercase font-bold">
                  FIRST LESSON IS FREE · ZERO ADMISSION FEE
                </span>
              </div>
              <h1 className="font-anton text-4xl sm:text-5xl md:text-6xl text-ink mb-4 leading-[0.95] tracking-tight uppercase">
                BOOK YOUR <br />
                <span className="text-[#7C5CFC]">FIRST CLASS.</span>
              </h1>
              <p className="text-ink-2 text-sm sm:text-base leading-relaxed">
                Every dancer starts with one complimentary trial session at Neredmet X Road, Secunderabad. No upfront cost or commitment.
              </p>
            </div>

            {/* 3 Crisp Assurance Tiles */}
            <div className="space-y-3">
              <div className="bento-card p-4 rounded-[22px] flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/10 text-[#7C5CFC] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">100% Free Trial</h4>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    No admission or registration fee. Experience the coaching before deciding.
                  </p>
                </div>
              </div>

              <div className="bento-card p-4 rounded-[22px] flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/10 text-[#7C5CFC] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">WhatsApp Coordination</h4>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    Our front desk confirms your batch timing and sends directions immediately.
                  </p>
                </div>
              </div>

              <div className="bento-card p-4 rounded-[22px] flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/10 text-[#7C5CFC] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">Sprung Floor Studio</h4>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    1,200 sq. ft. air-conditioned rehearsal floor with full-length mirrors and sound system.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Help Card */}
            <div className="bento-card p-6 rounded-[24px] border-[#7C5CFC]/30 bg-surface flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 block mb-0.5">Need Guidance?</span>
                <p className="text-xs font-bold text-ink">Call or WhatsApp us directly</p>
              </div>
              <a
                href={`https://wa.me/${ACADEMY.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-canvas border border-line text-xs font-mono font-bold text-[#7C5CFC] hover:border-[#7C5CFC] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Chat</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
