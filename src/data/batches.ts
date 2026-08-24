import { getPublicSupabase } from '@/lib/supabase/public';

// Reference schedules (design reference / structured data) — used when Supabase is unavailable.
// Ids mirror the DEFAULT_PROGRAMMES uuids so the enrol form can submit programme/batch ids.
const DEFAULT_BATCHES = [
  {
    id: "a1b2c3d4-4101-4000-8000-000000000001",
    programme_id: "a1b2c3d4-4001-4000-8000-000000000001",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "17:00:00",
    time_end: "18:00:00",
    capacity: 25,
    enrolled_count: 16,
    status: "active",
    programme: { name: "Kids Dance", slug: "kids-dance", sort_order: 1 },
    instructor: { name: "Deepak", photo_url: null },
  },
  {
    id: "a1b2c3d4-4102-4000-8000-000000000002",
    programme_id: "a1b2c3d4-4001-4000-8000-000000000001",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "18:00:00",
    time_end: "19:00:00",
    capacity: 25,
    enrolled_count: 15,
    status: "active",
    programme: { name: "Kids Dance", slug: "kids-dance", sort_order: 1 },
    instructor: { name: "Kajal", photo_url: null },
  },
  {
    id: "a1b2c3d4-4103-4000-8000-000000000003",
    programme_id: "a1b2c3d4-4002-4000-8000-000000000002",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "19:00:00",
    time_end: "20:00:00",
    capacity: 30,
    enrolled_count: 20,
    status: "active",
    programme: { name: "Adults Dance", slug: "adults-dance", sort_order: 2 },
    instructor: { name: "Nitish", photo_url: null },
  },
  {
    id: "a1b2c3d4-4104-4000-8000-000000000004",
    programme_id: "a1b2c3d4-4002-4000-8000-000000000002",
    days: ["Monday", "Tuesday", "Wednesday"],
    time_start: "20:00:00",
    time_end: "21:00:00",
    capacity: 30,
    enrolled_count: 14,
    status: "active",
    programme: { name: "Adults Dance", slug: "adults-dance", sort_order: 2 },
    instructor: { name: "Pranith", photo_url: null },
  },
  {
    id: "a1b2c3d4-4105-4000-8000-000000000005",
    programme_id: "a1b2c3d4-4003-4000-8000-000000000003",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    time_start: "09:30:00",
    time_end: "10:30:00",
    capacity: 25,
    enrolled_count: 15,
    status: "active",
    programme: { name: "Mind & Body Fitness", slug: "mind-body-fitness", sort_order: 3 },
    instructor: { name: "Shailaja", photo_url: null },
  },
  {
    id: "a1b2c3d4-4106-4000-8000-000000000006",
    programme_id: "a1b2c3d4-4004-4000-8000-000000000004",
    days: ["Friday", "Saturday"],
    time_start: "18:30:00",
    time_end: "19:30:00",
    capacity: 15,
    enrolled_count: 8,
    status: "active",
    programme: { name: "Kuchipudi Classical", slug: "kuchipudi", sort_order: 4 },
    instructor: { name: "Srusti", photo_url: null },
  },
];

export async function getBatches() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('batches')
      .select('id, programme_id, days, time_start, time_end, capacity, enrolled_count, status, programme:programmes(name, slug, sort_order), instructor:instructors(name, photo_url)')
      .eq('status', 'active');
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_BATCHES;
}
