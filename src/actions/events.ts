'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { eventSchema, type EventFormData } from '@/lib/validators/event';
import { revalidatePath } from 'next/cache';

import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';

export interface EventBroadcastOptions {
  enabled: boolean;
  channel: 'in_app' | 'whatsapp' | 'both';
  message?: string;
  scope?: 'all' | 'programme' | 'batch';
  scopeId?: string | null;
}

export async function createEvent(data: EventFormData, broadcast?: EventBroadcastOptions) {
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
      image_url: d.imageUrl ?? null,
      images: d.images ?? [],
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  let broadcastResult: {
    broadcasted: boolean;
    channel?: string;
    recipientsCount?: number;
    inAppLogged?: boolean;
  } = { broadcasted: false };

  // Handle Automatic Event Broadcast if requested
  if (broadcast?.enabled && inserted) {
    const formattedDate = new Date(d.startsAt).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const defaultMsg = `New Studio Event: "${d.title}"! Date: ${formattedDate} at ${d.venue}. View event details & RSVP in the student portal!`;
    const broadcastMsg = broadcast.message?.trim() || defaultMsg;

    let totalRecipients = 0;

    // Fetch active students if WhatsApp delivery is needed
    if (broadcast.channel === 'whatsapp' || broadcast.channel === 'both') {
      try {
        let query = admin.from('students').select('id, name, phone').eq('status', 'active');
        if (broadcast.scope === 'programme' && broadcast.scopeId) {
          query = query.eq('programme_id', broadcast.scopeId);
        } else if (broadcast.scope === 'batch' && broadcast.scopeId) {
          query = query.eq('batch_id', broadcast.scopeId);
        }
        const { data: students } = await query;
        const validPhones = (students || []).filter((s: any) => s.phone);
        totalRecipients = validPhones.length;

        if (totalRecipients > 0) {
          const queueRows = validPhones.map((s: any) => ({
            recipient_phone: s.phone,
            template_name: WHATSAPP_TEMPLATES.broadcast.name,
            variables: WHATSAPP_TEMPLATES.broadcast.variables({ message: broadcastMsg }),
          }));
          await admin.from('broadcast_queue').insert(queueRows);
        }
      } catch (err) {
        console.error('Error queueing event WhatsApp broadcast:', err);
      }
    }

    // Insert into broadcast_logs for In-App Notice or Both
    if (broadcast.channel === 'in_app' || broadcast.channel === 'both') {
      try {
        await admin.from('broadcast_logs').insert({
          message: broadcastMsg,
          template_name: 'event_announcement',
          recipients: {
            scope: broadcast.scope ?? 'all',
            scopeId: broadcast.scopeId ?? null,
            event_id: inserted.id,
            event_slug: d.slug,
          },
          recipient_count: totalRecipients,
          sent_at: new Date().toISOString(),
        } as any);
      } catch (err) {
        console.error('Error logging in-app event notice:', err);
      }
    }

    broadcastResult = {
      broadcasted: true,
      channel: broadcast.channel,
      recipientsCount: totalRecipients,
      inAppLogged: broadcast.channel === 'in_app' || broadcast.channel === 'both',
    };

    revalidatePath('/student/notices');
    revalidatePath('/student');
    revalidatePath('/admin/broadcast');
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath(`/events/${d.slug}`);
  return { success: true, event: inserted, broadcastResult };
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
      image_url: d.imageUrl ?? null,
      images: d.images ?? [],
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

export async function uploadEventImage(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const file = formData.get('file') as File | null;
  if (!file) return { success: false, error: 'No file selected' };

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: 'Image must be 10 MB or smaller' };
  }

  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Only image files are allowed' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const admin = createAdminSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());

  // Try 'events' bucket first, fallback to 'gallery'
  let bucket = 'events';
  let uploadRes = await admin.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || 'image/webp',
    upsert: true,
  });

  if (uploadRes.error) {
    bucket = 'gallery';
    uploadRes = await admin.storage.from(bucket).upload(`events/${path}`, buffer, {
      contentType: file.type || 'image/webp',
      upsert: true,
    });
  }

  if (uploadRes.error) {
    return { success: false, error: uploadRes.error.message };
  }

  const filePath = bucket === 'events' ? path : `events/${path}`;
  const { data: publicUrl } = admin.storage.from(bucket).getPublicUrl(filePath);

  return { success: true, url: publicUrl.publicUrl };
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
