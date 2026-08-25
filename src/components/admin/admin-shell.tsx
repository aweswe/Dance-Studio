"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GsapProvider } from "@/components/motion/gsap-provider";

interface AdminShellProps {
  email: string;
  initial: string;
  banner?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Admin layout shell: surface sidebar + topbar with hamburger (mobile),
 * theme toggle and account chip. The hamburger lives in the topbar and
 * shares the drawer state with the sidebar — same anatomy as the portals.
 */
export function AdminShell({ email, initial, banner, children }: AdminShellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas-muted flex flex-col md:flex-row">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {banner}
        <header className="h-16 bg-surface border-b border-line flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 -ml-1 text-ink rounded-sm relative z-50 hover:bg-canvas-muted transition-colors focus-visible:focus-ring active:scale-95"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display text-xl text-ink tracking-wide truncate">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <span className="text-sm font-body text-ink-2 hidden sm:block">{email}</span>
            <div className="w-8 h-8 rounded-full bg-bl flex items-center justify-center text-wh font-display">{initial}</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <GsapProvider>{children}</GsapProvider>
        </main>
      </div>
    </div>
  );
}
