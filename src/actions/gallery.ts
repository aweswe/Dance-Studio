'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB — matches the storage bucket limit

export async function uploadMedia(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string | null) || null;
  const tagsRaw = (formData.get('tags') as string | null) || '';

  if (!file) return { success: false, error: 'No file selected' };
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File must be 10 MB or smaller' };
  }

  const isVideo = file.type.startsWith('video/');
  if (!isVideo && !file.type.startsWith('image/')) {
    return { success: false, error: 'Only images and videos are allowed' };
  }
  const type = isVideo ? 'video' : 'photo';

  const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from('gallery')
    .upload(path, file, { contentType: file.type });
  if (uploadErr) return { success: false, error: uploadErr.message };

  const { data: publicUrl } = supabase.storage.from('gallery').getPublicUrl(path);

  const { data: last } = await supabase
    .from('gallery')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const { error } = await supabase.from('gallery').insert({
    url: publicUrl.publicUrl,
    type,
    title,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : null,
    is_visible: true,
    sort_order: ((last?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1,
  });
  if (error) {
    // Don't orphan the uploaded file if the row insert fails
    await supabase.storage.from('gallery').remove([path]);
    return { success: false, error: error.message };
  }

  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}

export async function reorderMedia(items: { id: string, sort_order: number }[]) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };
  for (const item of items) {
    await supabase.from('gallery').update({ sort_order: item.sort_order }).eq('id', item.id);
  }
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}

export async function toggleVisibility(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };
  const { data } = await supabase.from('gallery').select('is_visible').eq('id', id).single();
  if (data) {
    await supabase.from('gallery').update({ is_visible: !data.is_visible }).eq('id', id);
  }
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}

export async function deleteMedia(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };
  await supabase.from('gallery').delete().eq('id', id);
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}
