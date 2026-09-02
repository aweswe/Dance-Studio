import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blk text-white pt-20 pb-8 px-6 md:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href={ROUTES.home} className="inline-block mb-6">
              <Image src="/logo.png" alt="Rhythmzz Academy of Dance — logo" width={150} height={55} className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Teaching dance at Neredmet X Road, Secunderabad since 2010. IAO USA accredited. Structured programmes in Kids, Adults, Fitness, and Kuchipudi Classical Certification.
            </p>
            <p className="heading-display text-2xl text-bl mt-6 tracking-[2px]">FEEL THE BEAT!</p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-xs text-white/50">
              <li><Link href={ROUTES.home} className="hover:text-bl transition-colors">Home</Link></li>
              <li><Link href={ROUTES.programmes} className="hover:text-bl transition-colors">Programmes</Link></li>
              <li><Link href="/kuchipudi" className="hover:text-bl transition-colors">Kuchipudi Curriculum</Link></li>
              <li><Link href={ROUTES.about} className="hover:text-bl transition-colors">About Us</Link></li>
              <li><Link href={ROUTES.gallery} className="hover:text-bl transition-colors">Photo Gallery</Link></li>
              <li><Link href={ROUTES.studioRental} className="hover:text-bl transition-colors">Studio Rental</Link></li>
              <li><Link href={ROUTES.contact} className="hover:text-bl transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white mb-5">Portals &amp; SaaS</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-xs text-white/50">
              <li>
                <Link href="/login" className="text-bl-light hover:underline font-semibold flex items-center gap-1.5">
                  <span>Student Portal Login</span>
                </Link>
              </li>
              <li>
                <Link href="/admin-login" className="hover:text-white transition-colors">
                  Instructor &amp; Staff Login
                </Link>
              </li>
              <li>
                <Link href="/admin-login" className="hover:text-white transition-colors">
                  Studio Admin CRM
                </Link>
              </li>
              <li>
                <Link href={ROUTES.enrol} className="hover:text-white transition-colors">
                  Book Free Trial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white mb-5">Studio Location</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-xs text-white/50">
              <li>Beside SBI Bank, Neredmet X Road</li>
              <li>Secunderabad, Telangana 500056</li>
              <li><a href={`tel:${ACADEMY.phone}`} className="hover:text-bl transition-colors">{ACADEMY.phoneDisplay}</a></li>
              <li><a href={`mailto:${ACADEMY.email}`} className="hover:text-bl transition-colors">{ACADEMY.email}</a></li>
              <li className="pt-2 text-[11px] text-white/30">Open 7 Days: 6:00 AM – 9:00 PM</li>
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
              : 'Neredmet X Road · Secunderabad · IAO USA Accredited'}
          </p>
        </div>
      </div>
    </footer>
  );
}
