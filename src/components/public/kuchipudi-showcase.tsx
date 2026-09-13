import Link from 'next/link';
import Image from 'next/image';
import { enrolHref, ROUTES } from '@/lib/utils/constants';

export function KuchipudiShowcase() {
  return (
    <div className="bg-canvas text-ink">
      <section className="px-4 sm:px-8 md:px-14 py-16 sm:py-24 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
              Classical · Fri &amp; Sat
            </p>
            <h1 className="font-anton text-5xl sm:text-7xl uppercase tracking-tight leading-[1.05] mb-5">
              Kuchipudi
            </h1>
            <p className="text-ink-2 text-sm sm:text-base leading-relaxed max-w-md mb-8">
              Srusti, 6:30 to 7:30. From age 5. Exam when she says you are ready — not before.
            </p>
            <dl className="divide-y divide-line border-y border-line mb-8">
              {[
                ['Days', 'Friday & Saturday'],
                ['Time', '6:30 – 7:30 pm'],
                ['Fee', '₹2,000 / month · ₹5,000 / quarter'],
              ].map(([k, v]) => (
                <div key={k} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-ink-3 w-24 shrink-0">
                    {k}
                  </dt>
                  <dd className="text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3">
              <Link
                href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
                className="btn-sun px-6 py-3 text-xs font-black uppercase tracking-[0.16em]"
              >
                Book a trial
              </Link>
              <Link
                href={ROUTES.syllabusKuchipudi}
                className="px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-line hover:border-ink"
              >
                Syllabus
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-canvas-muted">
            <Image
              src="/images/classical-certification-dancer.png"
              alt="Kuchipudi at Rhythmzz"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
