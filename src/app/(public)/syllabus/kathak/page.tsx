import { Metadata } from 'next';
import Link from 'next/link';
import { enrolHref, SITE_URL } from '@/lib/utils/constants';
import { KathakSyllabusLevels } from '@/components/public/kathak-syllabus-levels';
import { KATHAK_SYLLABUS } from '@/data/kathak-syllabus';

export const metadata: Metadata = {
  title: 'Kathak syllabus',
  description:
    'Five-level Kathak syllabus at Rhythmzz Academy, Neredmet. Foundation through masterclass with Poonam.',
  alternates: { canonical: `${SITE_URL}/syllabus/kathak` },
};

export default function KathakSyllabusPage() {
  return (
    <div className="bg-canvas text-ink">
      <section className="px-4 sm:px-8 md:px-14 py-16 sm:py-24 max-w-[800px] mx-auto">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-3">
          Syllabus adoption
        </p>
        <h1 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight leading-[1.05] mb-4">
          Kathak
        </h1>
        <p className="text-ink-2 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
          {KATHAK_SYLLABUS.intro} {KATHAK_SYLLABUS.guru} holds the batch — WhatsApp the desk for days and fees.
        </p>

        <div className="flex flex-wrap gap-3 mb-14">
          <Link
            href={enrolHref({ programme: 'classical-dance', intent: 'trial' })}
            className="btn-sun px-6 py-3 text-xs font-black uppercase tracking-[0.16em]"
          >
            Enrol — Kathak
          </Link>
          <Link
            href={enrolHref({ programme: 'kuchipudi', intent: 'trial' })}
            className="px-6 py-3 rounded-md text-xs font-mono font-bold uppercase tracking-wider border border-line hover:border-ink"
          >
            Enrol — Kuchipudi
          </Link>
        </div>

        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-3 mb-4">
          Five levels
        </p>
        <KathakSyllabusLevels />
      </section>
    </div>
  );
}
