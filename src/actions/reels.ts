'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { revalidatePath } from 'next/cache';
import { MAX_HOMEPAGE_REELS, MAX_REEL_BYTES } from '@/lib/reels/constants';

function extractStoragePath(publicUrl: string): string | null {
  const parts = publicUrl.split('/reels/');
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

/** Step 1: mint a signed upload URL (no file bytes — avoids Vercel 4.5 MB body limit). */
export async function prepareHomepageReelUpload() {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();
  const { count } = await admin.from('homepage_reels').select('*', { count: 'exact', head: true });

  if ((count ?? 0) >= MAX_HOMEPAGE_REELS) {
    return { success: false, error: `Maximum ${MAX_HOMEPAGE_REELS} reels — delete one before uploading` };
  }

  const path = `${Date.now()}-${crypto.randomUUID()}.mp4`;
  const { data, error } = await admin.storage.from('reels').createSignedUploadUrl(path);

  if (error || !data) return { success: false, error: error?.message ?? 'Could not prepare upload' };

  return { success: true, path: data.path, token: data.token };
}

/** Step 2: after the browser uploads to Supabase Storage, register the reel row. */
export async function finalizeHomepageReelUpload(input: {
  storagePath: string;
  title: string;
  href: string;
  width: number;
  height: number;
  fileSize: number;
}) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const title = input.title.trim();
  const href = (input.href.trim() || 'https://www.instagram.com/rhythmzzdance.live');
  const { storagePath, width, height, fileSize } = input;

  if (!title) return { success: false, error: 'Title is required' };
  if (!storagePath.endsWith('.mp4')) return { success: false, error: 'Invalid storage path' };
  if (fileSize > MAX_REEL_BYTES) return { success: false, error: 'Video must be 20 MB or smaller' };
  if (width >= height) {
    return { success: false, error: 'Only portrait videos are allowed (height must exceed width)' };
  }

  const admin = createAdminSupabase();

  const { count } = await admin.from('homepage_reels').select('*', { count: 'exact', head: true });
  if ((count ?? 0) >= MAX_HOMEPAGE_REELS) {
    await admin.storage.from('reels').remove([storagePath]);
    return { success: false, error: `Maximum ${MAX_HOMEPAGE_REELS} reels — delete one before uploading` };
  }

  const { data: publicUrl } = admin.storage.from('reels').getPublicUrl(storagePath);

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
      storage_path: storagePath,
      href,
      sort_order: sortOrder,
      is_visible: true,
      width,
      height,
    })
    .select()
    .single();

  if (insertErr) {
    await admin.storage.from('reels').remove([storagePath]);
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
