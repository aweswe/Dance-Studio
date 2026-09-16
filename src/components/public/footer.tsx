import Link from 'next/link';
import { BrandLogo } from '@/components/shared/brand-logo';
import { HomepageSection } from '@/components/public/homepage-section';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

const linkClass = 'text-wh/75 hover:text-bl transition-colors';

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav className="w-max max-w-full shrink-0 text-left" aria-label={title}>
      <h4 className="font-anton text-lg tracking-wide mb-3 select-none text-bl">{title}</h4>
      <ul className="flex flex-col gap-1.5 list-none p-0 m-0 text-[11px] sm:text-xs font-bold uppercase tracking-wide">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-blk text-wh border-t border-white/10 transition-colors duration-300">
      <HomepageSection className="pt-10 sm:pt-12 pb-8">
        <div className="mb-6 flex w-full flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-10 lg:flex-nowrap lg:items-start lg:justify-between lg:gap-x-8">
          <div className="w-max max-w-full shrink-0 text-left">
            <Link
              href={ROUTES.home}
              aria-label="Rhythmzz Academy of Dance — home"
              className="inline-block w-fit max-w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
            >
              <BrandLogo className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-full" />
            </Link>
          </div>

          <div className="w-max max-w-[13rem] shrink-0 text-left">
            <h4 className="font-anton text-lg tracking-wide mb-3 select-none text-bl">Secunderabad</h4>
            <div className="text-[11px] sm:text-xs font-medium opacity-85 leading-relaxed space-y-0.5 text-wh/80">
              <p>Plot 597, 3rd Floor, Above ICICI ATM,</p>
              <p>Neredmet X Road, Secunderabad 500094</p>
              <p className="pt-2">
                <a href={`tel:${ACADEMY.phone}`} className="font-bold text-bl hover:text-bl transition-colors">
                  +91 90529 80859
                </a>
              </p>
            </div>
          </div>

          <FooterColumn
            title="Important links"
            links={[
              { href: ROUTES.privacy, label: 'Privacy policy' },
              { href: ROUTES.terms, label: 'Terms & conditions' },
              { href: ROUTES.refund, label: 'Refund policy' },
              { href: ROUTES.shipping, label: 'Shipping & delivery' },
            ]}
          />

          <FooterColumn
            title="Services"
            links={[
              { href: ROUTES.schedule, label: 'Schedule' },
              { href: ROUTES.about, label: 'Coaches' },
              { href: ROUTES.programmes, label: 'Styles' },
              { href: ROUTES.syllabus, label: 'Syllabus' },
              { href: ROUTES.gallery, label: 'Gallery' },
              { href: ROUTES.blog, label: 'Blog' },
            ]}
          />

          <FooterColumn
            title="Info"
            links={[
              { href: ROUTES.about, label: 'Who we are' },
              { href: ROUTES.contact, label: 'Contacts' },
              { href: ROUTES.events, label: 'Events' },
              { href: ROUTES.enrol, label: 'Enrol & pay' },
            ]}
          />
        </div>

        <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full text-[10px] font-mono uppercase tracking-widest opacity-60">
          <span>&copy; {currentYear} Rhythmzz Academy of Dance. Since 2010.</span>
          <span>Neredmet X Road · Secunderabad</span>
        </div>
      </HomepageSection>
    </footer>
  );
}
