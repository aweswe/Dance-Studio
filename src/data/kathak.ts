export interface KathakCurriculumYear {
  year: number;
  level: string;
  stageName: string;
  boardCertification: string;
  theory: string[];
  practical: string[];
  learningOutcome: string;
}

export const KATHAK_CURRICULUM_PLAN: {
  title: string;
  lineage: string;
  guru: string;
  targetAudience: string;
  summary: string;
  years: KathakCurriculumYear[];
} = {
  title: "Kathak Classical Dance: Graded Master Curriculum",
  lineage: "Lucknow Gharana",
  guru: "Guru Poonam Nayak Jamwale (Visharad Poorna · Gandharva Mahavidyalaya)",
  targetAudience: "Ages 5+ to Adults · Beginner to Visharad Graduation",
  summary:
    "Structured classical Kathak training rooted in the Lucknow Gharana tradition. Integrates rhythmic mathematical footwork (Tatkar), rapid pirouettes (Chakkars), lyrical graceful abhinaya, and Gandharva Mahavidyalaya / University certified board examinations.",
  years: [
    {
      year: 1,
      level: "Prarambhik (Year 1)",
      stageName: "Tatkar & Foundational Hastaks",
      boardCertification: "Gandharva Mahavidyalaya Prarambhik Prep",
      theory: [
        "Origin & history of Kathak and the Lucknow Gharana",
        "Introduction to Teentaal (16 beats, Matra, Vibhag, Sam, Taali, Khaali)",
        "Namascar Shloka and stage sanctity",
        "8 Asamyuta Hastas (single hand gestures) relevant to Kathak",
      ],
      practical: [
        "Tatkar (basic rhythmic footwork) in Ekgun (single speed) and Dugun (double speed)",
        "Foundational Hastaks (wrist and arm extensions)",
        "Basic 1-foot and 2-foot Chakkars (turns) with spotting technique",
        "Guru Vandana and introductory Teentaal Toda",
      ],
      learningOutcome:
        "Develops grounded footwork, rhythmic awareness on Teentaal metric cycles, spinal alignment, and balance during rotational turns.",
    },
    {
      year: 2,
      level: "Prarambhik (Year 2)",
      stageName: "Metric Mastery & Introductory Tukras",
      boardCertification: "Prarambhik Certificate Examination",
      theory: [
        "Definition of Laya: Vilambit, Madhyama, Dhruta",
        "Padhant (oral recitation) of Toda syllables with hand clapping",
        "Introduction to Samyuta Hastas (double hand gestures)",
        "Anatomy of Ghungroos (bells) and ankle weight management",
      ],
      practical: [
        "Tatkar in Chaugun (quadruple speed) with clear metric resolution on Sam",
        "Thaat and Aamad (traditional courtly entry pieces)",
        "Simple Tihais (thrice-repeated rhythmic cadences)",
        "Two traditional Teentaal Tukras and basic Salami (salutation)",
      ],
      learningOutcome:
        "Student masters oral padhant, executes crisp footwork with 50+ ghungroos, and performs the first complete entry repertoire.",
    },
    {
      year: 3,
      level: "Praveshika Pratham (Year 3)",
      stageName: "Gat Nikas & Speed Conditioning",
      boardCertification: "Praveshika Pratham Board Exam",
      theory: [
        "Study of Jhaptal (10 beats, 4 vibhags: 2-3-2-3)",
        "Introduction to Natyashastra Anga, Pratyanga, and Upanga movements",
        "Concept of Upaj (impromptu rhythmic variation)",
        "Biographical study of Lucknow Gharana maestros",
      ],
      practical: [
        "Rapid 5-count Chakkars (continuous spins maintaining center)",
        "Gat Nikas: Mor Mukut (Krishna) and Bansuri Chaal",
        "Tukras, Parans, and Chakradhar Tihais in Teentaal",
        "Introduction to Jhaptal Tatkar and foundational Toda",
      ],
      learningOutcome:
        "Command over 10-beat metric structures, swift sustained spins, and subtle eye/brow coordination during lyrical walking gaits.",
    },
    {
      year: 4,
      level: "Praveshika Poorna (Year 4)",
      stageName: "Abhinaya Foundations & Roopak Taal",
      boardCertification: "Praveshika Poorna Diploma",
      theory: [
        "Study of Roopak Taal (7 beats: 3-2-2, unique Khaali on beat 1)",
        "Introduction to the 9 Navarasas (primary aesthetic sentiments)",
        "Differentiation between Nritta (pure dance), Nritya, and Natya",
        "Costume aesthetics: Angarkha, Churidar, Dupatta, and Ornaments",
      ],
      practical: [
        "Kavit (rhythmic poetry set to mythological themes)",
        "Abhinaya on Thumri or Bhajan with nuanced facial storytelling",
        "Roopak Taal Tatkar in 3 speeds with Tukras and Tihais",
        "Gat Bhava: Makhan Chori or Panghat narrative sequences",
      ],
      learningOutcome:
        "Expressive storytelling capability through eyes and mudras, performing poetic literature set to challenging 7-beat cycles.",
    },
    {
      year: 5,
      level: "Madhyama Pratham (Years 5–6)",
      stageName: "Advanced Repertoire & Complex Rhythms",
      boardCertification: "Madhyama Pratham Degree",
      theory: [
        "Detailed study of Ektaal (12 beats) and Dhamar (14 beats)",
        "Historical impact of Mughal court patronage vs. temple traditions",
        "Raga and Tala relationship in Hindustani classical music",
        "Tabla Bol accompaniment and Layakari variations",
      ],
      practical: [
        "Extensive Chakradhar Parans with intricate footwork patterns",
        "Advanced Gat Bhava with character transitions (Pootana Moksha / Kaliya Daman)",
        "Dhamar taal Horis and seasonal compositions",
        "Speed spins of 16–27 continuous Chakkars landing precisely on Sam",
      ],
      learningOutcome:
        "Virtuoso rhythmic agility, effortless transition between multiple talas, and sophisticated character transformation in abhinaya.",
    },
    {
      year: 6,
      level: "Visharad Graduation (Years 7–8+)",
      stageName: "Solo Stage Debut (Manch Pravesh)",
      boardCertification: "Visharad Poorna (Recognized Graduation)",
      theory: [
        "In-depth Natyashastra, Abhinaya Darpana, and Sangeet Ratnakar analysis",
        "Comparative study: Lucknow vs. Jaipur vs. Banaras Gharanas",
        "Art of stage direction, light design, and live ensemble conduction",
        "Pedagogical methodology for training junior disciples",
      ],
      practical: [
        "Full 90-minute solo stage debut recital (Manch Pravesh)",
        "Live accompaniment coordination with Tabla, Sarangi, Harmonium, and Padhanth",
        "Complex Layakari: Kuwadi (1.25), Biwadi (1.75), and Sawadi (1.5)",
        "Deep emotional exploration of Ashthapadis, Ghazals, and Dadra",
      ],
      learningOutcome:
        "Full artistic independence, qualification as a certified classical performer and examiner, and completion of the sacred solo debut.",
    },
  ],
};
