'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Nav } from '@/components/public/nav';
import { cn } from '@/lib/utils/cn';

/**
 * Fixed header stack (announcement banner + nav).
 * On the homepage ('/'), the hero frame natively embeds the top navbar matching
 * the urban editorial reference, so this fixed bar gracefully slides in once scrolled.
 * On all other pages, it provides standard header spacing and visibility.
 */
export function PublicHeader({ bannerSlot }: { bannerSlot?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      // On homepage, we don't pad main so hero touches the top naturally
      const height = isHome ? 0 : el.offsetHeight;
      document.documentElement.style.setProperty('--public-header-h', `${height}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--public-header-h');
    };
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <div
      ref={ref}
      className={cn(
        'fixed top-0 left-0 right-0 z-[600] transition-all duration-300 ease-out',
        isHome && !scrolled
          ? 'opacity-0 pointer-events-none -translate-y-6'
          : 'opacity-100 pointer-events-auto translate-y-0'
      )}
    >
      {bannerSlot}
      <Nav />
    </div>
  );
}

