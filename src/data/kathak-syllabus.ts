export interface KathakSyllabusLevel {
  level: number;
  title: string;
  stage: string;
  focus: string;
  technical: string[];
  theory: string[];
  boardExam?: string;
  learningOutcome?: string;
}

export const KATHAK_SYLLABUS = {
  title: 'Kathak Dance Syllabus',
  subtitle: 'Structured Classical Curriculum · Rhythmzz Academy of Dance',
  intro:
    'Step into the rhythmic world of Kathak. Our curriculum provides a clear, progressive path for dancers of all ages, taking students from foundational rhythm to masterful stage performance. Grounded in technique and expressive art, each level builds strength, stamina, precision, and emotional depth.',
  guru: 'Poonam',
  outcomes: [
    {
      title: 'Technical Precision',
      text: 'Mastery over complex footwork, rapid turns, and precise body posture.',
    },
    {
      title: 'Expressive Artistry',
      text: 'Command over subtle facial expressions and gesture-based storytelling.',
    },
  ],
  differentiators: [
    {
      title: 'Rhythmic Precision (Tatkar)',
      body: 'Grounded mathematical footwork starting in single speed (Vilambit) and advancing through double (Dugun) and quadruple (Chaugun) on the 16-beat Teental metric cycle.',
      badge: 'Laya & Tala',
    },
    {
      title: 'Pirouettes & Balance (Chakkars)',
      body: 'Systematic spotting drills and upright balance, progressing from single-count turns to 27 continuous rapid Chakkars landing effortlessly on Sam.',
      badge: 'Spins & Balance',
    },
    {
      title: 'Padhant & Oral Recitation',
      body: 'Students recite rhythmic mnemonics (bols) with hands executing Taali and Khali before dancing, ensuring complete musical synchronization.',
      badge: 'Oral Tradition',
    },
    {
      title: 'Lyrical Abhinaya & Gat Bhaav',
      body: 'Subtle facial expression, eye gestures, and character transitions bringing mythological poetry, Thumri, and Ghazals to life with emotional authenticity.',
      badge: 'Expressive Storytelling',
    },
  ],
  whoCanJoin: [
    {
      title: 'Starting Age (5+)',
      subtitle: 'Foundation Entry',
      body: 'Young learners begin with posture, rhythm listening, clapping, and joint-safe basic Tatkar footwork.',
    },
    {
      title: 'Absolute Beginners',
      subtitle: 'No Experience Needed',
      body: 'Level 1 assumes zero prior dance background. Every movement is built systematically from Sama posture and basic alignment.',
    },
    {
      title: 'Continuing Dancers',
      subtitle: 'Placement Evaluation',
      body: 'Prior Kathak or classical training is evaluated by senior faculty for the right level placement across our progressive cohorts.',
    },
    {
      title: 'Teens & Adults (13+)',
      subtitle: 'Dedicated Batches',
      body: 'Adult beginners and mature learners are welcome, with curriculum paced to adult biomechanics, stamina, and expressive depth.',
    },
  ],
  agePathways: [
    {
      age: 'Age 5–7',
      label: 'Discover & Rhythm',
      body: 'Nurtures love for rhythm, posture awareness, basic Tatkar footwork, and foundational hand movements.',
      accent: 'Foundation',
    },
    {
      age: 'Age 8–10',
      label: 'Build & Strengthen',
      body: 'Focuses on clean footwork, spotting technique for Chakkars, oral Padhant recitation, and first Toda compositions.',
      accent: 'Technique',
    },
    {
      age: 'Age 11–13',
      label: 'Develop & Refine',
      body: 'Introduces Drut speed, Jhaptal (10 beats), Ektaal (12 beats), foundational Abhinaya, and 9-count spins.',
      accent: 'Laya & Expression',
    },
    {
      age: 'Age 14+ & Adults',
      label: 'Advanced & Perform',
      body: 'Advanced Layakari, Gat Bhaav, Thumri interpretation, complex multi-taal mastery, and Manch Pravesh guidance.',
      accent: 'Mastery',
    },
  ],
  pillars: [
    {
      title: 'Tatkar',
      subtitle: 'Pure Rhythmic Footwork',
      body: 'The rhythmic foundation of Kathak. Dancers strike the floor with precision, shifting effortlessly across Vilambit, Madhya, and Drut Laya.',
      points: ['Teental (16 beats) mastery', 'Ghungroo tone modulation', 'Ekgun, Dugun & Chaugun speeds'],
    },
    {
      title: 'Chakkar',
      subtitle: 'Spins & Pirouettes',
      body: 'The dynamic visual hallmark of Kathak. Executing crisp, continuous spins with spot control, maintaining upright spinal alignment.',
      points: ['Spotting & balance control', '5-count and 9-count turns', 'Landing dead on Sam'],
    },
    {
      title: 'Hastak & Mudra',
      subtitle: 'Hand & Arm Geometry',
      body: 'Fluid wrist movements, geometric arm extensions, and classical Asamyuta & Samyuta hand gestures conveying clarity and elegance.',
      points: ['Wrist articulation & Hastaks', 'Single & combined mudras', 'Sculptural stage lines'],
    },
    {
      title: 'Abhinaya & Gat Bhaav',
      subtitle: 'Expressive Storytelling',
      body: 'Communicating delicate human emotion and mythological narratives through subtle eye movements, facial mime, and poetic interpretation.',
      points: ['Gat Nikas walking gaits', 'Thumri, Bhajan & Ghazal', 'Navarasa emotional depth'],
    },
  ],
  repertoire: [
    {
      id: '01',
      name: 'Guru Vandana / Stuti',
      type: 'Invocation & Sanctification',
      focus: 'Devotional Obeisance',
      description:
        'The sacred classical opening offering prayers to the Guru and the Divine, invoking auspiciousness and grounding the mind in reverence.',
    },
    {
      id: '02',
      name: 'Thaat & Salami',
      type: 'Dignified Posture & Salutation',
      focus: 'Courtly Elegance',
      description:
        'Slow, majestic movements introducing the dancer. Subtle neck and wrist articulation, followed by traditional royal salutations honoring the audience.',
    },
    {
      id: '03',
      name: 'Aamad & Uthan',
      type: 'Dynamic Stage Entrance',
      focus: 'Metric Resolution on Sam',
      description:
        'The classical entry piece meaning "arrival". Characterized by sweeping arm extensions and crisp rhythmic syllables concluding with dramatic precision.',
    },
    {
      id: '04',
      name: 'Tukda, Toda & Paran',
      type: 'Pure Technical Nritta',
      focus: 'Complex Rhythmic Geometry',
      description:
        'Technical rhythmic suites composed of mnemonic bols, rapid spins, and intricate tihais performed in fast Drut tempo with live percussion.',
    },
    {
      id: '05',
      name: 'Gat Nikas & Gat Bhaav',
      type: 'Narrative Verse & Mime',
      focus: 'Lyrical Characterization',
      description:
        'Graceful walking gaits depicting mythological scenes such as Krishna with the flute (Bansuri) or milkmaids carrying pitchers (Panghat), rendered entirely through solo mime.',
    },
    {
      id: '06',
      name: 'Tarana',
      type: 'Melodic Technical Climax',
      focus: 'Persian-Indian Musical Fusion',
      description:
        'High-energy technical dance set to rhythmic syllables (Ta-Re-Na, Nom-Tom) composed by Amir Khusrau, celebrating speed, sculpturesque poses, and brisk footwork.',
    },
    {
      id: '07',
      name: 'Thumri, Bhajan & Ghazal',
      type: 'Expressive Abhinaya',
      focus: 'Poetic & Emotional Resonance',
      description:
        'Soulful semi-classical compositions where the dancer seated or standing interprets the emotional subtleties of poetry through expressive eyes, eyebrows, and hand mudras.',
    },
    {
      id: '08',
      name: 'Tatkar & Jugalbandi',
      type: 'Virtuoso Percussion Finale',
      focus: 'Rhythmic Dialogue with Tabla',
      description:
        'The grand finale where the dancer engages in lightning-fast rhythmic interplay with the Tabla player, demonstrating complete mastery over ghungroo dynamics.',
    },
  ],
  manchPraveshPillars: [
    'Full multi-taal classical repertoire mastery',
    'Fluent oral Padhant with Taali-Khali sync',
    'Solo performance stamina (90-minute concert)',
    'Live accompaniment coordination with Tabla & Harmonium',
    'Deep abhinaya maturity in Thumri & Bhajan',
    'Gandharva Mahavidyalaya board examination readiness',
  ],
  classSteps: [
    { n: 1, title: 'Pranam & Postural Warm-up', body: 'Salutation to the stage and earth, followed by spine alignment and joint-safe ankle conditioning.' },
    { n: 2, title: 'Tatkar Drills & Metric Speeds', body: 'Intensive footwork in Ekgun (single), Dugun (double), and Chaugun (quadruple) speeds on Teentaal.' },
    { n: 3, title: 'Chakkars & Technical Compositions', body: 'Continuous turn drills with spotting, followed by Tukdas, Todas, Parans, and Chakradhar Tihais.' },
    { n: 4, title: 'Padhant & Rhythmic Recitation', body: 'Clapping metric cycles (Taali/Khali) and reciting rhythmic syllables clearly before floor execution.' },
    { n: 5, title: 'Abhinaya & Repertoire Review', body: 'Expressive practice of Gat Nikas, Thumri verses, and consolidated weekly teacher corrections.' },
  ],
  theoryTopics: [
    'Teental, Jhaptal, Ektaal, Roopak, and Dhamar metric cycles',
    'Historical evolution: Temple kathakas to Lucknow and Jaipur court traditions',
    'Natyashastra definitions: Nritta, Nritya, and Natya',
    'Single-hand (Asamyuta) and combined (Samyuta) Hastas',
    'Anatomy of Ghungroos, bell tuning, and ankle weight discipline',
    'Notation reading and written score transcription of technical bols',
  ],
  faqs: [
    {
      q: 'What is the minimum age to start Kathak?',
      a: 'Children can start from 5 years of age. Our Level 1 Foundation syllabus is tailored for young bodies, focusing on musical listening, posture, and foundational footwork safely.',
    },
    {
      q: 'Do I need prior dance experience to join?',
      a: 'No previous dance training is required. Level 1 begins from absolute first principles: Sama posture, body alignment, and basic footwork.',
    },
    {
      q: 'Can adults and teens join the Kathak programme?',
      a: 'Yes! We welcome teens and adult learners (13+ years) who want to learn classical Kathak. The curriculum is adapted to adult posture, stamina, and expressive depth.',
    },
    {
      q: 'When do students start wearing ghungroos (ankle bells)?',
      a: 'Students begin wearing light ghungroos (around 50 bells per foot) after mastering foundational foot placement and posture in Level 1. Ankle weights increase gradually up to 100–150 bells in advanced stages.',
    },
    {
      q: 'What are the batch days and timings?',
      a: 'Kathak batches are held on Friday and Saturday evenings from 6:30 PM to 7:30 PM at our Neredmet X Road studio in Secunderabad.',
    },
    {
      q: 'What are the tuition fees?',
      a: 'Tuition is ₹2,000 per month or ₹5,000 per quarter (saving ₹1,000 compared to monthly). We maintain transparent pricing with zero admission fees.',
    },
    {
      q: 'What is Manch Pravesh?',
      a: 'Manch Pravesh is the dancer’s formal solo stage debut with a complete live classical music ensemble (Tabla, Harmonium, Vocalist, and Padhant). It marks graduation into professional classical performance.',
    },
    {
      q: 'Can we attend an introductory trial class first?',
      a: 'Yes, we provide one complimentary trial class so prospective students can meet faculty, experience the studio atmosphere, and determine the right level placement.',
    },
  ],
  levels: [
    {
      level: 1,
      title: 'Foundation',
      stage: 'Beginner',
      focus: 'Body posture, basic footwork, and rhythm comprehension.',
      boardExam: 'Gandharva Mahavidyalaya Prarambhik Prep',
      technical: [
        'Basic Sama posture & body alignment',
        'Fundamental footwork (Tatkar) in Teental (16 beats)',
        'Hand gestures (Hastak) & wrist movements',
      ],
      theory: [
        'Introduction to Teental layout (Taali, Khali, Vibhag)',
        'Basic Guru Vandana',
        'Introduction to ghungroos (ankle bells)',
      ],
      learningOutcome:
        'Develops grounded footwork, rhythmic awareness on Teentaal metric cycles, spinal alignment, and balance during rotational turns.',
    },
    {
      level: 2,
      title: 'Elementary',
      stage: 'Lower Intermediate',
      focus: 'Speed, spin control, and rhythmic variations.',
      boardExam: 'Prarambhik Certificate Examination',
      technical: [
        'Tatkar variations in Laya (Vilambit, Madhya)',
        'Introduction to turns (Chakkar) & balance',
        'Basic technical compositions (Tukda, Tihai)',
      ],
      theory: [
        'Single-hand (Asamyuta) & combined (Samyuta) Mudras',
        'Recitation (Padhant) with hand symbols',
        'Gharana history basics (Lucknow vs. Jaipur)',
      ],
      learningOutcome:
        'Student masters oral padhant, executes crisp footwork with ghungroos, and performs the first complete entry repertoire.',
    },
    {
      level: 3,
      title: 'Intermediate',
      stage: 'Upper Intermediate',
      focus: 'Rhythm mastery and expressive storytelling.',
      boardExam: 'Praveshika Pratham Board Exam',
      technical: [
        'Complex footwork patterns in Drut Laya',
        'Technical compositions: Tukda, Paran, Aamad',
        'Complex 5-count and 9-count spins',
      ],
      theory: [
        'Introduction to Abhinaya (expressive storytelling)',
        'Exploration of Jhaptal (10 beats) & Ektaal (12 beats)',
        'Sight reading and notation of rhythmic compositions',
      ],
      learningOutcome:
        'Command over 10-beat metric structures, swift sustained spins, and subtle eye/brow coordination during lyrical storytelling.',
    },
    {
      level: 4,
      title: 'Advanced',
      stage: 'Pre-Professional',
      focus: 'Improvisation, speed, and subtle expression.',
      boardExam: 'Praveshika Poorna Diploma',
      technical: [
        'Laya Kari (Rhythmic play: Thah, Dugun, Chaugun)',
        'Advanced spins and intricate footwork speed',
        'Gat Nikas and Gat Bhaav storytelling',
      ],
      theory: [
        'Deep dive into Nritta (pure dance) vs. Nritya (expression)',
        'Interpretive items: Thumri, Bhajan, and Ghazal',
        'Stage entrance (Uthan) and exit structures',
      ],
      learningOutcome:
        'Expressive storytelling capability through eyes and mudras, performing poetic literature set to challenging rhythmic cycles.',
    },
    {
      level: 5,
      title: 'Masterclass',
      stage: 'Professional / Manch Pravesh',
      focus: 'Solo performance, choreography, and nuance.',
      boardExam: 'Visharad Poorna (Recognized Graduation)',
      technical: [
        'Complex Taal structures (Dhamar, Roopak, Sawari)',
        'Solo performance repertoire (Manch Pravesh)',
        'Advanced improvisation with live percussion',
      ],
      theory: [
        'In-depth Natyashastra and Abhinaya Darpana analysis',
        'Comparative study: Lucknow vs. Jaipur vs. Banaras Gharanas',
        'Mastery over subtle facial expressions, Padhant recitation, and live Tabla jugalbandi',
      ],
      learningOutcome:
        'Full artistic independence, qualification as a certified classical performer and examiner, and completion of the sacred solo debut.',
    },
  ] satisfies KathakSyllabusLevel[],
} as const;

