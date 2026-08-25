'use client';

import { useEffect, useRef } from 'react';
import { Nav } from '@/components/public/nav';

/**
 * Fixed header stack (announcement banner + nav). Measures its own height
 * into --public-header-h so <main> can pad itself correctly whether the
 * banner is visible, dismissed, or wraps to two lines — fixes the old
 * banner/nav overlap where the fixed nav sat on top of the banner.
 */
export function PublicHeader({ bannerSlot }: { bannerSlot?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty('--public-header-h', `${el.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--public-header-h');
    };
  }, []);

  return (
    <div ref={ref} className="fixed top-0 left-0 right-0 z-[600]">
      {bannerSlot}
      <Nav />
    </div>
  );
}
