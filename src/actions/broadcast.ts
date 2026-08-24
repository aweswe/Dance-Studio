'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { sendBroadcastSchema } from '@/lib/validators/broadcast';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
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

  let query = supabase
    .from('students')
    .select('id, name, phone')
    .eq('status', 'active');
  if (d.scope === 'programme') query = query.eq('programme_id', d.scopeId as string);
  if (d.scope === 'batch') query = query.eq('batch_id', d.scopeId as string);

  const { data: students, error } = await query;
  if (error) return { success: false, error: error.message };

  const total = students?.length ?? 0;
  let sent = 0;
  for (const student of students ?? []) {
    try {
      if (student.phone) {
        const res = await sendWhatsAppTemplate({
          phone: student.phone,
          templateName: WHATSAPP_TEMPLATES.broadcast.name,
          variables: WHATSAPP_TEMPLATES.broadcast.variables({ message: d.message }),
        });
        if (res.success) sent++;
      }
    } catch (err) {
      console.error('Broadcast send failed for', student.id, err);
    }
  }

  const { error: logErr } = await supabase.from('broadcast_logs').insert({
    message: d.message,
    template_name: WHATSAPP_TEMPLATES.broadcast.name,
    recipients: { scope: d.scope, scopeId: d.scopeId || null, total },
    recipient_count: sent,
    sent_by: user?.id ?? null,
  });

  revalidatePath('/admin/broadcast');
  return { success: true, count: sent, total, logError: logErr?.message ?? null };
}
