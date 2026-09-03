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
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard }
    ]
  },
  {
    label: 'Management',
    items: [
      { name: 'Students', href: '/admin/students', icon: Users },
      { name: 'Classes', href: '/admin/classes', icon: GraduationCap },
      { name: 'Instructors', href: '/admin/instructors', icon: UserCircle }
    ]
  },
  {
    label: 'Operations',
    items: [
      { name: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
      { name: 'Fees', href: '/admin/fees', icon: IndianRupee },
      { name: 'Broadcast', href: '/admin/broadcast', icon: MessageSquare },
      { name: 'Enquiries', href: '/admin/enquiries', icon: Inbox }
    ]
  },
  {
    label: 'Content',
    items: [
      { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
      { name: 'Blog', href: '/admin/blog', icon: FileText },
      { name: 'Website Controls', href: '/admin/content', icon: Settings },
      { name: 'Studio Rental', href: '/admin/studio-rental', icon: Calendar }
    ]
  }
]

interface SidebarProps {
  /** Drawer open state (mobile) — owned by AdminShell. */
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningOut(true)
    triggerActionLoader("Logging out · Redirecting to Home...")
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
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-line transform transition-transform duration-250 ease-out-snap md:translate-x-0 md:static md:h-screen md:shrink-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 shrink-0">
          <Link href="/admin" className="font-display text-2xl text-ink tracking-widest block focus-visible:focus-ring rounded-sm">
            RHYTHMZZ<span className="text-bl">.</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-8">
          {navGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-3 text-xs font-display tracking-[5px] text-ink-2 uppercase mb-3">
                {group.label}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-colors relative focus-visible:focus-ring",
                          isActive
                            ? "text-bl-ink bg-bl-pale font-medium"
                            : "text-ink hover:bg-canvas-muted"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-bl rounded-r-full" aria-hidden />
                        )}
                        <item.icon size={18} className={isActive ? "text-bl" : "text-ink-2"} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-line shrink-0">
          <form 
            action="/auth/signout" 
            method="post"
            onSubmit={handleSignOut}
          >
            <button
              type="submit"
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-ink-2 hover:bg-canvas-muted hover:text-ink transition-colors focus-visible:focus-ring disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 size={18} className="animate-spin text-bl" />
              ) : (
                <LogOut size={18} />
              )}
              <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-blk/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
    </>
  )
}
