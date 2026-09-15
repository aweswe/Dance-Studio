import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getProgrammes, type ProgrammeItem } from '@/data/programmes';
import { ACADEMY, enrolHref } from '@/lib/utils/constants';
import {
  formatInr,
  pricingMetaForSlug,
  quarterlySavings,
} from '@/lib/programmes/pricing-display';

function Tier({
  label,
  amount,
  hint,
  featured = false,
}: {
  label: string;
  amount: string;
  hint?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        'relative flex flex-col items-center justify-center rounded-xl px-2 py-2.5 sm:py-3 text-center min-h-[72px] transition-colors',
        featured
          ? 'bg-[#F5FB38] text-[#0a0a0a] shadow-[0_0_0_1px_rgba(245,251,56,0.4),0_8px_24px_-8px_rgba(245,251,56,0.45)] z-[1] sm:scale-[1.04]'
          : 'bg-white/[0.04] text-white border border-white/[0.08]',
      ].join(' ')}
    >
      {featured && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#7C5CFC] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white">
          Best value
        </span>
      )}
      <span className={`font-anton text-lg sm:text-xl leading-none tracking-tight ${featured ? 'text-[#0a0a0a]' : 'text-white'}`}>
        {amount}
      </span>
      <span className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${featured ? 'text-[#0a0a0a]/70' : 'text-white/45'}`}>
        {label}
      </span>
      {hint && (
        <span className={`mt-0.5 text-[8px] font-medium ${featured ? 'text-[#0a0a0a]/60' : 'text-[#F5FB38]/80'}`}>
          {hint}
        </span>
      )}
    </div>
  );
}

function ProgrammePricingCard({ programme }: { programme: ProgrammeItem }) {
  const meta = pricingMetaForSlug(programme.slug, programme.batches_info);
  const showDropIn = meta.dropIn !== null && meta.dropIn !== undefined;
  const dropIn = meta.dropIn ?? undefined;
  const save = quarterlySavings(programme.fees_monthly, programme.fees_quarterly);
  const title = meta.shortLabel ?? programme.name.replace(/ programme$/i, '');

  return (
    <article className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 hover:border-white/[0.14] transition-colors">
      <div className="mb-4 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F5FB38]/90 mb-1">
          {title}
        </p>
        <h3 className="font-anton text-lg sm:text-xl uppercase leading-tight tracking-tight text-white truncate">
          {programme.name}
        </h3>
        <p className="mt-1.5 text-[11px] sm:text-xs text-white/45 leading-snug line-clamp-2">
          {programme.tagline || meta.tagline}
        </p>
      </div>

      <div
        className={`grid gap-2 mb-4 ${showDropIn ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
        {showDropIn && dropIn != null && (
          <Tier label="Drop-in" amount={formatInr(dropIn)} hint="One class" />
        )}
        <Tier label="Monthly" amount={formatInr(programme.fees_monthly)} />
        <Tier
          label="Quarterly"
          amount={formatInr(programme.fees_quarterly)}
          hint={save > 0 ? `Save ${formatInr(save)}` : undefined}
          featured
        />
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Link
          href={enrolHref({ programme: programme.slug, intent: 'pay' })}
          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] rounded-full bg-white text-[#0a0a0a] text-[10px] font-black uppercase tracking-[0.12em] hover:bg-[#F5FB38] transition-colors"
        >
          Book &amp; pay
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>
        <div className="flex items-center justify-between gap-2 text-[10px]">
          {meta.schedule ? (
            <span className="text-white/35 truncate">{meta.schedule}</span>
          ) : (
            <span className="text-white/35">{programme.age_group}</span>
          )}
          <a
            href={ACADEMY.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-semibold text-[#25D366] hover:text-[#2ee66d] transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export async function ProgrammePricingBoard() {
  const programmes = await getProgrammes();

  return (
    <section className="px-4 sm:px-6 md:px-10 pb-8 sm:pb-10 max-w-[1440px] mx-auto">
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#050505] border border-white/[0.07] px-5 sm:px-8 lg:px-10 py-8 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#7C5CFC]/10 blur-[80px]"
          aria-hidden
        />

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7C5CFC] mb-2">
              Pricing &amp; booking
            </p>
            <h2 className="font-anton text-3xl sm:text-4xl md:text-[2.75rem] uppercase leading-[0.95] tracking-tight text-white">
              Pick a class.
              <span className="block text-[#F5FB38]">Pay your way.</span>
            </h2>
            <p className="mt-3 text-sm text-white/45 max-w-md leading-relaxed">
              Drop-in, monthly, or quarterly — quarterly saves the most. UPI at checkout. First class is free.
            </p>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30 sm:text-right shrink-0">
            No registration fee
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {programmes.map((programme) => (
            <ProgrammePricingCard key={programme.id} programme={programme} />
          ))}
        </div>
      </div>
    </section>
  );
}
