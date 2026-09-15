import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { getProgrammes, type ProgrammeItem } from '@/data/programmes';
import { enrolHref } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';
import {
  formatInr,
  pricingMetaForSlug,
  quarterlySavings,
} from '@/lib/programmes/pricing-display';

function programmeWhatsAppMessage(name: string, monthly: number, quarterly: number) {
  return (
    `Hi Rhythmzz! I'd like to enquire about ${name}.\n` +
    `Monthly: ${formatInr(monthly)} · Quarterly: ${formatInr(quarterly)}.\n` +
    `Please share batch timings and how to book.`
  );
}

function Tier({
  label,
  amount,
  save,
  featured = false,
}: {
  label: string;
  amount: string;
  save?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center rounded-xl px-2 py-3 text-center min-h-[68px]',
        featured
          ? 'bg-[#F5FB38] text-[#0a0a0a] shadow-[0_6px_28px_-8px_rgba(245,251,56,0.55)]'
          : 'bg-white/[0.03] border border-white/[0.07]',
      ].join(' ')}
    >
      <span
        className={`font-anton text-lg leading-none tracking-tight ${featured ? 'text-[#0a0a0a]' : 'text-white'}`}
      >
        {amount}
      </span>
      <span
        className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.11em] ${featured ? 'text-[#0a0a0a]/65' : 'text-white/40'}`}
      >
        {label}
      </span>
      {save && (
        <span className={`mt-0.5 text-[8px] font-semibold ${featured ? 'text-[#0a0a0a]/55' : 'text-[#F5FB38]/80'}`}>
          {save}
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
  const waHref = whatsappLink(
    programmeWhatsAppMessage(programme.name, programme.fees_monthly, programme.fees_quarterly),
  );

  return (
    <article className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
      <div className="mb-5 min-w-0">
        <h3 className="font-anton text-lg uppercase leading-tight tracking-tight text-white">
          {programme.name}
        </h3>
        <p className="mt-1 text-[11px] text-white/45 leading-snug line-clamp-1">
          {programme.tagline || meta.tagline}
        </p>
        {meta.schedule && (
          <p className="mt-2.5 text-[10px] text-white/30">{meta.schedule}</p>
        )}
      </div>

      <div className={`grid gap-2 mb-6 ${showDropIn ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {showDropIn && dropIn != null && <Tier label="Drop-in" amount={formatInr(dropIn)} />}
        <Tier label="Monthly" amount={formatInr(programme.fees_monthly)} />
        <Tier
          label="Quarterly"
          amount={formatInr(programme.fees_quarterly)}
          save={save > 0 ? `Save ${formatInr(save)}` : undefined}
          featured
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-1">
        <Link
          href={enrolHref({ programme: programme.slug, intent: 'pay' })}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] rounded-full bg-white text-[#0a0a0a] text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#F5FB38] transition-colors"
        >
          Book &amp; pay
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 min-h-[48px] justify-center rounded-full border border-[#25D366]/30 px-4 py-2.5 hover:border-[#25D366]/50 hover:bg-[#25D366]/[0.07] transition-colors"
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#25D366]">
            <MessageCircle size={15} strokeWidth={2} className="opacity-90" />
            Enquire on WhatsApp
          </span>
          <span className="text-[9px] font-normal normal-case tracking-normal text-white/40 group-hover:text-white/55 transition-colors">
            Programme &amp; fees pre-filled — just tap send
          </span>
        </a>
      </div>
    </article>
  );
}

export async function ProgrammePricingBoard() {
  const programmes = await getProgrammes();

  return (
    <section className="px-4 sm:px-6 md:px-10 pb-8 sm:pb-10 max-w-[1440px] mx-auto">
      <div className="rounded-[20px] sm:rounded-[28px] bg-[#050505] border border-white/[0.07] px-5 sm:px-8 lg:px-10 py-7 sm:py-9">
        <header className="mb-7 sm:mb-8 max-w-md">
          <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-white">
            Pick a class.{' '}
            <span className="text-[#F5FB38]">Pay your way.</span>
          </h2>
          <p className="mt-2.5 text-sm text-white/40">
            Quarterly saves most · First class free
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {programmes.map((programme) => (
            <ProgrammePricingCard key={programme.id} programme={programme} />
          ))}
        </div>
      </div>
    </section>
  );
}
