'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { updateTag } from 'next/cache';

export async function createPost(data: any) {
  const supabase = await createServerSupabase();
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  await (supabase as any).from('blog_posts').insert({ ...data, slug });
  try { updateTag('blog'); } catch {}
  return { success: true };
}

export async function updatePost(id: string, data: any) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('blog_posts').update(data).eq('id', id);
  try { updateTag('blog'); } catch {}
  return { success: true };
}

export async function deletePost(id: string) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('blog_posts').delete().eq('id', id);
  try { updateTag('blog'); } catch {}
  return { success: true };
}
