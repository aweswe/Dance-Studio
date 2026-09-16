import { getPublicSupabase } from '@/lib/supabase/public';

/** Mirrors live Supabase seed — used only when the DB is unreachable. */
const DEFAULT_BATCHES = [
  {
    id: 'a1b2c3d4-4101-4000-8000-000000000001',
    programme_id: 'a1b2c3d4-4001-4000-8000-000000000001',
    days: ['Monday', 'Tuesday', 'Wednesday'],
    time_start: '17:00:00',
    time_end: '18:00:00',
    capacity: 25,
    enrolled_count: 16,
    status: 'active',
    name: 'Kids Dance · Mon–Wed 5–6 PM',
    programme: { name: 'Kids Dance', slug: 'kids-dance', sort_order: 1 },
    instructor: { name: 'Deepak', photo_url: null },
  },
  {
    id: 'a1b2c3d4-4102-4000-8000-000000000002',
    programme_id: 'a1b2c3d4-4001-4000-8000-000000000001',
    days: ['Monday', 'Tuesday', 'Wednesday'],
    time_start: '18:00:00',
    time_end: '19:00:00',
    capacity: 25,
    enrolled_count: 15,
    status: 'active',
    name: 'Kids Dance · Mon–Wed 6–7 PM',
    programme: { name: 'Kids Dance', slug: 'kids-dance', sort_order: 1 },
    instructor: { name: 'Kajal', photo_url: '/images/kajal-devi.png' },
  },
  {
    id: 'a1b2c3d4-4103-4000-8000-000000000003',
    programme_id: 'a1b2c3d4-4002-4000-8000-000000000002',
    days: ['Monday', 'Tuesday', 'Wednesday'],
    time_start: '19:00:00',
    time_end: '20:00:00',
    capacity: 30,
    enrolled_count: 20,
    status: 'active',
    name: 'Adults Dance · Mon–Wed 7–8 PM',
    programme: { name: 'Adults Dance', slug: 'adults-dance', sort_order: 2 },
    instructor: { name: 'Nitish', photo_url: '/images/studio-training/studio-technique.jpg' },
  },
  {
    id: 'a1b2c3d4-4104-4000-8000-000000000004',
    programme_id: 'a1b2c3d4-4002-4000-8000-000000000002',
    days: ['Monday', 'Tuesday', 'Wednesday'],
    time_start: '20:00:00',
    time_end: '21:00:00',
    capacity: 30,
    enrolled_count: 14,
    status: 'active',
    name: 'Adults Dance · Mon–Wed 8–9 PM',
    programme: { name: 'Adults Dance', slug: 'adults-dance', sort_order: 2 },
    instructor: { name: 'Pranith', photo_url: '/images/pranith-nair.png' },
  },
  {
    id: 'a1b2c3d4-4105-4000-8000-000000000005',
    programme_id: 'a1b2c3d4-4003-4000-8000-000000000003',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    time_start: '09:30:00',
    time_end: '10:30:00',
    capacity: 25,
    enrolled_count: 15,
    status: 'active',
    name: 'Mind & Body Fitness · Mon–Fri 9:30–10:30 AM',
    programme: { name: 'Mind & Body Fitness', slug: 'mind-body-fitness', sort_order: 3 },
    instructor: { name: 'Shailaja', photo_url: null },
  },
  {
    id: 'a1b2c3d4-4106-4000-8000-000000000006',
    programme_id: 'a1b2c3d4-4004-4000-8000-000000000004',
    days: ['Friday', 'Saturday'],
    time_start: '18:30:00',
    time_end: '19:30:00',
    capacity: 15,
    enrolled_count: 8,
    status: 'active',
    name: 'Kuchipudi · Fri–Sat 6:30–7:30 PM',
    programme: { name: 'Kuchipudi Classical', slug: 'kuchipudi', sort_order: 4 },
    instructor: { name: 'Srusti', photo_url: '/images/kuchipudi/kuchipudi-traditional-standing.jpg' },
  },
];

export async function getBatches() {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return DEFAULT_BATCHES;
    const { data, error } = await supabase
      .from('batches')
      .select(
        'id, programme_id, name, days, time_start, time_end, capacity, enrolled_count, status, programme:programmes(name, slug, sort_order), instructor:instructors(name, photo_url)',
      )
      .eq('status', 'active')
      .order('time_start', { ascending: true });
    if (error) {
      console.error('[getBatches]', error.message);
      return DEFAULT_BATCHES;
    }
    if (data && data.length > 0) return data;
  } catch (err) {
    console.error('[getBatches]', err);
  }
  return DEFAULT_BATCHES;
}

export async function getBatchesByProgramme(programmeId: string) {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return DEFAULT_BATCHES.filter(
        (b) => b.programme_id === programmeId || b.programme.slug === programmeId,
      );
    }
    const { data } = await supabase
      .from('batches')
      .select(
        'id, programme_id, name, days, time_start, time_end, capacity, enrolled_count, status, programme:programmes(name, slug), instructor:instructors(name, photo_url)',
      )
      .eq('programme_id', programmeId)
      .eq('status', 'active')
      .order('time_start', { ascending: true });
    if (data) return data;
  } catch {}
  return DEFAULT_BATCHES.filter(
    (b) => b.programme_id === programmeId || b.programme.slug === programmeId,
  );
}
