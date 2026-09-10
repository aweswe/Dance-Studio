import Link from 'next/link';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#09090B] text-white dark:bg-[#070709] dark:text-[#E4E4E7] pt-16 sm:pt-20 pb-12 px-6 sm:px-10 md:px-14 border-t border-line dark:border-white/10 mt-12 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Column 1: Studio Identity (approx 5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="heading-urban text-2xl sm:text-3xl tracking-tight mb-4 select-none">
                RHYTHMZZ DANCE ACADEMY
              </h3>
              <div className="text-xs sm:text-sm font-medium opacity-85 leading-relaxed space-y-1">
                <p className="font-bold">Secunderabad</p>
                <p>Plot 597, 3rd Floor, Above ICICI ATM,</p>
                <p>Neredmet X Road, Secunderabad 500094</p>
                <p className="pt-3">
                  <a
                    href={`tel:${ACADEMY.phone}`}
                    className="font-bold hover:text-[#FB923C] transition-colors"
                  >
                    +91 90529 80859
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Spacer Column (1 col) */}
          <div className="hidden md:block md:col-span-2" />

          {/* Column 2: SERVICES (2-3 cols) */}
          <div className="md:col-span-2">
            <h4 className="heading-urban text-lg sm:text-xl tracking-wide mb-4 select-none">
              SERVICES
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <li>
                <Link href="#schedule" className="hover:opacity-60 transition-opacity">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="#coaches" className="hover:opacity-60 transition-opacity">
                  Coaches
                </Link>
              </li>
              <li>
                <Link href={ROUTES.programmes} className="hover:opacity-60 transition-opacity">
                  Styles
                </Link>
              </li>
              <li>
                <Link href="#videos" className="hover:opacity-60 transition-opacity">
                  Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: INFO (2-3 cols) */}
          <div className="md:col-span-3">
            <h4 className="heading-urban text-lg sm:text-xl tracking-wide mb-4 select-none">
              INFO
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <li>
                <Link href={ROUTES.about} className="hover:opacity-60 transition-opacity">
                  Who We Are
                </Link>
              </li>
              <li>
                <Link href={ROUTES.contact} className="hover:opacity-60 transition-opacity">
                  Contacts
                </Link>
              </li>
              <li>
                <Link href={ROUTES.enrol} className="hover:opacity-60 transition-opacity">
                  Book A Class
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright hairline */}
        <div className="pt-6 border-t border-current/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest opacity-60">
          <span>&copy; {currentYear} Rhythmzz Academy of Dance. Since 2010.</span>
          <span>Neredmet X Road · Secunderabad</span>
        </div>
      </div>
    </footer>
  );
}


