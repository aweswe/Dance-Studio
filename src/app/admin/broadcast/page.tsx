import { BroadcastComposer } from '@/components/admin/broadcast-composer'

export default function BroadcastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-blk tracking-wide">WhatsApp Broadcast</h2>
        <p className="text-mu font-body text-sm mt-1">Send targeted announcements and reminders to students.</p>
      </div>

      <BroadcastComposer />
    </div>
  )
}
