'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { eventSchema, type EventFormData } from '@/lib/validators/event';
import { revalidatePath } from 'next/cache';

export async function createEvent(data: EventFormData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid event' };
  }

  const d = parsed.data;
  const admin = createAdminSupabase();

  const { data: existing } = await admin.from('events').select('id').eq('slug', d.slug).maybeSingle();
  if (existing) return { success: false, error: `Slug "${d.slug}" is already in use` };

  const { data: inserted, error } = await admin
    .from('events')
    .insert({
      title: d.title,
      slug: d.slug,
      starts_at: new Date(d.startsAt).toISOString(),
      venue: d.venue,
      description: d.description,
      is_published: d.isPublished,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath(`/events/${d.slug}`);
  return { success: true, event: inserted };
}

export async function updateEvent(id: string, data: EventFormData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid event' };
  }

  const d = parsed.data;
  const admin = createAdminSupabase();

  const { data: slugClash } = await admin
    .from('events')
    .select('id')
    .eq('slug', d.slug)
    .neq('id', id)
    .maybeSingle();
  if (slugClash) return { success: false, error: `Slug "${d.slug}" is already in use` };

  const { data: updated, error } = await admin
    .from('events')
    .update({
      title: d.title,
      slug: d.slug,
      starts_at: new Date(d.startsAt).toISOString(),
      venue: d.venue,
      description: d.description,
      is_published: d.isPublished,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath(`/events/${d.slug}`);
  return { success: true, event: updated };
}

export async function deleteEvent(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const admin = createAdminSupabase();
  const { data: row } = await admin.from('events').select('slug').eq('id', id).maybeSingle();

  const { error } = await admin.from('events').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/events');
  if (row?.slug) revalidatePath(`/events/${row.slug}`);
  return { success: true };
}
