'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
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
import { BrandLogo } from '@/components/shared/brand-logo';
import { createClient } from '@/lib/supabase/client';

type NavLink = { name: string; href: string; hint?: string };

const PRIMARY_LINKS: NavLink[] = [
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Schedule', href: ROUTES.schedule },
  { name: 'Gallery', href: ROUTES.gallery },
  { name: 'About', href: ROUTES.about },
];

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

type LucideIcon = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

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
        'whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors relative py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl rounded-md',
        active ? 'text-ink font-bold' : 'text-ink-2 hover:text-bl',
        className,
      )}
    >
      {link.name}
      {active && (
        <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-bl rounded-full" aria-hidden />
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
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(100vw-2rem,28rem)] rounded-md border border-line bg-canvas/95 backdrop-blur-xl shadow-overlay p-2.5 z-[70] animate-panel-in"
    >
      <div className="px-3 pt-2 pb-2 flex items-center gap-2 border-b border-line-subtle mb-1">
        <Compass size={14} className="text-bl shrink-0" strokeWidth={2} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Discover Rhythmzz</p>
      </div>
      <div className="grid grid-cols-1 gap-0.5 max-h-[min(70vh,24rem)] overflow-y-auto overscroll-contain">
        {DISCOVER_GROUPS.map((group) => (
          <div key={group.label} className="px-1 py-1">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">{group.label}</p>
            {group.links.map((item) => (
              <Link
                key={item.href}
                role="menuitem"
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex flex-col gap-0.5 rounded-md px-3.5 py-3 min-h-12 transition-colors touch-manipulation',
                  isActive(item.href)
                    ? 'bg-bl/10 text-ink'
                    : 'text-ink-2 hover:bg-surface hover:text-ink active:bg-surface',
                )}
              >
                <span className="text-xs font-bold uppercase tracking-wide">{item.name}</span>
                {item.hint && (
                  <span className="text-[11px] font-normal normal-case tracking-normal text-ink-3">{item.hint}</span>
                )}
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
  pathname,
  isActive,
  onNavigate,
  icon: Icon,
}: {
  title: string;
  links: NavLink[];
  pathname: string;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  icon?: LucideIcon;
}) {
  const sectionActive = links.some((l) => isActive(l.href));
  const [open, setOpen] = useState(() => sectionActive || title === 'Explore');

  useEffect(() => {
    if (sectionActive) setOpen(true);
  }, [pathname, sectionActive]);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 min-h-[56px] text-left text-white hover:bg-deep active:bg-deep transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bl"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {Icon && <Icon size={18} className="shrink-0 text-bl" strokeWidth={1.75} />}
          <span className="text-[15px] font-bold uppercase tracking-[0.12em] truncate">{title}</span>
          {sectionActive && !open && (
            <span className="h-2 w-2 rounded-full bg-bl shrink-0" aria-label="Current section" />
          )}
        </span>
        <ChevronDown size={18} className={cn('shrink-0 text-white/50 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="bg-deep pb-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              onClick={onNavigate}
              className={cn(
                'flex items-center justify-between gap-4 pl-14 pr-6 py-4 min-h-[56px] transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bl',
                isActive(link.href) ? 'text-bl bg-deep' : 'text-white/70 hover:text-white hover:bg-deep active:bg-deep',
              )}
            >
              <span className="min-w-0">
                <span className="block font-semibold tracking-wide text-base">{link.name}</span>
                {link.hint && (
                  <span className="block text-[13px] font-normal text-white/50 mt-0.5 normal-case tracking-normal">
                    {link.hint}
                  </span>
                )}
              </span>
              {isActive(link.href) && <ArrowRight size={18} strokeWidth={1.5} className="shrink-0" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileDrawerFooter({
  authInfo,
  onNavigate,
}: {
  authInfo: AuthInfo | null;
  onNavigate: () => void;
}) {
  return (
    <div className="shrink-0 border-t border-white/10 bg-blk px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2.5">
      {authInfo?.isLoggedIn ? (
        <Link
          href={authInfo.href}
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-md border border-bl/40 text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-bl/10 active:scale-[0.98] transition-all touch-manipulation"
        >
          <LayoutDashboard size={18} strokeWidth={1.75} />
          {authInfo.label}
        </Link>
      ) : (
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-md border border-white/15 text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-deep active:scale-[0.98] transition-all touch-manipulation"
        >
          <User size={18} strokeWidth={1.75} />
          Student Login
        </Link>
      )}
      <Link
        href={ROUTES.enrol}
        prefetch
        onClick={onNavigate}
        className="btn-sun flex items-center justify-center gap-2 w-full min-h-[52px] text-sm font-semibold touch-manipulation"
      >
        Book free trial
        <ArrowRight size={18} strokeWidth={2} />
      </Link>
      {authInfo?.isLoggedIn && (
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 pt-1">
          Signed in as {authInfo.name}
        </p>
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrollLockRef = useRef(0);

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
        if (isOpen) {
          setIsOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    scrollLockRef.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollLockRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollLockRef.current);
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
          className="group flex items-center min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl shrink-0 lg:col-start-1 touch-manipulation"
          aria-label="Rhythmzz Academy of Dance — home"
        >
          <BrandLogo priority className="group-hover:opacity-90 transition-opacity" />
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-6 min-w-0" aria-label="Main navigation">
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
                'inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl rounded-md transition-colors',
                discoverActive || discoverOpen ? 'text-ink font-bold' : 'text-ink-2 hover:text-bl',
              )}
            >
              Discover
              <ChevronDown size={14} className={cn('transition-transform duration-200', discoverOpen && 'rotate-180')} />
            </button>
            {discoverActive && !discoverOpen && (
              <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-bl rounded-full" aria-hidden />
            )}
            {discoverOpen && <DiscoverPanel isActive={isActive} onNavigate={() => setDiscoverOpen(false)} />}
          </div>
        </nav>

        <div className="hidden lg:flex items-center justify-end gap-2 shrink-0">
          {authInfo?.isLoggedIn ? (
            <Link
              href={authInfo.href}
              title={authInfo.label}
              className="inline-flex items-center gap-1.5 min-h-8 px-2.5 rounded-md border border-bl/25 bg-bl/5 text-bl hover:bg-bl/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
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
              className="inline-flex items-center gap-1.5 min-h-8 px-2.5 rounded-md border border-line text-ink-2 hover:text-ink hover:border-line-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
            >
              <User size={14} className="shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">Login</span>
            </Link>
          )}

          <Link
            href={ROUTES.enrol}
            className="btn-sun px-4 py-1.5 text-xs font-semibold shadow-sm active:scale-95 whitespace-nowrap"
          >
            Book a class
          </Link>

          <ThemeToggle />
        </div>

        {/* Mobile / tablet: logo + theme + menu only — Book lives in drawer footer */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center min-h-11 min-w-11 text-ink hover:text-bl transition-colors cursor-pointer rounded-md border border-line bg-surface/80 touch-manipulation active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
          >
            {isOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            <div
              className={cn(
                'fixed inset-0 z-[700] bg-blk/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 touch-manipulation',
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
              )}
              onClick={closeMobile}
              aria-hidden
            />

            <div
              id="mobile-nav-drawer"
              className={cn(
                'fixed inset-y-0 right-0 z-[710] w-[min(100vw,30rem)] lg:hidden bg-blk flex flex-col shadow-2xl transition-transform duration-300 ease-out h-[100dvh] max-h-[100dvh]',
                isOpen ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none',
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
            >
              <div className="flex items-center justify-between px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b border-white/10 shrink-0">
                <Link
                  href={ROUTES.home}
                  onClick={closeMobile}
                  className="flex items-center min-w-0 touch-manipulation"
                  aria-label="Rhythmzz Academy of Dance — home"
                >
                  <BrandLogo />
                </Link>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="inline-flex items-center justify-center min-h-11 min-w-11 text-white hover:text-bl active:bg-deep transition-colors rounded-md touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={1.75} />
                </button>
              </div>

              <nav
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
                aria-label="Mobile navigation"
              >
                {MOBILE_SECTIONS.map((section, i) => (
                  <MobileSection
                    key={section.id}
                    title={section.title}
                    links={section.links}
                    pathname={pathname}
                    isActive={isActive}
                    onNavigate={closeMobile}
                    icon={i === 0 ? BookOpen : mobileSectionIcons[i - 1]}
                  />
                ))}
              </nav>

              <MobileDrawerFooter authInfo={authInfo} onNavigate={closeMobile} />
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
