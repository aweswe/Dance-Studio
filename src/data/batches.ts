import { getPublicSupabase } from '@/lib/supabase/public';

export async function getBatches() {
  const supabase = getPublicSupabase();
  const { data } = await supabase
    .from('batches')
    .select('id, days, time_start, time_end, capacity, enrolled_count, status, programme:programmes(name, slug, sort_order), instructor:instructors(name, photo_url)')
    .eq('status', 'active');
  return data ?? [];
}
