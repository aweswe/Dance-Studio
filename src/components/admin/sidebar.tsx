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
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useState } from 'react'

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

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button 
        className="md:hidden fixed bottom-4 right-4 z-50 bg-bl text-wh p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-wh border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen md:shrink-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 shrink-0">
          <Link href="/admin" className="font-display text-2xl text-blk tracking-widest block">
            RHYTHMZZ<span className="text-bl">.</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-8">
          {navGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-3 text-xs font-display tracking-[5px] text-mu uppercase mb-3">
                {group.label}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-colors relative",
                          isActive 
                            ? "text-bl bg-blp font-medium" 
                            : "text-blk hover:bg-gray-100"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-bl rounded-r-full" />
                        )}
                        <item.icon size={18} className={isActive ? "text-bl" : "text-mu"} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 shrink-0">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-mu hover:bg-gray-100 hover:text-blk transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-blk/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
