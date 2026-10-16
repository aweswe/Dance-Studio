import { ROUTES } from '@/lib/utils/constants';

export type CertificationTrackId = 'overview' | 'kuchipudi' | 'kathak';

export interface TrackFeature {
  label: string;
  value: string;
  subtext?: string;
  iconName: 'book' | 'users' | 'award' | 'calendar';
}

export interface TrackGalleryImage {
  src: string;
  alt: string;
  label: string;
  shortLabel: string;
}

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
  gallery: TrackGalleryImage[];
  features: TrackFeature[];
  trustHighlights: string[];
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
    eyebrow: 'Certified dance courses',
    title: 'Certification',
    titleAccent: 'programmes.',
    summary:
      'Learn dance step-by-step from beginner to advanced. Our students follow an approved course, give yearly board exams, perform on stage, and earn recognized certificates.',
    image: '/images/studio-training/workshop-certificate.jpg',
    imageAlt: 'Students receiving dance certification at Rhythmzz Academy',
    imageBadge: 'IAO Accredited Studio',
    imageTags: 'Class Training · Exams · Stage Shows',
    gallery: [
      {
        src: '/images/studio-training/workshop-certificate.jpg',
        alt: 'Annual batch convocation ceremony and certificates at Rhythmzz Academy',
        label: 'Certificate distribution day',
        shortLabel: 'Certificates',
      },
      {
        src: '/images/studio-training/masterclass-foundation.jpg',
        alt: 'IAO accredited foundation cohort masterclass at Rhythmzz Academy',
        label: 'Studio workshop batch',
        shortLabel: 'Workshop',
      },
    ],
    features: [
      {
        label: 'Styles',
        value: 'Kuchipudi & Kathak',
        subtext: 'Classical dance courses',
        iconName: 'book',
      },
      {
        label: 'Batch Size',
        value: 'Max 25 Students',
        subtext: 'Personal teacher attention',
        iconName: 'users',
      },
      {
        label: 'Certificates',
        value: 'Official Board Exams',
        subtext: 'Passed step by step',
        iconName: 'award',
      },
    ],
    trustHighlights: [
      'Recognized dance board syllabus',
      'Practice dance and theory together',
      'Stage performance opportunities',
    ],
    details: [
      { label: 'Styles', value: 'Kuchipudi (Andhra syllabus) · Kathak (Gandharva Mahavidyalaya)' },
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
    eyebrow: 'Classical Andhra Style',
    title: 'Kuchipudi',
    titleAccent: 'certification.',
    summary:
      'Learn traditional Kuchipudi dance with basic steps, hand gestures, rhythm, and storytelling. Students build stamina, clear yearly board exams, and prepare for solo stage performances.',
    image: '/images/kuchipudi/kuchipudi-classical-02.jpg',
    imageAlt: 'Kuchipudi dancer in Natyarambham posture at Rhythmzz Academy',
    imageBadge: 'Classical Dance Faculty',
    imageTags: 'Steps · Hand Gestures · Poses',
    gallery: [
      {
        src: '/images/kuchipudi/kuchipudi-classical-02.jpg',
        alt: 'Kuchipudi classical dancer in full Aramandi posture with red drape and temple bells',
        label: 'Classical stance with temple bells',
        shortLabel: 'Dance Stance',
      },
      {
        src: '/images/kuchipudi/kuchipudi-classical-01.jpg',
        alt: 'Kuchipudi dancer demonstrating Abhinaya and Natyashastra mudras',
        label: 'Storytelling and hand gestures',
        shortLabel: 'Expressions',
      },
    ],
    features: [
      {
        label: 'Classes',
        value: 'Fri & Sat at 6:30 PM',
        subtext: 'Regular weekly practice',
        iconName: 'calendar',
      },
      {
        label: 'Levels',
        value: 'Beginner to Advanced',
        subtext: 'Clear yearly goals',
        iconName: 'book',
      },
      {
        label: 'Outcome',
        value: 'Board Certificate',
        subtext: 'Dance & theory evaluation',
        iconName: 'award',
      },
    ],
    trustHighlights: [
      'Official Andhra board syllabus',
      'Learn footwork, rhythm & expressions',
      'Path to your first solo stage show',
    ],
    details: [
      { label: 'Schedule', value: 'Fri & Sat 6:30 PM' },
      { label: 'How', value: 'Monthly or quarterly · not a drop-in' },
      { label: 'Then', value: 'Exam when faculty assesses readiness' },
    ],
    syllabusHref: ROUTES.syllabusKuchipudi,
    enrolProgramme: 'kuchipudi',
    primaryCta: 'Book free trial',
    secondaryCta: 'View syllabus',
  },
  {
    id: 'kathak',
    label: 'Kathak',
    eyebrow: 'Classical Lucknow Style',
    title: 'Kathak',
    titleAccent: 'certification.',
    summary:
      'Learn classical Kathak dance with fast footwork, spins, rhythm, and graceful expressions. Students prepare for recognized Gandharva board exams from basic level to graduation.',
    image: '/images/classical-certification-dancer.png',
    imageAlt: 'Kathak footwork and alignment training at Rhythmzz Academy',
    imageBadge: 'Classical Kathak',
    imageTags: 'Footwork · Fast Spins · Rhythm',
    gallery: [
      {
        src: '/images/classical-certification-dancer.png',
        alt: 'Classical Kathak and classical repertoire performance posture on stage',
        label: 'Classical stage performance',
        shortLabel: 'Stage Pose',
      },
      {
        src: '/images/studio-training/alignment-drills-1.jpg',
        alt: 'Kathak alignment drills, tatkar footwork and mudras in studio',
        label: 'Footwork drills in studio',
        shortLabel: 'Practice',
      },
    ],
    features: [
      {
        label: 'Classes',
        value: 'Sat & Sun at 4:30 PM',
        subtext: 'Weekend batch',
        iconName: 'calendar',
      },
      {
        label: 'Levels',
        value: '5 Graded Levels',
        subtext: 'From basics to diploma',
        iconName: 'book',
      },
      {
        label: 'Outcome',
        value: 'Board Diploma',
        subtext: 'Recognized certificate',
        iconName: 'award',
      },
    ],
    trustHighlights: [
      'Gandharva Mahavidyalaya syllabus',
      'Fast spins & rhythmic footwork',
      'Stage performances & diploma',
    ],
    details: [
      { label: 'Schedule', value: 'Sat & Sun 4:30 PM' },
      { label: 'How', value: 'Five graded levels · board exam prep' },
      { label: 'Then', value: 'Visharad graduation & solo debut path' },
    ],
    syllabusHref: ROUTES.syllabusKathak,
    enrolProgramme: 'classical-dance',
    primaryCta: 'Book free trial',
    secondaryCta: 'View syllabus',
  },
];
