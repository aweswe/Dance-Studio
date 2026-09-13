'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCircle,
  CalendarCheck,
  IndianRupee,
  MessageSquare,
  Inbox,
  Calendar,
  Image as ImageIcon,
  Settings,
  FileText,
  LogOut,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { triggerActionLoader } from '@/components/shared/navigation-progress'

const navGroups = [
  {
    label: 'Studio',
    items: [
      { name: 'Today', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'People',
    items: [
      { name: 'Students', href: '/admin/students', icon: Users },
      { name: 'Classes', href: '/admin/classes', icon: GraduationCap },
      { name: 'Instructors', href: '/admin/instructors', icon: UserCircle },
    ],
  },
  {
    label: 'Desk',
    items: [
      { name: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
      { name: 'Fees', href: '/admin/fees', icon: IndianRupee },
      { name: 'Broadcast', href: '/admin/broadcast', icon: MessageSquare },
      { name: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
    ],
  },
  {
    label: 'Site',
    items: [
      { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
      { name: 'Blog', href: '/admin/blog', icon: FileText },
      { name: 'Content', href: '/admin/content', icon: Settings },
      { name: 'Studio rental', href: '/admin/studio-rental', icon: Calendar },
      { name: 'Annual day', href: '/admin/events', icon: Calendar },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningOut(true)
    triggerActionLoader("Signing out")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      await supabase.auth.signOut().catch(() => {})
    } catch {}
    document.cookie = "bypass_student=; path=/; max-age=0;"
    try {
      await fetch("/auth/signout", { method: "POST" }).catch(() => {})
    } catch {}
    window.location.href = "/"
  }

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-[15.5rem] bg-canvas border-r border-line transform transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] md:translate-x-0 md:static md:h-dvh md:shrink-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-5 pt-5 pb-4 shrink-0">
          <Link href="/admin" className="block focus-visible:focus-ring rounded-lg">
            <p className="font-anton text-xl text-ink tracking-tight">Rhythmzz</p>
            <p className="text-[11px] text-ink-3 mt-0.5">Front desk</p>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-[11px] text-ink-3">{group.label}</p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 min-h-11 px-3 rounded-xl text-sm font-medium focus-visible:focus-ring",
                          isActive
                            ? "bg-surface-card text-ink shadow-lift"
                            : "text-ink-2 hover:bg-canvas-muted hover:text-ink"
                        )}
                      >
                        <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-bl" : "text-ink-3"} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-line shrink-0">
          <form action="/auth/signout" method="post" onSubmit={handleSignOut}>
            <button
              type="submit"
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 min-h-11 px-3 rounded-xl text-sm text-ink-2 hover:bg-canvas-muted hover:text-ink focus-visible:focus-ring disabled:opacity-50"
            >
              {isSigningOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} strokeWidth={1.5} />}
              {isSigningOut ? "Signing out" : "Sign out"}
            </button>
          </form>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
    </>
  )
}
