'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Send, Users } from 'lucide-react'

export function BroadcastComposer() {
  const [scope, setScope] = useState('all')
  const [template, setTemplate] = useState('custom')
  const [message, setMessage] = useState('')

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
                onChange={(e) => setScope(e.target.value)}
                options={[
                  { label: 'All Active Students', value: 'all' },
                  { label: 'Specific Programme...', value: 'programme' },
                  { label: 'Specific Batch...', value: 'batch' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blk mb-1">Message Template</label>
              <Select 
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                options={[
                  { label: 'Custom Message', value: 'custom' },
                  { label: 'Fee Reminder', value: 'fee' },
                  { label: 'Class Cancellation', value: 'cancel' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blk mb-1">Message Content</label>
              <textarea 
                className="w-full h-40 p-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-bl resize-none"
                placeholder="Type your broadcast message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <Button className="w-full flex items-center justify-center gap-2">
              <Send size={16} /> Send Broadcast
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
              <p className="text-sm text-mu">0 Students</p>
            </div>
          </div>
          <p className="text-xs text-mu">
            The actual number of recipients will depend on valid phone numbers and WhatsApp opt-in status.
          </p>
        </Card>
      </div>
    </div>
  )
}
