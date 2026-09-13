import Link from 'next/link';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#000000] text-[#FAF6EE] pt-16 sm:pt-20 pb-12 px-6 sm:px-10 md:px-14 border-t border-white/10 mt-12 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto overflow-hidden">
        <div aria-hidden="true" className="font-anton whitespace-nowrap leading-none tracking-wide select-none text-[#FAF6EE] text-[clamp(1.6rem,8vw,9rem)] mb-12">
          RHYTHMZZ DANCE ACADEMY
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Column 1: Studio Identity (approx 5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-xs sm:text-sm font-medium opacity-85 leading-relaxed space-y-1 text-[#FAF6EE]/80">
                <p className="font-bold text-[#FAF6EE]">Secunderabad</p>
                <p>Plot 597, 3rd Floor, Above ICICI ATM,</p>
                <p>Neredmet X Road, Secunderabad 500094</p>
                <p className="pt-3">
                  <a
                    href={`tel:${ACADEMY.phone}`}
                    className="font-bold text-[#F5FB38] hover:text-[#7C5CFC] transition-colors"
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
            <h4 className="font-anton text-xl tracking-wider mb-4 select-none text-[#F5FB38]">
              SERVICES
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <li>
                <Link href={ROUTES.schedule} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href={ROUTES.about} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Coaches
                </Link>
              </li>
              <li>
                <Link href={ROUTES.programmes} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Styles
                </Link>
              </li>
              <li>
                <Link href={ROUTES.syllabus} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Syllabus
                </Link>
              </li>
              <li>
                <Link href={ROUTES.gallery} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href={ROUTES.blog} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: INFO (2-3 cols) */}
          <div className="md:col-span-3">
            <h4 className="font-anton text-xl tracking-wider mb-4 select-none text-[#F5FB38]">
              INFO
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <li>
                <Link href={ROUTES.about} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Who We Are
                </Link>
              </li>
              <li>
                <Link href={ROUTES.contact} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Contacts
                </Link>
              </li>
              <li>
                <Link href={ROUTES.annualDay} className="text-[#FAF6EE]/75 hover:text-[#7C5CFC] transition-colors">
                  Annual Day
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


