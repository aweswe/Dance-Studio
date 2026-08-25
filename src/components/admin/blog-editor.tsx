'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { createPost, updatePost, deletePost } from '@/actions/blog'
import { formatDate } from '@/lib/utils/format'

interface Post {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  meta_description: string | null
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
}

interface PostForm {
  title: string
  excerpt: string
  coverImageUrl: string
  metaDescription: string
  tags: string
  content: string
}

const EMPTY_FORM: PostForm = {
  title: '',
  excerpt: '',
  coverImageUrl: '',
  metaDescription: '',
  tags: '',
  content: '',
}

export function BlogEditor({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PostForm>(EMPTY_FORM)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null)

  const posts = initialPosts || []

  const openNew = () => {
    setForm(EMPTY_FORM)
    setEditingId('new')
    setFeedback(null)
  }

  const openEdit = (post: Post) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? '',
      coverImageUrl: post.cover_image_url ?? '',
      metaDescription: post.meta_description ?? '',
      tags: (post.tags ?? []).join(', '),
      content: post.content ?? '',
    })
    setEditingId(post.id)
    setFeedback(null)
  }

  const save = async (isPublished: boolean) => {
    setBusy(true)
    setFeedback(null)
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      coverImageUrl: form.coverImageUrl,
      metaDescription: form.metaDescription,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      content: form.content,
      isPublished,
    }
    const res = editingId === 'new'
      ? await createPost(payload)
      : await updatePost(editingId as string, payload)
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: isPublished ? 'Post published' : 'Draft saved' })
      setEditingId(null)
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not save post' })
    }
  }

  const remove = async (id: string) => {
    setPendingDelete(null)
    const res = await deletePost(id)
    if (!res.success) {
      setFeedback({ ok: false, text: res.error ?? 'Could not delete post' })
      return
    }
    setFeedback({ ok: true, text: 'Post deleted' })
    router.refresh()
  }

  if (editingId !== null) {
    const isNew = editingId === 'new'
    return (
      <Card className="p-6">
        <h3 className="font-display text-xl text-blk mb-6">{isNew ? 'Create New Post' : 'Edit Post'}</h3>

        {feedback && (
          <p className={`mb-4 text-sm ${feedback.ok ? 'text-green' : 'text-red-500'}`}>{feedback.text}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-mu mb-1">Title</label>
            <Input
              placeholder="Enter post title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Excerpt</label>
            <Input
              placeholder="Brief summary"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Cover Image URL</label>
            <Input
              placeholder="https://..."
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Meta Description</label>
            <Input
              placeholder="SEO summary (optional)"
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Tags (comma-separated)</label>
            <Input
              placeholder="Kuchipudi, Fitness"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Content (HTML)</label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <textarea
                className="w-full h-96 p-3 rounded-md border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-bl resize-none"
                placeholder="<h2>Heading</h2>&#10;<p>Write your post content here (HTML)...</p>"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <div className="h-96 overflow-y-auto rounded-md border border-gray-200 bg-light/50 p-4">
                <p className="text-[10px] font-display tracking-[2px] text-mu uppercase mb-2">Live Preview</p>
                {form.content.trim() ? (
                  <div
                    className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-normal prose-a:text-bl prose-img:rounded-xl text-sm"
                    dangerouslySetInnerHTML={{ __html: form.content }}
                  />
                ) : (
                  <p className="text-sm text-mu italic">Start typing to preview the post.</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button onClick={() => save(true)} disabled={busy}>
              {busy ? 'Saving...' : 'Publish Post'}
            </Button>
            <Button variant="outline" onClick={() => save(false)} disabled={busy}>
              Save as Draft
            </Button>
            <Button variant="outline" onClick={() => setEditingId(null)} className="ml-auto text-mu">Cancel</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openNew} className="flex items-center gap-2">
          <Plus size={16} /> New Post
        </Button>
      </div>

      {feedback && (
        <p className={`text-sm ${feedback.ok ? 'text-green' : 'text-red-500'}`}>{feedback.text}</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blk">{post.title}</h4>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={post.is_published ? 'green' : 'default'} className="text-[10px]">
                  {post.is_published ? 'PUBLISHED' : 'DRAFT'}
                </Badge>
                <span className="text-xs text-mu">
                  {post.is_published && post.published_at
                    ? formatDate(post.published_at)
                    : formatDate(post.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-mu hover:text-bl rounded-full hover:bg-light" onClick={() => openEdit(post)}>
                <Edit size={16} />
              </button>
              <button className="p-2 text-mu hover:text-red-500 rounded-full hover:bg-light" onClick={() => setPendingDelete(post)}>
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}

        {posts.length === 0 && (
          <div className="py-12 text-center text-mu bg-light rounded-[16px]">
            No posts yet. Write the first one.
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete.id)}
        busy={busy}
        danger
        title="Delete this post?"
        confirmLabel="Delete"
        description={`"${pendingDelete?.title ?? 'This post'}" will be permanently removed from the blog. This cannot be undone.`}
      />
    </div>
  )
}
