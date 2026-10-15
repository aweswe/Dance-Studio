import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export const BRAND_LOGO_ALT = 'Rhythmzz Academy of Dance';

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt={BRAND_LOGO_ALT}
      width={896}
      height={697}
      priority={priority}
      className={cn('block h-11 sm:h-12 w-auto object-contain', className)}
    />
  );
}
