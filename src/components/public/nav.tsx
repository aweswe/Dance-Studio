'use client';

import { useSyncExternalStore } from 'react';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Phone,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { homepageCtaBrand, homepageCtaPairButton } from '@/lib/ui/homepage-cta';
import { ROUTES } from '@/lib/utils/constants';
import { BrandLogo } from '@/components/shared/brand-logo';
import { createClient } from '@/lib/supabase/client';

const navActionButton =
  'inline-flex items-center justify-center gap-1.5 box-border h-11 min-h-[44px] py-0 px-3 xl:px-4 lg:min-w-[7.5rem] xl:min-w-[9.75rem] rounded-md text-[10px] font-bold uppercase tracking-[0.1em] transition-colors active:scale-[0.98] touch-manipulation whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

/** Login — resting state uses subtle surface border and hover fill */
const navLoginButton = cn(
  navActionButton,
  'text-ink ring-1 ring-line-strong bg-surface hover:bg-canvas-muted hover:ring-ink/30',
);

const navBookButton = cn(
  navActionButton,
  'bg-bl text-slate-950 font-bold hover:bg-bl-deep hover:text-slate-950 shadow-[0_4px_16px_-4px_rgba(43,180,216,0.45)]',
);

type NavLink = { name: string; href: string; hint?: string };

const PRIMARY_LINKS: NavLink[] = [
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Schedule', href: ROUTES.schedule },
  { name: 'Gear', href: ROUTES.gear },
  { name: 'Studio Rental', href: ROUTES.studioRental },
  { name: 'Contact', href: ROUTES.contact },
];

const PROGRAMMES_GROUPS: { label: string; links: NavLink[] }[] = [
  {
    label: 'Dance Programmes',
    links: [
      { name: 'Kids Dance', href: `${ROUTES.programmes}/kids-dance`, hint: 'Ages 4 – 12 · Bollywood, Hip Hop, Freestyle' },
      { name: 'Adults Dance', href: `${ROUTES.programmes}/adults-dance`, hint: 'Ages 13+ · Bollywood, Contemporary' },
      { name: 'Mind & Body Fitness', href: `${ROUTES.programmes}/mind-body-fitness`, hint: 'Zumba, Yoga, Pilates, Strength' },
    ],
  },
  {
    label: 'Certification-Based Classes',
    links: [
      { name: 'Kuchipudi', href: ROUTES.syllabusKuchipudi, hint: 'Level-wise curriculum' },
      { name: 'Kathak', href: ROUTES.syllabusKathak, hint: 'Level-wise curriculum' },
    ],
  },
];

const DISCOVER_GROUPS: { label: string; links: NavLink[] }[] = [
  {
    label: 'Academy',
    links: [
      { name: 'About', href: ROUTES.about, hint: 'Our story & team' },
      { name: 'Gear Store', href: ROUTES.gear, hint: 'Official studio dancewear' },
      { name: 'Gallery', href: ROUTES.gallery, hint: 'Stage & studio archive' },
      { name: 'Blog', href: ROUTES.blog, hint: 'News & stories' },
    ],
  },
  {
    label: 'Events',
    links: [
      { name: 'Events', href: ROUTES.events, hint: 'Showcases & workshops' },
    ],
  },
];

const ALL_DISCOVER_LINKS = DISCOVER_GROUPS.flatMap((g) => g.links);
const ALL_PROGRAMMES_LINKS = PROGRAMMES_GROUPS.flatMap((g) => g.links);

const MOBILE_SECTIONS: { id: string; title: string; links: NavLink[] }[] = [
  { id: 'explore', title: 'Programmes', links: ALL_PROGRAMMES_LINKS },
  { id: 'discover', title: 'Discover', links: ALL_DISCOVER_LINKS },
  {
    id: 'studio',
    title: 'Studio & Contact',
    links: [
      { name: 'Rhythmzz Gear', href: ROUTES.gear, hint: 'Wear the brand' },
      { name: 'Studio Rental', href: ROUTES.studioRental, hint: 'Book the space' },
      { name: 'Schedule', href: ROUTES.schedule, hint: 'Weekly timetable' },
      { name: 'Contact', href: ROUTES.contact, hint: 'Visit or call us' },
    ],
  },
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
  badge,
  onClick,
}: {
  link: NavLink;
  active: boolean;
  className?: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={link.href}
      prefetch
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors relative py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl rounded-md',
        active ? 'text-ink font-bold' : 'text-ink-2 hover:text-bl',
        className,
      )}
    >
      <span>{link.name}</span>
      {badge && (
        <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 font-bold border border-amber-500/30 tracking-wider">
          {badge}
        </span>
      )}
      {active && (
        <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-bl rounded-full" aria-hidden />
      )}
    </Link>
  );
}

function ProgrammesPanel({
  isActive,
  onNavigate,
}: {
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      role="menu"
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(100vw-2rem,32rem)] rounded-md border border-line bg-canvas/95 backdrop-blur-xl shadow-overlay p-2.5 z-[70] animate-panel-in"
    >
      <div className="px-3 pt-2 pb-2 flex items-center gap-2 border-b border-line-subtle mb-1">
        <GraduationCap size={14} className="text-bl shrink-0" strokeWidth={2} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">Programmes</p>
      </div>
      <div className="grid grid-cols-1 gap-0.5 max-h-[min(70vh,24rem)] overflow-y-auto overscroll-contain">
        {PROGRAMMES_GROUPS.map((group) => (
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
  storefrontMode,
}: {
  title: string;
  links: NavLink[];
  pathname: string;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  icon?: LucideIcon;
  storefrontMode?: 'coming_soon' | 'live';
}) {
  const sectionActive = links.some((l) => isActive(l.href));
  const [open, setOpen] = useState(() => sectionActive || title === 'Explore');
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (sectionActive) setOpen(true);
  }

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
                <span className="flex items-center gap-2 font-semibold tracking-wide text-base">
                  <span>{link.name}</span>
                  {link.name === 'Rhythmzz Gear' && storefrontMode === 'coming_soon' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      SOON
                    </span>
                  )}
                </span>
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
        className={cn(homepageCtaBrand, homepageCtaPairButton)}
      >
        Book free trial
        <ArrowRight size={18} strokeWidth={2} />
      </Link>
      {authInfo?.isLoggedIn && (
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 pt-1">
          Signed in as {authInfo.name}
        </p>
      )}
    </div>
  );
}

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
  const [storefrontMode, setStorefrontMode] = useState<'coming_soon' | 'live'>('coming_soon');
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  const discoverRef = useRef<HTMLDivElement>(null);
  const programmesRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrollLockRef = useRef(0);

  useEffect(() => {
    fetch('/api/storefront-mode')
      .then((r) => r.json())
      .then((d) => {
        if (d?.mode) setStorefrontMode(d.mode);
      })
      .catch(() => {});
  }, []);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsOpen(false);
    setDiscoverOpen(false);
    setProgrammesOpen(false);
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
      if (!programmesRef.current?.contains(event.target as Node)) setProgrammesOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDiscoverOpen(false);
        setProgrammesOpen(false);
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
  const programmesActive = ALL_PROGRAMMES_LINKS.some((link) => isActive(link.href)) || isActive(ROUTES.programmes);
  const closeMobile = () => setIsOpen(false);

  const mobileSectionIcons = [CalendarDays, GraduationCap, Compass] as const;

  return (
    <header
      className={cn(
        'sticky top-0 w-full z-50 transition-all duration-200',
        scrolled
          ? 'bg-white/98 backdrop-blur-md border-b border-line shadow-sm py-1.5'
          : 'bg-white/95 backdrop-blur-md border-b border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-1.5 sm:py-2',
      )}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="px-0 sm:px-10 lg:px-6 xl:px-12 flex items-center justify-between lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-3 xl:gap-x-5">
          <Link
            href={ROUTES.home}
            className="group flex items-center min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl shrink-0 lg:col-start-1 touch-manipulation"
            aria-label="Rhythmzz Academy of Dance — home"
          >
            <BrandLogo priority className="h-11 sm:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity" />
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5 2xl:gap-6 min-w-0" aria-label="Main navigation">
            {/* Programmes dropdown */}
            <div className="relative shrink-0" ref={programmesRef}>
              <button
                type="button"
                aria-expanded={programmesOpen}
                aria-haspopup="menu"
                onClick={() => { setProgrammesOpen((o) => !o); setDiscoverOpen(false); }}
                className={cn(
                  'inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl rounded-md transition-colors',
                  programmesActive || programmesOpen ? 'text-ink font-bold' : 'text-ink-2 hover:text-bl',
                )}
              >
                Programmes
                <ChevronDown size={14} className={cn('transition-transform duration-200', programmesOpen && 'rotate-180')} />
              </button>
              {programmesActive && !programmesOpen && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-bl rounded-full" aria-hidden />
              )}
              {programmesOpen && <ProgrammesPanel isActive={isActive} onNavigate={() => setProgrammesOpen(false)} />}
            </div>

            {/* Remaining primary links (Schedule, Gear, Studio Rental, Contact) */}
            {PRIMARY_LINKS.filter((l) => l.name !== 'Programmes').map((link) => (
              <NavLinkItem
                key={link.name}
                link={link}
                active={isActive(link.href)}
                badge={link.name === 'Gear' && storefrontMode === 'coming_soon' ? 'SOON' : undefined}
              />
            ))}

            {/* Discover dropdown */}
            <div className="relative shrink-0" ref={discoverRef}>
              <button
                type="button"
                aria-expanded={discoverOpen}
                aria-haspopup="menu"
                onClick={() => { setDiscoverOpen((open) => !open); setProgrammesOpen(false); }}
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

            {/* Teach with us (highlighted nav menu item after Discover) */}
            <Link
              href={ROUTES.teachWithUs}
              prefetch
              className={cn(
                'relative inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.1em] py-1 px-2.5 xl:px-3 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl shrink-0',
                isActive(ROUTES.teachWithUs)
                  ? 'bg-bl text-slate-950 font-black shadow-xs'
                  : 'text-bl bg-bl/10 hover:bg-bl/20 border border-bl/30 hover:border-bl/60',
              )}
            >
              <span>Teach with us</span>
              <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bl opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-bl" />
              </span>
            </Link>
          </nav>

          <div className="hidden lg:flex items-center justify-end gap-3 shrink-0">
            {authInfo?.isLoggedIn ? (
              <Link href={authInfo.href} title={authInfo.label} className={navLoginButton}>
                <LayoutDashboard size={14} className="shrink-0" />
                <span className="max-w-[5.5rem] truncate xl:max-w-none">{authInfo.shortLabel}</span>
              </Link>
            ) : (
              <Link href="/login" title="Student login" className={navLoginButton}>
                <User size={14} className="shrink-0" />
                Login
              </Link>
            )}

            <Link href={ROUTES.enrol} className={navBookButton}>
              Book a class
            </Link>
          </div>

          {/* Mobile / tablet: logo + menu only — Book lives in drawer footer */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
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
      </div>

      {mounted &&
        createPortal(
          <>
            <div
              className={cn(
                'fixed inset-0 z-[700] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 touch-manipulation',
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
                  <div key={section.id}>
                    <MobileSection
                      title={section.title}
                      links={section.links}
                      pathname={pathname}
                      isActive={isActive}
                      onNavigate={closeMobile}
                      icon={i === 0 ? BookOpen : mobileSectionIcons[i - 1]}
                      storefrontMode={storefrontMode}
                    />
                    {section.id === 'discover' && (
                      <div className="p-3 bg-blk border-b border-white/10">
                        <Link
                          href={ROUTES.teachWithUs}
                          onClick={closeMobile}
                          className={cn(
                            'flex items-center justify-between gap-3 px-4 py-3 rounded-md border border-bl/40 bg-bl/10 hover:bg-bl/20 transition-all text-white touch-manipulation',
                            isActive(ROUTES.teachWithUs) && 'bg-bl/25 border-bl text-white',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bl opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-bl" />
                            </span>
                            <div className="min-w-0">
                              <span className="block font-bold text-sm uppercase tracking-wider text-bl">
                                Teach with us
                              </span>
                              <span className="block text-xs text-white/60 truncate">
                                Join our faculty &amp; choreography roster
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-bl shrink-0" />
                        </Link>
                      </div>
                    )}
                  </div>
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
