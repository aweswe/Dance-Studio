'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Users, Clock, UserCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createProgramme, createBatch } from '@/actions/classes'
import { formatTime } from '@/lib/utils/format'

type Programme = any
type Batch = any
type Instructor = any

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function BatchManager({
  initialProgrammes,
  initialBatches,
  instructors
}: {
  initialProgrammes: Programme[],
  initialBatches: Batch[],
  instructors: Instructor[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'batches' | 'programmes'>('batches')
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [isProgrammeModalOpen, setIsProgrammeModalOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  // New batch form
  const [batchForm, setBatchForm] = useState({
    programmeId: '',
    instructorId: '',
    name: '',
    days: [] as string[],
    timeStart: '17:00',
    timeEnd: '18:00',
    capacity: '25',
  })

  // New programme form
  const [progForm, setProgForm] = useState({
    name: '',
    description: '',
    includes: '',
    feesMonthly: '2000',
    feesQuarterly: '5000',
    ageGroup: '',
  })

  const toggleDay = (day: string) => {
    setBatchForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }))
  }

  const submitBatch = async () => {
    setBusy(true)
    setFeedback(null)
    const res = await createBatch({
      programmeId: batchForm.programmeId,
      instructorId: batchForm.instructorId,
      name: batchForm.name,
      days: batchForm.days,
      timeStart: batchForm.timeStart,
      timeEnd: batchForm.timeEnd,
      capacity: Number(batchForm.capacity),
      status: 'active',
    })
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: 'Batch created' })
      setIsBatchModalOpen(false)
      setBatchForm({ programmeId: '', instructorId: '', name: '', days: [], timeStart: '17:00', timeEnd: '18:00', capacity: '25' })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not create batch' })
    }
  }

  const submitProgramme = async () => {
    setBusy(true)
    setFeedback(null)
    const res = await createProgramme({
      name: progForm.name,
      description: progForm.description,
      includes: progForm.includes.split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
      feesMonthly: Number(progForm.feesMonthly),
      feesQuarterly: Number(progForm.feesQuarterly),
      ageGroup: progForm.ageGroup,
      isActive: true,
    })
    setBusy(false)
    if (res.success) {
      setFeedback({ ok: true, text: 'Programme created' })
      setIsProgrammeModalOpen(false)
      setProgForm({ name: '', description: '', includes: '', feesMonthly: '2000', feesQuarterly: '5000', ageGroup: '' })
      router.refresh()
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Could not create programme' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-line-strong">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 text-sm font-display tracking-[1px] uppercase transition-colors focus-visible:focus-ring active:scale-[0.98] ${
            activeTab === 'batches' ? 'border-b-2 border-bl text-bl-ink' : 'text-ink-2 hover:text-ink'
          }`}
        >
          Batches
        </button>
        <button
          onClick={() => setActiveTab('programmes')}
          className={`pb-3 text-sm font-display tracking-[1px] uppercase transition-colors focus-visible:focus-ring active:scale-[0.98] ${
            activeTab === 'programmes' ? 'border-b-2 border-bl text-bl-ink' : 'text-ink-2 hover:text-ink'
          }`}
        >
          Programmes
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">
          {activeTab === 'batches' ? 'Active Batches' : 'Academy Programmes'}
        </h3>
        <Button
          className="flex items-center gap-2"
          onClick={() => (activeTab === 'batches' ? setIsBatchModalOpen(true) : setIsProgrammeModalOpen(true))}
        >
          <Plus size={16} />
          {activeTab === 'batches' ? 'New Batch' : 'New Programme'}
        </Button>
      </div>

      {feedback && (
        <p className={`text-sm ${feedback.ok ? 'text-green-ink' : 'text-danger'}`}>{feedback.text}</p>
      )}

      {activeTab === 'batches' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBatches?.map((batch: any) => (
            <Card key={batch.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">{batch.programme?.name}</Badge>
                  <h4 className="font-display text-2xl text-ink">
                    {batch.name || `${batch.programme?.name} · ${batch.days?.join(', ')}`}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm text-ink-2">
                  <Users size={16} className="text-bl" />
                  <span>{batch.enrolled_count || 0} / {batch.capacity} Students</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-2">
                  <Clock size={16} className="text-gold" />
                  <span>
                    {formatTime(batch.time_start)} - {formatTime(batch.time_end)} ({batch.days?.join(', ')})
                  </span>
                </div>
                {batch.instructor?.name && (
                  <div className="flex items-center gap-3 text-sm text-ink-2">
                    <UserCircle size={16} className="text-purp" />
                    <span>{batch.instructor.name}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
          {(!initialBatches || initialBatches.length === 0) && (
            <div className="col-span-full py-12 text-center text-ink-2 bg-canvas-muted rounded-[16px]">
              No batches available. Create one to get started.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialProgrammes?.map((prog: any) => (
            <Card key={prog.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-display text-xl text-ink">{prog.name}</h4>
                <Badge variant={prog.is_active ? 'green' : 'default'}>
                  {prog.is_active ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <p className="text-sm text-ink-2 line-clamp-2">{prog.description}</p>
              <div className="mt-4 text-xs text-ink-2 space-y-1">
                <p>Monthly: ₹{prog.fees_monthly} · Quarterly: ₹{prog.fees_quarterly}</p>
                {prog.age_group && <p>Ages: {prog.age_group}</p>}
              </div>
            </Card>
          ))}
          {(!initialProgrammes || initialProgrammes.length === 0) && (
            <div className="col-span-full py-12 text-center text-ink-2 bg-canvas-muted rounded-[16px]">
              No programmes available. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* New Batch modal */}
      <Modal isOpen={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} title="New Batch" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink-2 mb-1">Programme</label>
            <Select
              value={batchForm.programmeId}
              onChange={(e) => setBatchForm({ ...batchForm, programmeId: e.target.value })}
              placeholder="Select a programme"
              options={(initialProgrammes ?? []).map((p: any) => ({ value: p.id, label: p.name }))}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Instructor</label>
            <Select
              value={batchForm.instructorId}
              onChange={(e) => setBatchForm({ ...batchForm, instructorId: e.target.value })}
              placeholder="Select an instructor"
              options={(instructors ?? []).map((i: any) => ({ value: i.id, label: i.name }))}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Batch Name</label>
            <Input
              placeholder="e.g., Kids Dance · Mon–Wed 5–6 PM"
              value={batchForm.name}
              onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Days</label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:focus-ring active:scale-[0.98] ${
                    batchForm.days.includes(day)
                      ? 'bg-bl text-wh border-bl'
                      : 'border-line-strong text-ink-2 hover:border-bl'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink-2 mb-1">Start Time</label>
              <Input
                type="time"
                value={batchForm.timeStart}
                onChange={(e) => setBatchForm({ ...batchForm, timeStart: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-ink-2 mb-1">End Time</label>
              <Input
                type="time"
                value={batchForm.timeEnd}
                onChange={(e) => setBatchForm({ ...batchForm, timeEnd: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Capacity</label>
            <Input
              type="number"
              min={1}
              value={batchForm.capacity}
              onChange={(e) => setBatchForm({ ...batchForm, capacity: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={submitBatch} disabled={busy}>
              {busy ? 'Creating...' : 'Create Batch'}
            </Button>
            <Button variant="outline" onClick={() => setIsBatchModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* New Programme modal */}
      <Modal isOpen={isProgrammeModalOpen} onClose={() => setIsProgrammeModalOpen(false)} title="New Programme" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink-2 mb-1">Name</label>
            <Input
              placeholder="e.g., Bollywood Basics"
              value={progForm.name}
              onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Description</label>
            <textarea
              className="w-full h-24 bg-surface border border-line-strong rounded-control px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-1 focus:ring-bl/20 transition-all resize-none"
              value={progForm.description}
              onChange={(e) => setProgForm({ ...progForm, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">What&apos;s Included (one per line or comma-separated)</label>
            <textarea
              className="w-full h-20 bg-surface border border-line-strong rounded-control px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-1 focus:ring-bl/20 transition-all resize-none"
              value={progForm.includes}
              onChange={(e) => setProgForm({ ...progForm, includes: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink-2 mb-1">Monthly Fee (₹)</label>
              <Input
                type="number"
                min={0}
                value={progForm.feesMonthly}
                onChange={(e) => setProgForm({ ...progForm, feesMonthly: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-ink-2 mb-1">Quarterly Fee (₹)</label>
              <Input
                type="number"
                min={0}
                value={progForm.feesQuarterly}
                onChange={(e) => setProgForm({ ...progForm, feesQuarterly: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1">Age Group</label>
            <Input
              placeholder="e.g., 5+ Years"
              value={progForm.ageGroup}
              onChange={(e) => setProgForm({ ...progForm, ageGroup: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={submitProgramme} disabled={busy}>
              {busy ? 'Creating...' : 'Create Programme'}
            </Button>
            <Button variant="outline" onClick={() => setIsProgrammeModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
