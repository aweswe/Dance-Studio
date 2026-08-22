import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_INSTRUCTORS = [
  {
    id: "i1-nitish",
    name: "Nitish",
    bio: "Founder & Artistic Director with 15+ years of teaching experience. Trained over 5,000 students in Bollywood, Hip Hop, and Contemporary. Certified by ISPTD.",
    photo_url: null,
    certifications: ["ISPTD Certified Dance Instructor", "15+ Years Teaching Experience"],
    is_active: true,
  },
];

export async function getInstructors() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('instructors')
      .select('id, name, bio, photo_url, certifications, is_active')
      .eq('is_active', true);
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_INSTRUCTORS;
}
