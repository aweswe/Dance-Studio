// Drains broadcast_queue via the WhatsApp provider.
// Vercel cron hits this every 5 minutes — see vercel.json.
// Auth: Bearer CRON_SECRET. Runs under the service role (no session).
import { createAdminSupabase } from '@/lib/supabase/server';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';

export const dynamic = 'force-dynamic';

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 25;

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminSupabase();
  const { data: pending, error: fetchError } = await supabase
    .from('broadcast_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE);

  if (fetchError) {
    console.error('broadcast drain fetch failed:', fetchError);
    return Response.json({ ok: false, error: fetchError.message }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const row of pending ?? []) {
    const attempts = (row as any).attempts + 1;

    // Mock mode (no WHATSAPP_API_KEY): the client logs and reports success.
    const res = await sendWhatsAppTemplate({
      phone: (row as any).recipient_phone,
      templateName: (row as any).template_name,
      variables: ((row as any).variables ?? {}) as Record<string, string>,
    });

    if (res.success) {
      await supabase
        .from('broadcast_queue')
        .update({ status: 'sent', attempts, last_error: null })
        .eq('id', (row as any).id);
      sent++;
    } else if (attempts >= MAX_ATTEMPTS) {
      await supabase
        .from('broadcast_queue')
        .update({ status: 'failed', attempts, last_error: res.error })
        .eq('id', (row as any).id);
      failed++;
    } else {
      await supabase
        .from('broadcast_queue')
        .update({ attempts, last_error: res.error })
        .eq('id', (row as any).id);
    }
  }

  return Response.json({ ok: true, sent, failed, remaining: (pending?.length ?? 0) - sent - failed });
}
