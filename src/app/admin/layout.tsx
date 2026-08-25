import { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email ?? 'Admin'
  const initial = (email[0] ?? 'A').toUpperCase()

  const banner = !process.env.WHATSAPP_API_KEY ? (
    <div className="bg-gold/15 border-b border-gold/40 text-gold px-6 py-2 text-xs font-medium">
      WhatsApp messaging is in TEST MODE — messages are logged, not sent. Add
      <code className="mx-1 bg-gold/10 px-1.5 py-0.5 rounded">WHATSAPP_API_KEY</code>
      to go live.
    </div>
  ) : null

  return (
    <AdminShell email={email} initial={initial} banner={banner}>
      {children}
    </AdminShell>
  )
}
