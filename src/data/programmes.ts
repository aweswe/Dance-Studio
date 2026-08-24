import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_PROGRAMMES = [
  {
    id: "a1b2c3d4-4001-4000-8000-000000000001",
    name: "Kids Dance",
    slug: "kids-dance",
    description: "Bollywood, Hip Hop and Contemporary training for children aged 5 and above — technique, rhythm and stage confidence, taught step by step.",
    includes: ["Bollywood & Hip Hop routines", "Basic technique & rhythm training", "Stage performance opportunities", "Annual recital participation", "Confidence & coordination building"],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: "5+ Years",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "a1b2c3d4-4002-4000-8000-000000000002",
    name: "Adults Dance",
    slug: "adults-dance",
    description: "Bollywood, Hip Hop, Contemporary and choreography for adults aged 16 and above — from first steps to full performance pieces.",
    includes: ["Bollywood choreography & trending tracks", "Hip Hop foundations & isolation drills", "Contemporary movement & expression", "Freestyle & musicality development", "No prior dance experience required"],
    fees_monthly: 2500,
    fees_quarterly: 6500,
    age_group: "16+ Years",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "a1b2c3d4-4003-4000-8000-000000000003",
    name: "Mind & Body Fitness",
    slug: "mind-body-fitness",
    description: "Zumba, Yoga, Pilates, HIIT and strength training — one hour every weekday morning to build stamina, flexibility and core strength.",
    includes: ["Zumba — high-calorie-burn dance fitness", "Hatha & Vinyasa Yoga for flexibility", "Core conditioning & posture alignment", "Breathwork & guided stress relief", "Suitable for all fitness levels"],
    fees_monthly: 2500,
    fees_quarterly: 6500,
    age_group: "16+ Years",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "a1b2c3d4-4004-4000-8000-000000000004",
    name: "Kuchipudi Classical",
    slug: "kuchipudi",
    description: "Level-based classical Kuchipudi training — Foundation through Advanced — adavus, jathis, hastas and abhinaya taught the traditional way.",
    includes: ["Structured curriculum: Foundation → Intermediate → Advanced", "Adavus (basic steps) & Jathis (rhythmic patterns)", "Asamyuta & Samyuta Hastas (hand gestures)", "Abhinaya (facial expression & storytelling)", "Stage performance & Arangetram preparation"],
    fees_monthly: 2000,
    fees_quarterly: 5000,
    age_group: "5+ Years",
    sort_order: 4,
    is_active: true,
  },
];

export async function getProgrammes() {
  try {
    const supabase = getPublicSupabase();
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
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('programmes')
      .select('*, batches(id, days, time_start, time_end, capacity, enrolled_count, status, instructor:instructors(name, photo_url))')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (data) return data;
  } catch {}
  return DEFAULT_PROGRAMMES.find((p) => p.slug === slug) ?? null;
}
