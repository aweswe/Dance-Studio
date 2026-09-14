import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const actionBase =
  'inline-flex flex-1 @md:flex-none items-center justify-center min-h-11 px-5 rounded-xl text-[11px] font-mono uppercase tracking-wider transition-colors active:scale-[0.98]';

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
        className={cn(
          actionBase,
          'border border-line bg-surface text-ink-2 hover:text-ink hover:border-line-strong',
        )}
      >
        {secondaryLabel}
      </Link>
      <Link
        href={primaryHref}
        prefetch
        onClick={onPrimaryClick}
        className={cn(
          actionBase,
          'gap-1.5 border-0 btn-sun font-black tracking-[0.12em] whitespace-nowrap',
        )}
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
