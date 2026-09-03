'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Upload, X, ArrowUp, ArrowDown, Eye, EyeOff, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { uploadMedia, toggleVisibility, deleteMedia, reorderMedia } from '@/actions/gallery';
import { compressImage } from '@/lib/utils/image-compress';

interface GalleryItem {
  id: string;
  url: string;
  type: 'photo' | 'video';
  title: string | null;
  tags: string[] | null;
  is_visible: boolean;
  sort_order: number;
}

export function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>(initialItems || []);
  const [busy, setBusy] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // Selected files state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Delete state
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Synchronize when server initialItems change
  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const handleFilesSelected = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setSelectedFiles(list);

    // Create object URLs for instant previews
    const previews = list.map((f) => URL.createObjectURL(f));
    setPreviewUrls(previews);
    setIsUploadOpen(true);
    setFeedback(null);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelected(e.target.files);
    e.target.value = '';
  };

  const onDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const closeUploadModal = () => {
    if (busy) return;
    setIsUploadOpen(false);
    setSelectedFiles([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setTitle('');
    setTags('');
    setUploadStatus('');
  };

  const doUpload = async () => {
    if (selectedFiles.length === 0) return;
    setBusy(true);
    setFeedback(null);

    const uploadedItems: GalleryItem[] = [];
    let failureCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const originalFile = selectedFiles[i];
      const fileLabel = `${i + 1} of ${selectedFiles.length}`;

      try {
        setUploadStatus(`Optimizing image ${fileLabel}...`);
        // Client-side compression for images: shrinks 10MB phone photos to ~350KB in ~50ms
        const compressed = await compressImage(originalFile, 1920, 1920, 0.85);

        const origSizeMb = (originalFile.size / (1024 * 1024)).toFixed(1);
        const compSizeMb = (compressed.size / (1024 * 1024)).toFixed(2);
        setUploadStatus(`Uploading ${fileLabel} (${origSizeMb} MB → ${compSizeMb} MB)...`);

        const fd = new FormData();
        fd.append('file', compressed);
        fd.append('title', selectedFiles.length === 1 ? title : (title ? `${title} (${i + 1})` : ''));
        fd.append('tags', tags);

        const res = await uploadMedia(fd);
        if (res.success && res.item) {
          uploadedItems.push(res.item as GalleryItem);
        } else {
          failureCount++;
          console.error('Upload failed for item:', res.error);
        }
      } catch (err) {
        failureCount++;
        console.error('Error during compression or upload:', err);
      }
    }

    setBusy(false);

    if (uploadedItems.length > 0) {
      // Optimistically add to UI immediately!
      setItems((prev) => [...uploadedItems, ...prev]);
      setFeedback({
        ok: failureCount === 0,
        text: failureCount === 0
          ? `Successfully uploaded ${uploadedItems.length} ${uploadedItems.length === 1 ? 'photo' : 'photos'}!`
          : `Uploaded ${uploadedItems.length} items, but ${failureCount} failed.`,
      });
      closeUploadModal();
      router.refresh();
    } else {
      setFeedback({ ok: false, text: 'Upload failed. Please ensure file is an image or video under 25MB.' });
      setUploadStatus('');
    }
  };

  const doToggle = async (id: string) => {
    // Optimistic toggle
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_visible: !item.is_visible } : item))
    );
    await toggleVisibility(id);
    router.refresh();
  };

  const doDelete = async (id: string) => {
    setDeleteBusy(true);
    setFeedback(null);
    const previousItems = items;

    // Optimistically remove immediately so the user doesn't wait
    setItems((prev) => prev.filter((item) => item.id !== id));
    setPendingDelete(null);

    const res = await deleteMedia(id);
    setDeleteBusy(false);

    if (res.success) {
      setFeedback({ ok: true, text: 'Photo removed from gallery' });
      router.refresh();
    } else {
      // Revert if delete failed
      setItems(previousItems);
      setFeedback({ ok: false, text: res.error ?? 'Failed to delete photo' });
    }
  };

  const doMove = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setItems(reordered);

    await reorderMedia(reordered.map((it, i) => ({ id: it.id, sort_order: items.length - i })));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between ${
            feedback.ok
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Drag & Drop / Click Upload Area */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDropFiles}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        className={`bg-surface rounded-2xl border-2 p-10 text-center border-dashed transition-all cursor-pointer focus-visible:focus-ring ${
          isDragging
            ? 'border-bl bg-bl/10 shadow-[0_0_20px_rgba(43,180,216,0.2)]'
            : 'border-line hover:border-bl/60 hover:bg-canvas-muted'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-bl/10 text-bl flex items-center justify-center mx-auto mb-4 border border-bl/20">
          <Upload size={28} />
        </div>
        <h4 className="font-display text-xl text-ink font-semibold">
          Click or Drag & Drop photos here
        </h4>
        <p className="text-sm text-ink-2 mt-1.5 max-w-md mx-auto">
          Upload individual or multiple photos (JPG, PNG, WEBP, MP4). Large phone photos are
          automatically optimized for fast web loading.
        </p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4"
          className="hidden"
          onChange={onPickFile}
        />
      </div>

      {/* Grid of Existing Photos */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-display text-lg text-ink">
          Uploaded Media <span className="text-xs text-ink-2 font-normal">({items.length} items)</span>
        </h3>
        {items.length > 0 && (
          <span className="text-xs text-ink-2">Hover over an item to reorder or remove</span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="relative group rounded-xl overflow-hidden border border-line-strong bg-surface shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative bg-canvas-muted">
              {item.type === 'video' ? (
                <video src={item.url} className="object-cover w-full h-full" muted />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.url}
                  alt={item.title || 'Gallery item'}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              )}

              {/* Status pill */}
              <div className="absolute top-2 left-2 z-10">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                    item.is_visible
                      ? 'bg-black/70 text-green-400 border border-green-500/30'
                      : 'bg-black/70 text-ink-2 border border-line'
                  }`}
                >
                  {item.is_visible ? 'Live' : 'Hidden'}
                </span>
              </div>

              {/* Hover action overlay */}
              <div className="absolute inset-0 bg-blk/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  className="p-2 bg-wh/95 rounded-full text-blk hover:text-bl disabled:opacity-30 focus-visible:focus-ring active:scale-95 shadow-md"
                  onClick={() => doMove(i, -1)}
                  disabled={i === 0}
                  title="Move forward in gallery"
                  aria-label="Move forward"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  className="p-2 bg-wh/95 rounded-full text-blk hover:text-bl disabled:opacity-30 focus-visible:focus-ring active:scale-95 shadow-md"
                  onClick={() => doMove(i, 1)}
                  disabled={i === items.length - 1}
                  title="Move backward in gallery"
                  aria-label="Move backward"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 focus-visible:focus-ring active:scale-95 shadow-md"
                  onClick={() => setPendingDelete(item)}
                  title="Delete from gallery"
                  aria-label="Delete"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-3 flex justify-between items-center bg-surface border-t border-line-subtle">
              <span className="text-xs font-medium text-ink truncate pr-2" title={item.title || ''}>
                {item.title || item.tags?.[0] || 'Photo'}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="p-1.5 rounded-lg text-ink-2 hover:text-bl hover:bg-canvas-muted transition-colors focus-visible:focus-ring"
                  onClick={() => doToggle(item.id)}
                  title={item.is_visible ? 'Hide from public site' : 'Show on public site'}
                  aria-label={item.is_visible ? 'Hide' : 'Show'}
                >
                  {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors focus-visible:focus-ring"
                  onClick={() => setPendingDelete(item)}
                  title="Delete photo"
                  aria-label="Delete photo"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-16 text-center text-ink-2 bg-canvas-muted rounded-2xl border border-line">
          <ImageIcon size={40} className="mx-auto mb-3 text-ink-2 opacity-50" />
          <p className="font-medium text-ink">No photos uploaded to database yet.</p>
          <p className="text-xs text-ink-2 mt-1">Upload your first studio photo above!</p>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && doDelete(pendingDelete.id)}
        busy={deleteBusy}
        danger
        title="Delete photo from gallery?"
        confirmLabel="Yes, Delete Photo"
        description={`"${pendingDelete?.title || pendingDelete?.tags?.[0] || 'This photo'}" will be permanently removed from the website and storage. This cannot be undone.`}
      />

      {/* Upload Modal with Multi-File Previews and Progress */}
      <Modal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        title={`Upload ${selectedFiles.length > 1 ? `${selectedFiles.length} Photos` : 'Photo'}`}
        size="md"
      >
        <div className="space-y-4">
          {/* Thumbnails Preview */}
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-lg overflow-hidden border border-line shrink-0 relative bg-canvas-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="preview" className="object-cover w-full h-full" />
              </div>
            ))}
          </div>

          <p className="text-xs text-ink-2">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected (Total:{' '}
            {(
              selectedFiles.reduce((acc, f) => acc + f.size, 0) /
              (1024 * 1024)
            ).toFixed(1)}{' '}
            MB) · Automatically compressed for speed
          </p>

          <div>
            <label className="block text-sm text-ink-2 mb-1">Title (Optional)</label>
            <Input
              placeholder="e.g., Annual Recital 2026, Kuchipudi Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={busy}
            />
          </div>

          <div>
            <label className="block text-sm text-ink-2 mb-1">Tags (comma-separated)</label>
            <Input
              placeholder="Kuchipudi, Recital, Kids Dance, Performance"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={busy}
            />
          </div>

          {busy && (
            <div className="p-3 bg-bl/10 border border-bl/20 rounded-xl flex items-center gap-3 text-xs text-bl font-medium">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{uploadStatus || 'Processing...'}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={doUpload} disabled={busy} className="flex items-center gap-2">
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Start Upload ({selectedFiles.length})</span>
                </>
              )}
            </Button>
            <Button variant="outline" onClick={closeUploadModal} disabled={busy}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
