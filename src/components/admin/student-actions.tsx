'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { useRouter } from 'next/navigation'
import {
  deactivateStudent,
  reactivateStudent,
  updateStudent,
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
    <div className="pt-4 border-t border-gray-100">
      <div className="flex gap-2">
        <Button className="w-full" onClick={() => setIsEditOpen(true)}>Edit Profile</Button>
        <Button
          variant="outline"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={toggleStatus}
          disabled={busy}
        >
          {student.status === 'active' ? 'Deactivate' : 'Reactivate'}
        </Button>
      </div>

      {feedback && (
        <p className={`mt-3 text-sm ${feedback.ok ? 'text-green' : 'text-red-500'}`}>
          {feedback.text}
        </p>
      )}

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-mu mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Batch</label>
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
