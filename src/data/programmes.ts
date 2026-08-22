import { cacheTag } from 'next/cache';
import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_PROGRAMMES = [
  {
    id: "a1b2c3d4-0001-0000-0000-000000000001",
    name: "Kids Dance",
    slug: "kids-dance",
    description: "Fun, high-energy dance classes designed specifically for children aged 4 to 14. Building confidence, rhythm, musicality, and stage presence through Bollywood, Hip Hop, and Freestyle.",
    includes: ["Bollywood & Hip Hop routines", "Basic technique & rhythm training", "Stage performance opportunities", "Annual recital participation", "Confidence & coordination building"],
    fees_monthly: 2500,
    fees_quarterly: 6500,
    age_group: "4 - 14 Years",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "a1b2c3d4-0002-0000-0000-000000000002",
    name: "Adults Dance",
    slug: "adults-dance",
    description: "Versatile dance training for adults of all skill levels — from absolute beginners to intermediate dancers. Learn choreography, master body isolation, and express yourself on the dance floor.",
    includes: ["Bollywood choreography & trending tracks", "Hip Hop foundations & isolation drills", "Contemporary movement & expression", "Freestyle & musicality development", "No prior dance experience required"],
    fees_monthly: 3000,
    fees_quarterly: 8000,
    age_group: "15+ Years",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "a1b2c3d4-0003-0000-0000-000000000003",
    name: "Mind & Body Fitness",
    slug: "mind-body-fitness",
    description: "A transformative blend of high-energy dance fitness and mindful body conditioning. Burn calories, improve flexibility, build core strength, and relieve daily stress.",
    includes: ["Zumba — high-calorie-burn dance fitness", "Hatha & Vinyasa Yoga for flexibility", "Core conditioning & posture alignment", "Breathwork & guided stress relief", "Suitable for all fitness levels"],
    fees_monthly: 2500,
    fees_quarterly: 6500,
    age_group: "All Ages (14+)",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "a1b2c3d4-0004-0000-0000-000000000004",
    name: "Kuchipudi Classical",
    slug: "kuchipudi",
    description: "Authentic, structured classical dance training rooted in the rich traditions of Andhra Pradesh. Master rhythmic footwork (Jathis), expressive storytelling (Abhinaya), and mudras.",
    includes: ["Structured curriculum: Foundation → Intermediate → Advanced", "Adavus (basic steps) & Jathis (rhythmic patterns)", "Asamyuta & Samyuta Hastas (hand gestures)", "Abhinaya (facial expression & storytelling)", "Stage performance & Arangetram preparation"],
    fees_monthly: 3500,
    fees_quarterly: 9500,
    age_group: "6+ Years",
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
