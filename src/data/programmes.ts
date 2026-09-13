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
    id: "p1-commercial-expressive",
    name: "Commercial & Expressive Style",
    slug: "commercial-expressive",
    badge: "Kids & Adults Batches",
    tagline: "Bollywood · Hip Hop · Contemporary · Tollywood · Gymnastics",
    description:
      "Kids 5–14 at 5 pm, adults 15+ at 7 pm, Monday to Wednesday. Bollywood, hip-hop, contemporary, Tollywood, and a bit of gymnastics — the same floor, two rooms of energy.",
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
      "Kids 5–14, Mon–Wed 5 to 7",
      "Adults 15+, Mon–Wed 7 to 9",
      "Bollywood, hip-hop, contemporary, Tollywood",
      "One recital a year — you will be on stage",
      "First class free. No registration fee",
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
      "Weekday mornings, 9:30 to 10:30. Zumba, yoga, pilates, and a hard 20 minutes of HIIT when Shailaja feels like it. Come in gym clothes. No dance background needed.",
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
      "Zumba that actually makes you sweat",
      "Yoga for tight hips after sitting all week",
      "Pilates and a short HIIT block",
      "Monday to Friday, 9:30–10:30",
      "No dance background. Gym clothes are fine",
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
    badge: "Kuchipudi syllabus",
    tagline: "Kuchipudi · Friday & Saturday · exams",
    description:
      "Srusti teaches Kuchipudi on Friday and Saturday evenings. There is a published year-by-year syllabus, board exams, and a path toward Rangapravesham. This is a term class, not a drop-in.",
    styles_highlight: ["Kuchipudi"],
    active_syllabi: ["Kuchipudi"],
    catalog_styles: ["Kuchipudi"],
    batches_info: [
      {
        name: "Kuchipudi",
        age: "From age 5 through adults",
        styles: "10-year foundation or 6-year certificate track",
        schedule: "Fri & Sat · 6:30 PM – 7:30 PM",
        instructors: "Srusti",
      },
    ],
    includes: [
      "Year-wise Kuchipudi syllabus (the one on this site)",
      "Adavus, jathis, hastas, and abhinaya in class, not on a handout",
      "Monthly or quarterly fees — you stay on the batch",
      "Board exams when Srusti says you are ready",
      "Stage work and Rangapravesham when the dancer is actually there",
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
    if (data && data.length > 0) {
      return data.map((row) => mergeProgrammeWithDefaults(row as Record<string, unknown>));
    }
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
    if (data) return mergeProgrammeWithDefaults(data as Record<string, unknown>);
  } catch {}

  return (
    DEFAULT_PROGRAMMES.find((p) => p.slug === normalizedSlug) ??
    DEFAULT_PROGRAMMES.find((p) => p.slug === slug) ??
    null
  );
}
