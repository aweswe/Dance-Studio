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
  Sparkles,
  ExternalLink,
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
  { name: "Classes & Batches", href: `${ROUTES.student}/classes`, icon: Sparkles },
  { name: "Schedule", href: `${ROUTES.student}/schedule`, icon: Calendar },
  { name: "Attendance", href: `${ROUTES.student}/attendance`, icon: CheckSquare },
  { name: "Fees & Receipts", href: `${ROUTES.student}/fees`, icon: CreditCard },
  { name: "Notices", href: `${ROUTES.student}/notices`, icon: Bell },
  { name: "My Profile", href: `${ROUTES.student}/profile`, icon: User },
];

const INSTRUCTOR_NAV = [
  { name: "Dashboard", href: ROUTES.instructor, icon: LayoutDashboard },
  { name: "My Classes", href: `${ROUTES.instructor}/classes`, icon: BookOpen },
  { name: "Mark Attendance", href: `${ROUTES.instructor}/attendance`, icon: CheckSquare },
  { name: "Students", href: `${ROUTES.instructor}/students`, icon: Users },
];

function getPageLabel(pathname: string, role: PortalRole): string {
  if (role === "instructor") {
    if (pathname.includes("/classes")) return "Instructor Classes";
    if (pathname.includes("/attendance")) return "Mark Attendance";
    if (pathname.includes("/students")) return "Student Directory";
    return "Instructor Dashboard";
  }
  if (pathname === ROUTES.student || pathname === `${ROUTES.student}/`) return "Student Dashboard";
  if (pathname.startsWith(`${ROUTES.student}/classes`)) return "Classes & Batches";
  if (pathname.startsWith(`${ROUTES.student}/schedule`)) return "Class Schedule";
  if (pathname.startsWith(`${ROUTES.student}/attendance`)) return "Attendance Record";
  if (pathname.startsWith(`${ROUTES.student}/fees`)) return "Fees & Receipts";
  if (pathname.startsWith(`${ROUTES.student}/notices`)) return "Academy Notices";
  if (pathname.startsWith(`${ROUTES.student}/profile`)) return "My Profile";
  if (pathname.startsWith(`${ROUTES.student}/progress`)) return "Kuchipudi Progress";
  return "Student Dashboard";
}

export function PortalShell({ role, name, isKuchipudi, children }: PortalShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const home = role === "instructor" ? ROUTES.instructor : ROUTES.student;
  const pageTitle = getPageLabel(pathname, role);
  const initial = name.charAt(0).toUpperCase() || (role === "instructor" ? "I" : "S");

  const navItems =
    role === "instructor"
      ? INSTRUCTOR_NAV
      : [...STUDENT_NAV, ...(isKuchipudi ? [{ name: "Progress", href: `${ROUTES.student}/progress`, icon: Award }] : [])];

  return (
    <div className="min-h-screen bg-canvas-muted flex">
      {/* Sidebar - Single Dynamic Logo */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-deep text-white transform transition-transform duration-250 ease-out-snap md:translate-x-0 flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Single Brand Logo with Dynamic Page Subtitle */}
        <div className="p-6 border-b border-white/10 shrink-0 bg-surface-dark/40">
          <Link href={home} className="group block focus-visible:focus-ring rounded">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-bl text-white flex items-center justify-center font-display font-black text-xl shadow-[0_0_20px_rgba(43,180,216,0.5)]">
                R
              </span>
              <div>
                <h2 className="font-display text-2xl tracking-[2px] text-white leading-none group-hover:text-bl transition-colors">
                  RHYTHMZZ<span className="text-bl">.</span>
                </h2>
                <p className="text-[10px] uppercase tracking-[1.5px] text-bl font-semibold mt-1">
                  {pageTitle}
                </p>
              </div>
            </div>
          </Link>

          {/* User Profile Pill */}
          <div className="mt-5 flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-bl flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{name}</p>
              <p className="text-[10px] text-white/50">{role === "instructor" ? "Instructor" : "Student"}</p>
            </div>
          </div>
        </div>

        {/* Home & Website quick link */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-white/70 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 transition-all group focus-visible:focus-ring"
          >
            <span className="flex items-center gap-2">
              <Home size={14} className="text-bl group-hover:scale-110 transition-transform" />
              Website Home
            </span>
            <ExternalLink size={12} className="text-white/40 group-hover:text-white/70" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase font-bold tracking-[1.5px] text-white/40 px-3 py-1.5">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== home && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative focus-visible:focus-ring",
                  isActive
                    ? "bg-bl/20 text-bl border border-bl/30 shadow-[0_0_15px_rgba(43,180,216,0.15)]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-bl rounded-r-full" aria-hidden />
                )}
                <Icon size={16} className={isActive ? "text-bl" : "text-white/60"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-surface-dark/20">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors focus-visible:focus-ring"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Content column */}
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        {/* Simple & Clean Header (No duplicate logo) */}
        <header className="h-16 bg-surface border-b border-line flex items-center gap-3 px-4 md:px-8 justify-between shrink-0 sticky top-0 z-30 backdrop-blur-md bg-surface/95">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -ml-1 text-ink rounded-lg hover:bg-canvas-muted transition-colors focus-visible:focus-ring active:scale-95 border border-line"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Clean Breadcrumb Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider hidden sm:inline shrink-0">Portal /</span>
              <h2 className="font-display text-base sm:text-lg text-ink font-bold tracking-wide truncate max-w-[140px] sm:max-w-none">
                {pageTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-ink-2 hover:text-bl px-2.5 py-1.5 rounded-lg hover:bg-canvas-muted transition-colors border border-transparent hover:border-line"
            >
              <Home size={14} />
              <span>Website</span>
            </Link>

            <ThemeToggle />

            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 border-l border-line">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-ink leading-tight">{name}</span>
                <span className="text-[10px] text-bl font-medium">{role === "instructor" ? "Instructor" : "Student"}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-bl flex items-center justify-center text-white font-display text-sm font-bold shadow-sm">
                {initial}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8">
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

