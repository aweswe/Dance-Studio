import { ReactNode } from 'react'
import { Sidebar } from '@/components/admin/sidebar'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email ?? 'Admin'
  const initial = (email[0] ?? 'A').toUpperCase()

  return (
    <div className="min-h-screen bg-light flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {!process.env.WHATSAPP_API_KEY && (
          <div className="bg-gold/15 border-b border-gold/40 text-gold px-6 py-2 text-xs font-medium">
            WhatsApp messaging is in TEST MODE — messages are logged, not sent. Add
            <code className="mx-1 bg-gold/10 px-1.5 py-0.5 rounded">WHATSAPP_API_KEY</code>
            to go live.
          </div>
        )}
        <header className="h-16 bg-wh border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
          <h1 className="font-display text-xl text-blk tracking-wide">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-body text-mu">{email}</span>
            <div className="w-8 h-8 rounded-full bg-bl flex items-center justify-center text-wh font-display">{initial}</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
