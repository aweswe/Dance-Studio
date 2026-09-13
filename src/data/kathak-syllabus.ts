export interface KathakSyllabusLevel {
  level: number;
  title: string;
  stage: string;
  focus: string;
  technical: string[];
  theory: string[];
}

export const KATHAK_SYLLABUS = {
  title: 'Kathak Dance Syllabus',
  subtitle: 'Structured Classical Curriculum · Rhythmzz Academy of Dance',
  intro:
    'A clear path from first footwork to stage. Each level builds rhythm, stamina, precision, and expression.',
  guru: 'Poonam',
  outcomes: [
    {
      title: 'Technical precision',
      text: 'Complex footwork, rapid turns, and steady posture.',
    },
    {
      title: 'Expressive artistry',
      text: 'Face and hands that carry the story.',
    },
  ],
  levels: [
    {
      level: 1,
      title: 'Foundation',
      stage: 'Beginner',
      focus: 'Body posture, basic footwork, and rhythm comprehension.',
      technical: [
        'Basic Sama posture and body alignment',
        'Fundamental footwork (Tatkar) in Teental (16 beats)',
        'Hand gestures (Hastak) and wrist movements',
      ],
      theory: [
        'Introduction to Teental layout (Taali, Khali, Vibhag)',
        'Basic Guru Vandana',
        'Introduction to ghungroos (ankle bells)',
      ],
    },
    {
      level: 2,
      title: 'Elementary',
      stage: 'Lower intermediate',
      focus: 'Speed, spin control, and rhythmic variations.',
      technical: [
        'Tatkar variations in Laya (Vilambit, Madhya)',
        'Introduction to turns (Chakkar) and balance',
        'Basic technical compositions (Tukda, Tihai)',
      ],
      theory: [
        'Single-hand (Asamyuta) and combined (Samyuta) mudras',
        'Recitation (Padhant) with hand symbols',
        'Gharana history basics (Lucknow vs Jaipur)',
      ],
    },
    {
      level: 3,
      title: 'Intermediate',
      stage: 'Upper intermediate',
      focus: 'Rhythm mastery and expressive storytelling.',
      technical: [
        'Complex footwork patterns in Drut Laya',
        'Technical compositions: Tukda, Paran, Aamad',
        'Complex 5-count and 9-count spins',
      ],
      theory: [
        'Introduction to Abhinaya (expressive storytelling)',
        'Exploration of Jhaptal (10 beats) and Ektaal (12 beats)',
        'Sight reading and notation of rhythmic compositions',
      ],
    },
    {
      level: 4,
      title: 'Advanced',
      stage: 'Pre-professional',
      focus: 'Improvisation, speed, and subtle expression.',
      technical: [
        'Laya Kari (Thah, Dugun, Chaugun)',
        'Advanced spins and intricate footwork speed',
        'Gat Nikas and Gat Bhaav storytelling',
      ],
      theory: [
        'Nritta (pure dance) vs Nritya (expression)',
        'Interpretive items: Thumri, Bhajan, and Ghazal',
        'Stage entrance (Uthan) and exit structures',
      ],
    },
    {
      level: 5,
      title: 'Masterclass',
      stage: 'Professional',
      focus: 'Solo performance, choreography, and nuance.',
      technical: [
        'Complex taal structures (Dhamar, Roopak, Sawari)',
        'Solo performance repertoire (Manch Pravesh)',
        'Advanced improvisation with live percussion',
      ],
      theory: [],
    },
  ] satisfies KathakSyllabusLevel[],
} as const;
