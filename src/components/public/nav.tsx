'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createClient } from '@/lib/supabase/client';

type NavLink = { name: string; href: string; hint?: string };

const PRIMARY_LINKS: NavLink[] = [
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Schedule', href: ROUTES.schedule },
  { name: 'Gallery', href: ROUTES.gallery },
  { name: 'About', href: ROUTES.about },
];

/** Everything else — one curated menu, zero clutter on the bar */
const DISCOVER_GROUPS: { label: string; links: NavLink[] }[] = [
  {
    label: 'Academy',
    links: [
      { name: 'Contact', href: ROUTES.contact, hint: 'Visit or call us' },
      { name: 'Blog', href: ROUTES.blog, hint: 'News & stories' },
    ],
  },
  {
    label: 'Classical syllabus',
    links: [
      { name: 'Kuchipudi', href: ROUTES.syllabusKuchipudi, hint: 'Level-wise curriculum' },
      { name: 'Kathak', href: ROUTES.syllabusKathak, hint: 'Level-wise curriculum' },
    ],
  },
  {
    label: 'Events & studio',
    links: [
      { name: 'Annual Day', href: ROUTES.annualDay, hint: 'Showcase & tickets' },
      { name: 'Studio Rental', href: ROUTES.studioRental, hint: 'Book the space' },
    ],
  },
];

const ALL_DISCOVER_LINKS = DISCOVER_GROUPS.flatMap((g) => g.links);

const MOBILE_SECTIONS: { id: string; title: string; links: NavLink[] }[] = [
  { id: 'explore', title: 'Explore', links: PRIMARY_LINKS },
  ...DISCOVER_GROUPS.map((g) => ({ id: g.label, title: g.label, links: g.links })),
];

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
        'whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm',
        active ? 'text-ink font-bold' : 'text-ink-2 hover:text-[#7C5CFC]',
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

function DiscoverPanel({
  isActive,
  onNavigate,
}: {
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      role="menu"
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-line bg-canvas/95 backdrop-blur-xl shadow-overlay p-2 z-[70] animate-panel-in"
    >
      <div className="px-3 pt-2 pb-2 flex items-center gap-2 border-b border-line-subtle mb-1">
        <Compass size={14} className="text-[#7C5CFC] shrink-0" strokeWidth={2} />
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">Discover Rhythmzz</p>
      </div>
      <div className="grid grid-cols-1 gap-0.5">
        {DISCOVER_GROUPS.map((group) => (
          <div key={group.label} className="px-1 py-1">
            <p className="px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-3">{group.label}</p>
            {group.links.map((item) => (
              <Link
                key={item.href}
                role="menuitem"
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex flex-col gap-0.5 rounded-xl px-3 py-2 transition-colors',
                  isActive(item.href)
                    ? 'bg-[#7C5CFC]/10 text-ink'
                    : 'text-ink-2 hover:bg-surface hover:text-ink',
                )}
              >
                <span className="text-[11px] font-bold uppercase tracking-wide">{item.name}</span>
                {item.hint && <span className="text-[10px] font-normal normal-case tracking-normal text-ink-3">{item.hint}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileSection({
  title,
  links,
  defaultOpen,
  isActive,
  onNavigate,
  icon: Icon,
}: {
  title: string;
  links: NavLink[];
  defaultOpen?: boolean;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const sectionActive = links.some((l) => isActive(l.href));

  return (
    <div className="border-b border-[#333333]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-6 sm:px-8 py-4 text-left text-white hover:bg-[#141414] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C5CFC]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {Icon && <Icon size={16} className="shrink-0 text-[#7C5CFC]" strokeWidth={1.75} />}
          <span className="text-xs font-bold uppercase tracking-[0.14em] truncate">{title}</span>
          {sectionActive && !open && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] shrink-0" aria-label="Current section" />
          )}
        </span>
        <ChevronDown size={16} className={cn('shrink-0 text-[#888888] transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="bg-[#0d0d0d] pb-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              onClick={onNavigate}
              className={cn(
                'flex items-center justify-between gap-4 pl-12 sm:pl-14 pr-6 sm:pr-8 py-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C5CFC]',
                isActive(link.href) ? 'text-[#F5FB38] bg-[#141414]' : 'text-[#cccccc] hover:text-white hover:bg-[#141414]',
              )}
            >
              <span className="font-semibold tracking-wide">{link.name}</span>
              {isActive(link.href) && <ArrowRight size={16} strokeWidth={1.5} className="shrink-0" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  const discoverRef = useRef<HTMLDivElement>(null);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsOpen(false);
    setDiscoverOpen(false);
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
      if (!discoverRef.current?.contains(event.target as Node)) setDiscoverOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDiscoverOpen(false);
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
  const discoverActive = ALL_DISCOVER_LINKS.some((link) => isActive(link.href));
  const closeMobile = () => setIsOpen(false);

  const mobileSectionIcons = [CalendarDays, GraduationCap, Sparkles] as const;

  return (
    <header
      className={cn(
        'w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/90 dark:bg-black/90 backdrop-blur-md border-b border-line py-1.5 shadow-md'
          : 'bg-canvas/80 dark:bg-black/60 backdrop-blur-md border-b border-line/40 py-2',
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-3 xl:gap-x-5">
        <Link
          href={ROUTES.home}
          className="group flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] shrink-0 lg:col-start-1"
        >
          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-anton text-lg sm:text-xl tracking-wide text-ink group-hover:text-[#7C5CFC] transition-colors">
              RHYTHMZZ
            </span>
            <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#7C5CFC]">Dance Academy</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-5 min-w-0" aria-label="Main navigation">
          {PRIMARY_LINKS.map((link) => (
            <NavLinkItem key={link.name} link={link} active={isActive(link.href)} />
          ))}

          <div className="relative shrink-0" ref={discoverRef}>
            <button
              type="button"
              aria-expanded={discoverOpen}
              aria-haspopup="menu"
              onClick={() => setDiscoverOpen((open) => !open)}
              className={cn(
                'inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-sm transition-colors',
                discoverActive || discoverOpen ? 'text-ink font-bold' : 'text-ink-2 hover:text-[#7C5CFC]',
              )}
            >
              Discover
              <ChevronDown size={12} className={cn('transition-transform duration-200', discoverOpen && 'rotate-180')} />
            </button>
            {(discoverActive || discoverOpen) && !discoverOpen && (
              <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#7C5CFC] rounded-full" aria-hidden />
            )}
            {discoverOpen && (
              <DiscoverPanel isActive={isActive} onNavigate={() => setDiscoverOpen(false)} />
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center justify-end gap-2 shrink-0">
          {authInfo?.isLoggedIn ? (
            <Link
              href={authInfo.href}
              title={authInfo.label}
              className="inline-flex items-center gap-1.5 min-h-8 px-2.5 rounded-lg border border-[#7C5CFC]/25 bg-[#7C5CFC]/5 text-[#7C5CFC] hover:bg-[#7C5CFC]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC]"
            >
              <LayoutDashboard size={14} className="shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] max-w-[5.5rem] truncate xl:max-w-none">
                {authInfo.shortLabel}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              title="Student login"
              className="inline-flex items-center gap-1.5 min-h-8 px-2.5 rounded-lg border border-line text-ink-2 hover:text-ink hover:border-line-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC]"
            >
              <User size={14} className="shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">Login</span>
            </Link>
          )}

          <Link
            href={ROUTES.enrol}
            className="btn-sun px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] shadow-sm active:scale-95 whitespace-nowrap"
          >
            Book a Class
          </Link>

          <ThemeToggle />
        </div>

        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          <ThemeToggle className="w-8 h-8" />
          <Link
            href={ROUTES.enrol}
            className="btn-sun px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-[0.96]"
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
                'fixed inset-0 z-[700] bg-[#0a0a0a]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300',
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
              )}
              onClick={closeMobile}
              aria-hidden
            />

            <div
              id="mobile-nav-drawer"
              className={cn(
                'fixed inset-y-0 right-0 z-[710] w-full max-w-sm lg:hidden bg-black flex flex-col shadow-2xl transition-transform duration-300 ease-out',
                isOpen ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none',
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
            >
              <div className="flex items-center justify-between px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-3 border-b border-[#333333] shrink-0">
                <Link href={ROUTES.home} onClick={closeMobile} className="flex flex-col leading-none gap-0.5">
                  <span className="font-anton text-lg tracking-wide text-white">RHYTHMZZ</span>
                  <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#7C5CFC]">Dance Academy</span>
                </Link>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="p-2 min-h-10 min-w-10 flex items-center justify-center text-white hover:text-[#7C5CFC] transition-colors rounded-lg"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain" aria-label="Mobile navigation">
                {MOBILE_SECTIONS.map((section, i) => (
                  <MobileSection
                    key={section.id}
                    title={section.title}
                    links={section.links}
                    defaultOpen={i === 0}
                    isActive={isActive}
                    onNavigate={closeMobile}
                    icon={i === 0 ? BookOpen : mobileSectionIcons[i - 1]}
                  />
                ))}

                <div className="px-6 sm:px-8 py-4 border-b border-[#333333] space-y-2">
                  {authInfo?.isLoggedIn ? (
                    <Link
                      href={authInfo.href}
                      onClick={closeMobile}
                      className="flex items-center justify-center gap-2 w-full min-h-11 rounded-xl border border-[#7C5CFC]/40 text-white text-xs font-bold uppercase tracking-[0.12em] hover:bg-[#7C5CFC]/10 transition-colors"
                    >
                      <LayoutDashboard size={16} strokeWidth={1.75} />
                      {authInfo.label}
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMobile}
                      className="flex items-center justify-center gap-2 w-full min-h-11 rounded-xl border border-[#444444] text-white text-xs font-bold uppercase tracking-[0.12em] hover:bg-[#141414] transition-colors"
                    >
                      <User size={16} strokeWidth={1.75} />
                      Student Login
                    </Link>
                  )}
                  <Link
                    href={ROUTES.enrol}
                    prefetch
                    onClick={closeMobile}
                    className="btn-sun flex items-center justify-center gap-2 w-full min-h-11 text-xs font-black uppercase tracking-[0.12em]"
                  >
                    Book Free Trial
                    <ArrowRight size={16} strokeWidth={2} />
                  </Link>
                </div>
              </nav>

              {authInfo?.isLoggedIn && (
                <div className="px-6 py-3 border-t border-[#333333] shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888]">
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
