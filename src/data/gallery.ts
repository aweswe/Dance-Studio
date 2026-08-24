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
    if (data && data.length > 0) {
      // Normalize display fields: the table has no alt/category columns, so
      // derive them from title/tags/type for the gallery UI.
      return (data as any[]).map((img) => ({
        ...img,
        alt: img.title ?? 'Gallery Image',
        category: (Array.isArray(img.tags) && img.tags.length > 0 ? img.tags[0] : img.type) ?? 'Classes',
      }));
    }
  } catch {}
  return [];
}
