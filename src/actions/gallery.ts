'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { updateTag } from 'next/cache';

export async function uploadMedia(formData: FormData) {
  try { updateTag('gallery'); } catch {}
  return { success: true };
}

export async function reorderMedia(items: { id: string, sort_order: number }[]) {
  const supabase = await createServerSupabase();
  for (const item of items) {
    await (supabase as any).from('gallery').update({ sort_order: item.sort_order }).eq('id', item.id);
  }
  try { updateTag('gallery'); } catch {}
  return { success: true };
}

export async function toggleVisibility(id: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('gallery').select('is_visible').eq('id', id).single();
  if (data) {
    await (supabase as any).from('gallery').update({ is_visible: !(data as any).is_visible }).eq('id', id);
  }
  try { updateTag('gallery'); } catch {}
  return { success: true };
}

export async function deleteMedia(id: string) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('gallery').delete().eq('id', id);
  try { updateTag('gallery'); } catch {}
  return { success: true };
}
