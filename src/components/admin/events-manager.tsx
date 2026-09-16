'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { createEvent, updateEvent, deleteEvent, uploadEventImage } from '@/actions/events';
import { slugifyEventTitle, type EventFormData } from '@/lib/validators/event';
import { compressImage } from '@/lib/utils/image-compress';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface EventRow {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  venue: string | null;
  description: string | null;
  is_published: boolean | null;
  image_url?: string | null;
  images?: string[] | null;
  event_rsvps?: { id: string; name: string; phone: string; guests: number | null }[];
}

const emptyForm = (): EventFormData => ({
  title: '',
  slug: '',
  startsAt: '',
  venue: 'Rhythmzz Academy, Neredmet X Road, Secunderabad',
  description: '',
  isPublished: false,
  imageUrl: '',
  images: [],
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventRow | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const coverFileRef = useRef<HTMLInputElement>(null);
  const galleryFilesRef = useRef<HTMLInputElement>(null);

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
      imageUrl: event.image_url ?? '',
      images: event.images ?? [],
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

  const handleCoverUpload = async (file: File) => {
    if (!form) return;
    setUploadingCover(true);
    setFeedback(null);
    try {
      const compressed = await compressImage(file, 1920, 1080, 0.85);
      const fd = new FormData();
      fd.append('file', compressed);
      const res = await uploadEventImage(fd);
      if (res.success && res.url) {
        setForm((prev) => (prev ? { ...prev, imageUrl: res.url } : null));
      } else {
        setFeedback({ ok: false, text: res.error || 'Failed to upload image' });
      }
    } catch {
      setFeedback({ ok: false, text: 'Failed to process image' });
    } finally {
      setUploadingCover(false);
      if (coverFileRef.current) coverFileRef.current.value = '';
    }
  };

  const handleGalleryUpload = async (files: FileList | File[]) => {
    if (!form) return;
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setUploadingGallery(true);
    setFeedback(null);
    try {
      const uploadedUrls: string[] = [];
      for (const file of fileList) {
        const compressed = await compressImage(file, 1920, 1080, 0.85);
        const fd = new FormData();
        fd.append('file', compressed);
        const res = await uploadEventImage(fd);
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setForm((prev) =>
          prev ? { ...prev, images: [...(prev.images || []), ...uploadedUrls] } : null
        );
      }
    } catch {
      setFeedback({ ok: false, text: 'Failed to upload one or more photos' });
    } finally {
      setUploadingGallery(false);
      if (galleryFilesRef.current) galleryFilesRef.current.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    if (!form) return;
    setForm({
      ...form,
      images: (form.images || []).filter((_, i) => i !== index),
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
        <p className="text-sm text-ink-2">
          Create showcases and annual events, add posters and photos, publish when ready, and track RSVPs.
        </p>
        <Button type="button" onClick={openCreate}>
          <Plus size={16} className="mr-2" /> New event
        </Button>
      </div>

      {form && (
        <Card className="p-6 space-y-6 border border-line shadow-sm bg-surface">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-display text-xl">{editingId ? 'Edit event' : 'New event'}</h3>
              <p className="text-xs text-ink-3 mt-0.5">
                Set title, date, venue, cover poster, and gallery images
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm(null)} disabled={busy}>
              <X size={16} />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-ink-2">Title</label>
              <Input
                placeholder="e.g. Rhythmzz Annual Showcase 2026"
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-ink-2">URL Slug</label>
              <Input
                placeholder="e.g. annual-showcase-2026"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-ink-2">Date & Time</label>
              <Input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-ink-2">Venue</label>
              <Input
                placeholder="Venue name and address"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-ink-2">Description</label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-line bg-canvas px-3 py-2 text-sm focus-visible:focus-ring"
              placeholder="Full description shown on the event details page..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Cover / Poster Image Section */}
          <div className="space-y-3 rounded-lg border border-line/60 bg-surface-2/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-ink font-semibold flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-brand" />
                  Cover / Poster Image
                </label>
                <p className="text-xs text-ink-3 mt-0.5">
                  Main banner displayed on the event page and cards.
                </p>
              </div>
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploadingCover}
                onClick={() => coverFileRef.current?.click()}
              >
                {uploadingCover ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} className="mr-1.5" /> Upload cover
                  </>
                )}
              </Button>
            </div>

            {form.imageUrl ? (
              <div className="relative group rounded-md overflow-hidden border border-line bg-canvas max-w-md">
                {/* Preview Image */}
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={form.imageUrl}
                    alt="Event cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 450px"
                    unoptimized
                  />
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-blk/75 backdrop-blur-sm rounded px-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="text-white hover:text-red-400 p-0.5 transition-colors"
                    title="Remove cover"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Or paste an image URL (https://...)"
                  value={form.imageUrl || ''}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="text-xs bg-canvas"
                />
              </div>
            )}
          </div>

          {/* Additional Photos / Gallery Section */}
          <div className="space-y-3 rounded-lg border border-line/60 bg-surface-2/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-ink font-semibold flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-brand" />
                  Additional Photos / Event Gallery
                </label>
                <p className="text-xs text-ink-3 mt-0.5">
                  Showcase stage moments, performer lineups, flyers, or previous editions.
                </p>
              </div>
              <input
                ref={galleryFilesRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleGalleryUpload(e.target.files);
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploadingGallery}
                onClick={() => galleryFilesRef.current?.click()}
              >
                {uploadingGallery ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} className="mr-1.5" /> Add photos
                  </>
                )}
              </Button>
            </div>

            {form.images && form.images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {form.images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-md overflow-hidden border border-line bg-canvas"
                  >
                    <Image
                      src={url}
                      alt={`Gallery photo ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-blk/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-3 italic">No additional photos uploaded yet.</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="rounded border-line"
            />
            <span>
              Published <span className="text-ink-3 font-normal">(visible publicly at /events/{form.slug || '…'})</span>
            </span>
          </label>

          <div className="flex gap-2 pt-2 border-t border-line">
            <Button type="button" onClick={submit} disabled={busy || uploadingCover || uploadingGallery}>
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
        <p className={`text-sm ${feedback.ok ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}`}>
          {feedback.text}
        </p>
      )}

      {events.length === 0 ? (
        <Card className="p-8 text-center text-ink-3 border-dashed">
          <Calendar size={36} className="mx-auto mb-2 opacity-50" />
          <p className="text-base font-medium text-ink">No events yet</p>
          <p className="text-xs mt-1">Click &quot;New event&quot; to create your first showcase or annual day.</p>
        </Card>
      ) : null}

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="p-5 border border-line hover:border-ink/20 transition-all bg-surface">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Event Thumbnail */}
                <div className="relative h-24 w-32 shrink-0 rounded-md overflow-hidden border border-line bg-surface-2 flex items-center justify-center">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="130px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center text-ink-3">
                      <ImageIcon size={22} className="opacity-40" />
                      <span className="text-[10px] mt-1 opacity-60">No poster</span>
                    </div>
                  )}
                </div>

                {/* Event Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl text-ink">{event.title}</h3>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider ${
                        event.is_published
                          ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {event.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} className="text-brand" />
                      {new Date(event.starts_at).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                    {event.venue && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="text-brand" />
                        {event.venue}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-xs text-ink-3">
                    <a
                      href={`/events/${event.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand hover:underline font-mono"
                    >
                      /events/{event.slug}
                      <ExternalLink size={11} />
                    </a>
                    {event.images && event.images.length > 0 && (
                      <span>· {event.images.length} gallery photo{event.images.length === 1 ? '' : 's'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <Button type="button" size="sm" variant="secondary" onClick={() => openEdit(event)}>
                    <Pencil size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                    onClick={() => setPendingDelete(event)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-3 font-mono">
                  <Users size={12} />
                  <span>
                    {(event.event_rsvps || []).length} RSVP{(event.event_rsvps || []).length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>

            {/* RSVP list if any */}
            {(event.event_rsvps || []).length > 0 && (
              <div className="mt-4 pt-3 border-t border-line/60">
                <p className="text-[10px] uppercase font-mono tracking-wider text-ink-3 mb-2 font-semibold">
                  Recent RSVPs
                </p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {(event.event_rsvps || []).map((r) => (
                    <span
                      key={r.id}
                      className="inline-flex items-center px-2 py-1 rounded bg-surface-2 text-xs text-ink"
                    >
                      {r.name} ({r.guests ?? 1} guest{(r.guests ?? 1) === 1 ? '' : 's'}) · {r.phone}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

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
