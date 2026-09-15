import Link from 'next/link';
import { getProgrammes } from '@/data/programmes';
import { enrolHref, ROUTES } from '@/lib/utils/constants';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { SnapCarousel, snapSlideClass } from '@/components/public/snap-carousel';

const TILES = ['ink', 'sun', 'velvet'] as const;

export async function PricingSection() {
  const programmes = await getProgrammes();
  const active = programmes;

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 pb-24 sm:pb-32 max-w-[1360px] mx-auto">
      <div className="flex items-baseline justify-between mb-10 px-1">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-2 mb-1">03 · Classes &amp; Fees</p>
          <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-ink uppercase tracking-tight leading-none">
            PICK YOUR<br />
            <span className="text-bl">CLASS.</span>
          </h2>
        </div>
        <Link
          href={ROUTES.enrol}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-ink border border-line px-4 py-2.5 rounded-xl hover:border-ink"
        >
          Book a free trial <ArrowUpRight size={12} />
        </Link>
      </div>

      <SnapCarousel columns={3}>
        {active.map((programme, i) => {
          const tile = TILES[i % TILES.length];
          const arrowOn =
            tile === 'sun'
              ? 'bg-blk text-bl'
              : tile === 'velvet'
                ? 'bg-purp/25 text-blk'
                : 'bg-bl text-blk';

          return (
            <Link
              key={programme.id}
              href={enrolHref({ programme: programme.slug, intent: 'pay' })}
              className={cn(
                snapSlideClass,
                'group block rounded-[24px] overflow-hidden hover:-translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.96]',
                tile === 'ink' && 'fee-tile-ink',
                tile === 'sun' && 'fee-tile-sun',
                tile === 'velvet' && 'fee-tile-velvet',
              )}
            >
              <div className="p-6 sm:p-7 flex flex-col h-full min-h-[220px]">
                <div className="flex items-end gap-2 mb-4">
                  <span className="font-anton text-5xl sm:text-6xl leading-none tracking-tight">
                    ₹{programme.fees_monthly?.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider mb-1.5 opacity-55">
                    /month
                  </span>
                </div>

                <div className="w-full h-px mb-4 bg-current opacity-15" />

                <span className="font-anton text-xl sm:text-2xl uppercase tracking-tight leading-tight mb-1">
                  {programme.name}
                </span>

                <span className="font-mono text-[10px] uppercase tracking-widest mt-1 opacity-50">
                  {programme.age_group}
                </span>

                {programme.fees_quarterly && (
                  <span className="font-mono text-[10px] uppercase tracking-wider mt-1 opacity-40">
                    ₹{programme.fees_quarterly.toLocaleString('en-IN')} per quarter
                  </span>
                )}

                <div className="mt-auto pt-4 flex justify-end">
                  <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', arrowOn)}>
                    <ArrowUpRight size={16} className="stroke-[2.5]" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </SnapCarousel>

      <div className="sm:hidden text-center mt-6">
        <Link
          href={ROUTES.enrol}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-ink"
        >
          Book a free trial <ArrowUpRight size={12} />
        </Link>
      </div>
    </section>
  );
}
