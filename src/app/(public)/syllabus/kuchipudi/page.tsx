import { Metadata } from 'next';
import Link from 'next/link';
import { enrolHref, SITE_URL } from '@/lib/utils/constants';
import { SyllabusYears } from '@/components/public/syllabus-years';

export const metadata: Metadata = {
  title: 'Kuchipudi syllabus',
  description:
    'Year-wise Kuchipudi syllabus with Srusti at Rhythmzz Academy, Neredmet. Friday and Saturday 6:30 to 7:30.',
  alternates: { canonical: `${SITE_URL}/syllabus/kuchipudi` },
};

export default function KuchipudiSyllabusPage() {
  return (
    <div className="bg-canvas text-ink">
      <section className="px-4 sm:px-8 md:px-14 py-16 sm:py-24 max-w-[800px] mx-auto">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
          Syllabus adoption
        </p>
        <h1 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight leading-[1.05] mb-4">
          Kuchipudi
        </h1>
        <p className="text-ink-2 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
          Srusti. Friday and Saturday, 6:30–7:30. You sit the exam when she says you are ready.
        </p>

        <div className="flex flex-wrap gap-3 mb-14">
          <Link
            href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
            className="btn-sun px-6 py-3 text-xs font-black uppercase tracking-[0.16em]"
          >
            Book a trial
          </Link>
          <Link
            href="/programmes/kuchipudi"
            className="px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-line hover:border-ink"
          >
            Class page
          </Link>
        </div>

        <SyllabusYears />
      </section>
    </div>
  );
}
