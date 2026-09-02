export interface CurriculumYear {
  year: number;
  level: string;
  stageName: string;
  theory: string[];
  practical: string[];
  learningOutcome: string;
}

export interface AssessmentParam {
  title: string;
  description: string;
}

export interface ProgressionGuideline {
  title: string;
  description: string;
}

export const KUCHIPUDI_10_YEAR_PLAN: {
  title: string;
  targetAudience: string;
  summary: string;
  years: CurriculumYear[];
  assessmentCriteria: AssessmentParam[];
  progressionModel: ProgressionGuideline[];
} = {
  title: "Kuchipudi Training: 10-Year Master Curriculum Plan",
  targetAudience: "Beginners starting at Ages 5–7 Years",
  summary:
    "This master curriculum is structured to prioritize developmental pacing, physical safety, and artistic depth, leading up to a Certificate Public Examination.",
  years: [
    {
      year: 1,
      level: "Beginner Level 1",
      stageName: "Foundation",
      theory: [
        "Introduction to Kuchipudi",
        "Natyarambham Slokam",
        "Introduction to selected Asamyutha Hastas",
      ],
      practical: [
        "Body Conditioning",
        "Correct posture and alignment (Natyarambham position)",
        "Rhythm exercises",
        "Selected steps from the First Half Steps (basic adugulu)",
      ],
      learningOutcome:
        "Students become familiar with their body, learn correct posture, develop coordination, and begin understanding rhythm and discipline in dance.",
    },
    {
      year: 2,
      level: "Beginner Level 1",
      stageName: "Foundation Development",
      theory: [
        "Remaining Asamyutha Hastas",
        "Introduction to Samyutha Hastas",
        "Introduction to Pada Bhedas",
      ],
      practical: [
        "Continued Body Conditioning",
        "Complete First Half Steps",
        "Rhythm and coordination exercises",
        "Basic movement combinations",
      ],
      learningOutcome:
        "Students establish a strong technical foundation with confidence in the basic Adugulu, hand gestures, and footwork.",
    },
    {
      year: 3,
      level: "Beginner Level 2",
      stageName: "Intermediate Technique Preparation",
      theory: [
        "Remaining Samyutha Hastas",
        "Uses of Hastas",
        "Revision of Pada Bhedas",
      ],
      practical: [
        "Body Conditioning",
        "Complete Second Half Steps",
        "Combining Adugulu with hastas",
        "Balance, coordination, and rhythm exercises",
      ],
      learningOutcome:
        "Students complete their basic Adugu training and are prepared to move into more structured Kuchipudi technique.",
    },
    {
      year: 4,
      level: "Beginner Level 2",
      stageName: "Completion of Foundation",
      theory: [
        "Siro Bhedas",
        "Griva Bhedas",
        "Introduction to Indian Classical Dance Forms",
        "Chaturvidha Abhinaya",
      ],
      practical: [
        "Refinement of all basic Adugulu",
        "Introduction to expressive movement",
        "Rhythm exercises",
        "Basic combinations and performance practice",
      ],
      learningOutcome:
        "Students gain confidence in executing foundational movements with improved expression, coordination, and stage discipline.",
    },
    {
      year: 5,
      level: "Intermediate Level 1",
      stageName: "Rhythm & Origins",
      theory: [
        "Natyam, Nrityam, and Nritta Slokam",
        "Natyotpatti (Origin of Dance)",
        "History and Evolution of Kuchipudi",
        "History of Siddhendra Yogi & Narayana Teertha",
      ],
      practical: [
        "Chaturasra Jathis (First Half)",
        "Tala practice",
        "Jathi recitation",
      ],
      learningOutcome:
        "Students begin developing rhythmic precision while understanding the origins and philosophy of the dance form.",
    },
    {
      year: 6,
      level: "Intermediate Level 1",
      stageName: "Yakshagana & Abhinaya Heritage",
      theory: [
        "Development of Yakshagana",
        "Bhagavatula Mela",
        "Bhama Kalapam",
        "Navarasas",
        "Drishti Bhedas & Bhru Bhedas",
      ],
      practical: [
        "Remaining Chaturasra Jathis",
        "Tala practice",
        "Stage discipline and presentation",
      ],
      learningOutcome:
        "Students strengthen rhythmic accuracy and expressive abilities while gaining a deeper understanding of Kuchipudi's heritage.",
    },
    {
      year: 7,
      level: "Intermediate Level 2",
      stageName: "Sapta Tala Mastery",
      theory: [
        "Sapta Tala",
        "Technical Terms: Natya, Nrutta, Nrutya, Lasya, Paatra, Apaatra, Kinkini, Sabha",
      ],
      practical: [
        "Tisram (4 Jathis)",
        "Khandam (2 Jathis)",
        "Misram (3 Jathis)",
        "Sankeernam (2 Jathis)",
        "Enunciation of Jathis on Tala",
      ],
      learningOutcome:
        "Students develop confidence in rhythm, tala, and technical vocabulary while performing more advanced rhythmic patterns.",
    },
    {
      year: 8,
      level: "Intermediate Level 2",
      stageName: "Traditional Repertoire & Choreography",
      theory: [
        "Uttama, Madhyama, and Adhama Nayikas",
        "Deva Hastas – Significance and Usage",
        "History of Jayadeva & Saint Thyagaraja",
        "Biography of Vedantam Lakshmi Narayana Sastry",
      ],
      practical: [
        "Introduction to Dr. Vempati Chinna Satyam Master Garu's choreographies:",
        "  - Jathiswaram",
        "  - Vinayaka Kauthvam",
        "  - Januta Shabdam",
        "  - Ramayana Shabdam",
        "Introduction to solo and group choreography",
      ],
      learningOutcome:
        "Students begin learning complete dance items while developing musical understanding and performance skills.",
    },
    {
      year: 9,
      level: "Intermediate Level 3",
      stageName: "Abhinaya, Tarangam & Musicality",
      theory: [
        "Biography of Vempati Venkata Narayana & Chinta Venkatramayya",
        "Raga, Tala, Composer, and Meaning of learned items",
        "Lokadharmi and Natyadharmi",
      ],
      practical: [
        "Tarangam – Krishnam Kalaya Sakhi & Neela Megha Sareera",
        "Ramadasa Keerthana",
        "Devi Stuthi",
        "Annamacharya Keerthana",
        "Continued solo and group choreography",
      ],
      learningOutcome:
        "Students develop greater maturity in abhinaya, musical interpretation, and stage performance.",
    },
    {
      year: 10,
      level: "Intermediate Level 3",
      stageName: "Exam Preparation & Mastery",
      theory: [
        "Sveeya, Parakeeya, and Samanya Nayikas",
        "Ashta Vidha Nayikas and their stages",
        "Dasavatara Hastas – Significance and Usage",
        "Life History of: Kshetrayya, Ramadasu, Annamacharya, Munipalle Subrahmanya Kavi",
      ],
      practical: [
        "Advanced repertoire:",
        "  - Mandooka Shabdam",
        "  - Dasavatara Shabdam",
        "  - Thyagaraja Keerthana",
        "  - Daruvu",
        "  - Adhyatma Ramayana Keerthana",
        "  - Thillana",
        "Prep for solo presentations, group productions, and Certificate Public Exam",
      ],
      learningOutcome:
        "Students demonstrate technical proficiency, theoretical knowledge, expressive maturity, and stage confidence required to appear for the Certificate Public Examination.",
    },
  ],
  assessmentCriteria: [
    {
      title: "Technical Proficiency",
      description:
        "Execution of Adugulu, posture, alignment, and flexibility.",
    },
    {
      title: "Rhythm & Coordination",
      description:
        "Grip on Tala, speed variations, and body-hand-foot coordination.",
    },
    {
      title: "Theory Knowledge",
      description:
        "Understanding of shlokas, gestures, history, and terminologies.",
    },
    {
      title: "Expression & Presentation",
      description:
        "Abhinaya, stage presence, eye movements, and overall confidence.",
    },
  ],
  progressionModel: [
    {
      title: "Mastery over Speed",
      description:
        "Progression is merit-based and individualistic rather than strictly chronological or age-bound.",
    },
    {
      title: "Accelerated Track",
      description:
        "Students who demonstrate quick comprehension, physical maturity, and consistent performance may transition to advanced levels earlier.",
    },
    {
      title: "Extended Track",
      description:
        "Foundation years are crucial. Students who need to spend extra time mastering alignment, posture, and basic rhythm are encouraged to do so to prevent long-term physical strain and build absolute clarity in execution.",
    },
  ],
};

export const KUCHIPUDI_6_YEAR_PLAN: {
  title: string;
  summary: string;
  years: CurriculumYear[];
  assessmentParameters: AssessmentParam[];
  progressAndMastery: ProgressionGuideline[];
} = {
  title: "Kuchipudi Certificate Course: 6-Year Master Curriculum Plan",
  summary:
    "This structured curriculum is designed to help students develop a robust, accelerated foundation in Kuchipudi, progressing systematically from foundational training to highly advanced repertoire and performance standards over a six-year period.",
  years: [
    {
      year: 1,
      level: "Beginner Level 1",
      stageName: "Foundation",
      theory: [
        "Introduction to Kuchipudi",
        "Natyarambham Slokam",
        "Asamyutha Hastas",
        "Samyutha Hastas",
        "Pada Bhedas",
      ],
      practical: [
        "Body Conditioning",
        "Basic posture and alignment (Natyarambham position)",
        "Basic adugulu (1st Half Steps)",
        "Rhythm, coordination, and balance exercises",
        "Introduction to expressions and stage discipline",
      ],
      learningOutcome:
        "Students develop correct posture, basic footwork, hand gestures, and core body coordination required for Kuchipudi.",
    },
    {
      year: 2,
      level: "Beginner Level 2",
      stageName: "Foundation Development",
      theory: [
        "Siro Bhedas",
        "Griva Bhedas",
        "Introduction to Indian Classical Dance Forms",
        "Uses of Hastas",
        "Chaturvidha Abhinaya",
      ],
      practical: [
        "Continued Body Conditioning",
        "Basic adugulu (2nd Half Steps)",
        "Improved rhythm and coordination exercises",
        "Introduction to combining movements and adugu sequences",
      ],
      learningOutcome:
        "Students gain confidence in executing foundational movements while understanding the essential expressive elements of classical dance.",
    },
    {
      year: 3,
      level: "Intermediate Level I",
      stageName: "Jathis & Tradition",
      theory: [
        "Natyam, Nrityam, and Nritta Slokam",
        "Natyotpatti (Origin of Dance)",
        "History and Evolution of Kuchipudi",
        "Development of Yakshagana",
        "Bhagavatula Mela Tradition",
        "Bhama Kalapam",
        "History of Siddhendra Yogi & Narayana Teertha",
        "Navarasas (Nine Emotions)",
        "Drishti Bhedas & Bhru Bhedas",
      ],
      practical: [
        "Chaturasra Jathis (First Half – 11 Jathis)",
        "Introduction to Tala structure",
        "Enunciation/recitation of Jathis on Tala",
      ],
      learningOutcome:
        "Students build deep rhythmic precision and begin understanding the rich historical and cultural roots of the Kuchipudi tradition.",
    },
    {
      year: 4,
      level: "Intermediate Level II",
      stageName: "Rhythm Systems & Complex Jathis",
      theory: [
        "Sapta Tala system",
        "Technical Terms: Natya, Nrutta, Nrutya, Lasya, Paatra, Apaatra, Kinkini, Sabha",
      ],
      practical: [
        "Remaining Chaturasra Jathis",
        "Tisram (4 Jathis)",
        "Khandam (2 Jathis)",
        "Misram (3 Jathis)",
        "Sankeernam (2 Jathis)",
        "Structured Tala practice and Jathi recitation",
        "Refinement of stage presentation skills",
      ],
      learningOutcome:
        "Students develop a sophisticated rhythmic understanding and learn to perform complex jathi variations and patterns with absolute confidence.",
    },
    {
      year: 5,
      level: "Advanced Level I",
      stageName: "Master Choreographies & Interpretation",
      theory: [
        "Significance of Uttama, Madhyama, and Adhama Nayikas",
        "Deva Hasta – Significance and Usage",
        "History of Jayadeva & Saint Thyagaraja",
        "Biography of Vedantam Lakshmi Narayana Sastry",
        "Biography of Vempati Venkata Narayana & Chinta Venkatramayya",
        "Raga, Tala, Composer, and semantic meaning of the dance items",
      ],
      practical: [
        "Selected choreographies of Dr. Vempati Chinna Satyam Master Garu:",
        "  - Jathiswaram",
        "  - Vinayaka Kauthvam",
        "  - Januta Shabdam",
        "  - Ramayana Shabdam",
        "Basic solo and group choreography techniques",
      ],
      learningOutcome:
        "Students strengthen performance skills, elevate their interpretive abilities, and develop a musical and emotional connection to the choreography.",
    },
    {
      year: 6,
      level: "Advanced Level II",
      stageName: "Exam Preparation & Repertoire",
      theory: [
        "Sveeya, Parakeeya, and Samanya Nayikas",
        "Ashta Vidha Nayikas and their psychological stages",
        "Dasavatara Hastas – Significance and Usage",
        "Concepts of Lokadharmi and Natyadharmi",
        "Life History of: Kshetrayya, Ramadasu, Annamacharya, Munipalle Subrahmanya Kavi",
      ],
      practical: [
        "Advanced repertoire of Dr. Vempati Chinna Satyam Master Garu's choreographies:",
        "  - Tarangam – Krishnam Kalaya Sakhi & Neela Megha Sareera",
        "  - Ramadasa Keerthana",
        "  - Devi Stuthi",
        "  - Annamacharya Keerthana",
        "  - Mandooka Shabdam",
        "  - Dasavatara Shabdam",
        "  - Thyagaraja Keerthana",
        "  - Daruvu",
        "  - Adhyatma Ramayana Keerthana",
        "  - Thillana",
        "Advanced solo and group stage presentations",
      ],
      learningOutcome:
        "Students demonstrate technical excellence, expressive maturity (abhinaya), deep theoretical mastery, and stage presence, qualifying them for the Certificate Public Examination.",
    },
  ],
  assessmentParameters: [
    {
      title: "Technical Proficiency",
      description:
        "Precision of footwork, clarity of hand gestures, execution of adugulu, and physical alignment.",
    },
    {
      title: "Practical Performance",
      description:
        "Grace, fluidity, flow of movement, and execution of items.",
    },
    {
      title: "Rhythm & Coordination",
      description:
        "Solid command of Tala, clarity in Jathi recitation, and syncing physical movements with complex rhythms.",
    },
    {
      title: "Theory Knowledge",
      description:
        "Understanding of shlokas, hand gestures, operational definitions, history, and biographical significance.",
    },
    {
      title: "Expression & Stage Presentation",
      description:
        "Authentic representation of abhinaya (expression), focus, confidence, and connection with the audience.",
    },
  ],
  progressAndMastery: [
    {
      title: "Promotion Standards",
      description:
        "Students who meet or exceed the performance benchmarks across all parameters will seamlessly transition to the next year of training.",
    },
    {
      title: "Student-Centric Reinforcement",
      description:
        "To preserve the integrity and high standards of classical Kuchipudi, students who require extra refinement in specific areas will receive targeted reinforcement. They will proceed to the next syllabus tier only when they display absolute comfort, technical safety, and mastery of their current level's foundations.",
    },
  ],
};
