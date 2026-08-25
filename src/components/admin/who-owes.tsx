'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle } from 'lucide-react'
import { sendFeeReminder } from '@/actions/fees'
import { formatCurrency, telLink } from '@/lib/utils/format'

export interface WhoOwesStudent {
  id: string
  name: string
  phone: string
  programmeName: string
  amount: number
}

/** Students whose current month is uncovered — the honest "who owes" list,
 *  with one-tap call and WhatsApp reminder. */
export function WhoOwes({ students }: { students: WhoOwesStudent[] }) {
  const [state, setState] = useState<Record<string, string>>({})

  return (
    <div className="bg-wh rounded-[16px] shadow-sm border border-amber-200 overflow-hidden">
      <div className="p-4 border-b border-amber-200 bg-amber-50 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg text-blk tracking-wide">Who Owes This Month</h3>
          <p className="text-sm text-mu mt-0.5">
            {students.length === 0
              ? 'Everyone is covered — no pending fees right now.'
              : `${students.length} active student${students.length === 1 ? '' : 's'} with the current month uncovered.`}
          </p>
        </div>
      </div>

      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-light border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-display tracking-[2px] text-mu uppercase">Student</th>
                <th className="px-6 py-3 text-xs font-display tracking-[2px] text-mu uppercase">Programme</th>
                <th className="px-6 py-3 text-xs font-display tracking-[2px] text-mu uppercase">Amount</th>
                <th className="px-6 py-3 text-xs font-display tracking-[2px] text-mu uppercase">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-light/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-blk">{s.name}</td>
                  <td className="px-6 py-3 text-sm text-mu">{s.programmeName}</td>
                  <td className="px-6 py-3 font-medium">{formatCurrency(s.amount)}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={telLink(s.phone)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-bl hover:underline"
                      >
                        <Phone size={14} /> {s.phone}
                      </a>
                      <Button
                        variant="outline"
                        className="text-xs shrink-0"
                        disabled={!!state[s.id]}
                        onClick={async () => {
                          setState((m) => ({ ...m, [s.id]: 'sending' }))
                          const res = await sendFeeReminder(s.id)
                          setState((m) => ({ ...m, [s.id]: res.success ? 'sent' : 'failed' }))
                        }}
                      >
                        <MessageCircle size={14} className="mr-1.5" />
                        {state[s.id] === 'sending' ? 'Sending…' : state[s.id] === 'sent' ? '✓ Sent' : state[s.id] === 'failed' ? 'Retry' : 'Remind'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
