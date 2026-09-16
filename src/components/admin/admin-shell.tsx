"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GsapProvider } from "@/components/motion/gsap-provider";

interface AdminShellProps {
  email: string;
  initial: string;
  banner?: React.ReactNode;
  children: React.ReactNode;
}

function pageTitle(pathname: string) {
  if (pathname === "/admin" || pathname === "/admin/") return "Today";
  const last = pathname.split("/").filter(Boolean).pop() || "Admin";
  return last.replace(/-/g, " ");
}

export function AdminShell({ email, initial, banner, children }: AdminShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const title = pageTitle(pathname);

  return (
    <div className="min-h-dvh bg-canvas flex flex-col md:flex-row">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {banner}
        <header className="h-14 sm:h-16 sticky top-0 z-50 flex items-center px-3 sm:px-6 justify-between bg-canvas/90 backdrop-blur-md border-b border-line shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden min-h-11 min-w-11 inline-flex items-center justify-center text-ink rounded-md hover:bg-canvas-muted focus-visible:focus-ring"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="font-anton text-lg sm:text-xl text-ink tracking-tight truncate capitalize">{title}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 min-h-11 px-3 rounded-md text-xs font-medium text-ink-2 hover:text-ink hover:bg-canvas-muted focus-visible:focus-ring"
            >
              <ExternalLink size={14} />
              Homepage
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-2 border-l border-line">
              <span className="text-sm text-ink-2 hidden sm:block truncate max-w-[12rem]">{email}</span>
              <div className="w-8 h-8 rounded-full bg-surface-raised border border-line text-ink text-xs font-semibold flex items-center justify-center">
                {initial}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <GsapProvider>{children}</GsapProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
