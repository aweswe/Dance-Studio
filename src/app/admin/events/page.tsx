import { createServerSupabase } from '@/lib/supabase/server';
import { EventsManager } from '@/components/admin/events-manager';

export default async function AdminEventsPage() {
  const supabase = await createServerSupabase();
  const { data: events } = await supabase
    .from('events')
    .select('id, slug, title, starts_at, venue, description, is_published, image_url, images, event_rsvps(id, name, phone, guests)')
    .order('starts_at', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink tracking-wide">Events</h2>
        <p className="text-ink-2 text-sm mt-1">Create, publish, and track RSVPs for stage showcases.</p>
      </div>
      <EventsManager initialEvents={(events ?? []) as any[]} />
    </div>
  );
}
