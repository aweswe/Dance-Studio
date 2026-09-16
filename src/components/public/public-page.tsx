import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function PublicPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative bg-canvas text-ink min-h-screen transition-colors duration-300', className)}>
      {children}
    </div>
  );
}
