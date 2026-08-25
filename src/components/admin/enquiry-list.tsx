'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateEnquiryStatus } from '@/actions/enquiries'
import { formatDate, telLink } from '@/lib/utils/format'

interface Enquiry {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  source: string | null
  status: string
  created_at: string
}

const STATUS_BADGE: Record<string, { variant: 'gold' | 'green' | 'default'; label: string }> = {
  new: { variant: 'gold', label: 'NEW' },
  contacted: { variant: 'green', label: 'CONTACTED' },
  closed: { variant: 'default', label: 'CLOSED' },
}

export function EnquiryList({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'new' | 'contacted' | 'closed' | 'all'>('all')
  const [busy, setBusy] = useState<Record<string, boolean>>({})

  const enquiries = (initialEnquiries || []).filter((e) => filter === 'all' || e.status === filter)

  const setStatus = async (id: string, status: string) => {
    setBusy((b) => ({ ...b, [id]: true }))
    await updateEnquiryStatus(id, status)
    setBusy((b) => ({ ...b, [id]: false }))
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['all', 'new', 'contacted', 'closed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:focus-ring active:scale-[0.98] ${
              filter === f ? 'bg-bl text-wh border-bl' : 'border-line-strong text-ink-2 hover:border-bl'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {enquiries.length === 0 ? (
        <Card className="p-12 text-center text-ink-2 text-sm">
          No enquiries{filter !== 'all' ? ` with status "${filter}"` : ''} yet.
        </Card>
      ) : (
        enquiries.map((e) => {
          const badge = STATUS_BADGE[e.status] ?? STATUS_BADGE.new
          return (
            <Card key={e.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-ink">{e.name}</h4>
                    <Badge variant={badge.variant} className="text-[10px]">{badge.label}</Badge>
                  </div>
                  <p className="text-xs text-ink-2 mt-0.5">{formatDate(e.created_at, 'long')}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-ink-2">Mark as:</span>
                  <Select
                    value={e.status}
                    onChange={(ev) => setStatus(e.id, ev.target.value)}
                    options={[
                      { label: 'New', value: 'new' },
                      { label: 'Contacted', value: 'contacted' },
                      { label: 'Closed', value: 'closed' },
                    ]}
                  />
                  {busy[e.id] && <span className="text-ink-2 text-[10px]">saving…</span>}
                </div>
              </div>

              <p className="text-sm text-ink/80 leading-relaxed mb-3 whitespace-pre-wrap">{e.message}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-2">
                <a href={telLink(e.phone)} className="flex items-center gap-1.5 hover:text-ink transition-colors focus-visible:focus-ring active:scale-[0.98]">
                  <Phone size={13} /> {e.phone}
                </a>
                {e.email && (
                  <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 hover:text-ink transition-colors focus-visible:focus-ring active:scale-[0.98]">
                    <Mail size={13} /> {e.email}
                  </a>
                )}
                <a
                  href={`https://wa.me/91${e.phone.replace(/\D/g, '').replace(/^91/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-green-ink hover:underline focus-visible:focus-ring active:scale-[0.98]"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </Card>
          )
        })
      )}
    </div>
  )
}
