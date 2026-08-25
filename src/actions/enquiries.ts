'use server';

import { headers } from 'next/headers';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { enquirySchema } from '@/lib/validators/enquiry';
import { rateLimit } from '@/lib/rate-limit';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { ACADEMY } from '@/lib/utils/constants';
import { revalidatePath } from 'next/cache';

/**
 * Public contact-form submission. Anon callers are rate-limited per IP
 * (RLS allows anon INSERT on enquiries; this caps spam).
 */
export async function submitEnquiry(data: { name: string; phone: string; email?: string; message: string }) {
  const parsed = enquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Please check the form and try again' };
  }
  const d = parsed.data;

  // Per-IP throttle: 5 enquiries / 10 minutes.
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`enquiry:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })) {
    return { success: false, error: 'Too many submissions. Please try again later or message us on WhatsApp.' };
  }

  // Insert under the anon key policy — no server privileges needed.
  const supabase = createAdminSupabase();
  const { error } = await supabase.from('enquiries').insert({
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    message: d.message,
    source: 'contact_form',
    status: 'new',
  });
  if (error) {
    console.error('enquiry insert failed:', error);
    return { success: false, error: 'Could not submit your message. Please try again.' };
  }

  // Heads-up to the academy phone (mock-safe when WhatsApp isn't configured).
  try {
    await sendWhatsAppTemplate({
      phone: ACADEMY.phone,
      templateName: WHATSAPP_TEMPLATES.broadcast.name,
      variables: WHATSAPP_TEMPLATES.broadcast.variables({
        message: `New enquiry from ${d.name} (${d.phone}): ${d.message.slice(0, 200)}`,
      }),
    });
  } catch (err) {
    console.error('enquiry WhatsApp notify failed:', err);
  }

  return { success: true };
}

/** Admin: update enquiry status (new → contacted → closed). */
export async function updateEnquiryStatus(id: string, status: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const valid = ['new', 'contacted', 'closed'];
  if (!valid.includes(status)) return { success: false, error: 'Invalid status' };

  const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/enquiries');
  return { success: true };
}
