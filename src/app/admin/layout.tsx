import { ReactNode } from 'react'
import { Sidebar } from '@/components/admin/sidebar'

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-light flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-wh border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
          <h1 className="font-display text-xl text-blk tracking-wide">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-body text-mu">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-bl flex items-center justify-center text-wh font-display">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
