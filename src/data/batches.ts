import { getPublicSupabase } from '@/lib/supabase/public';

// Reference schedules — mapped to the 3 flagship programmes
const DEFAULT_BATCHES = [
  {
    id: "b-kids-1",
    programme_id: "p1-commercial-expressive",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "17:00:00",
    time_end: "18:00:00",
    capacity: 25,
    enrolled_count: 16,
    status: "active",
    batch_title: "Kids Batch (5–10 Yrs) — Bollywood & Gymnastics",
    programme: { name: "Commercial & Expressive Style", slug: "commercial-expressive", sort_order: 1 },
    instructor: { name: "Deepak Rao", photo_url: null },
  },
  {
    id: "b-kids-2",
    programme_id: "p1-commercial-expressive",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "18:00:00",
    time_end: "19:00:00",
    capacity: 25,
    enrolled_count: 15,
    status: "active",
    batch_title: "Kids Batch (10–14 Yrs) — Hip Hop & Contemporary",
    programme: { name: "Commercial & Expressive Style", slug: "commercial-expressive", sort_order: 1 },
    instructor: { name: "Kajal Devi", photo_url: "/images/kajal-devi.png" },
  },
  {
    id: "b-adults-1",
    programme_id: "p1-commercial-expressive",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "19:00:00",
    time_end: "20:00:00",
    capacity: 30,
    enrolled_count: 20,
    status: "active",
    batch_title: "Adults Batch (15+) — Contemporary & Bollywood",
    programme: { name: "Commercial & Expressive Style", slug: "commercial-expressive", sort_order: 1 },
    instructor: { name: "Nitish Kumar", photo_url: "/images/studio-training/studio-technique.jpg" },
  },
  {
    id: "b-adults-2",
    programme_id: "p1-commercial-expressive",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "20:00:00",
    time_end: "21:00:00",
    capacity: 30,
    enrolled_count: 14,
    status: "active",
    batch_title: "Adults Batch (15+) — Commercial Hip Hop & Tollywood",
    programme: { name: "Commercial & Expressive Style", slug: "commercial-expressive", sort_order: 1 },
    instructor: { name: "Pranith Nair", photo_url: "/images/pranith-nair.png" },
  },
  {
    id: "b-fitness-1",
    programme_id: "p2-mind-body-fitness",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    time_start: "09:30:00",
    time_end: "10:30:00",
    capacity: 25,
    enrolled_count: 15,
    status: "active",
    batch_title: "Morning Wellness — Yoga, Zumba & Dance Fitness",
    programme: { name: "Mind & Body Fitness", slug: "mind-body-fitness", sort_order: 2 },
    instructor: { name: "Shailaja & Team", photo_url: null },
  },
  {
    id: "b-classical-kuchipudi",
    programme_id: "p3-classical-certification",
    days: ["Friday", "Saturday"],
    time_start: "18:30:00",
    time_end: "19:30:00",
    capacity: 15,
    enrolled_count: 8,
    status: "active",
    batch_title: "Kuchipudi Classical Cohort (Foundation to Advanced)",
    programme: { name: "Structured Level-Based Certification (Classical Dance)", slug: "classical-dance", sort_order: 3 },
    instructor: { name: "Guru Srushti Nidhi", photo_url: "/images/kuchipudi/kuchipudi-traditional-standing.jpg" },
  },
  {
    id: "b-classical-kathak",
    programme_id: "p3-classical-certification",
    days: ["Saturday", "Sunday"],
    time_start: "16:30:00",
    time_end: "17:30:00",
    capacity: 15,
    enrolled_count: 7,
    status: "active",
    batch_title: "Kathak Lucknow Gharana Cohort (Tatkar & Visharad)",
    programme: { name: "Structured Level-Based Certification (Classical Dance)", slug: "classical-dance", sort_order: 3 },
    instructor: { name: "Guru Poonam Nayak Jamwale", photo_url: "/images/studio-training/alignment-drills-1.jpg" },
  },
];

export async function getBatches() {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return DEFAULT_BATCHES;
    const { data } = await supabase
      .from('batches')
      .select('id, programme_id, days, time_start, time_end, capacity, enrolled_count, status, programme:programmes(name, slug, sort_order), instructor:instructors(name, photo_url)')
      .eq('status', 'active');
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_BATCHES;
}

export async function getBatchesByProgramme(programmeId: string) {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return DEFAULT_BATCHES.filter((b) => b.programme_id === programmeId || b.programme.slug === programmeId);
    }
    const { data } = await supabase
      .from('batches')
      .select('id, programme_id, days, time_start, time_end, capacity, enrolled_count, status, instructor:instructors(name, photo_url)')
      .eq('programme_id', programmeId)
      .eq('status', 'active');
    if (data) return data;
  } catch {}
  return DEFAULT_BATCHES.filter((b) => b.programme_id === programmeId || b.programme.slug === programmeId);
}
