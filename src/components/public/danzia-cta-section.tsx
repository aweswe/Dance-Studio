'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { WhatsAppIcon } from '@/components/public/whatsapp-icon';
import {
  homepageCtaPairButton,
  homepageCtaPairCentered,
  homepageCtaPrimary,
  homepageCtaWhatsApp,
} from '@/lib/ui/homepage-cta';
import { ACADEMY, ROUTES } from '@/lib/utils/constants';

export function DanziaCTASection() {
  return (
    <HomepageSection className="py-16 sm:py-24 select-none">
      <div className="ink-stage text-wh py-12 sm:py-16 md:py-20 px-6 sm:px-10 rounded-md border border-white/10 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bl/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <h2 className="font-anton uppercase tracking-tight leading-[0.92] text-wh mb-4 sm:mb-5 flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl md:text-[2.25rem]">Move</span>
            <span className="text-2xl sm:text-3xl md:text-[2.25rem] text-bl">Different</span>
          </h2>

          <p className="max-w-xl text-sm sm:text-base text-wh/80 leading-relaxed mb-8 sm:mb-10">
            Message {ACADEMY.phoneDisplay} with the dancer&apos;s age and a time that works. We&apos;ll put you in a trial.
          </p>

          <div className={homepageCtaPairCentered}>
            <Link href={ROUTES.enrol} className={`${homepageCtaPrimary} ${homepageCtaPairButton}`}>
              Book free trial
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </Link>
            <a
              href={ACADEMY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`${homepageCtaWhatsApp} ${homepageCtaPairButton}`}
            >
              <WhatsAppIcon className="size-3.5 shrink-0" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </HomepageSection>
  );
}
