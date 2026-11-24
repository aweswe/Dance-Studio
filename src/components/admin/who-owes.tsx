'use client'

import { useState } from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { formatCurrency, telLink, whatsappDirectLink } from '@/lib/utils/format'
import { SITE_URL } from '@/lib/utils/constants'

export interface WhoOwesStudent {
  id: string
  name: string
  phone: string
  programmeName: string
  amount: number
}

/** Students whose current month is uncovered — the honest "who owes" list,
 *  with one-tap call and manual WhatsApp Business reminder link. */
export function WhoOwes({ students }: { students: WhoOwesStudent[] }) {
  const [reminded, setReminded] = useState<Record<string, boolean>>({})

  const currentMonth = new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-surface rounded-card border-2 border-slate-200 overflow-hidden shadow-2xs">
      <div className="p-4 border-b-2 border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg text-ink tracking-wide">Who Owes This Month</h3>
          <p className="text-sm text-ink-2 mt-0.5">
            {students.length === 0
              ? 'Everyone is covered — no pending fees right now.'
              : `${students.length} active student${students.length === 1 ? '' : 's'} with the current month uncovered.`}
          </p>
        </div>
      </div>

      {students.length > 0 && (
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[560px] text-left border-collapse">
            <thead>
              <tr className="bg-canvas-muted border-b border-line-strong">
                <th className="px-3 sm:px-6 py-2.5 sm:py-3 text-xs font-display tracking-[1.5px] sm:tracking-[2px] text-ink-2 uppercase">Student</th>
                <th className="px-3 sm:px-6 py-2.5 sm:py-3 text-xs font-display tracking-[1.5px] sm:tracking-[2px] text-ink-2 uppercase">Programme</th>
                <th className="px-3 sm:px-6 py-2.5 sm:py-3 text-xs font-display tracking-[1.5px] sm:tracking-[2px] text-ink-2 uppercase">Amount</th>
                <th className="px-3 sm:px-6 py-2.5 sm:py-3 text-xs font-display tracking-[1.5px] sm:tracking-[2px] text-ink-2 uppercase">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {students.map((s) => {
                const message = `Hi ${s.name}! Gentle reminder from Rhythmzz Academy of Dance: Your ${s.programmeName} fee of ${formatCurrency(s.amount)} for ${currentMonth} is due by the 7th. You can pay online anytime via PhonePe on your Student Portal: ${SITE_URL}/student/fees — let us know if you need any help!`
                const waUrl = whatsappDirectLink(s.phone, message)

                return (
                  <tr key={s.id} className="hover:bg-canvas-muted transition-colors">
                    <td className="px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-ink">{s.name}</td>
                    <td className="px-3 sm:px-6 py-2.5 sm:py-3 text-sm text-ink-2">{s.programmeName}</td>
                    <td className="px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-ink tabular-nums">{formatCurrency(s.amount)}</td>
                    <td className="px-3 sm:px-6 py-2.5 sm:py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={telLink(s.phone)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-bl hover:underline whitespace-nowrap"
                        >
                          <Phone size={13} /> {s.phone}
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setReminded((m) => ({ ...m, [s.id]: true }))}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-green/40 bg-green/10 text-green-ink hover:bg-green/20 text-xs font-semibold whitespace-nowrap transition-colors"
                        >
                          <MessageCircle size={14} />
                          {reminded[s.id] ? '✓ Opened WhatsApp' : 'WhatsApp Remind'}
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
