import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#0F0F0F] text-white pt-20 pb-8 px-6 md:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href={ROUTES.home} className="inline-block mb-6">
              <Image src="/logo.png" alt="Rhythmzz Logo" width={150} height={55} className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Secunderabad&apos;s premier dance and fitness studio since {ACADEMY.foundingYear}. Moving with rhythm, building community.
            </p>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0 text-sm text-white/50">
              <li><Link href={ROUTES.home} className="hover:text-bl transition-colors">Home</Link></li>
              <li><Link href={ROUTES.about} className="hover:text-bl transition-colors">About Us</Link></li>
              <li><Link href={ROUTES.gallery} className="hover:text-bl transition-colors">Gallery</Link></li>
              <li><Link href={ROUTES.contact} className="hover:text-bl transition-colors">Contact</Link></li>
              <li><Link href={ROUTES.adminLogin} className="hover:text-bl transition-colors">Staff Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white mb-6">Programmes</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0 text-sm text-white/50">
              <li><Link href={ROUTES.programme('kids-dance')} className="hover:text-bl transition-colors">Kids Dance</Link></li>
              <li><Link href={ROUTES.programme('adults-dance')} className="hover:text-bl transition-colors">Adults Dance</Link></li>
              <li><Link href={ROUTES.programme('mind-body-fitness')} className="hover:text-bl transition-colors">Mind & Body Fitness</Link></li>
              <li><Link href={ROUTES.programme('kuchipudi')} className="hover:text-bl transition-colors">Kuchipudi Classical</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white mb-6">Contact</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0 text-sm text-white/50">
              <li>{ACADEMY.address.landmark}</li>
              <li>{ACADEMY.phoneDisplay}</li>
              <li>{ACADEMY.email}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] tracking-[1px] uppercase text-white/30">
            &copy; {currentYear} Rhythmzz Academy of Dance. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] tracking-[1px] uppercase text-white/30">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
