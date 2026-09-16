import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { homepageCtaBrand, homepageCtaOutlineLight, homepageCtaPairButton } from '@/lib/ui/homepage-cta';

export function CardFooterActions({
  className,
  secondaryHref,
  secondaryLabel,
  primaryHref,
  primaryLabel,
  primaryIcon,
  onSecondaryClick,
  onPrimaryClick,
}: {
  className?: string;
  secondaryHref: string;
  secondaryLabel: string;
  primaryHref: string;
  primaryLabel: ReactNode;
  primaryIcon?: ReactNode;
  onSecondaryClick?: () => void;
  onPrimaryClick?: () => void;
}) {
  return (
    <div className={cn('flex items-stretch gap-3 sm:gap-4 w-full @md:w-auto min-w-0', className)}>
      <Link
        href={secondaryHref}
        prefetch
        onClick={onSecondaryClick}
        className={cn(homepageCtaOutlineLight, homepageCtaPairButton, '@md:flex-none')}
      >
        {secondaryLabel}
      </Link>
      <Link
        href={primaryHref}
        prefetch
        onClick={onPrimaryClick}
        className={cn(homepageCtaBrand, homepageCtaPairButton, '@md:flex-none')}
      >
        {primaryLabel}
        {primaryIcon}
      </Link>
    </div>
  );
}

export function CardPriceBlock({
  amount,
  className,
}: {
  amount: string;
  className?: string;
}) {
  return (
    <div className={cn('shrink-0', className)}>
      <span className="font-anton text-2xl sm:text-3xl text-ink tracking-tight">{amount}</span>
      <span className="text-[10px] font-mono text-ink-3 ml-1.5">/month</span>
    </div>
  );
}
