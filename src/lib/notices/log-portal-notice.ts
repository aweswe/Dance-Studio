import type { SupabaseClient } from '@supabase/supabase-js';

/** Mirror automated WhatsApp sends in the student portal notices feed. */
export async function logPortalNotice(
  admin: SupabaseClient,
  opts: {
    message: string;
    templateName: string;
    scope?: 'all' | 'programme' | 'batch';
    scopeId?: string | null;
    recipientCount?: number;
  },
) {
  const { error } = await admin.from('broadcast_logs').insert({
    message: opts.message,
    template_name: opts.templateName,
    recipients: {
      scope: opts.scope ?? 'all',
      scopeId: opts.scopeId ?? null,
      total: opts.recipientCount ?? 0,
    },
    recipient_count: opts.recipientCount ?? 0,
    sent_at: new Date().toISOString(),
  });

  if (error) console.error('[logPortalNotice]', error.message);
}
