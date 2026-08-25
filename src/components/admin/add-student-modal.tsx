'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createStudent } from '@/actions/students'

interface ProgrammeOption { id: string; name: string }
interface BatchOption { id: string; name: string | null; programme: { name: string } | null }

export function AddStudentModal({
  programmes,
  batches,
}: {
  programmes: ProgrammeOption[]
  batches: BatchOption[]
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    programmeId: '',
    batchId: '',
    status: 'active' as 'active' | 'inactive',
    enablePortal: false,
  })

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const submit = async () => {
    setBusy(true)
    setFeedback(null)
    const res = await createStudent({
      name: form.name,
      phone: form.phone,
      email: form.email,
      programmeId: form.programmeId || null,
      batchId: form.batchId || null,
      status: form.status,
      enablePortal: form.enablePortal,
    })
    setBusy(false)
    if (res.success) {
      setFeedback({
        ok: true,
        text: res.portalEnabled
          ? 'Student enrolled and portal access enabled'
          : 'Student enrolled',
      })
      setForm({ name: '', phone: '', email: '', programmeId: '', batchId: '', status: 'active', enablePortal: false })
      router.refresh()
      // Keep the modal open for rapid consecutive walk-ins; show confirmation inside.
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not create student' })
    }
  }

  return (
    <>
      <Button className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
        <UserPlus size={16} /> Add Student
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Walk-in Enrolment" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-mu mb-1">Full Name</label>
            <Input
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="e.g., Ananya Sharma"
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Phone (10 digits)</label>
            <Input
              value={form.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="e.g., 9876543210"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Email (optional)</label>
            <Input
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="student@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Programme</label>
            <Select
              value={form.programmeId}
              onChange={(e) => set({ programmeId: e.target.value, batchId: '' })}
              placeholder="No programme yet"
              options={programmes.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Batch</label>
            <Select
              value={form.batchId}
              onChange={(e) => set({ batchId: e.target.value })}
              placeholder="No batch yet"
              options={batches.map((b) => ({
                value: b.id,
                label: `${b.programme?.name ?? ''} — ${b.name ?? ''}`.trim(),
              }))}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Status</label>
            <Select
              value={form.status}
              onChange={(e) => set({ status: e.target.value as 'active' | 'inactive' })}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-blk cursor-pointer">
            <input
              type="checkbox"
              checked={form.enablePortal}
              onChange={(e) => set({ enablePortal: e.target.checked })}
              className="accent-bl"
            />
            Enable portal access now (sends WhatsApp OTP welcome)
          </label>

          {feedback && (
            <p className={`text-sm ${feedback.ok ? 'text-green' : 'text-red-500'}`}>
              {feedback.text}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={submit} disabled={busy}>
              {busy ? 'Enrolling...' : 'Enrol Student'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
