import { Metadata } from 'next';
import { SITE_URL } from '@/lib/utils/constants';
import { KuchipudiSyllabusContent } from '@/components/public/kuchipudi-syllabus-content';

export const metadata: Metadata = {
  title: 'Kuchipudi Syllabus — Year-wise Curriculum | Rhythmzz Academy',
  description:
    'Structured Kuchipudi training from age 5 to Rangapravesham. Year-wise curriculum, four pillars, age pathways, FAQ and batch details at Rhythmzz Academy, Neredmet.',
  alternates: { canonical: `${SITE_URL}/syllabus/kuchipudi` },
};

export default function KuchipudiSyllabusPage() {
  return <KuchipudiSyllabusContent />;
}
