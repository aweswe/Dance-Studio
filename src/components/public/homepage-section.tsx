import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface HomepageSectionProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  ariaLabel?: string;
}

/** Shared homepage horizontal grid — matches hero, spotlight videos, and pricing. */
export function HomepageSection({
  children,
  className,
  innerClassName,
  id,
  ariaLabel,
}: HomepageSectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn('w-full px-4 sm:px-6 md:px-10 max-w-[1440px] mx-auto', className)}
    >
      <div className={cn('px-0 sm:px-10 lg:px-12 xl:px-14', innerClassName)}>{children}</div>
    </section>
  );
}

export function HomepageSectionHeading({
  eyebrow,
  title,
  accent,
  description,
  className,
  as = 'h2',
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  className?: string;
  as?: 'h1' | 'h2';
}) {
  const HeadingTag = as;

  return (
    <header className={cn('mb-7 sm:mb-10 max-w-2xl', className)}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl mb-2">{eyebrow}</p>
      ) : null}
      <HeadingTag className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-ink">
        {title}
        {accent ? (
          <>
            {' '}
            <span className="text-bl">{accent}</span>
          </>
        ) : null}
      </HeadingTag>
      {description ? <p className="mt-2.5 text-sm text-ink-2 leading-relaxed">{description}</p> : null}
    </header>
  );
}
