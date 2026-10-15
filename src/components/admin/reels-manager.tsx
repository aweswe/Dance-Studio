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

  const [activeTab, setActiveTab] = useState<'video' | 'instagram'>('video');
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const doUploadVideoToVercel = async () => {
    if (!uploadTitle.trim() || !selectedFile) return;
    setBusy(true);
    setFeedback(null);
    setUploadProgress('Analyzing video...');

    try {
      const meta = await probePortrait(selectedFile);
      setUploadProgress('Uploading to Vercel Blob CDN...');

      const { upload } = await import('@vercel/blob/client');
      const blob = await upload(
        `reels/${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        selectedFile,
        {
          access: 'public',
          handleUploadUrl: '/api/blob/upload',
        },
      );

      setUploadProgress('Applying rolling FIFO & saving...');
      const { registerVercelBlobReelWithFIFO } = await import('@/actions/reels');
      const res = await registerVercelBlobReelWithFIFO({
        title: uploadTitle.trim(),
        videoUrl: blob.url,
        href: uploadHref.trim() || undefined,
        width: meta.width,
        height: meta.height,
      });

      if (!res.success) {
        setFeedback({ ok: false, text: res.error ?? 'Failed to register reel' });
        return;
      }

      setUploadTitle('');
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setFeedback({
        ok: true,
        text: 'Video uploaded to Vercel Blob successfully (rolling FIFO auto-rotation active)!',
      });
      router.refresh();
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Could not upload video to Vercel',
      });
    } finally {
      setBusy(false);
      setUploadProgress(null);
    }
  };

  const doAddInstagramReel = async () => {
    if (!uploadTitle.trim() || !uploadHref.trim()) return;
    setBusy(true);
    setFeedback(null);

    try {
      const { createInstagramHomepageReel } = await import('@/actions/reels');
      const res = await createInstagramHomepageReel({
        title: uploadTitle.trim(),
        instagramUrl: uploadHref.trim(),
      });

      if (!res.success) {
        setFeedback({ ok: false, text: res.error ?? 'Failed to add reel' });
        return;
      }

      setUploadTitle('');
      setUploadHref('');
      setFeedback({ ok: true, text: 'Instagram Reel added — visible on homepage' });
      router.refresh();
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Could not add reel link',
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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg text-ink">Add Showcase Reel</h3>
            <p className="text-sm text-ink-2 mt-1">
              Host videos directly on Vercel with rolling FIFO auto-deletion (max 6 videos)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-3 shrink-0">
              {items.length}/{MAX_HOMEPAGE_REELS} used
            </span>
            {items.length >= MAX_HOMEPAGE_REELS && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold uppercase">
                FIFO Rotation Ready
              </span>
            )}
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-line gap-4 text-xs font-mono uppercase tracking-wider font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'video'
                ? 'border-bl text-bl font-bold'
                : 'border-transparent text-ink-3 hover:text-ink'
            }`}
          >
            Upload Video (Vercel Blob)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('instagram')}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'instagram'
                ? 'border-bl text-bl font-bold'
                : 'border-transparent text-ink-3 hover:text-ink'
            }`}
          >
            Instagram Reel Link
          </button>
        </div>

        {activeTab === 'video' ? (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Reel title (e.g. VIP walk — Divya choreo)"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
              <Input
                placeholder="Instagram profile or reel link (optional)"
                value={uploadHref}
                onChange={(e) => setUploadHref(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="text-xs text-ink-2 file:mr-3 file:py-2 file:px-3 file:rounded file:border file:border-line file:text-xs file:font-semibold file:bg-canvas file:text-ink hover:file:border-bl cursor-pointer"
              />
              <Button
                type="button"
                onClick={doUploadVideoToVercel}
                disabled={busy || !uploadTitle.trim() || !selectedFile}
              >
                {busy ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
                {uploadProgress || 'Upload to Vercel'}
              </Button>
            </div>

            <p className="text-[11px] text-ink-3">
              ⚡ <strong>FIFO Engine:</strong> When 6 reels exist, uploading a new video automatically purges the oldest video from Vercel CDN storage and database so your storage never grows.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Reel title (e.g. VIP walk — Divya choreo)"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
            <Input
              placeholder="Instagram Reel URL (e.g. https://www.instagram.com/reel/C8...)"
              value={uploadHref}
              onChange={(e) => setUploadHref(e.target.value)}
            />
            <div className="sm:col-span-2 flex flex-wrap gap-3 items-center">
              <Button
                type="button"
                onClick={doAddInstagramReel}
                disabled={busy || !uploadTitle.trim() || !uploadHref.trim()}
              >
                {busy ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                Add Instagram Reel
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
