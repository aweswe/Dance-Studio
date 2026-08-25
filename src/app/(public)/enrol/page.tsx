import { Metadata } from 'next';
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { EnrolForm } from '@/components/public/enrol-form';
import { SITE_URL } from '@/lib/utils/constants';
import { CheckCircle2 } from 'lucide-react';

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
    <div className="bg-light min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Form Column */}
        <div className="order-2 lg:order-1">
          <EnrolForm programmes={programmes} batches={batches} defaultProgramme={programme} />
        </div>

        {/* Info Column */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Free Trial Class</div>
          <h1 className="heading-display text-4xl md:text-5xl text-blk mb-6">BOOK YOUR FIRST CLASS</h1>
          <p className="text-mu mb-10 leading-relaxed">
            Every new student starts with one free trial class at Neredmet X Road, Secunderabad.
            Pick your programme and batch below — we&apos;ll confirm your slot on WhatsApp.
          </p>

          <div className="bg-white p-8 rounded-2xl border border-black/5 mb-8 shadow-sm">
            <h3 className="text-[12px] font-bold tracking-[2px] uppercase mb-6 border-b border-black/5 pb-4">What&apos;s Included</h3>
            <ul className="space-y-4">
              {[
                "One free trial class — no registration fee, no commitment",
                "Air-conditioned studio at Neredmet X Road Bus Stop, above ICICI ATM",
                "Batches Monday to Saturday, 6 AM to 9 PM",
                "Stage performance slots in our shows and recitals",
                "Attendance and fees tracked in your student dashboard"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start text-sm text-mu">
                  <CheckCircle2 className="text-green shrink-0 mt-0.5" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-bl/10 p-8 rounded-2xl border border-bl/20">
            <h3 className="text-[12px] font-bold tracking-[2px] uppercase mb-4 text-blk">Need Help?</h3>
            <p className="text-sm text-mu mb-4 leading-relaxed">
              Not sure which programme fits? Message us on WhatsApp and we&apos;ll help you pick —
              we reply within 2 hours.
            </p>
            <p className="text-sm font-semibold text-blk">Call or WhatsApp +91 90529 80859</p>
          </div>
        </div>
      </div>
    </div>
  );
}
