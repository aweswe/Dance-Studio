'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { createEvent, updateEvent, deleteEvent, slugifyEventTitle } from '@/actions/events';
import type { EventFormData } from '@/lib/validators/event';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EventRow {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  venue: string | null;
  description: string | null;
  is_published: boolean | null;
  event_rsvps?: { id: string; name: string; phone: string; guests: number | null }[];
}

const emptyForm = (): EventFormData => ({
  title: '',
  slug: '',
  startsAt: '',
  venue: 'Rhythmzz Academy, Neredmet X Road, Secunderabad',
  description: '',
  isPublished: false,
});

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventsManager({ initialEvents }: { initialEvents: EventRow[] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [eventsSource, setEventsSource] = useState(initialEvents);
  const [form, setForm] = useState<EventFormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventRow | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setFeedback(null);
  };

  const openEdit = (event: EventRow) => {
    setEditingId(event.id);
    setSlugTouched(true);
    setForm({
      title: event.title,
      slug: event.slug,
      startsAt: toLocalInput(event.starts_at),
      venue: event.venue ?? '',
      description: event.description ?? '',
      isPublished: Boolean(event.is_published),
    });
    setFeedback(null);
  };

  const onTitleChange = (title: string) => {
    if (!form) return;
    setForm({
      ...form,
      title,
      slug: slugTouched ? form.slug : slugifyEventTitle(title),
    });
  };

  const submit = async () => {
    if (!form) return;
    setBusy(true);
    setFeedback(null);

    const res = editingId
      ? await updateEvent(editingId, form)
      : await createEvent(form);

    setBusy(false);
    if (!res.success) {
      setFeedback({ ok: false, text: res.error ?? 'Save failed' });
      return;
    }

    setForm(null);
    setEditingId(null);
    setFeedback({ ok: true, text: editingId ? 'Event updated' : 'Event created' });
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    const res = await deleteEvent(pendingDelete.id);
    setBusy(false);
    setPendingDelete(null);
    if (res.success) {
      setEvents((prev) => prev.filter((e) => e.id !== pendingDelete.id));
      router.refresh();
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Delete failed' });
    }
  };

  if (initialEvents !== eventsSource) {
    setEventsSource(initialEvents);
    setEvents(initialEvents);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <p className="text-sm text-ink-2">Create showcases, publish when ready, track RSVPs below.</p>
        <Button type="button" onClick={openCreate}>
          <Plus size={16} className="mr-2" /> New event
        </Button>
      </div>

      {form && (
        <Card className="p-6 space-y-4">
          <h3 className="font-display text-lg">{editingId ? 'Edit event' : 'New event'}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Title" value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
            <Input
              placeholder="URL slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: e.target.value });
              }}
            />
            <Input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            />
            <Input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </div>
          <textarea
            className="w-full min-h-[100px] rounded-xl border border-line bg-canvas px-3 py-2 text-sm"
            placeholder="Description shown on the public event page"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            Published (visible at /events/{form.slug || '…'})
          </label>
          <div className="flex gap-2">
            <Button type="button" onClick={submit} disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {editingId ? 'Save changes' : 'Create event'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setForm(null)} disabled={busy}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {feedback && (
        <p className={`text-sm ${feedback.ok ? 'text-green-600' : 'text-red-600'}`}>{feedback.text}</p>
      )}

      {events.map((event) => (
        <Card key={event.id} className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-display text-xl">{event.title}</h3>
              <p className="text-sm text-ink-2">
                /events/{event.slug} · {event.is_published ? 'Published' : 'Draft'}
              </p>
              <p className="text-sm text-ink-2 mt-1">
                {event.venue} ·{' '}
                {new Date(event.starts_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={() => openEdit(event)}>
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
              <Button type="button" size="sm" variant="ghost" className="text-red-600" onClick={() => setPendingDelete(event)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          <p className="text-xs uppercase tracking-wider text-ink-3 mb-2">
            {(event.event_rsvps || []).length} RSVPs
          </p>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {(event.event_rsvps || []).map((r) => (
              <li key={r.id}>
                {r.name} · {r.phone} · {r.guests ?? 1} guest{(r.guests ?? 1) === 1 ? '' : 's'}
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete event?"
        description={`Delete "${pendingDelete?.title}" and all RSVPs? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
