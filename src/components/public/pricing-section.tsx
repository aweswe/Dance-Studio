import Link from 'next/link';
import { getProgrammes } from '@/data/programmes';
import { ROUTES } from '@/lib/utils/constants';
import { ArrowUpRight } from 'lucide-react';

// Accent colour per programme index — cycles if there are more classes
const ACCENTS = [
  { bg: '#000000', text: '#F5FB38', sub: 'rgba(245,251,56,0.12)' },
  { bg: '#F5FB38', text: '#000000', sub: 'rgba(0,0,0,0.08)' },
  { bg: '#1a0a2e', text: '#a78bfa', sub: 'rgba(167,139,250,0.12)' },
  { bg: '#000000', text: '#F5FB38', sub: 'rgba(245,251,56,0.12)' },
  { bg: '#F5FB38', text: '#000000', sub: 'rgba(0,0,0,0.08)' },
  { bg: '#1a0a2e', text: '#a78bfa', sub: 'rgba(167,139,250,0.12)' },
];

export async function PricingSection() {
  const programmes = await getProgrammes();
  const active = programmes.filter((p) => p.is_active);

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 pb-24 sm:pb-32 max-w-[1360px] mx-auto">

      {/* Header row */}
      <div className="flex items-baseline justify-between mb-10 px-1">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-2 mb-1">03 · Classes &amp; Fees</p>
          <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-ink uppercase tracking-tight leading-none">
            PICK YOUR<br />
            <span className="text-[#7C5CFC]">CLASS.</span>
          </h2>
        </div>
        <Link
          href={ROUTES.enrol}
          className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-ink-3 hover:text-ink transition-colors border border-line px-4 py-2.5 rounded-xl hover:border-ink"
        >
          Book a Free Trial <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Cards grid — auto-fills for any number of classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {active.map((programme, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const isYellow = accent.bg === '#F5FB38';

          return (
            <Link
              key={programme.id}
              href={`${ROUTES.enrol}?programme=${programme.slug}`}
              className="group block rounded-[24px] overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-md hover:shadow-xl"
              style={{ backgroundColor: accent.bg }}
            >
              <div className="p-6 sm:p-7 flex flex-col h-full min-h-[220px]">

                {/* Price — the visual hero */}
                <div className="flex items-end gap-2 mb-4">
                  <span
                    className="font-anton text-5xl sm:text-6xl leading-none tracking-tight"
                    style={{ color: accent.text }}
                  >
                    ₹{programme.fees_monthly?.toLocaleString('en-IN')}
                  </span>
                  <span
                    className="font-mono text-[11px] uppercase tracking-wider mb-1.5"
                    style={{ color: accent.text, opacity: 0.55 }}
                  >
                    /month
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px mb-4"
                  style={{ backgroundColor: accent.text, opacity: 0.15 }}
                />

                {/* Name */}
                <span
                  className="font-anton text-xl sm:text-2xl uppercase tracking-tight leading-tight mb-1"
                  style={{ color: accent.text }}
                >
                  {programme.name}
                </span>

                {/* Age group */}
                <span
                  className="font-mono text-[10px] uppercase tracking-widest mt-1"
                  style={{ color: accent.text, opacity: 0.5 }}
                >
                  {programme.age_group}
                </span>

                {/* Quarterly note */}
                {programme.fees_quarterly && (
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider mt-1"
                    style={{ color: accent.text, opacity: 0.4 }}
                  >
                    ₹{programme.fees_quarterly.toLocaleString('en-IN')} per quarter
                  </span>
                )}

                {/* Arrow — bottom right */}
                <div className="mt-auto pt-4 flex justify-end">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: accent.text }}
                  >
                    <ArrowUpRight
                      size={16}
                      style={{ color: accent.bg }}
                      className="stroke-[2.5]"
                    />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden text-center mt-6">
        <Link
          href={ROUTES.enrol}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-ink-3 hover:text-ink transition-colors"
        >
          Book a Free Trial <ArrowUpRight size={12} />
        </Link>
      </div>
    </section>
  );
}
