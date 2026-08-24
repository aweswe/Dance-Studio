'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Clock, Mail, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { confirmRental, cancelRental } from '@/actions/rentals'
import { formatDate, formatTime } from '@/lib/utils/format'

interface Rental {
  id: string
  name: string
  phone: string
  email: string | null
  preferred_date: string
  preferred_time_start: string
  preferred_time_end: string
  status: 'pending' | 'confirmed' | 'cancelled'
  admin_notes: string | null
  created_at: string
}

export function RentalCalendar({ initialRentals }: { initialRentals: Rental[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'pending' | 'confirmed' | 'cancelled' | 'all'>('pending')
  const [busy, setBusy] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, { ok: boolean; text: string }>>({})

  const rentals = (initialRentals || []).filter((r) => filter === 'all' || r.status === filter)

  const act = async (id: string, approve: boolean) => {
    setBusy((b) => ({ ...b, [id]: true }))
    setResults((r) => { const n = { ...r }; delete n[id]; return n })
    const res = approve ? await confirmRental(id) : await cancelRental(id)
    setBusy((b) => ({ ...b, [id]: false }))
    if (res.success) {
      const wa = (res as any).whatsapp
      setResults((r) => ({
        ...r,
        [id]: {
          ok: true,
          text: approve
            ? (wa && !wa.success ? 'Confirmed — but WhatsApp notify failed' : 'Confirmed — renter notified on WhatsApp')
            : 'Request declined',
        },
      }))
      router.refresh()
    } else {
      setResults((r) => ({ ...r, [id]: { ok: false, text: res.error ?? 'Action failed' } }))
    }
  }

  const statusVariant = (status: string) =>
    status === 'confirmed' ? 'green' : status === 'cancelled' ? 'default' : 'gold'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3">
        <Card className="p-6 min-h-[600px] bg-light border-dashed">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-blk">Requests</h3>
            <div className="flex gap-2">
              {(['pending', 'confirmed', 'cancelled', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    filter === f ? 'bg-bl text-wh border-bl' : 'border-gray-200 text-mu hover:border-bl'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {rentals.length === 0 ? (
            <div className="text-center text-mu py-16">
              <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p>No {filter === 'all' ? '' : filter + ' '}requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rentals.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-blk">{r.name}</h4>
                      <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded">
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-mu">Requested {formatDate(r.created_at)}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-mu mb-4">
                    <div className="flex items-center gap-1"><Phone size={12} /> {r.phone}</div>
                    {r.email && <div className="flex items-center gap-1"><Mail size={12} /> {r.email}</div>}
                    <div className="flex items-center gap-1"><CalendarIcon size={12} /> {formatDate(r.preferred_date, 'long')}</div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} /> {formatTime(r.preferred_time_start)} - {formatTime(r.preferred_time_end)}
                    </div>
                  </div>

                  {results[r.id] && (
                    <p className={`mb-3 text-xs ${results[r.id].ok ? 'text-green' : 'text-red-500'}`}>
                      {results[r.id].text}
                    </p>
                  )}

                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 text-xs py-2"
                        disabled={!!busy[r.id]}
                        onClick={() => act(r.id, true)}
                      >
                        {busy[r.id] ? 'Working...' : 'Approve'}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-xs py-2"
                        disabled={!!busy[r.id]}
                        onClick={() => act(r.id, false)}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-xl text-blk">Pending Requests</h3>
        {(initialRentals || []).filter((r) => r.status === 'pending').map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-blk">{r.name}</h4>
              <Badge variant="gold" className="text-[10px]">PENDING</Badge>
            </div>
            <div className="space-y-1 mb-3 text-sm text-mu">
              <div className="flex items-center gap-1"><CalendarIcon size={12} /> {formatDate(r.preferred_date, 'long')}</div>
              <div className="flex items-center gap-1"><Clock size={12} /> {formatTime(r.preferred_time_start)} - {formatTime(r.preferred_time_end)}</div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 text-xs py-2"
                disabled={!!busy[r.id]}
                onClick={() => act(r.id, true)}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-xs py-2"
                disabled={!!busy[r.id]}
                onClick={() => act(r.id, false)}
              >
                Decline
              </Button>
            </div>
          </Card>
        ))}
        {(initialRentals || []).filter((r) => r.status === 'pending').length === 0 && (
          <Card className="p-4 text-sm text-mu text-center">Nothing pending. 🎉</Card>
        )}
      </div>
    </div>
  )
}
