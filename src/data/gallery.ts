import { getPublicSupabase } from '@/lib/supabase/public';

export async function getGalleryImages(limit = 8) {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('gallery')
      .select('id, url, thumbnail_url, type, title, tags, is_visible, sort_order')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .limit(limit);
    if (data && data.length > 0) return data;
  } catch {}
  return [];
}
