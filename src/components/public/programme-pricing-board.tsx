import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getProgrammes, type ProgrammeItem } from '@/data/programmes';
import { enrolHref } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';
import {
  formatInr,
  pricingMetaForSlug,
  quarterlySavings,
} from '@/lib/programmes/pricing-display';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
        'flex flex-col items-center justify-center rounded-sm px-2 py-3 text-center min-h-[68px]',
        featured
          ? 'bg-bl text-blk shadow-[0_6px_28px_-8px_rgba(43,180,216,0.55)]'
          : 'bg-white/[0.03] border border-white/[0.07]',
      ].join(' ')}
    >
      <span
        className={`font-anton text-lg leading-none tracking-tight ${featured ? 'text-blk' : 'text-white'}`}
      >
        {amount}
      </span>
      <span
        className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.11em] ${featured ? 'text-blk/65' : 'text-white/40'}`}
      >
        {label}
      </span>
      {save && (
        <span className={`mt-0.5 text-[8px] font-semibold ${featured ? 'text-blk/55' : 'text-bl/80'}`}>
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
    <article className="flex flex-col rounded-lg border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
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

      <div className={`grid gap-2.5 mb-6 ${showDropIn ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {showDropIn && dropIn != null && <Tier label="Drop-in" amount={formatInr(dropIn)} />}
        <Tier label="Monthly" amount={formatInr(programme.fees_monthly)} />
        <Tier
          label="Quarterly"
          amount={formatInr(programme.fees_quarterly)}
          save={save > 0 ? `Save ${formatInr(save)}` : undefined}
          featured
        />
      </div>

      <div className="mt-auto flex w-full flex-col gap-2.5 pt-1">
        <Link
          href={enrolHref({ programme: programme.slug, intent: 'pay' })}
          className="flex w-full items-center justify-center gap-1.5 min-h-[44px] rounded-md bg-white px-4 text-blk text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-bl transition-colors"
        >
          Book &amp; pay
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-1.5 min-h-[40px] rounded-md px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#25D366] ring-1 ring-[#25D366]/35 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white hover:ring-[#25D366] transition-colors"
        >
          <WhatsAppIcon className="size-3.5 shrink-0" />
          WhatsApp enquire
        </a>
      </div>
    </article>
  );
}

export async function ProgrammePricingBoard() {
  const programmes = await getProgrammes();

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 pt-12 sm:pt-14 md:pt-16 pb-8 sm:pb-10 max-w-[1440px] mx-auto">
      <div className="px-6 sm:px-10 lg:px-12 xl:px-14">
        <header className="mb-7 sm:mb-8 max-w-md">
          <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-white">
            Pick a class.{' '}
            <span className="text-bl">Pay your way.</span>
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
