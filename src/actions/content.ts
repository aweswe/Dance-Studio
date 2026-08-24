'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { revalidatePath } from 'next/cache';

export async function updateSiteContent(key: string, value: any) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { error } = await supabase
    .from('site_content')
    .upsert({ content_key: key, content_value: value }, { onConflict: 'content_key' });
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  return { success: true };
}

export async function updateFAQ(faqs: any[]) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { error } = await supabase
    .from('site_content')
    .upsert({ content_key: 'faqs', content_value: faqs as any }, { onConflict: 'content_key' });
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  return { success: true };
}

export async function updateBanner(data: any) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { error } = await supabase
    .from('site_content')
    .upsert({ content_key: 'banner', content_value: data }, { onConflict: 'content_key' });
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  return { success: true };
}
