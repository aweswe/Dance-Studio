import { ROUTES } from '@/lib/utils/constants';

export type CertificationTrackId = 'overview' | 'kuchipudi' | 'kathak';

export interface CertificationTrack {
  id: CertificationTrackId;
  label: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  summary: string;
  image: string;
  imageAlt: string;
  imageBadge: string;
  imageTags: string;
  details: { label: string; value: string }[];
  syllabusHref: string;
  enrolProgramme: string;
  primaryCta: string;
  secondaryCta: string;
}

export const CERTIFICATION_TRACKS: CertificationTrack[] = [
  {
    id: 'overview',
    label: 'All certification',
    eyebrow: 'Level-based · Board exams',
    title: 'Certification',
    titleAccent: 'programmes.',
    summary:
      'Structured syllabi, formal exams, and stage milestones — not drop-in choreography. Kuchipudi and Kathak each run as a separate certified cohort.',
    image: '/images/studio-training/workshop-certificate.jpg',
    imageAlt: 'Students receiving dance certification at Rhythmzz Academy',
    imageBadge: 'IAO Accredited',
    imageTags: 'Foundation · Exams · Stage work',
    details: [
      { label: 'Tracks', value: 'Kuchipudi (Andhra syllabus) · Kathak (Gandharva Mahavidyalaya)' },
      { label: 'Format', value: 'Monthly or quarterly enrolment · capped batches' },
      { label: 'Outcome', value: 'Board papers when your guru clears you for the level' },
    ],
    syllabusHref: ROUTES.syllabus,
    enrolProgramme: 'kuchipudi',
    primaryCta: 'Book free trial',
    secondaryCta: 'Compare syllabi',
  },
  {
    id: 'kuchipudi',
    label: 'Kuchipudi',
    eyebrow: 'Certified · Kuchipudi',
    title: 'Kuchipudi',
    titleAccent: 'certification.',
    summary:
      'Srusti leads a published year-wise curriculum — adavus, jathis, hastas, and abhinaya in class. Path toward Rangapravesham when the dancer is ready.',
    image: '/images/kuchipudi/kuchipudi-natyarambham-posture.jpg',
    imageAlt: 'Kuchipudi dancer in Natyarambham posture at Rhythmzz Academy',
    imageBadge: 'Guru Srusti',
    imageTags: 'Aramandi · Mudras · Natyashastra',
    details: [
      { label: 'Who', value: 'Srusti · Fri & Sat 6:30 PM' },
      { label: 'How', value: 'Monthly or quarterly · not a drop-in' },
      { label: 'Then', value: 'Exam when she says you are ready' },
    ],
    syllabusHref: ROUTES.syllabusKuchipudi,
    enrolProgramme: 'kuchipudi',
    primaryCta: 'Book free trial',
    secondaryCta: 'View syllabus',
  },
  {
    id: 'kathak',
    label: 'Kathak',
    eyebrow: 'Certified · Kathak',
    title: 'Kathak',
    titleAccent: 'certification.',
    summary:
      'Guru Poonam trains Lucknow Gharana Kathak — tatkar, chakkars, teentaal, and abhinaya — with Gandharva Mahavidyalaya papers from Prarambhik through Visharad.',
    image: '/images/studio-training/alignment-drills-1.jpg',
    imageAlt: 'Kathak footwork and alignment training at Rhythmzz Academy',
    imageBadge: 'Lucknow Gharana',
    imageTags: 'Tatkar · Chakkars · Teentaal',
    details: [
      { label: 'Who', value: 'Poonam · Sat & Sun 4:30 PM' },
      { label: 'How', value: 'Five graded levels · board exam prep' },
      { label: 'Then', value: 'Visharad graduation & solo debut path' },
    ],
    syllabusHref: ROUTES.syllabusKathak,
    enrolProgramme: 'classical-dance',
    primaryCta: 'Book free trial',
    secondaryCta: 'View syllabus',
  },
];
