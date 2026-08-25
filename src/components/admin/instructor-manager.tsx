'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Plus, Mail, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createInstructor } from '@/actions/instructors'

export function InstructorManager({ initialInstructors }: { initialInstructors: any[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    certifications: '',
    email: '',
    phone: '',
  })

  const submit = async () => {
    setBusy(true)
    setFeedback(null)
    const res = await createInstructor({
      name: form.name,
      role: form.role,
      bio: form.bio,
      certifications: form.certifications.split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
      email: form.email,
      phone: form.phone,
      isActive: true,
    })
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: 'Instructor added' })
      setIsOpen(false)
      setForm({ name: '', role: '', bio: '', certifications: '', email: '', phone: '' })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not add instructor' })
    }
  }

  const instructors = initialInstructors || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">All Instructors</h3>
        <Button className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
          <Plus size={16} /> Add Instructor
        </Button>
      </div>

      {feedback && (
        <p className={`text-sm ${feedback.ok ? 'text-green-ink' : 'text-danger'}`}>{feedback.text}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-canvas-muted border border-line-strong flex items-center justify-center font-display text-xl text-bl">
                  {instructor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display text-xl text-ink">{instructor.name}</h4>
                  <Badge variant={instructor.is_active ? 'green' : 'default'} className="mt-1">
                    {instructor.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
              </div>
            </div>

            {instructor.role && (
              <p className="text-xs font-display tracking-[1px] uppercase text-bl-ink mb-3">{instructor.role}</p>
            )}

            <p className="text-sm text-ink-2 mb-4 line-clamp-2">{instructor.bio || 'No biography provided.'}</p>

            <div className="space-y-2 border-t border-line-subtle pt-4">
              {instructor.email && (
                <div className="flex items-center gap-2 text-sm text-ink-2">
                  <Mail size={14} className="text-bl" /> {instructor.email}
                </div>
              )}
              {instructor.phone && (
                <div className="flex items-center gap-2 text-sm text-ink-2">
                  <Phone size={14} className="text-bl" /> {instructor.phone}
                </div>
              )}
            </div>
          </Card>
        ))}

        {instructors.length === 0 && (
          <div className="col-span-full py-12 text-center text-ink-2 bg-canvas-muted rounded-[16px]">
            No instructors found.
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Instructor" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink-2 mb-1">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Role / Title</label>
            <Input
              placeholder="e.g., Kids Dance Instructor"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Bio</label>
            <textarea
              className="w-full h-24 bg-surface border border-line-strong rounded-control px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-1 focus:ring-bl/20 transition-all resize-none"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Certifications (one per line or comma-separated)</label>
            <textarea
              className="w-full h-16 bg-surface border border-line-strong rounded-control px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-1 focus:ring-bl/20 transition-all resize-none"
              value={form.certifications}
              onChange={(e) => setForm({ ...form, certifications: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink-2 mb-1">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-ink-2 mb-1">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={submit} disabled={busy}>
              {busy ? 'Adding...' : 'Add Instructor'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
