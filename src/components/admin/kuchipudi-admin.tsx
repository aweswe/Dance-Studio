'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { updateProgress } from '@/actions/kuchipudi'
import {
  KUCHIPUDI_LEVELS,
  KUCHIPUDI_LEVEL_LABELS,
  KUCHIPUDI_CURRICULUM,
  type KuchipudiLevel,
} from '@/lib/kuchipudi/curriculum'

interface ProgressRow {
  current_level: string | null
  modules_completed: string[] | null
}

/** Admin-side Kuchipudi module marking shown on the student detail page. */
export function KuchipudiAdmin({
  studentId,
  initialProgress,
}: {
  studentId: string
  initialProgress: ProgressRow | null
}) {
  const router = useRouter()
  const [level, setLevel] = useState(initialProgress?.current_level || 'foundation')
  const [modules, setModules] = useState<string[]>(
    Array.isArray(initialProgress?.modules_completed) ? (initialProgress.modules_completed as string[]) : [],
  )
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  const toggleModule = (name: string) => {
    setModules((prev) => (prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]))
  }

  const save = async () => {
    setBusy(true)
    setFeedback(null)
    const result = await updateProgress({ studentId, level, modules })
    setFeedback(result.success ? { ok: true, text: 'Progress saved.' } : { ok: false, text: result.error || 'Save failed.' })
    setBusy(false)
    router.refresh()
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-blk">Kuchipudi Progress</h3>
        <button
          onClick={save}
          disabled={busy}
          className="text-[11px] font-semibold tracking-[2px] uppercase px-5 py-2 bg-bl text-wh rounded disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save Progress'}
        </button>
      </div>

      <div className="mb-4 max-w-xs">
        <label className="block text-xs font-semibold text-mu mb-1.5 uppercase tracking-widest">Current Level</label>
        <Select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          options={KUCHIPUDI_LEVELS.map((l) => ({ label: KUCHIPUDI_LEVEL_LABELS[l as KuchipudiLevel], value: l }))}
        />
      </div>

      <div className="space-y-5">
        {KUCHIPUDI_LEVELS.map((l) => (
          <div key={l}>
            <p className="text-xs font-semibold text-mu uppercase tracking-widest mb-2">
              {KUCHIPUDI_LEVEL_LABELS[l as KuchipudiLevel]}
            </p>
            <div className="flex flex-wrap gap-2">
              {KUCHIPUDI_CURRICULUM[l as KuchipudiLevel].map((module) => {
                const checked = modules.includes(module)
                return (
                  <label
                    key={module}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                      checked ? 'border-bl/30 bg-blp/40 text-blk' : 'border-gray-200 text-mu hover:border-bl'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleModule(module)}
                      className="accent-bl"
                    />
                    {module}
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {feedback && (
        <p className={`text-sm mt-4 ${feedback.ok ? 'text-green' : 'text-red-500'}`}>{feedback.text}</p>
      )}
    </Card>
  )
}
