'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const LINKS = [
  { name: 'Programmes', href: ROUTES.programmes },
  { name: 'Schedule', href: `${ROUTES.home}#schedule` },
  { name: 'Gallery', href: ROUTES.gallery },
  { name: 'About', href: ROUTES.about },
  { name: 'Contact', href: ROUTES.contact },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Slight elevation + compression once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hash links (schedule) belong to the home page; everything else matches
  // its exact pathname.
  const isActive = (href: string) =>
    href.startsWith('/#') ? pathname === ROUTES.home : pathname === href;

  return (
    <nav
      className={cn(
        'relative z-50 flex items-center justify-between px-6 md:px-12 bg-canvas/95 border-b border-line backdrop-blur-md transition-all duration-250',
        scrolled ? 'py-2 shadow-pop' : 'py-2.5',
      )}
    >
      <Link href={ROUTES.home} className="block rounded-sm focus-visible:focus-ring">
        <Image src="/logo.png" alt="Rhythmzz Logo" width={120} height={44} className="h-11 w-auto" priority />
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 list-none m-0 p-0">
        {LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.name} className="relative">
              <Link
                href={link.href}
                className={cn(
                  'text-[11px] tracking-[1.8px] uppercase font-medium transition-colors rounded-sm focus-visible:focus-ring',
                  active ? 'text-ink' : 'text-ink-2 hover:text-bl-ink',
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
      <div className="hidden md:flex gap-2.5 items-center">
        <ThemeToggle />
        <Link
          href={ROUTES.contact}
          className="text-[11px] font-semibold tracking-[1.8px] uppercase px-5.5 py-2.5 border border-line-strong text-ink hover:border-bl-ink hover:text-bl-ink transition-all focus-visible:focus-ring active:scale-[0.98]"
        >
          Contact
        </Link>
        <Link
          href={ROUTES.enrol}
          className="text-[11px] font-semibold tracking-[1.8px] uppercase px-5.5 py-2.5 bg-blk text-white hover:bg-bl transition-all focus-visible:focus-ring active:scale-[0.98]"
        >
          Enrol Now
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-ink rounded-sm focus-visible:focus-ring active:scale-95 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu — always mounted so the close animation runs; `invisible`
          removes closed links from the tab order and the a11y tree. */}
      <div
        id="mobile-menu"
        className={cn(
          'absolute top-full left-0 right-0 bg-surface border-b border-line p-6 flex flex-col gap-6 md:hidden shadow-pop transition-all duration-250 ease-out-snap',
          isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-2',
        )}
      >
        <ul className="flex flex-col gap-4 list-none m-0 p-0">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.name} className="relative">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-sm tracking-wider uppercase font-medium block py-2 rounded-sm focus-visible:focus-ring',
                    active ? 'text-ink' : 'text-ink-2 hover:text-bl-ink',
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
          <Link
            href={ROUTES.contact}
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase py-3 border border-line-strong text-ink text-center transition-all focus-visible:focus-ring active:scale-[0.98]"
          >
            Contact
          </Link>
          <Link
            href={ROUTES.enrol}
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase py-3 bg-blk text-white text-center focus-visible:focus-ring active:scale-[0.98]"
          >
            Enrol Now
          </Link>
          <div className="flex justify-center pt-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
