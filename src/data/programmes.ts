import { getPublicSupabase } from '@/lib/supabase/public';
import { mergeProgrammeWithDefaults } from '@/lib/programmes/merge-defaults';

export interface ProgrammeBatchInfo {
  name: string;
  age: string;
  styles: string;
  schedule: string;
  instructors: string;
}

export interface ProgrammeItem {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  tagline: string;
  description: string;
  styles_highlight: string[];
  batches_info?: ProgrammeBatchInfo[];
  includes: string[];
  fees_monthly: number;
  fees_quarterly: number;
  age_group: string;
  sort_order: number;
  is_active: boolean;
  active_syllabi?: string[];
  catalog_styles?: string[];
}

export const DEFAULT_PROGRAMMES: ProgrammeItem[] = [
  {
    id: "p1-kids-dance",
    name: "Kids Dance",
    slug: "kids-dance",
    badge: "Kids Foundation & Choreography",
    tagline: "Bollywood · Hip Hop · Contemporary · Freestyle · Gymnastics",
    description:
      "Monday to Wednesday, 5:00 to 7:00 PM. Foundational technique, rhythm, stage confidence, Bollywood routines, hip hop basics, contemporary expression, and foundational gymnastics tailored specifically for young dancers.",
    styles_highlight: ["Bollywood", "Hip Hop", "Contemporary", "Freestyle", "Gymnastics"],
    batches_info: [
      {
        name: "Kids Bollywood & Freestyle (5–6 PM)",
        age: "Kids: 3.5–12 Years",
        styles: "Bollywood, Freestyle Rhythm & Coordination",
        schedule: "Mon to Wed · 5:00 PM – 6:00 PM",
        instructors: "Deepak (Dance Faculty)",
      },
      {
        name: "Kids Bollywood & Contemporary (6–7 PM)",
        age: "Kids: 3.5–12 Years",
        styles: "Bollywood, Hip Hop & Foundational Contemporary",
        schedule: "Mon to Wed · 6:00 PM – 7:00 PM",
        instructors: "Kajal (Dance Faculty)",
      },
    ],
    includes: [
      "Dance & Choreography",
      "Foundations & Grooves",
      "Rhythm, Musicality & Beat Recognition",
      "Basic Dance Technique & Body Control",
      "Stage Confidence & Performance Skills",
      "Movement & Creative Expression",
      "Foundational Gymnastics & Movement Skills",
      "Discipline, Focus & Self-Confidence",
    ],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: "Kids: 3.5–12 years",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "p2-adults-dance",
    name: "Adults Dance",
    slug: "adults-dance",
    badge: "Adults Choreography & Technique",
    tagline: "Bollywood · Commercial Hip Hop · Contemporary · Tollywood",
    description:
      "Discover your rhythm, build confidence, and experience the joy of dance at Rhythmzz Academy of Dance. Explore Bollywood, Hip Hop, and Contemporary dance through energetic choreography and structured training—from your first steps to confident performances. No prior dance experience is required.",
    styles_highlight: ["Bollywood", "Hip Hop", "Contemporary", "Tollywood", "Choreography"],
    batches_info: [
      {
        name: "Adults Bollywood & Commercial (7–8 PM)",
        age: "13+ Years",
        styles: "Trending Bollywood & Commercial Choreography",
        schedule: "Mon to Wed · 7:00 PM – 8:00 PM",
        instructors: "Nitish (Dance Faculty)",
      },
      {
        name: "Adults Contemporary & Lyrical (8–9 PM)",
        age: "13+ Years",
        styles: "Contemporary Floorwork & Expressive Phrasing",
        schedule: "Mon to Wed · 8:00 PM – 9:00 PM",
        instructors: "Pranith (Dance Faculty)",
      },
    ],
    includes: [
      "Bollywood Choreography & Trending Music",
      "Hip Hop Foundations & Isolation Techniques",
      "Contemporary Dance Foundation & Creative Expression",
      "Dance Technique, Posture & Body Control",
      "Coordination, Balance & Movement Precision",
      "Confidence, Stage Presence & Performance Skills",
      "Choreography Retention & Step Transitions",
      "Group Routines, Synchronisation & Teamwork",
      "Fitness, Flexibility & Active Movement",
    ],
    fees_monthly: 2500,
    fees_quarterly: 6000,
    age_group: "13+ Years",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "p3-mind-body-fitness",
    name: "Mind & Body Fitness",
    slug: "mind-body-fitness",
    badge: "Morning Wellness Batch",
    tagline: "Yoga · Zumba · Dance Fitness · Core Conditioning",
    description:
      "Build strength, improve flexibility, and feel your best with Mind & Body Fitness at Rhythmzz Academy of Dance. From Zumba and aerobics to yoga, Pilates, and strength training, our sessions combine energising workouts and mindful movement to support your fitness journey.",
    styles_highlight: ["Yoga", "Zumba", "Dance Fitness", "Pilates", "HIIT"],
    batches_info: [
      {
        name: "Complete Fitness Combo Pack",
        age: "16+ Years · All Fitness Levels",
        styles: "Zumba, Yoga, Pilates, HIIT & Mobility Drills",
        schedule: "Mon to Fri · 8:30–9:15 AM & 9:30–10:20 AM",
        instructors: "Fitness Faculty",
      },
      {
        name: "Zumba (2 Days a Week)",
        age: "16+ Years · All Fitness Levels",
        styles: "High-Energy Latin Dance Fitness Cardio",
        schedule: "Mon & Wed · 8:30–9:15 AM & 9:30–10:20 AM",
        instructors: "Fitness Faculty",
      },
      {
        name: "Yoga (1 Day a Week)",
        age: "16+ Years · All Fitness Levels",
        styles: "Flexibility, Posture & Breathwork Conditioning",
        schedule: "Tuesday · 9:30 AM – 10:20 AM",
        instructors: "Fitness Faculty",
      },
    ],
    includes: [
      "Personal Training & Individual Fitness Goals",
      "Zumba & Dance-Based Cardio Workouts",
      "Aerobics & Cardiovascular Endurance",
      "Yoga, Flexibility & Mindful Movement",
      "Pilates, Core Strength & Body Control",
      "Tabata & High-Intensity Interval Training",
      "Circuit Training & Full-Body Conditioning",
      "Cardio Workouts & Stamina Development",
      "Goal-Based Workouts & Progress Tracking",
      "Strength Training, Mobility & Functional Fitness",
    ],
    fees_monthly: 2500,
    fees_quarterly: 6000,
    age_group: "16+ Years",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "p4-classical-certification",
    name: "Structured Level-Based Certification (Classical Dance)",
    slug: "kuchipudi",
    badge: "Kuchipudi syllabus",
    tagline: "Kuchipudi · Friday & Saturday · exams",
    description:
      "Kuchipudi classical training on Friday and Saturday, 6:30 to 7:30 PM. Published year-by-year syllabus, board examinations, and accredited pathway toward Rangapravesham under Guru Srushti Nidhi.",
    styles_highlight: ["Kuchipudi"],
    active_syllabi: ["Kuchipudi"],
    catalog_styles: ["Kuchipudi"],
    batches_info: [
      {
        name: "Kuchipudi Classical Batch",
        age: "Kids: 3.5–12 yrs & Adults: 13+ yrs",
        styles: "10-year foundation or 6-year certificate track",
        schedule: "Fri & Sat · 6:30 PM – 7:30 PM",
        instructors: "Guru Srushti Nidhi (Classical Guru)",
      },
    ],
    includes: [
      "Year-wise Kuchipudi syllabus (Nritta, Nritya, Natya & Abhinaya)",
      "Adavus, jathis, hastas, and traditional repertoire items",
      "Board exams and accredited certification milestones",
      "Stage recitals and Rangapravesham preparation",
      "First trial class is on us · Zero admission fee",
    ],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: "Kids: 3.5–12 yrs & Adults: 13+ yrs",
    sort_order: 4,
    is_active: true,
  },
  {
    id: "p5-gymnastics",
    name: "Gymnastics & Tumbling",
    slug: "gymnastics",
    badge: "Acrobatics & Agility",
    tagline: "Foundational Tumbling & Acrobatics · Ages 3.5–12 Years",
    description:
      "Thursday & Saturday 5:15 to 6:15 PM. Tumbling, agility, flexibility, and foundational gymnastics. Ages 3.5–12 years.",
    styles_highlight: ["Gymnastics", "Tumbling", "Acrobatics"],
    batches_info: [
      {
        name: "Gymnastic Batch",
        age: "Kids: 3.5–12 Years",
        styles: "Tumbling, Acrobatics, Agility",
        schedule: "Thu & Sat · 5:15 PM – 6:15 PM",
        instructors: "Srikanth (Acrobatics Coach)",
      },
    ],
    includes: [
      "Foundational tumbling, rolls & handstand balance",
      "Core stability, flexibility, and spatial awareness",
      "Thursday & Saturday 5:15–6:15 PM",
      "Drop-in ₹300, Monthly ₹1,000, Quarterly ₹2,500",
      "First class is on us · Zero admission fee",
    ],
    fees_monthly: 1000,
    fees_quarterly: 2500,
    age_group: "Kids: 3.5–12 years",
    sort_order: 5,
    is_active: true,
  },
  {
    id: "p6-commercial-expressive",
    name: "Commercial & Expressive Style",
    slug: "commercial-expressive",
    badge: "Legacy Track",
    tagline: "Bollywood · Hip Hop · Contemporary",
    description: "Combined commercial choreography track for legacy registrations.",
    styles_highlight: ["Bollywood", "Hip Hop", "Contemporary"],
    includes: ["Commercial dance training", "Zero admission fee"],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: "All Age Pathways",
    sort_order: 99,
    is_active: false,
  },
];

export async function getProgrammes() {
  try {
    const supabase = getPublicSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('programmes')
        .select('id, name, slug, description, includes, fees_monthly, fees_quarterly, age_group, sort_order')
        .eq('is_active', true)
        .order('sort_order');
      if (data && data.length > 0) {
        return data.map((row) => mergeProgrammeWithDefaults(row as Record<string, unknown>));
      }
    }
  } catch {}
  return DEFAULT_PROGRAMMES.filter((p) => p.is_active);
}

export async function getProgrammeBySlug(slug: string) {
  try {
    const supabase = getPublicSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('programmes')
        .select('*, batches(id, days, time_start, time_end, capacity, enrolled_count, status, instructor:instructors(name, photo_url))')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (data) return mergeProgrammeWithDefaults(data as Record<string, unknown>);
    }
  } catch {}

  // Direct exact match from DEFAULT_PROGRAMMES
  const direct = DEFAULT_PROGRAMMES.find((p) => p.slug === slug);
  if (direct) return direct;

  // Legacy alias fallbacks
  if (slug === 'commercial-expressive') {
    return DEFAULT_PROGRAMMES.find((p) => p.slug === 'kids-dance') ?? null;
  }
  if (slug === 'classical-dance' || slug === 'classical-certification' || slug === 'kathak') {
    return DEFAULT_PROGRAMMES.find((p) => p.slug === 'kuchipudi') ?? null;
  }
  if (slug === 'gymnastic') {
    return DEFAULT_PROGRAMMES.find((p) => p.slug === 'gymnastics') ?? null;
  }

  return null;
}
