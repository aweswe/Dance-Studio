'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useRouter } from 'next/navigation'
import {
  deactivateStudent,
  reactivateStudent,
  updateStudent,
  enablePortalAccess,
} from '@/actions/students'

interface BatchOption {
  id: string
  name: string | null
  days: string[]
  programme: { name: string }
}

interface StudentActionsProps {
  student: {
    id: string
    name: string
    phone: string
    email: string | null
    status: string
    batch_id: string | null
    auth_id: string | null
  }
  batches: BatchOption[]
}

export function StudentActions({ student, batches }: StudentActionsProps) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  // Edit form state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [name, setName] = useState(student.name)
  const [phone, setPhone] = useState(student.phone)
  const [email, setEmail] = useState(student.email ?? '')
  const [batchId, setBatchId] = useState(student.batch_id ?? '')

  // Deactivate confirmation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>, okText: string) => {
    setBusy(true)
    setFeedback(null)
    const res = await fn()
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: okText })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Something went wrong' })
    }
  }

  const toggleStatus = () => {
    const targetInactive = student.status === 'active'
    run(
      () => (targetInactive ? deactivateStudent(student.id) : reactivateStudent(student.id)),
      targetInactive ? 'Student deactivated' : 'Student reactivated'
    )
    setIsConfirmOpen(false)
  }

  const saveEdit = () => {
    run(async () => {
      const res = await updateStudent(student.id, {
        name,
        phone,
        email,
        batchId: batchId || null,
        status: student.status as 'active' | 'inactive',
      })
      if (res.success) setIsEditOpen(false)
      return res
    }, 'Profile updated')
  }

  return (
    <div className="pt-4 border-t border-line-subtle space-y-4">
      {/* Portal access */}
      {student.auth_id ? (
        <div className="flex items-center justify-between bg-green/10 border border-green/20 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Portal access enabled</p>
            <p className="text-xs text-ink-2">Student can log in with WhatsApp OTP</p>
          </div>
          <span className="text-[10px] font-semibold tracking-[2px] text-green-ink">LINKED</span>
        </div>
      ) : (
        <div className="bg-canvas-muted border border-line-strong rounded-lg px-4 py-3">
          <p className="text-sm font-medium text-ink mb-1">Portal not enabled</p>
          <p className="text-xs text-ink-2 mb-3">
            Creates the student&apos;s WhatsApp OTP login and sends a welcome message.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => run(() => enablePortalAccess(student.id), 'Portal enabled — welcome message sent')}
            disabled={busy}
          >
            {busy ? 'Enabling...' : 'Enable Portal Access'}
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button className="w-full" onClick={() => setIsEditOpen(true)}>Edit Profile</Button>
        <Button
          variant="outline"
          className="w-full text-danger hover:text-danger-deep hover:bg-danger/10"
          onClick={() => {
            if (student.status === 'active') setIsConfirmOpen(true)
            else toggleStatus()
          }}
          disabled={busy}
        >
          {student.status === 'active' ? 'Deactivate' : 'Reactivate'}
        </Button>
      </div>

      {feedback && (
        <p className={`mt-3 text-sm ${feedback.ok ? 'text-green-ink' : 'text-danger'}`}>
          {feedback.text}
        </p>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={toggleStatus}
        busy={busy}
        danger
        title="Deactivate student?"
        confirmLabel="Deactivate"
        description={`${student.name} will no longer appear as active and will be freed from their batch. This does not delete their records or portal access.`}
      />

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink-2 mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Batch</label>
            <Select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="No batch"
              options={batches.map((b) => ({
                value: b.id,
                label: `${b.programme.name} — ${b.name || b.days.join(', ')}`,
              }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={saveEdit} disabled={busy}>
              {busy ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
