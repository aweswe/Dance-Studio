import { getPublicSupabase } from '@/lib/supabase/public';

export const DEFAULT_STATS = [
  { key: 'stats_students', value: '3000+' },
  { key: 'stats_years', value: '15+' },
  { key: 'stats_programmes', value: '5' },
  { key: 'stats_shows', value: '200+' },
];

export const DEFAULT_FAQS = [
  { question: 'Where are dance classes near Sainikpuri?', answer: 'Rhythmzz Academy of Dance is at Neredmet X Road Bus Stop, just 8 to 12 minutes from Sainikpuri by drive. We offer Kids Dance, Adults Dance, Mind and Body Fitness, Gymnastic and Kuchipudi Classical. Call +91 90529 80859 to book a trial class.' },
  { question: 'Is there a free trial class for dance classes in Secunderabad?', answer: 'Yes. Rhythmzz Academy of Dance offers your first class on us for all new students. No registration fee. Call or WhatsApp +91 90529 80859 to book your trial class.' },
  { question: 'What are the dance class fees at Rhythmzz Academy of Dance?', answer: 'Kids Dance: ₹2,000/month or ₹5,000/quarter. Adults Dance: ₹2,500/month or ₹6,500/quarter. Mind and Body Fitness: ₹2,500/month or ₹6,500/quarter. Kuchipudi Classical: ₹2,000/month or ₹5,000/quarter. Gymnastic: ₹1,200/month or ₹3,000/quarter (₹300 drop-in). No registration fee.' },
  { question: 'Does Rhythmzz offer Kuchipudi classes near AS Rao Nagar?', answer: 'Yes. Rhythmzz Academy of Dance offers certified Kuchipudi Classical Dance classes at Neredmet X Road, about 10 to 14 minutes from AS Rao Nagar. Classes run every Friday and Saturday 6:30 to 7:30 PM, taught by certified classical Kuchipudi faculty.' },
  { question: 'Are there Zumba classes near Neredmet?', answer: 'Yes. Rhythmzz Academy of Dance offers Zumba as part of the Mind and Body Fitness programme at Neredmet X Road, Secunderabad. Classes run Monday to Friday, 8:30 to 9:15 AM and 9:30 to 10:20 AM under certified fitness faculty.' },
  { question: 'Can I rent a dance studio in Secunderabad?', answer: 'Yes. Rhythmzz Academy of Dance offers studio rental at Neredmet X Road, Secunderabad. Rates are ₹1,000 per hour on weekdays and ₹1,500 per hour on weekends. Amenities include washroom, mirrors, a Marley dance floor, Bluetooth sound system, changing rooms, and CCTV protection. WhatsApp +91 9052980859 to check availability.' },
  { question: 'Which areas does Rhythmzz Academy of Dance serve?', answer: 'Rhythmzz Academy of Dance at Neredmet X Road serves students from Sainikpuri, AS Rao Nagar, Yapral, Malkajgiri, Hastinapuri, Kapra and surrounding areas in Secunderabad and East Hyderabad. Most students are within 8 to 15 minutes by drive.' },
];

export async function getSiteContent(key: string) {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) throw new Error('no public client');
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
    if (!supabase) throw new Error('no public client');
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
    if (!supabase) throw new Error('no public client');
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'faqs')
      .single();
    if (data) return ((data as any)?.content_value) ?? [];
  } catch {}
  return DEFAULT_FAQS;
}

export interface BannerContent {
  text: string;
  ctaLink?: string | null;
}

/**
 * Banner is stored as {active, text, ctaLink} by the admin content editor.
 */
export async function getBanner(): Promise<BannerContent | null> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) throw new Error('no public client');
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'banner')
      .single();
    const value = (data as any)?.content_value;
    if (value == null) return null;
    if (typeof value === 'string') return { text: value };
    if (typeof value === 'object' && value.active && value.text) {
      return { text: value.text, ctaLink: value.ctaLink ?? null };
    }
    return null;
  } catch {}
  return null;
}

export const DEFAULT_TESTIMONIALS = [
  { name: "Pooja Reddy", quote: "Rhythmzz is more than a dance studio — it's a family. The faculty's energy is contagious and the technique training is unmatched in Secunderabad.", programme: "Adults Dance", rating: 5 },
  { name: "Suresh & Deepa", quote: "Our 7-year-old daughter was shy before joining the kids batch. Now she leads performances with absolute confidence. Truly grateful!", programme: "Kids Dance", rating: 5 },
  { name: "Ananya Sharma", quote: "The Kuchipudi training under traditional guidance is rigorous yet so nurturing. Beautiful studio atmosphere and excellent discipline.", programme: "Kuchipudi Classical", rating: 5 }
];

export async function getTestimonials() {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) throw new Error('no public client');
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'testimonials')
      .single();
    if (data) return ((data as any)?.content_value) ?? [];
  } catch {}
  return DEFAULT_TESTIMONIALS;
}

export interface HomepageContentBundle {
  faqs: any[];
  testimonials: any[];
  stats: { key: string; value: string }[];
  storefrontMode: 'coming_soon' | 'live';
}

/**
 * Batched query for all site_content:
 * Fetches FAQs, Testimonials, Stats, and Storefront Mode in ONE single roundtrip (120ms vs 350ms+ unbatched).
 */
export async function getHomepageContentBundle(): Promise<HomepageContentBundle> {
  const supabase = getPublicSupabase();
  if (!supabase) {
    return {
      faqs: DEFAULT_FAQS,
      testimonials: DEFAULT_TESTIMONIALS,
      stats: DEFAULT_STATS,
      storefrontMode: 'coming_soon',
    };
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content_key, content_value');

    if (error || !data || data.length === 0) {
      return {
        faqs: DEFAULT_FAQS,
        testimonials: DEFAULT_TESTIMONIALS,
        stats: DEFAULT_STATS,
        storefrontMode: 'coming_soon',
      };
    }

    const map = new Map<string, any>();
    const stats: { key: string; value: string }[] = [];

    for (const row of data as any[]) {
      map.set(row.content_key, row.content_value);
      if (typeof row.content_key === 'string' && row.content_key.startsWith('stats_')) {
        stats.push({ key: row.content_key, value: row.content_value });
      }
    }

    const faqs = map.get('faqs') || DEFAULT_FAQS;
    const testimonials = map.get('testimonials') || DEFAULT_TESTIMONIALS;
    const storefrontRaw = map.get('storefront_status');
    const storefrontMode =
      storefrontRaw && typeof storefrontRaw.mode === 'string'
        ? (storefrontRaw.mode as 'coming_soon' | 'live')
        : 'coming_soon';

    return {
      faqs: Array.isArray(faqs) ? faqs : DEFAULT_FAQS,
      testimonials: Array.isArray(testimonials) ? testimonials : DEFAULT_TESTIMONIALS,
      stats: stats.length > 0 ? stats : DEFAULT_STATS,
      storefrontMode,
    };
  } catch {
    return {
      faqs: DEFAULT_FAQS,
      testimonials: DEFAULT_TESTIMONIALS,
      stats: DEFAULT_STATS,
      storefrontMode: 'coming_soon',
    };
  }
}
