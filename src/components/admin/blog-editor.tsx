'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function BlogEditor() {
  const [isEditing, setIsEditing] = useState(false)

  const posts = [
    { id: '1', title: 'Welcome to our New Studio', status: 'published', date: 'Oct 15, 2026' }
  ]

  if (isEditing) {
    return (
      <Card className="p-6">
        <h3 className="font-display text-xl text-blk mb-6">Create New Post</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-mu mb-1">Title</label>
            <Input placeholder="Enter post title" />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Excerpt</label>
            <Input placeholder="Brief summary" />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Cover Image URL</label>
            <Input placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Content</label>
            <textarea 
              className="w-full h-64 p-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-bl resize-none"
              placeholder="Write your post content here (Markdown supported)..."
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button>Publish Post</Button>
            <Button variant="outline">Save as Draft</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="ml-auto text-mu">Cancel</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
          <Plus size={16} /> New Post
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blk">{post.title}</h4>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={post.status === 'published' ? 'green' : 'default'} className="text-[10px]">
                  {post.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-mu">{post.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-mu hover:text-bl rounded-full hover:bg-light"><Edit size={16}/></button>
              <button className="p-2 text-mu hover:text-red-500 rounded-full hover:bg-light"><Trash2 size={16}/></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
