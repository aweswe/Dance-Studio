import { Metadata } from 'next';
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { EnrolForm } from '@/components/public/enrol-form';
import { SITE_URL, ACADEMY, parseEnrolIntent } from '@/lib/utils/constants';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string; intent?: string }>;
}): Promise<Metadata> {
  const { intent } = await searchParams;
  const isPay = parseEnrolIntent(intent) === 'pay';
  return {
    title: isPay ? 'Enrol & Pay | Rhythmzz Academy' : 'Enrol — Free Trial Class | Rhythmzz Academy',
    description: isPay
      ? 'Enrol at Rhythmzz Academy of Dance, Neredmet X Road, Secunderabad. Pay the first month or quarter online and join your batch.'
      : 'Book your free trial class at Rhythmzz Academy of Dance, Neredmet X Road, Secunderabad. Kids Dance, Adults Dance, Mind & Body Fitness and Kuchipudi. No registration fee.',
    alternates: { canonical: `${SITE_URL}/enrol` },
  };
}

export default async function EnrolPage({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string; intent?: string }>;
}) {
  const [programmes, batches, params] = await Promise.all([
    getProgrammes(),
    getBatches(),
    searchParams,
  ]);
  const intent = parseEnrolIntent(params.intent);
  const isPay = intent === 'pay';

  return (
    <div className="bg-canvas min-h-screen pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 md:px-16 text-ink">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <EnrolForm
              key={`${intent}-${params.programme ?? ''}`}
              programmes={programmes}
              batches={batches}
              defaultProgramme={params.programme}
              intent={intent}
            />
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="mb-3">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.22em] text-bl uppercase font-bold">
                  {isPay ? 'ENROL · FIRST MONTH OR QUARTER' : 'FIRST LESSON IS FREE · ZERO ADMISSION FEE'}
                </span>
              </div>
              <h1 className="font-anton text-4xl sm:text-5xl md:text-6xl text-ink mb-4 leading-[0.95] tracking-tight uppercase">
                {isPay ? (
                  <>
                    ENROL AND <br />
                    <span className="text-bl">PAY.</span>
                  </>
                ) : (
                  <>
                    BOOK YOUR <br />
                    <span className="text-bl">FIRST CLASS.</span>
                  </>
                )}
              </h1>
              <p className="text-ink-2 text-sm sm:text-base leading-relaxed">
                  {isPay
                  ? 'Pay the first month or quarter from here. If checkout is down, we finish on WhatsApp. Use this mobile number to log into the student portal.'
                  : 'First class is free. No admission fee. We confirm the slot on WhatsApp after you send the form.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="bento-card p-4 rounded-md flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                    {isPay ? 'Pay to join the batch' : '100% Free Trial'}
                  </h4>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    {isPay
                      ? 'Monthly or quarterly fees match the pricing card. Receipts land on the student portal after confirmation.'
                      : 'No admission or registration fee. Experience the coaching before deciding.'}
                  </p>
                </div>
              </div>

              <div className="bento-card p-4 rounded-md flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">WhatsApp Coordination</h4>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    Our front desk confirms your batch timing and sends directions immediately.
                  </p>
                </div>
              </div>

              <div className="bento-card p-4 rounded-md flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0 font-mono font-bold text-xs">
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

            <div className="bento-card p-6 rounded-md border-bl/30 bg-surface flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 block mb-0.5">Need Guidance?</span>
                <p className="text-xs font-bold text-ink">Call or WhatsApp us directly</p>
              </div>
              <a
                href={`https://wa.me/${ACADEMY.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md bg-canvas border border-line text-xs font-mono font-bold text-bl hover:border-bl transition-colors inline-flex items-center gap-1.5"
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
