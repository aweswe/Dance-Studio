'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { revalidatePath } from 'next/cache';
import { MAX_HOMEPAGE_REELS, MAX_REEL_BYTES } from '@/lib/reels/constants';

function extractStoragePath(publicUrl: string): string | null {
  const parts = publicUrl.split('/reels/');
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

export async function uploadHomepageReel(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const file = formData.get('file') as File | null;
  const title = ((formData.get('title') as string) || '').trim();
  const href = ((formData.get('href') as string) || 'https://www.instagram.com/rhythmzzdance.live').trim();
  const widthRaw = formData.get('width') as string | null;
  const heightRaw = formData.get('height') as string | null;
  const width = widthRaw ? Number(widthRaw) : null;
  const height = heightRaw ? Number(heightRaw) : null;

  if (!file) return { success: false, error: 'No video selected' };
  if (!title) return { success: false, error: 'Title is required' };
  if (file.type !== 'video/mp4') return { success: false, error: 'Only MP4 videos are allowed' };
  if (file.size > MAX_REEL_BYTES) return { success: false, error: 'Video must be 20 MB or smaller' };

  if (width && height && width >= height) {
    return { success: false, error: 'Only portrait videos are allowed (height must exceed width)' };
  }

  const admin = createAdminSupabase();

  const { count } = await admin
    .from('homepage_reels')
    .select('*', { count: 'exact', head: true });

  if ((count ?? 0) >= MAX_HOMEPAGE_REELS) {
    return { success: false, error: `Maximum ${MAX_HOMEPAGE_REELS} reels — delete one before uploading` };
  }

  const path = `${Date.now()}-${crypto.randomUUID()}.mp4`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await admin.storage.from('reels').upload(path, buffer, {
    contentType: 'video/mp4',
    upsert: false,
  });
  if (uploadErr) return { success: false, error: uploadErr.message };

  const { data: publicUrl } = admin.storage.from('reels').getPublicUrl(path);

  const { data: last } = await admin
    .from('homepage_reels')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const sortOrder = ((last?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1;

  const { data: inserted, error: insertErr } = await admin
    .from('homepage_reels')
    .insert({
      title,
      video_url: publicUrl.publicUrl,
      storage_path: path,
      href,
      sort_order: sortOrder,
      is_visible: true,
      width,
      height,
    })
    .select()
    .single();

  if (insertErr) {
    await admin.storage.from('reels').remove([path]);
    return { success: false, error: insertErr.message };
  }

  revalidatePath('/admin/reels');
  revalidatePath('/');
  return { success: true, item: inserted };
}

export async function updateHomepageReel(
  id: string,
  data: { title: string; href: string; isVisible: boolean },
) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();
  const { error } = await admin
    .from('homepage_reels')
    .update({
      title: data.title.trim(),
      href: data.href.trim() || 'https://www.instagram.com/rhythmzzdance.live',
      is_visible: data.isVisible,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/reels');
  revalidatePath('/');
  return { success: true };
}

export async function reorderHomepageReels(items: { id: string; sort_order: number }[]) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();
  for (const item of items) {
    await admin.from('homepage_reels').update({ sort_order: item.sort_order }).eq('id', item.id);
  }

  revalidatePath('/admin/reels');
  revalidatePath('/');
  return { success: true };
}

export async function deleteHomepageReel(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();
  const { data: row } = await admin
    .from('homepage_reels')
    .select('storage_path, video_url')
    .eq('id', id)
    .maybeSingle();

  if (row?.storage_path) {
    await admin.storage.from('reels').remove([row.storage_path]);
  } else if (row?.video_url) {
    const path = extractStoragePath(row.video_url);
    if (path) await admin.storage.from('reels').remove([path]);
  }

  const { error } = await admin.from('homepage_reels').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/reels');
  revalidatePath('/');
  return { success: true };
}
