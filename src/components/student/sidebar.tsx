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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/lib/utils/constants";
import { Button } from "@/components/ui/button";

interface StudentSidebarProps {
  studentName: string;
  isKuchipudi: boolean;
}

export function StudentSidebar({ studentName, isKuchipudi }: StudentSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: ROUTES.student, icon: LayoutDashboard },
    { name: "Schedule", href: `${ROUTES.student}/schedule`, icon: Calendar },
    { name: "Attendance", href: `${ROUTES.student}/attendance`, icon: CheckSquare },
    { name: "Fees", href: `${ROUTES.student}/fees`, icon: CreditCard },
    { name: "Notices", href: `${ROUTES.student}/notices`, icon: Bell },
  ];

  if (isKuchipudi) {
    navItems.push({ name: "Progress", href: `${ROUTES.student}/progress`, icon: Award });
  }

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-deep text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-deep text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="font-display text-2xl tracking-[2px]">RHYTHMZZ</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bl flex items-center justify-center font-bold">
              {studentName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{studentName}</p>
              <p className="text-xs text-white/60">Student</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== ROUTES.student && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-bl"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action="/auth/signout" method="post">
            <Button variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/5 justify-start px-4">
              <LogOut size={18} />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
