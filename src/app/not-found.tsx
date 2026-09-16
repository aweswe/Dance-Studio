import Link from 'next/link';
import { ACADEMY, ROUTES } from '@/lib/utils/constants';
import { homepageCtaBrand, homepageCtaOutlineDark, homepageCtaPair, homepageCtaPairButton } from '@/lib/ui/homepage-cta';
import { cn } from '@/lib/utils/cn';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blk text-center px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl-light mb-3">Page not found</p>
      <h1 className="font-anton text-[clamp(4rem,12vw,7.5rem)] leading-none tracking-tight text-bl uppercase">
        404
      </h1>
      <p className="text-sm text-white/50 max-w-md mt-6 mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist. But the dance floor is always open at {ACADEMY.name}.
      </p>
      <div className={cn(homepageCtaPair, 'sm:max-w-[24rem]')}>
        <Link href={ROUTES.home} className={cn(homepageCtaBrand, homepageCtaPairButton)}>
          Back home
        </Link>
        <Link href={ROUTES.contact} className={cn(homepageCtaOutlineDark, homepageCtaPairButton)}>
          Contact us
        </Link>
      </div>
    </main>
  );
}
