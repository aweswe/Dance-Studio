import { getPublicSupabase } from '@/lib/supabase/public';

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
    id: "p1-commercial-expressive",
    name: "Commercial & Expressive Style",
    slug: "commercial-expressive",
    badge: "Kids & Adults Batches",
    tagline: "Bollywood · Hip Hop · Contemporary · Tollywood · Gymnastics",
    description:
      "Comprehensive commercial and expressive dance training split into dedicated Kids and Adults batches. Covers Bollywood routines, authentic Hip Hop foundations, expressive Contemporary floorwork, commercial Tollywood, and acrobatic gymnastics.",
    styles_highlight: ["Bollywood", "Hip Hop", "Contemporary", "Tollywood", "Gymnastics"],
    batches_info: [
      {
        name: "Kids Batch",
        age: "Ages 5–14 Years",
        styles: "Bollywood, Hip Hop, Contemporary & Foundational Gymnastics",
        schedule: "Mon to Wed · 5:00 PM – 7:00 PM",
        instructors: "Deepak Rao & Kajal Devi",
      },
      {
        name: "Adults Batch",
        age: "Ages 15+ Years",
        styles: "Bollywood, Commercial Hip Hop, Contemporary & Tollywood",
        schedule: "Mon to Wed · 7:00 PM – 9:00 PM",
        instructors: "Nitish Kumar & Pranith Nair",
      },
    ],
    includes: [
      "Dedicated Kids Batch: Technique, rhythm, acro-gymnastics & stage confidence",
      "Dedicated Adults Batch: Trending choreography, isolation drills, popping & lyrical flow",
      "Tollywood & Bollywood commercial screen choreography",
      "Annual recital, video showcase & live stage performance opportunities",
      "No prior experience required · Free trial evaluation class",
    ],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: "Kids (5+) & Adults (15+)",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "p2-mind-body-fitness",
    name: "Mind & Body Fitness",
    slug: "mind-body-fitness",
    badge: "Morning Wellness Batch",
    tagline: "Yoga · Zumba · Dance Fitness · Core Conditioning",
    description:
      "High-energy weekday morning conditioning combining calorie-burning Zumba dance fitness, flexibility-building Hatha & Vinyasa Yoga, Pilates core alignment, HIIT cardio, and guided breathwork.",
    styles_highlight: ["Yoga", "Zumba", "Dance Fitness", "Pilates", "HIIT"],
    batches_info: [
      {
        name: "Morning Wellness Cohort",
        age: "Ages 16+ Years · All Fitness Levels",
        styles: "Zumba, Yoga, Pilates, HIIT & Mobility Drills",
        schedule: "Mon to Fri · 9:30 AM – 10:30 AM",
        instructors: "Shailaja & Certified Fitness Coaches",
      },
    ],
    includes: [
      "Zumba — high-calorie-burn dance fitness & rhythm cardio",
      "Hatha & Vinyasa Yoga for joint mobility, flexibility & posture",
      "Pilates & core conditioning for functional strength",
      "HIIT stamina training & guided breathwork stress relief",
      "Suitable for all fitness levels · No dance background required",
    ],
    fees_monthly: 2500,
    fees_quarterly: 6500,
    age_group: "16+ Years · All Levels",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "p3-classical-certification",
    name: "Structured Level-Based Certification (Classical Dance)",
    slug: "classical-dance",
    badge: "Kuchipudi & Kathak Syllabi",
    tagline: "Kuchipudi · Kathak · Bharatnatyam · Ballet",
    description:
      "Rigorous level-based classical training adhering to Natyashastra traditions with fixed-term enrolment cycles (prohibiting casual drop-ins) and recognized board examinations leading to sacred Rangapravesham solo debuts. Active master syllabi available for Kuchipudi and Kathak.",
    styles_highlight: ["Kuchipudi", "Kathak", "Bharatnatyam", "Ballet"],
    active_syllabi: ["Kuchipudi", "Kathak"],
    catalog_styles: ["Kuchipudi", "Kathak", "Bharatnatyam", "Ballet"],
    batches_info: [
      {
        name: "Kuchipudi Classical Cohort",
        age: "Ages 5+ to Adults · Foundation to Advanced",
        styles: "10-Year Master Syllabus & 6-Year Accelerated Certificate Track",
        schedule: "Fri & Sat · 6:30 PM – 7:30 PM",
        instructors: "Guru Srushti Nidhi",
      },
      {
        name: "Kathak Classical Cohort",
        age: "Ages 5+ to Adults · Prarambhik to Visharad",
        styles: "Lucknow Gharana Tatkar, Chakkars, Toda-Tukra & Abhinaya",
        schedule: "Saturday & Sunday Weekend Batches",
        instructors: "Guru Poonam Nayak Jamwale",
      },
    ],
    includes: [
      "Structured Master Syllabi: Active curriculums for Kuchipudi and Kathak",
      "Foundational Adavus / Tatkar, Jathis, Samyuta/Asamyuta Hastas & Abhinaya",
      "Fixed Terms: Monthly & 3-Month enrolment cycles (strictly zero casual drops)",
      "Official board examinations & grade certificate progression",
      "Stage repertoire, Tarangam brass plate dance & Rangapravesham solo debut",
    ],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: "5+ Years to Adults",
    sort_order: 3,
    is_active: true,
  },
];

export async function getProgrammes() {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return DEFAULT_PROGRAMMES;
    const { data } = await supabase
      .from('programmes')
      .select('id, name, slug, description, includes, fees_monthly, fees_quarterly, age_group, sort_order')
      .eq('is_active', true)
      .order('sort_order');
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_PROGRAMMES;
}

export async function getProgrammeBySlug(slug: string) {
  // Alias mapping to support both new 3-programme slugs and legacy paths
  const normalizedSlug =
    slug === 'kids-dance' || slug === 'adults-dance'
      ? 'commercial-expressive'
      : slug === 'kuchipudi' || slug === 'kathak' || slug === 'classical-certification'
      ? 'classical-dance'
      : slug;

  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return (
        DEFAULT_PROGRAMMES.find((p) => p.slug === normalizedSlug) ??
        DEFAULT_PROGRAMMES.find((p) => p.slug === slug) ??
        null
      );
    }
    const { data } = await supabase
      .from('programmes')
      .select('*, batches(id, days, time_start, time_end, capacity, enrolled_count, status, instructor:instructors(name, photo_url))')
      .eq('slug', normalizedSlug)
      .eq('is_active', true)
      .single();
    if (data) return data;
  } catch {}

  return (
    DEFAULT_PROGRAMMES.find((p) => p.slug === normalizedSlug) ??
    DEFAULT_PROGRAMMES.find((p) => p.slug === slug) ??
    null
  );
}
