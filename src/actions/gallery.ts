'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB max

export async function uploadMedia(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string | null) || null;
  const tagsRaw = (formData.get('tags') as string | null) || '';

  if (!file) return { success: false, error: 'No file selected' };
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File must be 25 MB or smaller' };
  }

  const isVideo = file.type.startsWith('video/');
  if (!isVideo && !file.type.startsWith('image/')) {
    return { success: false, error: 'Only images and videos are allowed' };
  }
  const type = isVideo ? 'video' : 'photo';

  const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'webp');
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const admin = createAdminSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await admin.storage
    .from('gallery')
    .upload(path, buffer, {
      contentType: file.type || (isVideo ? 'video/mp4' : 'image/webp'),
      upsert: true,
    });
  if (uploadErr) return { success: false, error: uploadErr.message };

  const { data: publicUrl } = admin.storage.from('gallery').getPublicUrl(path);

  const { data: last } = await admin
    .from('gallery')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const newSortOrder = ((last?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1;

  const { data: inserted, error: insertErr } = await admin.from('gallery').insert({
    url: publicUrl.publicUrl,
    type,
    title,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : null,
    is_visible: true,
    sort_order: newSortOrder,
  }).select().single();

  if (insertErr) {
    // Don't orphan the uploaded file if the row insert fails
    await admin.storage.from('gallery').remove([path]);
    return { success: false, error: insertErr.message };
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true, item: inserted };
}

export async function reorderMedia(items: { id: string, sort_order: number }[]) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();
  for (const item of items) {
    await admin.from('gallery').update({ sort_order: item.sort_order }).eq('id', item.id);
  }
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}

export async function toggleVisibility(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();
  const { data } = await admin.from('gallery').select('is_visible').eq('id', id).single();
  if (data) {
    await admin.from('gallery').update({ is_visible: !data.is_visible }).eq('id', id);
  }
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}

export async function deleteMedia(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();

  // Find the media row to extract storage path and remove file
  const { data: item } = await admin
    .from('gallery')
    .select('url')
    .eq('id', id)
    .single();

  if (item?.url) {
    try {
      const parts = item.url.split('/gallery/');
      if (parts.length > 1) {
        const filePath = parts[parts.length - 1];
        await admin.storage.from('gallery').remove([filePath]);
      }
    } catch (e) {
      console.error('Error removing file from storage:', e);
    }
  }

  const { error: deleteErr } = await admin.from('gallery').delete().eq('id', id);
  if (deleteErr) {
    return { success: false, error: deleteErr.message };
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}
