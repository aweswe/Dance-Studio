'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { updateTag } from 'next/cache';

export async function updateSiteContent(key: string, value: any) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('site_content').upsert({ content_key: key, content_value: value }, { onConflict: 'content_key' });
  try { updateTag('content'); } catch {}
  return { success: true };
}

export async function updateFAQ(faqs: any[]) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('site_content').upsert({ content_key: 'faqs', content_value: faqs }, { onConflict: 'content_key' });
  try { updateTag('content'); } catch {}
  return { success: true };
}

export async function updateBanner(data: any) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('site_content').upsert({ content_key: 'banner', content_value: data }, { onConflict: 'content_key' });
  try { updateTag('content'); } catch {}
  return { success: true };
}
