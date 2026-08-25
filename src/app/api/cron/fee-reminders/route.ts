// Daily fee-reminder sweep: students with an uncovered current month get a
// WhatsApp fee_reminder template (queued; drained by /api/cron/broadcast).
// Vercel cron hits this at 03:30 UTC (09:00 IST) — see vercel.json.
// Auth: Bearer CRON_SECRET. Silent skip when no WhatsApp key is configured.
import { createAdminSupabase } from '@/lib/supabase/server';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // No WhatsApp key → no point queueing reminders that can never send.
  if (!process.env.WHATSAPP_API_KEY) {
    return Response.json({ ok: true, skipped: 'whatsapp-key-missing', queued: 0 });
  }

  const supabase = createAdminSupabase();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthStart = `${monthKey}-01T00:00:00Z`;

  const [{ data: students }, { data: payments }, { data: programmes }, { data: existing }] =
    await Promise.all([
      supabase
        .from('students')
        .select('id, name, phone, programme_id')
        .eq('status', 'active')
        .not('phone', 'is', null),
      supabase.from('fee_payments').select('student_id, paid_at, for_month'),
      supabase.from('programmes').select('id, fees_monthly'),
      supabase
        .from('broadcast_queue')
        .select('recipient_phone')
        .eq('template_name', WHATSAPP_TEMPLATES.feeReminder.name)
        .gte('created_at', monthStart),
    ]);

  // Covered students: any payment whose (for_month ?? paid_at) falls in this month.
  const covered = new Set(
    (payments ?? [])
      .map((p) => p as { student_id: string; paid_at: string; for_month: string | null })
      .filter((p) => (p.for_month ?? p.paid_at).slice(0, 7) === monthKey)
      .map((p) => p.student_id),
  );

  // Already-reminded this month: dedup by phone.
  const remindedPhones = new Set(
    (existing ?? []).map((e) => (e as { recipient_phone: string }).recipient_phone),
  );

  const feeByProgramme = new Map(
    (programmes ?? []).map((p) => {
      const prog = p as { id: string; fees_monthly: number | null };
      return [prog.id, prog.fees_monthly ?? 0];
    }),
  );

  const rows = (students ?? [])
    .map((s) => s as { id: string; name: string; phone: string; programme_id: string | null })
    .filter((s) => {
      if (covered.has(s.id)) return false; // already covered this month
      if (remindedPhones.has(s.phone)) return false; // reminded earlier this month
      if (!s.programme_id || (feeByProgramme.get(s.programme_id) ?? 0) <= 0) return false; // nothing due
      return true;
    })
    .map((s) => {
      const amount = String(feeByProgramme.get(s.programme_id!) ?? 0);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        recipient_phone: s.phone,
        template_name: WHATSAPP_TEMPLATES.feeReminder.name,
        variables: WHATSAPP_TEMPLATES.feeReminder.variables({
          studentName: s.name,
          amount,
          dueDate: lastDay.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          paymentLink: `https://rhythmzz.in/student/fees`,
        }),
      };
    });

  if (rows.length === 0) {
    return Response.json({ ok: true, queued: 0 });
  }

  const { error } = await supabase.from('broadcast_queue').insert(rows);
  if (error) {
    console.error('fee-reminder enqueue failed:', error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, queued: rows.length });
}
