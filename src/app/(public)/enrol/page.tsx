import { Metadata } from 'next';
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { EnrolForm } from '@/components/public/enrol-form';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enrol Now',
  description: 'Join Rhythmzz Academy of Dance today. Enrol in our kids dance, adults dance, fitness, or Kuchipudi programs.',
};

export default async function EnrolPage() {
  const [programmes, batches] = await Promise.all([
    getProgrammes(),
    getBatches()
  ]);

  return (
    <div className="bg-light min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Form Column */}
        <div className="order-2 lg:order-1">
          <EnrolForm programmes={programmes} batches={batches} />
        </div>

        {/* Info Column */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Join Us</div>
          <h1 className="heading-display text-4xl md:text-5xl text-blk mb-6">START YOUR JOURNEY</h1>
          <p className="text-mu mb-10 leading-relaxed">
            Ready to dance? Enrol in our classes and become part of the Rhythmzz family. We offer programs for all age groups and skill levels.
          </p>

          <div className="bg-white p-8 rounded-2xl border border-black/5 mb-8 shadow-sm">
            <h3 className="text-[12px] font-bold tracking-[2px] uppercase mb-6 border-b border-black/5 pb-4">What's Included</h3>
            <ul className="space-y-4">
              {[
                "Professional instruction from certified trainers",
                "Access to fully equipped AC studios",
                "Performance opportunities in annual showcases",
                "Progress tracking and personalized feedback",
                "Make-up classes for missed sessions (subject to availability)"
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
              Not sure which class is right for you? Our team is happy to help you find the perfect fit.
            </p>
            <p className="text-sm font-semibold text-blk">Call us at +91 90529 80859</p>
          </div>
        </div>
      </div>
    </div>
  );
}
