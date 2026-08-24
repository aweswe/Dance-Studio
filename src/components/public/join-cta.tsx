import Link from 'next/link';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';

const PERKS = [
  { value: '₹0', label: 'Registration Fee' },
  { value: '1', label: 'Free Trial Class' },
  { value: '₹2,000', label: 'Fees From · /Month' },
];

/** Join band per the reference .join-sec — light blue, three big-number perks. */
export function JoinCTA() {
  return (
    <section id="join" className="py-24 px-6 md:px-16 bg-bl-pale border-y border-bl/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">Join The Academy</div>
          <h2 className="heading-display text-4xl md:text-6xl text-blk leading-[0.95]">
            YOUR FIRST CLASS
            <br />
            IS ON US.
          </h2>
          <p className="text-sm text-mu max-w-md mt-4 leading-relaxed">
            Every new student starts with one free trial class — no registration fee, no
            commitment. Kids, adults, fitness and classical batches run Monday to Saturday,
            6 AM to 9 PM, at Neredmet X Road Bus Stop.
          </p>
        </Reveal>

        <Reveal y={20} delay={0.1}>
          <div className="flex gap-4 mb-8">
            {PERKS.map((perk) => (
              <div
                key={perk.label}
                className="flex-1 bg-white border border-bl/15 rounded-xl px-4 py-6 text-center"
              >
                <div className="heading-display text-4xl text-bl leading-none">{perk.value}</div>
                <p className="text-[10px] tracking-[2px] uppercase text-mu mt-2">{perk.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link
              href={ROUTES.enrol}
              className="bg-bl text-white text-[11px] font-semibold tracking-[2px] uppercase py-4 px-10 hover:opacity-85 transition-opacity"
            >
              Book Your Free Trial
            </Link>
            <a
              href={ACADEMY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[1.5px] uppercase text-blk hover:text-bl transition-colors"
            >
              or WhatsApp {ACADEMY.phoneDisplay} &rarr;
            </a>
          </div>

          <p className="text-[11px] tracking-[1px] text-mu/80 mt-5">
            Mon–Sat 6 AM–9 PM · Neredmet X Road · Secunderabad
          </p>
        </Reveal>
      </div>
    </section>
  );
}
