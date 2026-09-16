'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  prepareHomepageReelUpload,
  finalizeHomepageReelUpload,
  updateHomepageReel,
  deleteHomepageReel,
  reorderHomepageReels,
} from '@/actions/reels';
import { createClient } from '@/lib/supabase/client';
import { MAX_HOMEPAGE_REELS, type HomepageReelRow } from '@/lib/reels/constants';
import { ArrowUp, ArrowDown, Loader2, Trash2, Upload, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

function probePortrait(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read video metadata'));
    };
    video.src = url;
  });
}

export function ReelsManager({ initialItems }: { initialItems: HomepageReelRow[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialItems);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HomepageReelRow | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadHref, setUploadHref] = useState('https://www.instagram.com/rhythmzzdance.live');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const slotsLeft = MAX_HOMEPAGE_REELS - items.length;

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setFeedback(null);

    if (file.type !== 'video/mp4') {
      setFeedback({ ok: false, text: 'Only MP4 portrait videos are allowed' });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setFeedback({ ok: false, text: 'Video must be 20 MB or smaller' });
      return;
    }

    try {
      const { width, height } = await probePortrait(file);
      if (width >= height) {
        setFeedback({ ok: false, text: `Portrait only — this file is ${width}×${height} (landscape or square)` });
        return;
      }
      setSelectedFile(file);
      if (!uploadTitle) setUploadTitle(file.name.replace(/\.mp4$/i, '').slice(0, 60));
    } catch {
      setFeedback({ ok: false, text: 'Could not read video — try another file' });
    }
  };

  const doUpload = async () => {
    if (!selectedFile || !uploadTitle.trim()) return;
    setBusy(true);
    setFeedback(null);

    try {
      const { width, height } = await probePortrait(selectedFile);

      const prep = await prepareHomepageReelUpload();
      if (!prep.success || !prep.path || !prep.token) {
        setFeedback({ ok: false, text: prep.error ?? 'Could not start upload' });
        return;
      }

      const supabase = createClient();
      const { error: uploadErr } = await supabase.storage
        .from('reels')
        .uploadToSignedUrl(prep.path, prep.token, selectedFile, { contentType: 'video/mp4' });

      if (uploadErr) {
        setFeedback({ ok: false, text: uploadErr.message || 'Storage upload failed' });
        return;
      }

      const res = await finalizeHomepageReelUpload({
        storagePath: prep.path,
        title: uploadTitle.trim(),
        href: uploadHref.trim(),
        width,
        height,
        fileSize: selectedFile.size,
      });

      if (!res.success) {
        setFeedback({ ok: false, text: res.error ?? 'Upload failed' });
        return;
      }

      setSelectedFile(null);
      setUploadTitle('');
      setFeedback({ ok: true, text: 'Reel uploaded — visible on homepage after refresh' });
      router.refresh();
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Upload failed — try a smaller MP4 (under 20 MB)',
      });
    } finally {
      setBusy(false);
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    const payload = reordered.map((item, i) => ({ id: item.id, sort_order: i + 1 }));
    setItems(reordered.map((item, i) => ({ ...item, sort_order: i + 1 })));
    await reorderHomepageReels(payload);
    router.refresh();
  };

  const saveMeta = async (item: HomepageReelRow, title: string, href: string, isVisible: boolean) => {
    setBusy(true);
    const res = await updateHomepageReel(item.id, { title, href, isVisible });
    setBusy(false);
    setFeedback(res.success ? { ok: true, text: 'Saved' } : { ok: false, text: res.error ?? 'Save failed' });
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    const res = await deleteHomepageReel(pendingDelete.id);
    setBusy(false);
    setPendingDelete(null);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== pendingDelete.id));
      router.refresh();
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Delete failed' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-line bg-surface p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg text-ink">Upload reel</h3>
            <p className="text-sm text-ink-2 mt-1">
              Portrait MP4 only · max 20 MB · uploads go direct to storage (not through Vercel)
            </p>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-3 shrink-0">
            {items.length}/{MAX_HOMEPAGE_REELS} used
          </span>
        </div>

        {slotsLeft <= 0 ? (
          <p className="text-sm text-gold">All {MAX_HOMEPAGE_REELS} slots full — delete a reel to upload a new one.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Reel title (shown on card)"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
            <Input
              placeholder="Link on click (Instagram URL)"
              value={uploadHref}
              onChange={(e) => setUploadHref(e.target.value)}
            />
            <div className="sm:col-span-2 flex flex-wrap gap-3 items-center">
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={onPickFile}
              />
              <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()} disabled={busy}>
                <Upload size={16} className="mr-2" />
                {selectedFile ? selectedFile.name.slice(0, 40) : 'Choose portrait MP4'}
              </Button>
              <Button type="button" onClick={doUpload} disabled={busy || !selectedFile || !uploadTitle.trim()}>
                {busy ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                Upload
              </Button>
            </div>
          </div>
        )}

        {feedback && (
          <p className={`text-sm ${feedback.ok ? 'text-green-600' : 'text-red-600'}`}>{feedback.text}</p>
        )}
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-ink-2">No reels in database — homepage uses local fallback files until you upload.</p>
        )}
        {items.map((item, index) => (
          <ReelRow
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            busy={busy}
            onMove={move}
            onSave={saveMeta}
            onDelete={() => setPendingDelete(item)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete reel?"
        description={`Remove "${pendingDelete?.title}" from the homepage strip?`}
        confirmLabel="Delete"
        danger
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

function ReelRow({
  item,
  index,
  total,
  busy,
  onMove,
  onSave,
  onDelete,
}: {
  item: HomepageReelRow;
  index: number;
  total: number;
  busy: boolean;
  onMove: (index: number, dir: -1 | 1) => void;
  onSave: (item: HomepageReelRow, title: string, href: string, isVisible: boolean) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [href, setHref] = useState(item.href);
  const [visible, setVisible] = useState(item.is_visible);

  return (
    <div className="rounded-md border border-line bg-surface p-4 flex flex-col sm:flex-row gap-4">
      <div className="relative w-[100px] shrink-0 aspect-[9/16] rounded-md overflow-hidden bg-blk">
        <video src={item.video_url} muted playsInline className="w-full h-full object-cover" />
        <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
          <Video size={10} /> {item.width && item.height ? `${item.width}×${item.height}` : '9:16'}
        </span>
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="Instagram link" />
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="rounded"
          />
          Visible on homepage
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => onSave(item, title, href, visible)}>
            Save
          </Button>
          <Button type="button" size="sm" variant="ghost" disabled={index === 0 || busy} onClick={() => onMove(index, -1)}>
            <ArrowUp size={14} />
          </Button>
          <Button type="button" size="sm" variant="ghost" disabled={index === total - 1 || busy} onClick={() => onMove(index, 1)}>
            <ArrowDown size={14} />
          </Button>
          <Button type="button" size="sm" variant="ghost" className="text-red-600" disabled={busy} onClick={onDelete}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
