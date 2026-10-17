'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Plus, Mail, Phone, Trash2, Copy, Link2, MessageCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createInstructor, linkInstructorAuth, deleteInstructor } from '@/actions/instructors'

const PORTAL_URL = 'https://rhythmzzdance.com/login'

function buildWhatsAppInvite(name: string) {
  return `Hi ${name}! 👋 Welcome to *Rhythmzz Academy of Dance*!\n\nYou have been onboarded as an instructor on our portal. You can access your assigned classes, daily attendance, and schedule here:\n\n🔗 ${PORTAL_URL}\n\nSign in with your registered email. If you have any questions, feel free to contact the academy administration. 🎶`
}

export function InstructorManager({ initialInstructors }: { initialInstructors: any[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<any | null>(null)
  const [inviteInfo, setInviteInfo] = useState<{ name: string; phone?: string } | null>(null)
  const [copied, setCopied] = useState(false)

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
      setIsOpen(false)
      setInviteInfo({ name: form.name, phone: form.phone })
      setForm({ name: '', role: '', bio: '', certifications: '', email: '', phone: '' })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not add instructor' })
    }
  }

  const copyInvite = async () => {
    if (!inviteInfo) return
    await navigator.clipboard.writeText(buildWhatsAppInvite(inviteInfo.name))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const sendWhatsApp = () => {
    if (!inviteInfo) return
    const msg = buildWhatsAppInvite(inviteInfo.name)
    const phone = inviteInfo.phone?.replace(/[^0-9]/g, '')
    const url = phone
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setBusy(true)
    setFeedback(null)
    const res = await deleteInstructor(pendingDelete.id)
    setBusy(false)
    setPendingDelete(null)
    if (res.success) {
      setFeedback({ ok: true, text: `Instructor "${pendingDelete.name}" deleted` })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not delete instructor' })
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

      {/* WhatsApp Invite Panel — shown after successful instructor creation */}
      {inviteInfo && (
        <div className="rounded-xl border-2 border-green/40 bg-green/5 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-ink">{inviteInfo.name} added successfully!</p>
              <p className="text-xs text-ink-2 mt-0.5">Send the portal invite to this instructor via WhatsApp.</p>
            </div>
          </div>
          <div className="bg-canvas-muted border border-line rounded-lg p-3 text-xs text-ink-2 whitespace-pre-line leading-relaxed font-mono">
            {buildWhatsAppInvite(inviteInfo.name)}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyInvite}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-surface border border-line-strong rounded-md px-3 py-2 hover:bg-canvas-muted transition-colors"
            >
              {copied ? <CheckCircle2 size={13} className="text-green" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Message'}
            </button>
            <button
              type="button"
              onClick={sendWhatsApp}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-green text-white rounded-md px-3 py-2 hover:bg-green/90 transition-colors"
            >
              <MessageCircle size={13} />
              {inviteInfo.phone ? `Send to ${inviteInfo.phone}` : 'Send on WhatsApp'}
            </button>
            <button
              type="button"
              onClick={() => setInviteInfo(null)}
              className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink px-2 py-2 transition-colors"
            >
              Dismiss
            </button>
          </div>
          <p className="text-[10px] text-ink-3 flex items-center gap-1">
            <Link2 size={10} /> Portal URL: {PORTAL_URL}
          </p>
        </div>
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
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-500/10 p-2"
                title="Delete instructor"
                onClick={() => setPendingDelete(instructor)}
              >
                <Trash2 size={16} />
              </Button>
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
              <p className="text-xs text-ink-2">
                Portal login: {instructor.auth_id ? 'linked' : 'not linked'}
              </p>
              {!instructor.auth_id && (
                <InstructorLinkForm instructorId={instructor.id} email={instructor.email || ''} />
              )}
            </div>
          </Card>
        ))}

        {instructors.length === 0 && (
          <div className="col-span-full py-12 text-center text-ink-2 bg-canvas-muted rounded-md">
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

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete instructor?"
        description={`Are you sure you want to delete instructor "${pendingDelete?.name}"? Any batches currently assigned to them will have their instructor unassigned.`}
        confirmLabel="Delete"
        danger
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  )
}

function InstructorLinkForm({ instructorId, email }: { instructorId: string; email: string }) {
  const router = useRouter()
  const [value, setValue] = useState(email)
  const [busy, setBusy] = useState(false)
  const [text, setText] = useState<string | null>(null)

  return (
    <form
      className="flex flex-col gap-2 pt-2"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        const res = await linkInstructorAuth(instructorId, value)
        setText(res.success ? 'Login linked — they can sign in with this email.' : res.error || 'Could not link')
        setBusy(false)
        if (res.success) router.refresh()
      }}
    >
      <Input
        type="email"
        required
        placeholder="Instructor email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" size="sm" disabled={busy}>
        {busy ? 'Linking…' : 'Link portal login'}
      </Button>
      {text && <p className="text-xs text-ink-2">{text}</p>}
    </form>
  )
}
