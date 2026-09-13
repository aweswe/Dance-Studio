import { createAdminSupabase } from '@/lib/supabase/server';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { formatTime } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.WHATSAPP_API_KEY) {
    return Response.json({ ok: true, skipped: true, reason: 'WhatsApp not configured' });
  }

  const supabase = createAdminSupabase();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekday = tomorrow.toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });

  const { data: batches } = await supabase
    .from('batches')
    .select('id, days, time_start, time_end, programme:programmes(name)')
    .neq('status', 'paused');

  const todays = (batches || []).filter((b: any) => Array.isArray(b.days) && b.days.includes(weekday));
  let queued = 0;
  for (const batch of todays) {
    const { data: students } = await supabase
      .from('students')
      .select('name, phone')
      .eq('batch_id', (batch as any).id)
      .eq('status', 'active');
    for (const s of students || []) {
      if (!(s as any).phone) continue;
      await sendWhatsAppTemplate({
        phone: (s as any).phone,
        templateName: WHATSAPP_TEMPLATES.classReminder.name,
        variables: WHATSAPP_TEMPLATES.classReminder.variables({
          studentName: (s as any).name,
          programmeName: (batch as any).programme?.name || 'Rhythmzz',
          time: `${formatTime((batch as any).time_start)} – ${formatTime((batch as any).time_end)}`,
        }),
      });
      queued++;
    }
  }

  return Response.json({ ok: true, weekday, batches: todays.length, messaged: queued });
}
