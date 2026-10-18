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
  {
    name: "Vidya M",
    quote: "Training with the fitness faculty here has been such a refreshing experience. They don't just count reps; they genuinely understand people, their bodies, their limitations, and their goals. What makes Rhythmzz stand out is their ability to push you beyond your comfort zone while still making you feel supported and confident. Her sessions are thoughtfully planned, never monotonous, and pay close attention to technique and form. I’ve noticed not just physical changes, but also a better sense of strength, discipline, and confidence.",
    programme: "Adults Fitness & Dance · Secunderabad",
    rating: 5,
    category: "student" as const,
    highlight: "Fitness & Form",
  },
  {
    name: "Meghna Menon",
    quote: "Wonderful experience! The instructors are very good in their respective fields of dance and the management was very friendly, patient, and explained everything from A to Z. I joined here as a student and now it's been years of attending Rhythmzz — this has become more than a dance group for me, it's like my second home.",
    programme: "Adults Dance · Secunderabad",
    rating: 5,
    category: "student" as const,
    highlight: "Second Home",
  },
  {
    name: "A J",
    quote: "Awesome experience at Rhythmzz! I enrolled my son when he was 5 and it's been a year now. I can see a real transformation in my child, slowly learning and growing. The studio looks great with an awesome instructor who has great bonding with kids and knows how to deal with children of different age groups. Classes start with proper warm-up and stretching exercises which helps them in dance. My son enjoys his dance class and productively uses his evening time instead of spending it on mobile or TV. Happy Mom and Happy Son!",
    programme: "Parents · Kids Dance (Age 5)",
    rating: 5,
    category: "parent" as const,
    highlight: "Kids Confidence",
  },
  {
    name: "Johannah Sparshica",
    quote: "Rhythmzz Academy of Dance is really the best platform where you transform yourself — firstly with dance, then your personality and overall confidence! Lovely instructors, friendly people, various dance forms, the location is so convenient behind Neredmet bus stop, and the batch timings are very suitable. Loved it!",
    programme: "Student · Dance & Personality",
    rating: 5,
    category: "student" as const,
    highlight: "Transformation",
  },
  {
    name: "Datla Sowdeepya",
    quote: "Classical dance classes are amazing! The instructor is very patient, meticulous with mudras and footwork, and ensures every student grasps the rhythmic nuances and padabhedas. Love dancing here every week.",
    programme: "Classical Kathak · Secunderabad",
    rating: 5,
    category: "student" as const,
    highlight: "Classical Arts",
  },
  {
    name: "Karimulla Baba Shaik",
    quote: "Best academy to join. They maintain strict hygiene and safety precautions with clean wooden flooring. The faculties are very interactive, patient, and encouraging with beginners. Thank you Rhythmzz!",
    programme: "Adults Dance · Studio Member",
    rating: 5,
    category: "student" as const,
    highlight: "Hygiene & Safety",
  },
  {
    name: "Shruthi Saneri",
    quote: "The best place to learn dance in Secunderabad! The instructors are more like family to me. I love the way they break down complex choreography into simple, digestible counts so anyone can pick it up with ease.",
    programme: "Dance Student · Secunderabad",
    rating: 5,
    category: "student" as const,
    highlight: "Family Vibe",
  },
  {
    name: "Priya Sharma",
    quote: "Rhythmzz Academy of Dance is fantastic! My 7-year-old daughter is learning classical dance here, and the dedication and individual attention given to each child is remarkable. Her rhythm sense, stage confidence, and posture have improved tremendously. Highly recommend for kids!",
    programme: "Parents · Kids Dance (Age 7)",
    rating: 5,
    category: "parent" as const,
    highlight: "Discipline",
  },
  {
    name: "Rajesh Kumar",
    quote: "Best dance studio in Sainikpuri. The infrastructure is top-notch with professional sprung wooden flooring and full-length mirrors. I joined the adult Zumba and weekend fitness batches, and the calorie burn and energy are incredible.",
    programme: "Adults Fitness & Zumba · Sainikpuri",
    rating: 5,
    category: "student" as const,
    highlight: "High Energy",
  },
  {
    name: "Ananya Reddy",
    quote: "Amazing place to learn western and contemporary dance. The choreographers are very patient and professional. The studio ambience, acoustic sound system, and lighting make every rehearsal feel like a live stage performance.",
    programme: "Western & Contemporary · Secunderabad",
    rating: 5,
    category: "student" as const,
    highlight: "Stage Ambience",
  },
  {
    name: "Karthik Rao",
    quote: "Joined for adult hip-hop and choreography classes. Great batches, well-structured curriculum, and very friendly desk management. The fee structure is very reasonable for the quality of training provided.",
    programme: "Adults Hip-Hop & Choreography",
    rating: 5,
    category: "student" as const,
    highlight: "Urban Beats",
  },
  {
    name: "Sneha Latha",
    quote: "My son has been attending the kids' creative movement and Bollywood batch for 6 months now. His confidence has grown tremendously. The studio maintains high standards of discipline, child safety, and stage readiness.",
    programme: "Parents · Kids Creative Movement",
    rating: 5,
    category: "parent" as const,
    highlight: "Stage Readiness",
  },
  {
    name: "Vikramaditya Varma",
    quote: "Professional management and exceptional training quality. The classical dance training here is authentic, rigorous, and deeply inspiring. Proud to have my children enrolled at Rhythmzz.",
    programme: "Parents · Classical Dance Lineage",
    rating: 5,
    category: "parent" as const,
    highlight: "Authentic Lineage",
  },
  {
    name: "Divya Nambiar",
    quote: "The yoga and fitness sessions are extremely rejuvenating. Clean studio space, wonderful acoustics, and expert trainers who focus on proper posture, breathing, and flexibility.",
    programme: "Yoga & Mind-Body Fitness",
    rating: 5,
    category: "student" as const,
    highlight: "Flexibility & Posture",
  },
  {
    name: "Manish Gupta",
    quote: "Used the studio rental for a professional choreography video shoot. The ambient DMX club lighting, sprung wooden floor, and 45-foot mirror array were perfect. The desk staff was punctual and very helpful.",
    programme: "Studio Rental & Video Production",
    rating: 5,
    category: "student" as const,
    highlight: "Sprung Floor",
  },
  {
    name: "Swathi Rao",
    quote: "One of the finest dance academies in Secunderabad. Structured grading, transparent fee policies, and wonderful annual recitals organized for students to showcase their talent on real auditorium stages.",
    programme: "Diploma Student · Secunderabad",
    rating: 5,
    category: "student" as const,
    highlight: "Annual Recitals",
  },
  {
    name: "Rahul Varma",
    quote: "Fantastic vibe! The instructors make even complete beginners feel comfortable. I started with zero dance experience and now I can comfortably groove in sync without feeling awkward or hesitant.",
    programme: "Beginners Adults Dance · Sainikpuri",
    rating: 5,
    category: "student" as const,
    highlight: "Beginner Friendly",
  },
  {
    name: "Meena Sundaram",
    quote: "Exceptional academy! The classical training under traditional guru guidance is outstanding. My daughter loves going to class every single week and looks forward to every session.",
    programme: "Parents · Classical Foundations",
    rating: 5,
    category: "parent" as const,
    highlight: "Traditional Art",
  },
  {
    name: "Sandeep Goud",
    quote: "Very well maintained studio near Neredmet X Road. Ample parking, air-conditioned practice rooms, and dedicated batch timings. Top marks for studio cleanliness, sound quality, and floor shock absorption!",
    programme: "Adults Dance · Neredmet Studio",
    rating: 5,
    category: "student" as const,
    highlight: "Studio Acoustics",
  },
  {
    name: "Nikhila Reddy",
    quote: "The sibling discount plan made it very affordable for both my kids to learn dance together. Excellent customer service from the academy desk and very respectful trainers.",
    programme: "Parents · Sibling Dance Package",
    rating: 5,
    category: "parent" as const,
    highlight: "Sibling Value",
  },
  {
    name: "Tarun Sharma",
    quote: "Top-class audio equipment and wooden flooring that absorbs impact properly. Safe on joints during rigorous jumps and turns. Best rehearsal space in the twin cities.",
    programme: "Contemporary Dance · Rehearsal Member",
    rating: 5,
    category: "student" as const,
    highlight: "Joint Safety",
  },
  {
    name: "Lavanya Prasad",
    quote: "Very structured curriculum with regular progress updates and event participation opportunities. They actually teach dance technique rather than just random song steps.",
    programme: "Parents · Kids Dance (Age 8)",
    rating: 5,
    category: "parent" as const,
    highlight: "Structured Learning",
  },
  {
    name: "Naveen Kumar",
    quote: "Joined the weekend adult batch. Great way to de-stress after a hectic work week. Highly skilled trainers, great crowd, and a welcoming community atmosphere.",
    programme: "Weekend Adults Batch · Sainikpuri",
    rating: 5,
    category: "student" as const,
    highlight: "Stress Relief",
  },
  {
    name: "Blue Stone",
    quote: "Good place for all who love dancing to learn properly. Centrally located and easily reachable behind Neredmet X Road bus stop. Dedicated instructors round the clock from Monday to Friday with structured learning assured.",
    programme: "Dance Member · Neredmet X Road",
    rating: 4,
    category: "student" as const,
    highlight: "Central Location",
  },
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
