import { createServerSupabase } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'

export default async function AdminEventsPage() {
  const supabase = await createServerSupabase()
  const { data: events } = await supabase
    .from('events')
    .select('id, slug, title, starts_at, venue, event_rsvps(id, name, phone, guests)')
    .order('starts_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Events</h2>
        <p className="text-ink-2 text-sm mt-1">Annual Day RSVPs and other published showcases.</p>
      </div>
      {(events || []).map((event: any) => (
        <Card key={event.id} className="p-6">
          <h3 className="font-display text-xl mb-1">{event.title}</h3>
          <p className="text-sm text-ink-2 mb-4">
            {event.venue} · {new Date(event.starts_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
          <p className="text-xs uppercase tracking-wider text-ink-3 mb-2">
            {(event.event_rsvps || []).length} RSVPs
          </p>
          <ul className="text-sm space-y-1">
            {(event.event_rsvps || []).map((r: any) => (
              <li key={r.id}>{r.name} · {r.phone} · {r.guests} guest{r.guests === 1 ? '' : 's'}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  )
}
