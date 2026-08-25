'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Calendar as CalendarIcon, Clock, Mail, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { confirmRental, cancelRental } from '@/actions/rentals'
import { formatDate, formatTime, telLink } from '@/lib/utils/format'

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
  const [view, setView] = useState<'list' | 'month'>('month')
  const [filter, setFilter] = useState<'pending' | 'confirmed' | 'cancelled' | 'all'>('pending')
  const [busy, setBusy] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, { ok: boolean; text: string }>>({})
  const [declining, setDeclining] = useState<Rental | null>(null)

  // Month-grid navigation
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()) // 0-indexed

  const rentals = initialRentals || []

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
            : (wa && !wa.success ? 'Declined — but WhatsApp notify failed' : 'Declined — renter notified on WhatsApp'),
        },
      }))
      router.refresh()
    } else {
      setResults((r) => ({ ...r, [id]: { ok: false, text: res.error ?? 'Action failed' } }))
    }
  }

  const phoneLinks = (r: Rental) => (
    <span className="inline-flex items-center gap-1">
      <a href={telLink(r.phone)} className="hover:text-blk" aria-label={`Call ${r.name}`}>
        <Phone size={12} />
      </a>
      <a
        href={`https://wa.me/91${r.phone.replace(/\D/g, '').replace(/^91/, '')}`}
        target="_blank"
        rel="noreferrer"
        className="hover:text-green"
        aria-label={`WhatsApp ${r.name}`}
      >
        <MessageCircle size={12} />
      </a>
    </span>
  )

  // ---------- Month grid ----------
  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay() // 0 = Sun
  const monthKey = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const monthGrid = (
    <Card className="p-6 bg-wh">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-blk">
          {new Date(year, month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-full border border-gray-200 text-mu hover:border-bl transition-colors"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <Button variant="outline" className="text-xs py-1.5" onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()) }}>
            Today
          </Button>
          <button
            className="p-1.5 rounded-full border border-gray-200 text-mu hover:border-bl transition-colors"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-[10px] font-display tracking-[2px] text-mu uppercase py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`pad-${i}`} className="min-h-[96px] bg-light/40 rounded-lg" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const key = monthKey(day)
          const dayRentals = rentals
            .filter((r) => r.preferred_date.slice(0, 10) === key)
            .sort((a, b) => a.preferred_time_start.localeCompare(b.preferred_time_start))
          const isToday = key === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
          return (
            <div
              key={key}
              className={`min-h-[96px] rounded-lg border p-1.5 flex flex-col gap-1 ${
                isToday ? 'border-bl bg-blp/20' : 'border-gray-100 bg-light/40'
              }`}
            >
              <span className={`text-[11px] font-semibold ${isToday ? 'text-bl' : 'text-mu'}`}>{day}</span>
              {dayRentals.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  title={`${r.name} · ${formatTime(r.preferred_time_start)} - ${formatTime(r.preferred_time_end)}`}
                  className={`text-[10px] leading-tight px-1.5 py-1 rounded truncate ${
                    r.status === 'confirmed'
                      ? 'bg-green/15 text-green'
                      : r.status === 'cancelled'
                        ? 'bg-gray-200 text-mu line-through'
                        : 'bg-gold/15 text-gold'
                  }`}
                >
                  {r.preferred_time_start.slice(0, 5)} {r.name}
                </div>
              ))}
              {dayRentals.length > 3 && (
                <span className="text-[10px] text-mu">+{dayRentals.length - 3} more</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-mu">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gold/30" /> Pending</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green/30" /> Confirmed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200" /> Declined</span>
      </div>
    </Card>
  )

  // ---------- List view ----------
  const listView = (
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

      {rentals.filter((r) => filter === 'all' || r.status === filter).length === 0 ? (
        <div className="text-center text-mu py-16">
          <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>No {filter === 'all' ? '' : filter + ' '}requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.filter((r) => filter === 'all' || r.status === filter).map((r) => (
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
                <div className="flex items-center gap-1">{phoneLinks(r)} <span>{r.phone}</span></div>
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
                    onClick={() => setDeclining(r)}
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
  )

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['month', 'list'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              view === v ? 'bg-bl text-wh border-bl' : 'border-gray-200 text-mu hover:border-bl'
            }`}
          >
            {v === 'month' ? 'Month View' : 'List View'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className={view === 'month' ? 'xl:col-span-4' : 'xl:col-span-3'}>
          {view === 'month' ? monthGrid : listView}
        </div>

        {view === 'list' && (
          <div className="space-y-4">
            <h3 className="font-display text-xl text-blk">Pending Requests</h3>
            {rentals.filter((r) => r.status === 'pending').map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blk">{r.name}</h4>
                  <Badge variant="gold" className="text-[10px]">PENDING</Badge>
                </div>
                <div className="space-y-1 mb-3 text-sm text-mu">
                  <div className="flex items-center gap-1">{phoneLinks(r)} <span>{r.phone}</span></div>
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
                    onClick={() => setDeclining(r)}
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            ))}
            {rentals.filter((r) => r.status === 'pending').length === 0 && (
              <Card className="p-4 text-sm text-mu text-center">Nothing pending. 🎉</Card>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={declining !== null}
        onClose={() => setDeclining(null)}
        onConfirm={() => {
          if (declining) {
            const id = declining.id
            setDeclining(null)
            act(id, false)
          }
        }}
        busy={declining !== null && !!busy[declining.id]}
        danger
        title="Decline this request?"
        confirmLabel="Decline"
        description={`${declining?.name ?? 'The renter'}'s request for ${declining ? formatDate(declining.preferred_date, 'long') : ''} will be marked declined and they'll be notified on WhatsApp.`}
      />
    </div>
  )
}
