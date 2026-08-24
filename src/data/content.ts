import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_STATS = [
  { key: 'stats_students', value: '5000+' },
  { key: 'stats_years', value: '15+' },
  { key: 'stats_programmes', value: '4' },
  { key: 'stats_awards', value: '3' },
];

const DEFAULT_FAQS = [
  { question: 'Where are dance classes near Sainikpuri?', answer: 'Rhythmzz Academy of Dance is at Neredmet X Road Bus Stop, just 8 to 12 minutes from Sainikpuri by drive. We offer Kids Dance, Adults Dance, Mind and Body Fitness and Kuchipudi Classical. Call +91 90529 80859 to book a free trial.' },
  { question: 'Is there a free trial class for dance classes in Secunderabad?', answer: 'Yes. Rhythmzz Academy of Dance offers one free trial class for all new students. No registration fee. Call or WhatsApp +91 90529 80859 to book your trial class.' },
  { question: 'What are the dance class fees at Rhythmzz Academy?', answer: 'Kids Dance: 2000 rupees per month or 5000 rupees per quarter. Adults Dance: 2500 rupees per month or 6500 rupees per quarter. Mind and Body Fitness: 2500 rupees per month or 6500 rupees per quarter. Kuchipudi Classical: 2000 rupees per month or 5000 rupees per quarter. No registration fee.' },
  { question: 'Does Rhythmzz offer Kuchipudi classes near AS Rao Nagar?', answer: 'Yes. Rhythmzz Academy of Dance offers certified Kuchipudi Classical Dance classes at Neredmet X Road, about 10 to 14 minutes from AS Rao Nagar. Classes run every Friday and Saturday 6:30 to 7:30 PM. Taught by Srusti, a certified Kuchipudi instructor.' },
  { question: 'Are there Zumba classes near Neredmet?', answer: 'Yes. Rhythmzz Academy of Dance offers Zumba as part of the Mind and Body Fitness programme at Neredmet X Road, Secunderabad. Classes run Monday to Friday, 9:30 to 10:30 AM. 2500 rupees per month.' },
  { question: 'Can I rent a dance studio in Secunderabad?', answer: 'Yes. Rhythmzz Academy of Dance offers studio rental at Neredmet X Road, Secunderabad. Rates are 1000 rupees per hour on weekdays and 1500 rupees per hour on weekends. The studio is fully air-conditioned with mirrors, a dance floor, and a sound system. WhatsApp +91 90529 80859 to check availability.' },
  { question: 'Which areas does Rhythmzz Academy serve?', answer: 'Rhythmzz Academy of Dance at Neredmet X Road serves students from Sainikpuri, AS Rao Nagar, Yapral, Malkajgiri, Hastinapuri, Kapra and surrounding areas in Secunderabad and East Hyderabad. Most students are within 15 minutes by drive.' },
];

export async function getSiteContent(key: string) {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', key)
      .single();
    if (data) return (data as any)?.content_value;
  } catch {}
  return null;
}

export async function getStats() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('site_content')
      .select('content_key, content_value')
      .like('content_key', 'stats_%');
    if (data && data.length > 0) {
      return ((data as any[]) ?? []).map(d => ({ key: d.content_key, value: d.content_value }));
    }
  } catch {}
  return DEFAULT_STATS;
}

export async function getFAQs() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'faqs')
      .single();
    if (data) return ((data as any)?.content_value) ?? [];
  } catch {}
  return DEFAULT_FAQS;
}

/**
 * Banner is stored as {active, text, ctaLink} by the admin content editor.
 * Returns the text (or null when hidden) — legacy plain-string banners are
 * treated as active with no CTA.
 */
export async function getBanner(): Promise<string | null> {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'banner')
      .single();
    const value = (data as any)?.content_value;
    if (value == null) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.active && value.text) return value.text;
    return null;
  } catch {}
  return null;
}

export async function getTestimonials() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'testimonials')
      .single();
    if (data) return ((data as any)?.content_value) ?? [];
  } catch {}
  return [
    { name: "Pooja Reddy", quote: "Rhythmzz is more than a dance studio — it's a family. Nitish Sir's energy is contagious and the technique training is unmatched in Secunderabad.", programme: "Adults Dance", rating: 5 },
    { name: "Suresh & Deepa", quote: "Our 7-year-old daughter was shy before joining the kids batch. Now she leads performances with absolute confidence. Truly grateful!", programme: "Kids Dance", rating: 5 },
    { name: "Ananya Sharma", quote: "The Kuchipudi training under traditional guidance is rigorous yet so nurturing. Beautiful studio atmosphere and excellent discipline.", programme: "Kuchipudi Classical", rating: 5 }
  ];
}
