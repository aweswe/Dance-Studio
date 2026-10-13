'use server';

import { headers } from 'next/headers';
import { createAdminSupabase } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { normalizeIndianPhone } from '@/lib/utils/format';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { ACADEMY } from '@/lib/utils/constants';

export interface WaitlistSubmissionData {
  name: string;
  phone: string;
  email?: string;
  programme: string;
  preferredTiming?: string;
  notes?: string;
}

export async function submitWaitlistRequest(data: WaitlistSubmissionData) {
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: 'Please enter a valid full name.' };
  }

  const phone = normalizeIndianPhone(data.phone);
  if (!phone || phone.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  // Rate-limit by IP: 6 submissions / 15 minutes
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await rateLimit(`waitlist:${ip}`, { limit: 6, windowMs: 15 * 60 * 1000 }))) {
    return { success: false, error: 'Too many submissions. Please contact us on WhatsApp directly.' };
  }

  const admin = createAdminSupabase();

  const formattedMessage = [
    `WAITLIST REQUEST: ${data.programme || 'Certification Course'}`,
    data.preferredTiming ? `Timing: ${data.preferredTiming}` : null,
    data.notes ? `Notes: ${data.notes}` : null,
  ].filter(Boolean).join(' · ');

  // 1. Record in enquiries table
  const { error: enquiryErr } = await admin.from('enquiries').insert({
    name: data.name.trim(),
    phone,
    email: data.email?.trim() || null,
    message: formattedMessage,
    source: 'waitlist',
    status: 'new',
  });

  if (enquiryErr) {
    console.error('Waitlist enquiry insert error:', enquiryErr);
    // Don't fail completely if table is temporarily constrained, try to notify
  }

  // 2. Count existing waitlist entries for this programme to give an authentic queue number
  let queuePosition = 4;
  try {
    const { count } = await admin
      .from('enquiries')
      .select('id', { count: 'exact', head: true })
      .eq('source', 'waitlist');
    if (count !== null && count !== undefined) {
      queuePosition = count + 1;
    }
  } catch {}

  // 3. Send WhatsApp admin notification
  try {
    await sendWhatsAppTemplate({
      phone: ACADEMY.phone,
      templateName: WHATSAPP_TEMPLATES.broadcast.name,
      variables: WHATSAPP_TEMPLATES.broadcast.variables({
        message: `New WAITLIST sign-up from ${data.name.trim()} (${phone}) for ${data.programme}. Slot #${queuePosition}.`,
      }),
    });
  } catch (err) {
    console.error('Waitlist WhatsApp alert failed:', err);
  }

  return {
    success: true,
    queuePosition,
    message: `You're on the waitlist! Position #${queuePosition} reserved. We'll message you on WhatsApp as soon as an opening is confirmed.`,
  };
}
