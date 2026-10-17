import { Metadata } from 'next';
import { SITE_URL } from '@/lib/utils/constants';
import { KathakSyllabusContent } from '@/components/public/kathak-syllabus-content';

export const metadata: Metadata = {
  title: 'Kathak Dance Syllabus — 5-Level Structured Curriculum | Rhythmzz Academy',
  description:
    'Structured classical Kathak dance training from age 5 to Manch Pravesh. Five graded levels, Tatkar rhythm, Chakkars, Abhinaya, and Gandharva board examination track at Rhythmzz Academy, Neredmet.',
  alternates: { canonical: `${SITE_URL}/syllabus/kathak` },
};

export default function KathakSyllabusPage() {
  return <KathakSyllabusContent />;
}
