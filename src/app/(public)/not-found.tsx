import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24 bg-canvas text-ink">
      {/* in-page notFound() streams as 200 (soft 404) — noindex keeps it out of search results */}
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <div className="section-label mb-3">404 · Curtain Call</div>
        <h1 className="heading-display text-6xl text-ink mb-4">THIS PAGE ISN&apos;T ON THE FLOOR</h1>
        <p className="text-sm text-ink-2 leading-relaxed mb-8">
          The page you are looking for has left the stage. Head back to the programmes, or talk to
          us directly.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href={ROUTES.programmes}
            className="bg-blk text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 px-9 hover:bg-bl transition-all focus-visible:focus-ring active:scale-[0.98]"
          >
            View Programmes
          </Link>
          <Link
            href={ROUTES.contact}
            className="border border-line-strong text-ink text-[11px] font-medium tracking-[2px] uppercase py-[13px] px-8 hover:border-bl hover:text-bl transition-all focus-visible:focus-ring active:scale-[0.98]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
