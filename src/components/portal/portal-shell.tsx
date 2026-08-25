"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  CreditCard,
  Bell,
  Award,
  User,
  LogOut,
  Menu,
  X,
  Users,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/lib/utils/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export type PortalRole = "student" | "instructor";

interface PortalShellProps {
  role: PortalRole;
  name: string;
  isKuchipudi?: boolean;
  children: React.ReactNode;
}

const STUDENT_NAV = [
  { name: "Dashboard", href: ROUTES.student, icon: LayoutDashboard },
  { name: "Schedule", href: `${ROUTES.student}/schedule`, icon: Calendar },
  { name: "Attendance", href: `${ROUTES.student}/attendance`, icon: CheckSquare },
  { name: "Fees", href: `${ROUTES.student}/fees`, icon: CreditCard },
  { name: "Notices", href: `${ROUTES.student}/notices`, icon: Bell },
  { name: "Profile", href: `${ROUTES.student}/profile`, icon: User },
];

const INSTRUCTOR_NAV = [
  { name: "Dashboard", href: ROUTES.instructor, icon: LayoutDashboard },
  { name: "My Classes", href: `${ROUTES.instructor}/classes`, icon: BookOpen },
  { name: "Mark Attendance", href: `${ROUTES.instructor}/attendance`, icon: CheckSquare },
  { name: "Students", href: `${ROUTES.instructor}/students`, icon: Users },
];

/**
 * Shared shell for the student and instructor portals: dark brand sidebar
 * (fixed, slides in on mobile) + surface topbar with wordmark, theme toggle
 * and avatar. The mobile hamburger lives inside the topbar and stays above
 * the overlay so the drawer can be toggled either way.
 */
export function PortalShell({ role, name, isKuchipudi, children }: PortalShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const home = role === "instructor" ? ROUTES.instructor : ROUTES.student;
  const roleLabel = role === "instructor" ? "Instructor" : "Student";
  const initial = name.charAt(0).toUpperCase() || (role === "instructor" ? "I" : "S");

  const navItems =
    role === "instructor"
      ? INSTRUCTOR_NAV
      : [...STUDENT_NAV, ...(isKuchipudi ? [{ name: "Progress", href: `${ROUTES.student}/progress`, icon: Award }] : [])];

  return (
    <div className="min-h-screen bg-canvas-muted flex">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-deep text-white transform transition-transform duration-250 ease-out-snap md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10 shrink-0">
          <h2 className="font-display text-2xl tracking-[2px]">RHYTHMZZ</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bl flex items-center justify-center font-bold">
              {initial}
            </div>
            <div>
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-white/60">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== home && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-colors relative focus-visible:focus-ring",
                  isActive
                    ? "bg-white/10 text-bl font-medium"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-bl rounded-r-full" aria-hidden />
                )}
                <Icon size={18} className={isActive ? "text-bl" : ""} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-white/70 hover:text-white hover:bg-white/5 transition-colors focus-visible:focus-ring"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Content column */}
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <header className="h-16 bg-surface border-b border-line flex items-center gap-3 px-4 md:px-8 justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -ml-1 text-ink rounded-sm relative z-50 hover:bg-canvas-muted transition-colors focus-visible:focus-ring active:scale-95"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href={home} className="font-display text-xl tracking-[2px] text-ink truncate">
              RHYTHMZZ<span className="text-bl">.</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <span className="hidden sm:block text-sm text-ink-2">{name}</span>
            <div className="w-8 h-8 rounded-full bg-bl flex items-center justify-center text-white font-display text-sm">
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-blk/50 z-30 md:hidden" onClick={() => setIsOpen(false)} aria-hidden />
      )}
    </div>
  );
}
