'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  Upload,
  X,
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  GripVertical,
  Info,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  uploadMedia,
  toggleVisibility,
  deleteGalleryItem,
  saveGalleryOrder,
} from '@/actions/gallery';
import { compressImage } from '@/lib/utils/image-compress';

export interface GalleryItem {
  id: string;
  url: string;
  type: 'photo' | 'video' | 'image';
  title: string | null;
  tags: string[] | null;
  is_visible: boolean;
  sort_order: number;
  source?: 'db' | 'archive';
  category?: string;
}

export interface ArchiveGalleryItem {
  id: string;
  url: string;
  thumbnail_url?: string;
  title: string;
  alt: string;
  type: string;
  category: string;
  tags: string[];
  is_visible: boolean;
  sort_order: number;
}

export function GalleryManager({
  initialItems,
  archiveItems = [],
}: {
  initialItems: GalleryItem[];
  archiveItems?: ArchiveGalleryItem[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // Combine DB and archive into a unified editable list
  const [items, setItems] = useState<GalleryItem[]>(() => {
    const dbList: GalleryItem[] = (initialItems || []).map((it) => ({
      ...it,
      source: 'db',
    }));
    const archiveList: GalleryItem[] = archiveItems.map((it) => ({
      id: it.id,
      url: it.url,
      type: (it.type === 'video' ? 'video' : 'photo') as 'photo' | 'video',
      title: it.title,
      tags: it.tags,
      is_visible: it.is_visible ?? true,
      sort_order: it.sort_order ?? 0,
      source: 'archive',
      category: it.category,
    }));
    return [...dbList, ...archiveList];
  });

  const [activeTab, setActiveTab] = useState<'all' | 'uploaded' | 'archive'>('all');
  const [archiveCategory, setArchiveCategory] = useState<string>('all');
  const [busy, setBusy] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // Mouse Drag & Drop Reorder states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Upload modal states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [isDraggingUpload, setIsDraggingUpload] = useState(false);

  // Delete modal states
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const handleFilesSelected = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setSelectedFiles(list);

    const previews = list.map((f) => URL.createObjectURL(f));
    setPreviewUrls(previews);
    setIsUploadOpen(true);
    setFeedback(null);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelected(e.target.files);
    e.target.value = '';
  };

  const onDropUpload = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingUpload(false);
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
          uploadedItems.push({
            ...(res.item as GalleryItem),
            source: 'db',
          });
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
      setItems((prev) => [...uploadedItems, ...prev]);
      setFeedback({
        ok: failureCount === 0,
        text:
          failureCount === 0
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

    // Optimistically remove immediately from all views
    setItems((prev) => prev.filter((item) => item.id !== id));
    setPendingDelete(null);

    const res = await deleteGalleryItem(id);
    setDeleteBusy(false);

    if (res.success) {
      setFeedback({ ok: true, text: 'Photo removed from gallery across website.' });
      router.refresh();
    } else {
      setItems(previousItems);
      setFeedback({ ok: false, text: res.error ?? 'Failed to delete photo' });
    }
  };

  // Drag and Drop Mouse Reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent ghost / transfer data
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);

    setItems(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);

    setFeedback({ ok: true, text: 'Gallery order updated and saved.' });

    // Persist ordered list in DB & site_content
    const orderedIds = reordered.map((item) => item.id);
    await saveGalleryOrder(orderedIds);
    router.refresh();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Filter items based on active tab and category
  const filteredItems = items.filter((item) => {
    if (activeTab === 'uploaded') return item.source === 'db';
    if (activeTab === 'archive') {
      if (item.source !== 'archive') return false;
      if (archiveCategory === 'all') return true;
      return item.category === archiveCategory || item.tags?.includes(archiveCategory);
    }
    // 'all' tab:
    if (archiveCategory !== 'all') {
      return item.category === archiveCategory || item.tags?.includes(archiveCategory);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-md border text-sm font-medium flex items-center justify-between ${
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

      {/* ── IDEAL SIZE INFORMATION CALLOUT ── */}
      <div className="rounded-md border-2 border-bl/40 bg-bl/5 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-bl/15 text-bl flex items-center justify-center shrink-0 border border-bl/30 mt-0.5">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-ink flex items-center gap-2">
              <span>Ideal Image Size to Prevent Cropping</span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-bl text-slate-950">
                16:9 or 1:1
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-ink-2 mt-1 leading-relaxed">
              Use <strong className="text-ink">1920 × 1080 px</strong> (16:9 Landscape) or <strong className="text-ink">1080 × 1080 px</strong> (1:1 Square) for optimal studio framing without edges being cut off.
            </p>
          </div>
        </div>
        <div className="text-left md:text-right shrink-0">
          <div className="inline-block px-3 py-1.5 rounded-md bg-surface border border-line text-xs font-mono font-semibold text-ink">
            Recommended: 1920 × 1080 px
          </div>
        </div>
      </div>

      {/* Drag & Drop / Click Upload Area */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingUpload(true);
        }}
        onDragLeave={() => setIsDraggingUpload(false)}
        onDrop={onDropUpload}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        className={`bg-surface rounded-md border-2 p-8 sm:p-10 text-center border-dashed transition-all cursor-pointer focus-visible:focus-ring ${
          isDraggingUpload
            ? 'border-bl bg-bl/10 shadow-[0_0_20px_rgba(43,180,216,0.2)]'
            : 'border-line hover:border-bl/60 hover:bg-canvas-muted'
        }`}
      >
        <div className="w-14 h-14 rounded-md bg-bl/10 text-bl flex items-center justify-center mx-auto mb-3 border border-bl/20">
          <Upload size={28} />
        </div>
        <h4 className="font-display text-xl text-ink font-semibold">
          Click or Drag &amp; Drop photos here
        </h4>
        <p className="text-sm text-ink-2 mt-1.5 max-w-md mx-auto">
          Upload studio photos (JPG, PNG, WEBP). <strong className="text-ink">Ideal size: 1920 × 1080 px</strong>. Large phone photos are automatically compressed for fast loading.
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

      {/* Mouse Drag-to-Reorder Explanatory Banner */}
      <div className="rounded-md border border-line bg-surface p-3 sm:p-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <GripVertical size={18} className="text-bl shrink-0" />
          <span className="text-ink-2">
            <strong className="text-ink font-bold">Mouse Drag Reorder Active:</strong> Click and drag any photo card with your mouse to change its display order across the entire website gallery.
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-ink-3 shrink-0">
          Total: {items.length} Photos
        </span>
      </div>

      {/* Tab Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-b border-line pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-canvas-muted text-ink-2 hover:text-ink'
            }`}
          >
            All Photos ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('uploaded')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'uploaded'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-canvas-muted text-ink-2 hover:text-ink'
            }`}
          >
            Database Uploads ({items.filter((i) => i.source === 'db').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-canvas-muted text-ink-2 hover:text-ink'
            }`}
          >
            Studio Archive ({items.filter((i) => i.source === 'archive').length})
          </button>
        </div>

        {activeTab !== 'uploaded' && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-ink-3 font-semibold mr-1 shrink-0">Filter:</span>
            {['all', 'Classical', 'Contemporary', 'Gymnastics', 'Live Concerts & Tours', 'Studio Training'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setArchiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  archiveCategory === cat
                    ? 'bg-bl/20 text-bl-ink font-bold border border-bl/40'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Photos — All Draggable & Deletable */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => {
          const isOver = dragOverIndex === index;
          const isDragging = draggedIndex === index;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-md overflow-hidden border bg-surface transition-all cursor-grab active:cursor-grabbing select-none ${
                isDragging ? 'opacity-30 scale-95' : 'opacity-100'
              } ${
                isOver
                  ? 'border-bl ring-2 ring-bl scale-[1.02] shadow-lg'
                  : 'border-line-strong hover:border-bl/60 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="aspect-square relative bg-canvas-muted">
                {item.type === 'video' ? (
                  <video src={item.url} className="object-cover w-full h-full pointer-events-none" muted />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.url}
                    alt={item.title || 'Gallery item'}
                    className="object-cover w-full h-full pointer-events-none"
                    loading="lazy"
                  />
                )}

                {/* Status pill & drag handle */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                  <div className="bg-black/80 text-white/90 p-1 rounded-md backdrop-blur-md flex items-center shadow-xs">
                    <GripVertical size={13} className="text-bl" />
                  </div>
                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                      item.source === 'db'
                        ? 'bg-black/75 text-green-400 border border-green-500/30'
                        : 'bg-black/75 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {item.source === 'db' ? 'Upload' : 'Archive'}
                  </span>
                  {item.category && (
                    <span className="hidden sm:inline-block text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-black/75 text-white/90 border border-white/20 backdrop-blur-md">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Hover overlay with Delete button & preview link */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full text-slate-950 hover:bg-bl hover:text-white transition-colors shadow-md"
                    title="View full resolution"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    type="button"
                    className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 active:scale-95 transition-all shadow-md cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDelete(item);
                    }}
                    title="Delete photo from website"
                    aria-label="Delete photo"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Bottom info strip with Delete button accessible on touch / desktop */}
              <div className="p-3 flex justify-between items-center bg-surface border-t border-line-subtle gap-2">
                <div className="truncate pr-1">
                  <p className="text-xs font-semibold text-ink truncate" title={item.title || ''}>
                    {item.title || item.tags?.[0] || 'Studio Photo'}
                  </p>
                  <p className="text-[10px] text-ink-3 truncate mt-0.5">
                    {item.category || item.tags?.slice(0, 2).join(', ') || 'Rhythmzz'}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.source === 'db' && (
                    <button
                      type="button"
                      className="p-1.5 rounded-md text-ink-2 hover:text-bl hover:bg-canvas-muted transition-colors"
                      onClick={() => doToggle(item.id)}
                      title={item.is_visible ? 'Hide from public site' : 'Show on public site'}
                    >
                      {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  )}
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    onClick={() => setPendingDelete(item)}
                    title="Delete this photo"
                    aria-label="Delete photo"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-16 text-center text-ink-2 bg-canvas-muted rounded-md border border-line">
          <ImageIcon size={40} className="mx-auto mb-3 text-ink-2 opacity-50" />
          <p className="font-medium text-ink">No photos match the selected filter.</p>
          <p className="text-xs text-ink-2 mt-1">Upload a photo or choose another category above.</p>
        </div>
      )}

      {/* Confirmation Modal for Universal Deletion */}
      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && doDelete(pendingDelete.id)}
        busy={deleteBusy}
        danger
        title="Delete photo from gallery?"
        confirmLabel="Yes, Delete Photo"
        description={`"${pendingDelete?.title || pendingDelete?.tags?.[0] || 'This photo'}" will be removed from the gallery across the entire website. This action cannot be undone.`}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        title={`Upload ${selectedFiles.length > 1 ? `${selectedFiles.length} Photos` : 'Photo'}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-bl/10 border border-bl/30 rounded-md text-xs text-ink space-y-0.5">
            <span className="font-bold text-bl flex items-center gap-1.5">
              <Info size={14} /> Ideal Image Size: 1920 × 1080 px
            </span>
            <p className="text-ink-2">
              Landscape 16:9 or square 1:1 prevents cropping on desktop and mobile displays.
            </p>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-md overflow-hidden border border-line shrink-0 relative bg-canvas-muted"
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
            <label className="block text-sm text-ink-2 mb-1">Category / Tag</label>
            <Input
              placeholder="Classical, Contemporary, Gymnastics, Studio Training, Live Tours"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={busy}
            />
          </div>

          {busy && (
            <div className="p-3 bg-bl/10 border border-bl/20 rounded-md flex items-center gap-3 text-xs text-bl font-medium">
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
