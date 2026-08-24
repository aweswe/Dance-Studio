import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_INSTRUCTORS = [
  {
    id: "i1-nitish",
    name: "Nitish",
    role: "Founder & Artistic Director",
    bio: "Founder of Rhythmzz Academy. 15+ years of teaching, 5,000+ students trained in Bollywood, Hip Hop and Contemporary. ISPTD-certified; represented India at the nATFEST International Contemporary Dance Festival, Sri Lanka 2017.",
    photo_url: null,
    certifications: ["ISPTD Certified", "nATFEST International Festival, Sri Lanka 2017", "15+ Years Teaching Experience"],
    is_active: true,
  },
  {
    id: "i2-deepak",
    name: "Deepak",
    role: "Kids Dance Instructor",
    bio: "Leads the Kids Dance programme — Bollywood and Hip Hop fundamentals, choreography and stage confidence for children aged 5 and above. Mon–Wed, 5 to 7 PM.",
    photo_url: null,
    certifications: ["Bollywood & Hip Hop Specialist"],
    is_active: true,
  },
  {
    id: "i3-shailaja",
    name: "Shailaja",
    role: "Mind & Body Fitness Instructor",
    bio: "Runs the Mind & Body Fitness programme — Zumba, Yoga, Pilates, HIIT and strength training every weekday morning, 9:30 to 10:30 AM.",
    photo_url: null,
    certifications: ["Zumba Certified", "Yoga Instructor"],
    is_active: true,
  },
  {
    id: "i4-srusti",
    name: "Srusti",
    role: "Kuchipudi Classical Instructor",
    bio: "Certified Kuchipudi instructor guiding students from Foundation to Advanced level through adavus, jathis, hastas and abhinaya. Fri–Sat, 6:30 to 7:30 PM.",
    photo_url: null,
    certifications: ["Certified Kuchipudi Instructor"],
    is_active: true,
  },
];

export async function getInstructors() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('instructors')
      .select('id, name, role, bio, photo_url, certifications, is_active')
      .eq('is_active', true);
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_INSTRUCTORS;
}
