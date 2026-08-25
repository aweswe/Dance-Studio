import { Metadata } from 'next';
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { EnrolForm } from '@/components/public/enrol-form';
import { SITE_URL } from '@/lib/utils/constants';
import { CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Enrol — Free Trial Class',
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
    <div className="bg-canvas-muted min-h-screen py-16 px-6 md:px-16 text-ink">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Form Column */}
        <div className="order-2 lg:order-1">
          <EnrolForm programmes={programmes} batches={batches} defaultProgramme={programme} />
        </div>

        {/* Info Column */}
        <Reveal className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="section-label mb-3">Free Trial Class</div>
          <h1 className="heading-display text-4xl md:text-5xl text-ink mb-6">BOOK YOUR FIRST CLASS</h1>
          <p className="text-ink-2 mb-10 leading-relaxed">
            Every new student starts with one free trial class at Neredmet X Road, Secunderabad.
            Pick your programme and batch below — we&apos;ll confirm your slot on WhatsApp.
          </p>

          <div className="bg-surface p-8 rounded-card border border-line mb-8">
            <h3 className="text-xs font-bold tracking-[2px] uppercase mb-6 border-b border-line pb-4">What&apos;s Included</h3>
            <ul className="space-y-4">
              {[
                "One free trial class — no registration fee, no commitment",
                "Air-conditioned studio at Neredmet X Road Bus Stop, above ICICI ATM",
                "Batches Monday to Saturday, 6 AM to 9 PM",
                "Stage performance slots in our shows and recitals",
                "Attendance and fees tracked in your student dashboard"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start text-sm text-ink-2">
                  <CheckCircle2 className="text-green shrink-0 mt-0.5" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-bl/10 p-8 rounded-card border border-bl/20">
            <h3 className="text-xs font-bold tracking-[2px] uppercase mb-4 text-ink">Need Help?</h3>
            <p className="text-sm text-ink-2 mb-4 leading-relaxed">
              Not sure which programme fits? Message us on WhatsApp and we&apos;ll help you pick —
              we reply within 2 hours.
            </p>
            <p className="text-sm font-semibold text-ink">Call or WhatsApp +91 90529 80859</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
