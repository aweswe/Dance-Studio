'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Send, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { sendBroadcast, estimateBroadcastReach } from '@/actions/broadcast'

interface ProgrammeOption { id: string; name: string }
interface BatchOption { id: string; name: string | null; programme: { name: string } | null }

export function BroadcastComposer({
  programmes,
  batches,
}: {
  programmes: ProgrammeOption[]
  batches: BatchOption[]
}) {
  const router = useRouter()
  const [scope, setScope] = useState('all')
  const [scopeId, setScopeId] = useState('')
  const [message, setMessage] = useState('')
  const [reach, setReach] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const updateScope = async (nextScope: string, nextScopeId: string) => {
    setScope(nextScope)
    setScopeId(nextScopeId)
    setReach(null)
    setResult(null)
    const { count } = await estimateBroadcastReach(nextScope, nextScopeId)
    setReach(count)
  }

  const send = async () => {
    setConfirmOpen(false)
    setBusy(true)
    setResult(null)
    const res = await sendBroadcast(scope, scopeId, message)
    setBusy(false)
    if (res.success) {
      setResult({
        ok: true,
        text: `Queued for ${res.count} of ${res.total} active students — messages go out within 5 minutes.`,
      })
      router.refresh()
    } else {
      setResult({ ok: false, text: res.error ?? 'Broadcast failed' })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="font-display text-xl text-blk mb-6">Compose Message</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blk mb-1">Target Audience</label>
              <Select
                value={scope}
                onChange={(e) => updateScope(e.target.value, e.target.value === 'all' ? '' : scopeId)}
                options={[
                  { label: 'All Active Students', value: 'all' },
                  { label: 'Specific Programme...', value: 'programme' },
                  { label: 'Specific Batch...', value: 'batch' },
                ]}
              />
            </div>

            {scope !== 'all' && (
              <div>
                <label className="block text-sm font-medium text-blk mb-1">
                  {scope === 'programme' ? 'Programme' : 'Batch'}
                </label>
                <Select
                  value={scopeId}
                  onChange={(e) => updateScope(scope, e.target.value)}
                  placeholder={scope === 'programme' ? 'Select a programme' : 'Select a batch'}
                  options={
                    scope === 'programme'
                      ? programmes.map((p) => ({ value: p.id, label: p.name }))
                      : batches.map((b) => ({
                          value: b.id,
                          label: `${b.programme?.name ?? ''} — ${b.name ?? ''}`.trim(),
                        }))
                  }
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blk mb-1">Message Content</label>
              <textarea
                className="w-full h-40 p-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-bl resize-none"
                placeholder="Type your broadcast message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
              />
              <p className="text-xs text-mu mt-1 text-right">{message.length}/1000</p>
            </div>

            {result && (
              <p className={`text-sm ${result.ok ? 'text-green' : 'text-red-500'}`}>{result.text}</p>
            )}

            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setConfirmOpen(true)}
              disabled={busy || message.trim().length === 0 || (scope !== 'all' && !scopeId)}
            >
              <Send size={16} /> {busy ? 'Sending...' : 'Send Broadcast'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-light border-dashed">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blp flex items-center justify-center text-bl">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-medium text-blk">Estimated Reach</h4>
              <p className="text-sm text-mu">
                {reach === null ? 'Pick a target to estimate' : `${reach} Students`}
              </p>
            </div>
          </div>
          <p className="text-xs text-mu">
            The actual number of recipients will depend on valid phone numbers and WhatsApp opt-in status.
          </p>
        </Card>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={send}
        busy={busy}
        title="Send this broadcast?"
        confirmLabel="Send"
        description={
          reach === null
            ? `This will message every active student${scope !== 'all' ? ' in the selected ' + scope : ''} on WhatsApp.`
            : `This will message up to ${reach} active student${reach === 1 ? '' : 's'}${scope !== 'all' ? ' in the selected ' + scope : ''} on WhatsApp.`
        }
      />
    </div>
  )
}
