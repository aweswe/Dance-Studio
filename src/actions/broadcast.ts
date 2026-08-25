'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { sendBroadcastSchema } from '@/lib/validators/broadcast';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { rateLimit } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';

/** Count of active students a broadcast with this scope would reach. */
export async function estimateBroadcastReach(scope: string, scopeId: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { count: 0 };

  let query = supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');
  if (scope === 'programme') query = query.eq('programme_id', scopeId);
  if (scope === 'batch') query = query.eq('batch_id', scopeId);

  const { count, error } = await query;
  if (error) {
    console.error('estimateBroadcastReach failed:', error);
    return { count: 0 };
  }
  return { count: count ?? 0 };
}

export async function sendBroadcast(scope: string, scopeId: string, message: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = sendBroadcastSchema.safeParse({ scope, scopeId, message });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid broadcast' };
  }
  const d = parsed.data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Mass-send endpoint — throttle per admin (5/hour) before any sends
  if (!rateLimit(`broadcast:${user?.id ?? 'anon'}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return { success: false, error: 'Too many broadcasts. Please wait before sending again.' };
  }

  let query = supabase
    .from('students')
    .select('id, name, phone')
    .eq('status', 'active');
  if (d.scope === 'programme') query = query.eq('programme_id', d.scopeId as string);
  if (d.scope === 'batch') query = query.eq('batch_id', d.scopeId as string);

  const { data: students, error } = await query;
  if (error) return { success: false, error: error.message };

  const total = students?.length ?? 0;
  const withPhone = (students ?? []).filter((s) => (s as { phone: string | null }).phone);

  // Enqueue instead of a synchronous send loop — the cron drain
  // (/api/cron/broadcast) picks rows up every 5 minutes with retries.
  const queued = withPhone.length;
  if (queued > 0) {
    const rows = withPhone.map((student) => {
      const s = student as { phone: string };
      return {
        recipient_phone: s.phone,
        template_name: WHATSAPP_TEMPLATES.broadcast.name,
        variables: WHATSAPP_TEMPLATES.broadcast.variables({ message: d.message }),
      };
    });

    const { error: logErr } = await supabase.from('broadcast_logs').insert({
      message: d.message,
      template_name: WHATSAPP_TEMPLATES.broadcast.name,
      recipients: { scope: d.scope, scopeId: d.scopeId || null, total },
      recipient_count: queued,
      sent_by: user?.id ?? null,
    });

    if (logErr) {
      console.error('Broadcast log insert failed:', logErr);
      return { success: false, error: 'Could not record the broadcast — try again' };
    }

    const { error: queueErr } = await supabase.from('broadcast_queue').insert(rows);
    if (queueErr) {
      console.error('Broadcast enqueue failed:', queueErr);
      return { success: false, error: 'Could not queue the broadcast — try again' };
    }
  }

  revalidatePath('/admin/broadcast');
  return { success: true, count: queued, total };
}
