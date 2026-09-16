'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { WhatsAppIcon } from '@/components/public/whatsapp-icon';
import { sectionPadLg } from '@/lib/ui/section-layout';
import { ACADEMY, ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const stackGap = 'gap-4 sm:gap-5';

const mainCtaBase =
  'inline-flex w-full items-center justify-center gap-2 min-h-[52px] sm:min-h-[56px] px-7 sm:px-9 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] transition-colors active:scale-[0.98] touch-manipulation whitespace-nowrap';

const mainCtaPrimary = cn(
  mainCtaBase,
  'bg-white text-blk hover:bg-bl',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-blk',
);

const mainCtaWhatsApp = cn(
  mainCtaBase,
  'text-[#25D366] ring-1 ring-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white hover:ring-[#25D366]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-blk',
);

export function PublicBookTrialCta({
  id = 'book',
  eyebrow = 'Free trial',
  title = 'Move',
  accent = 'Different',
  description = "WhatsApp age and preferred time — we'll confirm your free trial.",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  description?: string;
}) {
  return (
    <section id={id} className="relative w-full overflow-hidden bg-blk text-wh">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bl/25 via-transparent to-transparent"
        aria-hidden
      />

      <HomepageSection className={cn('relative', sectionPadLg)}>
        <div className={cn('mx-auto flex max-w-4xl flex-col items-center text-center', stackGap)}>
          <div className={cn('flex flex-col items-center', stackGap)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl-light">{eyebrow}</p>
            <h2 className="font-anton uppercase leading-[0.92] tracking-tight text-wh">
              <span className="block text-[clamp(2.75rem,9vw,5.25rem)]">{title}</span>
              <span className="block text-[clamp(2.75rem,9vw,5.25rem)] text-bl">{accent}</span>
            </h2>
            <p className="max-w-md text-base sm:text-lg text-wh/70 leading-relaxed">{description}</p>
          </div>

          <div className="grid w-full max-w-[34rem] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <Link href={ROUTES.enrol} className={mainCtaPrimary}>
              Book free trial
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
            <a
              href={ACADEMY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={mainCtaWhatsApp}
            >
              <WhatsAppIcon className="size-4 shrink-0" />
              WhatsApp us
            </a>
          </div>
        </div>
      </HomepageSection>
    </section>
  );
}
