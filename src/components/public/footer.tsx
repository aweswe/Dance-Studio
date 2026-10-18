import Link from 'next/link';
import Image from 'next/image';
import { BrandLogo } from '@/components/shared/brand-logo';
import { HomepageSection } from '@/components/public/homepage-section';
import { ROUTES, ACADEMY } from '@/lib/utils/constants';

const linkClass = 'text-wh/75 hover:text-bl transition-colors';

function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinktreeIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
            <div className="mt-3">
              <Image
                src="/images/branding/feel-the-beat.png"
                alt="Feel The Beat — Tagline"
                width={170}
                height={34}
                className="h-6 sm:h-7 w-auto object-contain opacity-90 select-none drop-shadow-sm"
              />
            </div>
            <div className="mt-4 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-white/15 bg-white/5">
              <div className="relative h-8 w-8 rounded-full bg-white p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/branding/iao-logo.png"
                  alt="IAO USA Accreditation Logo"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white">IAO Accredited</span>
                <span className="block text-[9px] font-mono text-white/60 uppercase">USA Standard · Est. 2014</span>
              </div>
            </div>
          </div>

          <div className="w-max max-w-[15rem] shrink-0 text-left">
            <h4 className="font-anton text-lg tracking-wide mb-3 select-none text-bl">Secunderabad</h4>
            <div className="text-[11px] sm:text-xs font-medium opacity-85 leading-relaxed space-y-0.5 text-wh/80">
              <p>Plot 597, 3rd Floor, Above Jawed Habib,</p>
              <p>Defence Colony, Jawahar Nagar,</p>
              <p>Behind Neredmet X Road Bus Stop,</p>
              <p>Secunderabad, Telangana 500094</p>
              <p className="pt-2">
                <a href={`tel:${ACADEMY.phone}`} className="font-bold text-bl hover:text-bl transition-colors">
                  {ACADEMY.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          <FooterColumn
            title="Important links"
            links={[
              { href: ROUTES.adminLogin, label: 'Admin & Staff Login' },
              { href: ROUTES.privacy, label: 'Privacy policy' },
              { href: ROUTES.terms, label: 'Terms & conditions' },
              { href: ROUTES.refund, label: 'Refund & return policy' },
              { href: ROUTES.shipping, label: 'Shipping & delivery' },
            ]}
          />

          <FooterColumn
            title="Services"
            links={[
              { href: ROUTES.pricing, label: 'Pricing & Plans' },
              { href: ROUTES.gear, label: 'Rhythmzz Gear' },
              { href: ROUTES.schedule, label: 'Schedule' },
              { href: ROUTES.studioRental, label: 'Studio Rental' },
              { href: ROUTES.programmes, label: 'Programmes' },
              { href: ROUTES.syllabus, label: 'Syllabus' },
              { href: ROUTES.gallery, label: 'Gallery' },
              { href: ROUTES.blog, label: 'Blog' },
            ]}
          />

          <FooterColumn
            title="About Us"
            links={[
              { href: ROUTES.about, label: 'Who we are' },
              { href: `${ROUTES.about}#founders`, label: 'Founders & Team' },
              { href: ROUTES.eventsAchievements, label: 'Achievements & Press' },
              { href: ROUTES.guestTrainers, label: 'International Guest Trainers' },
              { href: '/teach-with-us', label: 'Teach with us' },
              { href: ROUTES.contact, label: 'Contacts' },
              { href: ROUTES.events, label: 'Upcoming Events' },
              { href: ROUTES.enrol, label: 'Enrol & pay' },
            ]}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            CONNECT STRIP (SOCIAL MEDIA ONLY — NO BUTTONS)
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="py-5 my-5 border-t border-white/10 flex items-center justify-between sm:justify-start gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-wh/70">
            Connect:
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/rhythmzzdance.live"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Rhythmzz on Instagram"
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:border-bl hover:text-bl text-wh/80 flex items-center justify-center transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.facebook.com/rhythmzzdance"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Rhythmzz on Facebook"
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:border-bl hover:text-bl text-wh/80 flex items-center justify-center transition-colors"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linktr.ee/rhythmzzdance.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Rhythmzz Linktree Hub"
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:border-bl hover:text-bl text-wh/80 flex items-center justify-center transition-colors"
            >
              <LinktreeIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://wa.me/919052980859"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Rhythmzz on WhatsApp"
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:border-bl hover:text-bl text-wh/80 flex items-center justify-center transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full text-[10px] font-mono uppercase tracking-widest opacity-60">
          <span>&copy; {currentYear} Rhythmzz Academy of Dance. Since 2010.</span>
          <span>Neredmet X Road · Secunderabad</span>
        </div>
      </HomepageSection>
    </footer>
  );
}
