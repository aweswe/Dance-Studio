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
  Home,
  Layers,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/lib/utils/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { triggerActionLoader } from "@/components/shared/navigation-progress";

export type PortalRole = "student" | "instructor";

interface PortalShellProps {
  role: PortalRole;
  name: string;
  isKuchipudi?: boolean;
  unreadNotices?: number;
  children: React.ReactNode;
}

const STUDENT_NAV = [
  { name: "Home", href: ROUTES.student, icon: LayoutDashboard },
  { name: "Classes", href: `${ROUTES.student}/classes`, icon: Layers },
  { name: "Schedule", href: `${ROUTES.student}/schedule`, icon: Calendar },
  { name: "Attendance", href: `${ROUTES.student}/attendance`, icon: CheckSquare },
  { name: "Fees", href: `${ROUTES.student}/fees`, icon: CreditCard },
  { name: "Notices", href: `${ROUTES.student}/notices`, icon: Bell },
  { name: "Leave Academy", href: `${ROUTES.student}/leave`, icon: LogOut },
  { name: "Profile", href: `${ROUTES.student}/profile`, icon: User },
];

const INSTRUCTOR_NAV = [
  { name: "Home", href: ROUTES.instructor, icon: LayoutDashboard },
  { name: "Classes", href: `${ROUTES.instructor}/classes`, icon: BookOpen },
  { name: "Roster", href: `${ROUTES.instructor}/attendance`, icon: CheckSquare },
  { name: "Students", href: `${ROUTES.instructor}/students`, icon: Users },
];

function getPageLabel(pathname: string, role: PortalRole): string {
  if (role === "instructor") {
    if (pathname.includes("/classes")) return "Classes";
    if (pathname.includes("/attendance")) return "Roster";
    if (pathname.includes("/students")) return "Students";
    return "Today";
  }
  if (pathname === ROUTES.student || pathname === `${ROUTES.student}/`) return "Today";
  if (pathname.startsWith(`${ROUTES.student}/classes`)) return "Classes";
  if (pathname.startsWith(`${ROUTES.student}/schedule`)) return "Schedule";
  if (pathname.startsWith(`${ROUTES.student}/attendance`)) return "Attendance";
  if (pathname.startsWith(`${ROUTES.student}/fees`)) return "Fees";
  if (pathname.startsWith(`${ROUTES.student}/notices`)) return "Notices";
  if (pathname.startsWith(`${ROUTES.student}/leave`)) return "Leave Academy";
  if (pathname.startsWith(`${ROUTES.student}/profile`)) return "Profile";
  if (pathname.startsWith(`${ROUTES.student}/progress`)) return "Progress";
  return "Today";
}

export function PortalShell({ role, name, isKuchipudi, unreadNotices, children }: PortalShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const home = role === "instructor" ? ROUTES.instructor : ROUTES.student;
  const pageTitle = getPageLabel(pathname, role);
  const initial = name.charAt(0).toUpperCase() || (role === "instructor" ? "I" : "S");

  const navItems =
    role === "instructor"
      ? INSTRUCTOR_NAV
      : [...STUDENT_NAV, ...(isKuchipudi ? [{ name: "Progress", href: `${ROUTES.student}/progress`, icon: Award }] : [])];

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningOut(true);
    triggerActionLoader("Signing out");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut().catch(() => {});
    } catch {}
    document.cookie = "bypass_student=; path=/; max-age=0;";
    try {
      await fetch("/auth/signout", { method: "POST" }).catch(() => {});
    } catch {}
    window.location.href = "/";
  };

  return (
    <div className="min-h-dvh bg-canvas flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[15.5rem] bg-canvas border-r border-line flex flex-col transform transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-5 pt-5 pb-4 shrink-0">
          <Link href={home} className="block focus-visible:focus-ring rounded-md">
            <p className="font-anton text-xl text-ink tracking-tight">Rhythmzz</p>
            <p className="text-[11px] text-ink-3 mt-0.5">{role === "instructor" ? "Instructor" : "Student"}</p>
          </Link>
        </div>

        <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== home && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 min-h-11 px-3 rounded-md text-sm font-medium focus-visible:focus-ring",
                  isActive
                    ? "bg-surface-card text-ink shadow-lift"
                    : "text-ink-2 hover:bg-canvas-muted hover:text-ink",
                )}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-bl" : "text-ink-3"} />
                {item.name}
                {item.name === "Notices" && unreadNotices ? (
                  <span className="ml-auto text-[10px] font-semibold bg-bl text-white rounded-md px-1.5 py-0.5">
                    {unreadNotices}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-line shrink-0 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 min-h-11 px-3 rounded-md text-sm text-ink-2 hover:bg-canvas-muted hover:text-ink focus-visible:focus-ring"
          >
            <Home size={16} strokeWidth={1.5} />
            Studio site
          </Link>
          <form action="/auth/signout" method="post" onSubmit={handleSignOut}>
            <button
              type="submit"
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 min-h-11 px-3 rounded-md text-sm text-ink-2 hover:bg-canvas-muted hover:text-ink focus-visible:focus-ring disabled:opacity-50"
            >
              {isSigningOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} strokeWidth={1.5} />}
              {isSigningOut ? "Signing out" : "Sign out"}
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 md:ml-[15.5rem] flex flex-col min-w-0 overflow-x-hidden">
        <header className="h-14 sm:h-16 sticky top-0 z-50 flex items-center gap-3 px-3 sm:px-6 justify-between bg-canvas/90 backdrop-blur-md border-b border-line">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden min-h-11 min-w-11 inline-flex items-center justify-center text-ink rounded-md hover:bg-canvas-muted focus-visible:focus-ring"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="font-anton text-lg sm:text-xl text-ink tracking-tight truncate">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-2 border-l border-line">
              <span className="hidden sm:block text-sm font-medium text-ink truncate max-w-[9rem]">{name}</span>
              <div className="w-8 h-8 rounded-full bg-surface-raised border border-line text-ink text-xs font-semibold flex items-center justify-center">
                {initial}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} aria-hidden />
      )}
    </div>
  );
}
