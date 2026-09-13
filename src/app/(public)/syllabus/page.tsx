import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Syllabus adoption',
  description: 'Kuchipudi and Kathak syllabus adoption at Rhythmzz Academy, Neredmet.',
  alternates: { canonical: `${SITE_URL}/syllabus` },
};

const STYLES = [
  {
    href: '/syllabus/kuchipudi',
    name: 'Kuchipudi',
    note: 'Srusti · Fri & Sat 6:30',
    status: 'On the site',
  },
  {
    href: '/syllabus/kathak',
    name: 'Kathak',
    note: 'Poonam · five levels',
    status: 'On the site',
  },
] as const;

export default function SyllabusIndexPage() {
  return (
    <div className="bg-canvas text-ink">
      <section className="px-4 sm:px-8 md:px-14 py-16 sm:py-24 max-w-[960px] mx-auto">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
          Syllabus adoption
        </p>
        <h1 className="font-anton text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-[1.05] mb-4">
          What we teach, year by year
        </h1>
        <p className="text-ink-2 text-sm sm:text-base max-w-lg leading-relaxed mb-12">
          Kuchipudi and Kathak — year by year, level by level.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STYLES.map((style) => (
            <Link
              key={style.href}
              href={style.href}
              className="rounded-[24px] border border-line bg-surface p-6 sm:p-8 hover:border-ink transition-colors active:scale-[0.98]"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C5CFC]">
                {style.status}
              </span>
              <h2 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight mt-2 mb-2">
                {style.name}
              </h2>
              <p className="text-sm text-ink-2">{style.note}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
