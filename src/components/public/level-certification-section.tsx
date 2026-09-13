import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

interface LevelCertificationSectionProps {
  className?: string;
  showExploreCurriculum?: boolean;
}

export function LevelCertificationSection({
  className = '',
  showExploreCurriculum = true,
}: LevelCertificationSectionProps) {
  return (
    <section className={`w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-14 py-16 sm:py-24 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Image */}
        <div className="relative w-full aspect-[4/4.8] rounded-[24px] overflow-hidden bg-canvas border border-line shadow-md">
          <Image
            src="/images/classical-certification-dancer.png"
            alt="Classical dance certification at Rhythmzz"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 text-white">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#F5FB38] mb-0.5">IAO Accredited</p>
            <p className="font-anton text-lg uppercase tracking-wide">Aramandi · Mudras · Natyashastra</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8">
          {/* Heading */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
              Classical · Kuchipudi
            </p>
            <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl text-ink tracking-tight uppercase leading-[1.05]">
              THE KUCHIPUDI<br />SYLLABUS
            </h2>
          </div>

          <div className="divide-y divide-line border-t border-b border-line">
            {[
              { label: 'Who', value: 'Srusti · Fri & Sat 6:30' },
              { label: 'How', value: 'Monthly or quarterly. Not a drop-in.' },
              { label: 'Then', value: 'Exam when she says you are ready' },
            ].map(({ label, value }) => (
              <div key={label} className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-3 shrink-0 w-40">{label}</span>
                <span className="text-sm text-ink font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={ROUTES.enrol}
              className="btn-sun py-3 px-6 text-xs font-black tracking-[0.16em] uppercase flex items-center gap-2 active:scale-[0.97]"
            >
              Book Free Trial
            </Link>
            {showExploreCurriculum && (
              <Link
                href={ROUTES.syllabusKuchipudi}
                className="py-3 px-6 rounded-xl text-xs font-mono font-bold tracking-[0.15em] uppercase bg-surface text-ink border border-line hover:border-ink transition-all active:scale-[0.97]"
              >
                View Syllabus
              </Link>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
