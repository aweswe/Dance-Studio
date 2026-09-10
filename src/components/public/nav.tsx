'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LayoutDashboard, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createClient } from '@/lib/supabase/client';

const ALL_LINKS = [
  { name: 'Schedule', href: '#schedule' },
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Upcoming', href: '#classes' },
  { name: 'Videos', href: '#videos' },
  { name: 'Kuchipudi', href: '/kuchipudi' },
  { name: 'Studio Rental', href: ROUTES.studioRental },
  { name: 'Gallery', href: ROUTES.gallery },
  { name: 'About', href: ROUTES.about },
  { name: 'Contact', href: ROUTES.contact },
];

interface AuthInfo {
  isLoggedIn: boolean;
  role: 'student' | 'admin' | 'instructor';
  label: string;
  href: string;
  name?: string;
}

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          const role = profile?.role || 'student';
          let href: string = ROUTES.student;
          let label = 'Student Portal';
          if (role === 'admin') {
            href = '/admin';
            label = 'Admin Portal';
          } else if (role === 'instructor') {
            href = '/instructor';
            label = 'Instructor Portal';
          }

          setAuthInfo({
            isLoggedIn: true,
            role,
            label,
            href,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          });
        } else {
          setAuthInfo(null);
        }
      } catch {
        setAuthInfo(null);
      }
    }

    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/90 dark:bg-black/90 backdrop-blur-md border-b border-line py-3 shadow-md'
          : 'bg-transparent py-4'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href={ROUTES.home}
          className="group flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB4D8]"
        >
          <div className="flex flex-col leading-none">
            <span className="heading-urban text-lg sm:text-2xl tracking-tighter text-ink group-hover:text-[#2BB4D8] transition-colors">
              RHYTHMZZ
            </span>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FB923C]">
              DANCE ACADEMY
            </span>
          </div>
        </Link>

        {/* Center/Right Desktop Controls */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          <Link
            href="/programmes"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-2 hover:text-ink transition-colors"
          >
            Programmes
          </Link>

          <Link
            href="#schedule"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-2 hover:text-ink transition-colors"
          >
            Schedule
          </Link>

          <Link
            href="#coaches"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-2 hover:text-ink transition-colors"
          >
            Coaches
          </Link>

          <Link
            href="/about"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-2 hover:text-ink transition-colors"
          >
            About
          </Link>

          {/* Book A Class Pill Button in Warm Peach */}
          <Link
            href={ROUTES.enrol}
            className="btn-peach px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] shadow-sm active:scale-95"
          >
            Book a Class
          </Link>

          {/* Account Portal Link */}
          {authInfo?.isLoggedIn ? (
            <Link
              href={authInfo.href}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2BB4D8] hover:underline transition-colors"
            >
              <LayoutDashboard size={13} />
              <span>{authInfo.label}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-2 hover:text-ink transition-colors"
            >
              Account
            </Link>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>

        {/* Mobile Header Controls (Only on mobile) */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle className="w-7 h-7" />
          <Link
            href={ROUTES.enrol}
            className="btn-peach px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm active:scale-[0.96]"
          >
            Book
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle mobile menu"
            className="p-1.5 text-ink hover:text-[#FB923C] transition-colors cursor-pointer rounded-lg border border-line bg-surface/50"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sleek Mobile Slide-Down Drawer (Mobile Only: md:hidden) */}
      <div
        id="mobile-nav-drawer"
        className={cn(
          'fixed inset-x-0 top-[60px] z-50 md:hidden bg-canvas/95 backdrop-blur-xl px-5 py-6 flex flex-col justify-between transition-all duration-300 ease-out border-b border-line shadow-2xl max-h-[calc(100vh-60px)] overflow-y-auto',
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FB923C] font-bold">
              Menu Navigation
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-mono text-ink-2 hover:text-ink flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Close
            </button>
          </div>

          <nav className="grid grid-cols-2 gap-2">
            {ALL_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-2.5 rounded-xl border border-line bg-surface/70 hover:border-[#FB923C] hover:bg-surface text-ink text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.96] flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-[#FB923C] text-[10px] font-mono">→</span>
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-line space-y-2">
            <Link
              href={ROUTES.enrol}
              onClick={() => setIsOpen(false)}
              className="btn-peach w-full py-3 text-xs font-black uppercase tracking-wider text-center block shadow-sm active:scale-[0.96]"
            >
              Book Free Trial Class ──→
            </Link>

            {authInfo?.isLoggedIn ? (
              <Link
                href={authInfo.href}
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-xs font-mono uppercase tracking-wider text-center block text-[#2BB4D8] hover:underline"
              >
                {authInfo.label} ──→
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-xs font-mono uppercase tracking-wider text-center block text-ink-2 hover:text-ink"
              >
                Student / Instructor Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

