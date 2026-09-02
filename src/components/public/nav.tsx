'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createClient } from '@/lib/supabase/client';

const LINKS = [
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Kuchipudi', href: '/kuchipudi' },
  { name: 'Schedule', href: `${ROUTES.home}#schedule` },
  { name: 'Gallery', href: ROUTES.gallery },
  { name: 'Studio Rental', href: ROUTES.studioRental },
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

  // Slight elevation + compression once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href.startsWith('/#') ? pathname === ROUTES.home : pathname === href;

  return (
    <nav
      className={cn(
        'relative z-50 flex items-center justify-between px-6 md:px-10 bg-canvas/95 border-b border-line backdrop-blur-md transition-all duration-250',
        scrolled ? 'py-2 shadow-pop' : 'py-2.5',
      )}
    >
      <Link href={ROUTES.home} className="block rounded-sm focus-visible:focus-ring">
        <Image src="/logo.png" alt="Rhythmzz Logo" width={120} height={44} className="h-10 w-auto" priority />
      </Link>

      {/* Desktop Links */}
      <ul className="hidden lg:flex gap-5 list-none m-0 p-0">
        {LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.name} className="relative">
              <Link
                href={link.href}
                className={cn(
                  'text-[11px] tracking-[1.6px] uppercase font-medium transition-colors rounded-sm focus-visible:focus-ring',
                  active ? 'text-ink font-bold' : 'text-ink-2 hover:text-bl-ink',
                )}
              >
                {link.name}
              </Link>
              {active && (
                <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-bl" aria-hidden />
              )}
            </li>
          );
        })}
      </ul>

      {/* Desktop CTAs */}
      <div className="hidden lg:flex gap-2.5 items-center">
        <ThemeToggle />
        {authInfo?.isLoggedIn ? (
          <Link
            href={authInfo.href}
            className="text-[11px] font-semibold tracking-[1.6px] uppercase px-3.5 py-2 text-bl-ink hover:text-bl bg-bl/10 hover:bg-bl/20 border border-bl/30 rounded-control flex items-center gap-2 transition-all focus-visible:focus-ring shadow-sm"
          >
            <LayoutDashboard size={14} className="text-bl" />
            <span>{authInfo.label}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-[11px] font-semibold tracking-[1.6px] uppercase px-4 py-2 text-ink-2 hover:text-ink flex items-center gap-1.5 transition-colors focus-visible:focus-ring"
          >
            <User size={14} className="text-bl-ink" />
            <span>Login</span>
          </Link>
        )}
        <Link
          href={ROUTES.enrol}
          className="text-[11px] font-semibold tracking-[1.6px] uppercase px-5 py-2.5 bg-blk text-white hover:bg-bl hover:text-blk transition-all focus-visible:focus-ring active:scale-[0.98] rounded-control dark:bg-bl dark:text-blk dark:hover:bg-white"
        >
          Enrol Now
        </Link>
      </div>

      {/* Mobile Header Controls: Theme Toggle & Hamburger */}
      <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle className="w-9 h-9 border border-line" />
        <button
          className="p-2 text-ink rounded-control border border-line focus-visible:focus-ring active:scale-95 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'absolute top-full left-0 right-0 bg-surface border-b border-line p-6 flex flex-col gap-6 lg:hidden shadow-pop transition-all duration-250 ease-out-snap',
          isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-2',
        )}
      >
        <ul className="flex flex-col gap-3 list-none m-0 p-0">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.name} className="relative">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-sm tracking-wider uppercase font-medium block py-2 rounded-sm focus-visible:focus-ring',
                    active ? 'text-ink font-bold' : 'text-ink-2 hover:text-bl-ink',
                  )}
                >
                  {link.name}
                </Link>
                {active && (
                  <span className="absolute left-0 bottom-0 w-5 h-[2px] bg-bl" aria-hidden />
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-3 pt-4 border-t border-line">
          {authInfo?.isLoggedIn ? (
            <Link
              href={authInfo.href}
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold tracking-widest uppercase py-3 bg-bl/15 border border-bl/40 text-bl-ink text-center flex items-center justify-center gap-2 rounded-control"
            >
              <LayoutDashboard size={16} /> {authInfo.label}
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold tracking-widest uppercase py-3 border border-line-strong text-ink text-center flex items-center justify-center gap-2 rounded-control"
            >
              <User size={16} /> Student Login
            </Link>
          )}
          <Link
            href={ROUTES.enrol}
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase py-3 bg-blk text-white text-center rounded-control dark:bg-bl dark:text-blk"
          >
            Enrol Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
