'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, Menu, X, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createClient } from '@/lib/supabase/client';

type NavLink = { name: string; href: string };

const PRIMARY_LINKS: NavLink[] = [
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Schedule', href: ROUTES.schedule },
  { name: 'Gallery', href: ROUTES.gallery },
  { name: 'About', href: ROUTES.about },
  { name: 'Contact', href: ROUTES.contact },
];

const MORE_LINKS: NavLink[] = [
  { name: 'Blog', href: ROUTES.blog },
  { name: 'Annual Day', href: ROUTES.annualDay },
  { name: 'Studio Rental', href: ROUTES.studioRental },
];

const SYLLABUS_LINKS: NavLink[] = [
  { name: 'Kuchipudi', href: ROUTES.syllabusKuchipudi },
  { name: 'Kathak', href: ROUTES.syllabusKathak },
];

const MOBILE_MENU_LINKS: NavLink[] = [...PRIMARY_LINKS, ...MORE_LINKS, ...SYLLABUS_LINKS];

interface AuthInfo {
  isLoggedIn: boolean;
  role: 'student' | 'admin' | 'instructor';
  label: string;
  shortLabel: string;
  href: string;
  name?: string;
}

function NavLinkItem({
  link,
  active,
  className,
  onClick,
}: {
  link: NavLink;
  active: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={link.href}
      prefetch
      onClick={onClick}
      className={cn(
        'whitespace-nowrap text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.12em] xl:tracking-[0.14em] transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm',
        active ? 'text-ink font-extrabold' : 'text-ink-2 hover:text-[#7C5CFC]',
        className,
      )}
    >
      {link.name}
      {active && (
        <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#7C5CFC] rounded-full" aria-hidden />
      )}
    </Link>
  );
}

function MobileMenuRow({
  link,
  active,
  onClick,
}: {
  link: NavLink;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={link.href}
      prefetch
      onClick={onClick}
      className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-[#333333] text-white hover:bg-[#141414] active:bg-[#1a1a1a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C5CFC]"
    >
      <span className="text-sm font-bold uppercase tracking-[0.14em]">{link.name}</span>
      {active && <ArrowRight size={18} strokeWidth={1.5} className="shrink-0" aria-hidden />}
    </Link>
  );
}

function DropdownPanel({
  title,
  links,
  isActive,
  onNavigate,
}: {
  title: string;
  links: NavLink[];
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      role="menu"
      className="absolute left-0 top-full mt-2 min-w-[210px] rounded-2xl border border-line bg-canvas shadow-overlay p-2 z-[70]"
    >
      <p className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-widest text-ink-3">{title}</p>
      {links.map((item) => (
        <Link
          key={item.href}
          role="menuitem"
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'block rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider',
            isActive(item.href) ? 'bg-surface text-ink' : 'text-ink-2 hover:bg-surface hover:text-ink',
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  const syllabusRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsOpen(false);
    setSyllabusOpen(false);
    setMoreOpen(false);
  }

  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();

          const role = profile?.role || 'student';
          let href: string = ROUTES.student;
          let label = 'Student Portal';
          let shortLabel = 'Portal';
          if (role === 'admin') {
            href = '/admin';
            label = 'Admin Portal';
            shortLabel = 'Admin';
          } else if (role === 'instructor') {
            href = '/instructor';
            label = 'Instructor Portal';
            shortLabel = 'Instructor';
          }

          setAuthInfo({
            isLoggedIn: true,
            role,
            label,
            shortLabel,
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

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!syllabusRef.current?.contains(event.target as Node)) setSyllabusOpen(false);
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSyllabusOpen(false);
        setMoreOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => pathname === href;
  const syllabusActive = pathname.startsWith('/syllabus');
  const moreActive = MORE_LINKS.some((link) => isActive(link.href));
  const closeMobile = () => setIsOpen(false);

  return (
    <header
      className={cn(
        'w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/90 dark:bg-black/90 backdrop-blur-md border-b border-line py-2 shadow-md'
          : 'bg-canvas/80 dark:bg-black/60 backdrop-blur-md border-b border-line/40 py-3',
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-4 xl:gap-x-6">
        {/* Brand */}
        <Link
          href={ROUTES.home}
          className="group flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] shrink-0 lg:col-start-1"
        >
          <div className="flex flex-col leading-none">
            <span className="font-anton text-xl sm:text-2xl tracking-wide text-ink group-hover:text-[#7C5CFC] transition-colors">
              RHYTHMZZ
            </span>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#7C5CFC]">DANCE ACADEMY</span>
          </div>
        </Link>

        {/* Desktop nav — centred column, never pushes actions off-screen */}
        <nav
          className="hidden lg:flex items-center justify-center gap-3 xl:gap-5 min-w-0"
          aria-label="Main navigation"
        >
          {PRIMARY_LINKS.map((link) => (
            <NavLinkItem key={link.name} link={link} active={isActive(link.href)} />
          ))}

          <div className="relative shrink-0" ref={syllabusRef}>
            <button
              type="button"
              aria-expanded={syllabusOpen}
              aria-haspopup="menu"
              onClick={() => {
                setSyllabusOpen((open) => !open);
                setMoreOpen(false);
              }}
              className={cn(
                'inline-flex items-center gap-1 whitespace-nowrap text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.12em] xl:tracking-[0.14em] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm',
                syllabusActive ? 'text-ink' : 'text-ink-2 hover:text-[#7C5CFC]',
              )}
            >
              Syllabus
              <ChevronDown size={12} className={cn('transition-transform', syllabusOpen && 'rotate-180')} />
            </button>
            {syllabusOpen && (
              <DropdownPanel title="Syllabus adoption" links={SYLLABUS_LINKS} isActive={isActive} />
            )}
          </div>

          {/* Blog + Annual Day inline from xl */}
          {MORE_LINKS.slice(0, 2).map((link) => (
            <NavLinkItem
              key={link.name}
              link={link}
              active={isActive(link.href)}
              className="hidden xl:inline-flex"
            />
          ))}

          {/* Studio Rental inline from 2xl only */}
          <NavLinkItem
            link={MORE_LINKS[2]}
            active={isActive(MORE_LINKS[2].href)}
            className="hidden 2xl:inline-flex"
          />

          {/* More dropdown on lg–xl (and lg-only for Blog/Annual/Studio) */}
          <div className="relative shrink-0 xl:hidden" ref={moreRef}>
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => {
                setMoreOpen((open) => !open);
                setSyllabusOpen(false);
              }}
              className={cn(
                'inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm',
                moreActive ? 'text-ink' : 'text-ink-2 hover:text-[#7C5CFC]',
              )}
            >
              More
              <ChevronDown size={12} className={cn('transition-transform', moreOpen && 'rotate-180')} />
            </button>
            {moreOpen && <DropdownPanel title="Explore" links={MORE_LINKS} isActive={isActive} />}
          </div>

          {/* xl–2xl: Studio Rental stays in More */}
          <div className="relative shrink-0 hidden xl:block 2xl:hidden" ref={moreRef}>
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => {
                setMoreOpen((open) => !open);
                setSyllabusOpen(false);
              }}
              className={cn(
                'inline-flex items-center gap-1 whitespace-nowrap text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.14em] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm',
                isActive(MORE_LINKS[2].href) ? 'text-ink' : 'text-ink-2 hover:text-[#7C5CFC]',
              )}
            >
              More
              <ChevronDown size={12} className={cn('transition-transform', moreOpen && 'rotate-180')} />
            </button>
            {moreOpen && (
              <DropdownPanel title="Explore" links={[MORE_LINKS[2]]} isActive={isActive} />
            )}
          </div>
        </nav>

        {/* Desktop actions — fixed width column, never wraps */}
        <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-3 shrink-0">
          {authInfo?.isLoggedIn ? (
            <Link
              href={authInfo.href}
              title={authInfo.label}
              className="inline-flex items-center gap-1.5 min-h-9 px-2.5 xl:px-3 rounded-xl border border-[#7C5CFC]/25 bg-[#7C5CFC]/5 text-[#7C5CFC] hover:bg-[#7C5CFC]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC]"
            >
              <LayoutDashboard size={14} className="shrink-0" />
              <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.12em] max-w-[8rem] truncate 2xl:max-w-none">
                <span className="2xl:hidden">{authInfo.shortLabel}</span>
                <span className="hidden 2xl:inline">{authInfo.label}</span>
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              title="Student login"
              className="inline-flex items-center gap-1.5 min-h-9 px-2.5 xl:px-3 rounded-xl border border-line text-ink-2 hover:text-ink hover:border-line-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC]"
            >
              <User size={14} className="shrink-0" />
              <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.12em]">Login</span>
            </Link>
          )}

          <Link
            href={ROUTES.enrol}
            className="btn-sun px-3.5 xl:px-5 py-2 text-[10px] xl:text-[11px] font-black uppercase tracking-[0.14em] shadow-sm active:scale-95 whitespace-nowrap"
          >
            <span className="xl:hidden">Book</span>
            <span className="hidden xl:inline">Book a Class</span>
          </Link>

          <ThemeToggle />
        </div>

        {/* Mobile header controls */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <ThemeToggle className="w-8 h-8" />
          <Link
            href={ROUTES.enrol}
            className="btn-sun px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-[0.96]"
          >
            Book
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="p-2 min-h-9 min-w-9 flex items-center justify-center text-ink hover:text-[#7C5CFC] transition-colors cursor-pointer rounded-xl border border-line bg-surface/80"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            <div
              className={cn(
                'fixed inset-0 z-[700] bg-[#0a0a0a] lg:hidden transition-opacity duration-300',
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
              )}
              onClick={closeMobile}
              aria-hidden
            />

            <div
              id="mobile-nav-drawer"
              className={cn(
                'fixed inset-y-0 right-0 z-[710] w-full lg:hidden bg-black flex flex-col shadow-2xl transition-transform duration-300 ease-out',
                isOpen ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none',
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
            >
              <div className="flex items-center justify-between px-6 sm:px-8 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-[#333333] shrink-0">
                <Link href={ROUTES.home} onClick={closeMobile} className="flex flex-col leading-none">
                  <span className="font-anton text-xl tracking-wide text-white">RHYTHMZZ</span>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#7C5CFC]">
                    Dance Academy
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="p-2 min-h-10 min-w-10 flex items-center justify-center text-white hover:text-[#7C5CFC] transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain" aria-label="Mobile navigation">
                {MOBILE_MENU_LINKS.map((link) => (
                  <MobileMenuRow key={link.href} link={link} active={isActive(link.href)} onClick={closeMobile} />
                ))}

                {authInfo?.isLoggedIn ? (
                  <Link
                    href={authInfo.href}
                    onClick={closeMobile}
                    className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-[#333333] text-white hover:bg-[#141414] active:bg-[#1a1a1a] transition-colors"
                  >
                    <span className="text-sm font-bold uppercase tracking-[0.14em]">{authInfo.label}</span>
                    <ArrowRight size={18} strokeWidth={1.5} className="shrink-0" aria-hidden />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-[#333333] text-white hover:bg-[#141414] active:bg-[#1a1a1a] transition-colors"
                  >
                    <span className="text-sm font-bold uppercase tracking-[0.14em]">Student Login</span>
                    <User size={18} strokeWidth={1.5} className="shrink-0" aria-hidden />
                  </Link>
                )}

                <Link
                  href={ROUTES.enrol}
                  prefetch
                  onClick={closeMobile}
                  className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-[#333333] text-[#FFE566] hover:bg-[#141414] active:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-sm font-bold uppercase tracking-[0.14em]">Book Free Trial</span>
                  <ArrowRight size={18} strokeWidth={1.5} className="shrink-0" aria-hidden />
                </Link>
              </nav>

              {authInfo?.isLoggedIn && (
                <div className="px-6 sm:px-8 py-4 border-t border-[#333333] shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">
                    Signed in as {authInfo.name}
                  </p>
                </div>
              )}
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
