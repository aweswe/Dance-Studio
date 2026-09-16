import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';
import { homepageCtaBrand, homepageCtaOutlineLight, homepageCtaPair, homepageCtaPairButton } from '@/lib/ui/homepage-cta';
import { cn } from '@/lib/utils/cn';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24 bg-canvas text-ink">
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl mb-3">404</p>
        <h1 className="font-anton text-4xl sm:text-5xl text-ink mb-4 uppercase tracking-tight leading-[0.95]">
          This page isn&apos;t on the floor
        </h1>
        <p className="text-sm text-ink-2 leading-relaxed mb-8">
          Head back to the programmes, or talk to us directly.
        </p>
        <div className={cn(homepageCtaPair, 'sm:mx-auto')}>
          <Link href={ROUTES.programmes} className={cn(homepageCtaBrand, homepageCtaPairButton)}>
            View programmes
          </Link>
          <Link href={ROUTES.contact} className={cn(homepageCtaOutlineLight, homepageCtaPairButton)}>
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
