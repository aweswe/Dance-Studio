'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-2.5 bg-white/95 border-b border-black/5 backdrop-blur-md">
      <Link href={ROUTES.home} className="block">
        <Image src="/logo.png" alt="Rhythmzz Logo" width={120} height={44} className="h-11 w-auto" priority />
      </Link>
      
      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 list-none m-0 p-0">
        {[
          { name: 'Programmes', href: ROUTES.programmes },
          { name: 'Schedule', href: `${ROUTES.home}#schedule` },
          { name: 'Gallery', href: ROUTES.gallery },
          { name: 'About', href: ROUTES.about },
          { name: 'Contact', href: ROUTES.contact },
        ].map((link) => (
          <li key={link.name}>
            <Link 
              href={link.href}
              className="text-[11px] tracking-[1.8px] uppercase text-black/45 font-medium hover:text-bl transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop CTAs */}
      <div className="hidden md:flex gap-2.5 items-center">
        <Link 
          href={ROUTES.contact}
          className="text-[11px] font-semibold tracking-[1.8px] uppercase px-5.5 py-2.5 border border-black/20 text-black hover:border-bl hover:text-bl transition-all"
        >
          Contact
        </Link>
        <Link 
          href={ROUTES.enrol}
          className="text-[11px] font-semibold tracking-[1.8px] uppercase px-5.5 py-2.5 bg-blk text-white hover:bg-bl transition-all"
        >
          Enrol Now
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-blk"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="absolute top-full left-0 right-0 bg-white border-b border-black/5 p-6 flex flex-col gap-6 md:hidden shadow-lg">
          <ul className="flex flex-col gap-4 list-none m-0 p-0">
            {[
              { name: 'Programmes', href: ROUTES.programmes },
              { name: 'Schedule', href: `${ROUTES.home}#schedule` },
              { name: 'Gallery', href: ROUTES.gallery },
              { name: 'About', href: ROUTES.about },
              { name: 'Contact', href: ROUTES.contact },
            ].map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className="text-sm tracking-wider uppercase text-black/60 font-medium hover:text-bl block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
            <Link 
              href={ROUTES.contact}
              className="text-xs font-semibold tracking-widest uppercase py-3 border border-black/20 text-black text-center"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href={ROUTES.enrol}
              className="text-xs font-semibold tracking-widest uppercase py-3 bg-blk text-white text-center"
              onClick={() => setIsOpen(false)}
            >
              Enrol Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
