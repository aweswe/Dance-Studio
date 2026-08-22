import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_STATS = [
  { key: 'stats_students', value: '5000+' },
  { key: 'stats_years', value: '15+' },
  { key: 'stats_programmes', value: '4' },
  { key: 'stats_awards', value: '3' },
];

const DEFAULT_FAQS = [
  { question: 'Do I need prior dance experience to join?', answer: 'Not at all! We have beginner-friendly batches for both kids and adults across all dance styles.' },
  { question: 'What should I wear to class?', answer: 'Comfortable workout or dance attire (t-shirt, track pants or leggings) and clean dance sneakers or bare feet for classical classes.' },
  { question: 'Can I attend a trial class before enrolling?', answer: 'Yes! We offer a free trial class for prospective students. Contact us on WhatsApp to schedule your trial.' },
  { question: 'What is the fee payment cycle?', answer: 'Fees are payable monthly by the 5th of each month, or quarterly with an attractive discount.' },
  { question: 'Where is Rhythmzz Academy located?', answer: 'We are located at Plot 597, 3rd Floor, Above ICICI ATM, Neredmet X Road Bus Stop, Secunderabad.' },
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

export async function getBanner() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'banner')
      .single();
    if (data) return (data as any)?.content_value;
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
