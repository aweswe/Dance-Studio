import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blk text-white pt-20 pb-8 px-6 md:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href={ROUTES.home} className="inline-block mb-6">
              <Image src="/logo.png" alt="Rhythmzz Academy of Dance — logo" width={150} height={55} className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Dance classes at Neredmet X Road, Secunderabad since 2010. Kids, Adults, Fitness &amp; Kuchipudi — 5,000+ students trained. Free trial class. No registration fee.
            </p>
            <p className="heading-display text-2xl text-bl mt-6 tracking-[2px]">FEEL THE BEAT!</p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0 text-sm text-white/50">
              <li><Link href={ROUTES.home} className="hover:text-bl transition-colors">Home</Link></li>
              <li><Link href={ROUTES.programmes} className="hover:text-bl transition-colors">Programmes</Link></li>
              <li><Link href={ROUTES.about} className="hover:text-bl transition-colors">About Us</Link></li>
              <li><Link href={ROUTES.gallery} className="hover:text-bl transition-colors">Gallery</Link></li>
              <li><Link href={ROUTES.contact} className="hover:text-bl transition-colors">Contact</Link></li>
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
              <li><a href={`tel:${ACADEMY.phone}`} className="hover:text-bl transition-colors">{ACADEMY.phoneDisplay}</a></li>
              <li><a href={`mailto:${ACADEMY.email}`} className="hover:text-bl transition-colors">{ACADEMY.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] tracking-[1px] uppercase text-white/30">
            &copy; {currentYear} Rhythmzz Academy of Dance. All rights reserved.
          </p>
          <p className="text-[11px] tracking-[1px] uppercase text-white/30">
            {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
              ? 'Payments secured by Razorpay'
              : 'Neredmet X Road · Secunderabad · +91 90529 80859'}
          </p>
        </div>
      </div>
    </footer>
  );
}
