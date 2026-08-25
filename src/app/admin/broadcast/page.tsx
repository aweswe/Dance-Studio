import { BroadcastComposer } from '@/components/admin/broadcast-composer'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function BroadcastPage() {
  const supabase = await createServerSupabase()

  const { data: programmes } = await supabase.from('programmes').select('id, name').order('name')
  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, programme:programmes(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">WhatsApp Broadcast</h2>
        <p className="text-ink-2 font-body text-sm mt-1">Send targeted announcements and reminders to students.</p>
      </div>

      <BroadcastComposer
        programmes={(programmes ?? []) as any[]}
        batches={(batches ?? []) as any[]}
      />
    </div>
  )
}
