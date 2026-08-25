'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Upload, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { uploadMedia, toggleVisibility, deleteMedia, reorderMedia } from '@/actions/gallery'

interface GalleryItem {
  id: string
  url: string
  type: 'photo' | 'video'
  title: string | null
  tags: string[] | null
  is_visible: boolean
  sort_order: number
}

export function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const items = initialItems || []

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setPendingFile(file)
    if (file) setIsUploadOpen(true)
    e.target.value = ''
  }

  const doUpload = async () => {
    if (!pendingFile) return
    setBusy(true)
    setFeedback(null)
    const fd = new FormData()
    fd.append('file', pendingFile)
    fd.append('title', title)
    fd.append('tags', tags)
    const res = await uploadMedia(fd)
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: 'Uploaded' })
      setIsUploadOpen(false)
      setPendingFile(null)
      setTitle('')
      setTags('')
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Upload failed' })
    }
  }

  const doToggle = async (id: string) => {
    await toggleVisibility(id)
    router.refresh()
  }

  const doDelete = async (id: string) => {
    setDeleteBusy(true)
    setFeedback(null)
    const res = await deleteMedia(id)
    setDeleteBusy(false)
    if (res.success) {
      setPendingDelete(null)
      setFeedback({ ok: true, text: 'Media deleted' })
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Delete failed' })
    }
    router.refresh()
  }

  const doMove = async (index: number, delta: -1 | 1) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(target, 0, moved)
    await reorderMedia(reordered.map((it, i) => ({ id: it.id, sort_order: i + 1 })))
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <p className={`text-sm ${feedback.ok ? 'text-green-ink' : 'text-danger'}`}>{feedback.text}</p>
      )}

      <div
        role="button"
        tabIndex={0}
        className="bg-surface rounded-2xl border border-line p-12 text-center border-dashed hover:bg-canvas-muted transition-colors cursor-pointer focus-visible:focus-ring"
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileRef.current?.click()
          }
        }}
      >
        <Upload size={32} className="mx-auto text-ink-2 mb-4" />
        <h4 className="font-medium text-ink">Click to upload images or videos</h4>
        <p className="text-sm text-ink-2 mt-1">Supported formats: JPG, PNG, WEBP, MP4. Max size: 10MB.</p>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4" className="hidden" onChange={onPickFile} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="relative group rounded-lg overflow-hidden border border-line-strong bg-surface">
            <div className="aspect-square relative">
              {item.type === 'video' ? (
                <video src={item.url} className="object-cover w-full h-full" muted />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.url} alt={item.title || 'Gallery item'} className="object-cover w-full h-full" />
              )}

              <div className="absolute inset-0 bg-blk/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  className="p-2 bg-wh rounded-full text-blk hover:text-bl disabled:opacity-40 focus-visible:focus-ring active:scale-[0.98]"
                  onClick={() => doMove(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  className="p-2 bg-wh rounded-full text-blk hover:text-bl disabled:opacity-40 focus-visible:focus-ring active:scale-[0.98]"
                  onClick={() => doMove(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>

            <div className="p-3 flex justify-between items-center bg-surface">
              <span className="text-xs font-medium text-ink truncate">
                {item.title || item.tags?.[0] || item.type}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="p-1 rounded text-ink-2 hover:text-bl hover:bg-line-subtle focus-visible:focus-ring active:scale-[0.98]"
                  onClick={() => doToggle(item.id)}
                  aria-label={item.is_visible ? 'Hide from site' : 'Show on site'}
                >
                  {item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  className="p-1 rounded text-danger hover:bg-danger/10 focus-visible:focus-ring active:scale-[0.98]"
                  onClick={() => setPendingDelete(item)}
                  aria-label="Delete"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-12 text-center text-ink-2 bg-canvas-muted rounded-[16px]">
          No media yet. Upload the first photo or video above.
        </div>
      )}

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && doDelete(pendingDelete.id)}
        busy={deleteBusy}
        danger
        title="Delete media?"
        confirmLabel="Delete"
        description={`"${pendingDelete?.title || pendingDelete?.tags?.[0] || pendingDelete?.type || 'This item'}" will be removed from the site and the storage bucket. This cannot be undone.`}
      />

      <Modal isOpen={isUploadOpen} onClose={() => { setIsUploadOpen(false); setPendingFile(null) }} title="Upload Media" size="md">
        <div className="space-y-4">
          <p className="text-sm text-ink-2 truncate">
            {pendingFile?.name} · {pendingFile ? `${(pendingFile.size / (1024 * 1024)).toFixed(1)} MB` : ''}
          </p>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Title</label>
            <Input
              placeholder="e.g., Annual Recital 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Tags (comma-separated)</label>
            <Input
              placeholder="Kuchipudi, Recital"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={doUpload} disabled={busy}>
              {busy ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="outline" onClick={() => { setIsUploadOpen(false); setPendingFile(null) }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
