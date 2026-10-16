import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, MapPin, Award, Calendar, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SITE_URL, ROUTES } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';
import { PublicPage } from '@/components/public/public-page';

export const metadata: Metadata = {
  title: 'International Guest Trainers — Masterclass Residencies | Rhythmzz Academy',
  description:
    'Distinguished international dance artists and visiting faculty from the UK, Germany, Israel, and India who have led masterclasses, choreography residencies, and intensive workshops at Rhythmzz Academy of Dance.',
  alternates: { canonical: `${SITE_URL}/guest-trainers` },
};

interface GuestTrainer {
  name: string;
  country: string;
  role: string;
  image: string;
  quote: string;
  bio: string;
  credentials: string[];
  styles: string[];
}

const GUEST_TRAINERS: GuestTrainer[] = [
  {
    name: 'Kay Crook',
    country: 'United Kingdom',
    role: 'Contemporary Choreographer & Technique Specialist',
    image: '/images/guest-trainers/kay-crook.jpg',
    quote: 'Dance transcends linguistic boundaries — it is an exchange of raw physical presence.',
    bio: 'Freelance UK dance artist and Artistic Director of Chhaya Collective working between the UK and India. Toured the acclaimed duet "Antara" across the UK in collaboration with Asian Arts Agency and Interwoven Productions. Completed a 10-month artistic residency in Toronto, Canada, and toured with Map Dance Company.',
    credentials: [
      'MA in Dance Performance (University of Chichester)',
      'Lea Anderson Award for Choreographic Excellence',
      'Valerie Briginshaw Award for Academic Dance Writing',
      'Guest faculty for Attakkalari Centre for Movement Arts',
    ],
    styles: ['Contemporary Release', 'Contact Improvisation', 'Choreographic Composition'],
  },
  {
    name: 'Maria Schneiders',
    country: 'Germany',
    role: 'Contemporary Dance & Somatic Movement Specialist',
    image: '/images/guest-trainers/maria-schneiders.jpg',
    quote: 'Precision in alignment frees the dancer to explore authentic, unrestrained motion.',
    bio: 'German choreographer, performer, and dance educator combining rigorous classical ballet training with fluid European contemporary release and somatic bodywork (Feldenkrais, Biomechanics, Klein Technique). Her choreographies have premiered at Get on stage Festival Dortmund, Dock11 Berlin, and short film projects across Europe.',
    credentials: [
      'Royal Academy of Dance (RAD) & Vaganova Method Trained',
      'Dock11 Berlin & Get on Stage Dortmund Resident Choreographer',
      'Attakkalari Diploma Guest Faculty (Choreographed "Secret Me")',
      'Somatic Bodywork & Movement Improvisation Pioneer',
    ],
    styles: ['Vaganova Ballet Method', 'Contemporary Floorwork', 'Somatic Bodywork'],
  },
  {
    name: 'Atalya Baumer',
    country: 'Israel',
    role: 'Ballet Master & Repertory Choreographer',
    image: '/images/guest-trainers/atalya-baumer.jpg',
    quote: 'Ballet technique is not a limitation; it is the fundamental vocabulary of expression.',
    bio: 'Acclaimed Israeli choreographer, ballet educator, and graduate of the prestigious Kelim Choreographic Center (under Anat Daniely) and Jerusalem Academy of Music and Dance. Multi-year award recipient at the Gertrude Kraus Dance Competition and resident choreographer at the Jerusalem Academy Dancers’ Ensemble.',
    credentials: [
      'Jerusalem Academy of Music and Dance (Teaching & Choreography)',
      'Gertrude Kraus Dance Competition Award Winner (2008, 2009, 2010)',
      'Kelim Center for Young Choreographers Graduate',
      'In-house Choreographer, Academy Dancers’ Ensemble',
    ],
    styles: ['Classical Ballet', 'Modern Jazz Phrasing', 'Stage Dramaturgy'],
  },
  {
    name: 'Ajeesh Balakrishnan',
    country: 'India',
    role: 'Kalaripayattu & Kinetic Contemporary Artist',
    image: '/images/guest-trainers/ajeesh-balakrishnan.jpg',
    quote: 'When martial martial power meets contemporary momentum, the dancer commands the entire room.',
    bio: 'Principal touring performer with Attakkalari since 2006, performing across France, Belgium, and Prague. Collaborated internationally with ICK Amsterdam and Emio Greco Company for the Beyond Project in Seoul and Amsterdam. Co-founder of Chhaya Collective with British artist Kay Crook.',
    credentials: [
      'Attakkalari Centre for Movement Arts (Principal Artist since 2006)',
      'ICK Amsterdam & Emio Greco Beyond Project (Seoul & Europe)',
      'British Council India-UK Connections (Choreographed "Rush")',
      'Master of Traditional Kerala Kalaripayattu Martial Arts',
    ],
    styles: ['Kalaripayattu Martial Movement', 'Kinetic Floorwork', 'Acrobatic Contemporary'],
  },
];

export default function GuestTrainersPage() {
  return (
    <PublicPage>
      {/* ── HERO SECTION ── */}
      <section className="w-full pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-line bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-bl/10 text-bl border border-bl/30">
              <Globe size={13} />
              Global Faculty &amp; Master Residencies
            </span>
            <h1 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-ink">
              International Guest Trainers
            </h1>
            <p className="text-sm sm:text-base text-ink-2 font-body leading-relaxed pt-1">
              Dance is an international language with no borders. Over the past decade, Rhythmzz Academy has hosted master artists, choreographers, and festival directors from the UK, Germany, Israel, and across India to lead intensive residencies, masterclasses, and choreographic commissions for our dancers.
            </p>
          </div>
        </div>
      </section>

      {/* ── RESIDENCY HIGHLIGHTS METRICS ── */}
      <section className="w-full py-8 border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0 border border-bl/20 mt-0.5">
                <Globe size={18} />
              </div>
              <div>
                <h2 className="font-anton text-lg uppercase tracking-wide text-ink">4+ Countries Represented</h2>
                <p className="text-xs text-ink-3 mt-0.5 leading-relaxed">
                  Visiting masters from London, Berlin, Jerusalem, and Bengaluru directing bespoke masterclasses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0 border border-bl/20 mt-0.5">
                <Award size={18} />
              </div>
              <div>
                <h2 className="font-anton text-lg uppercase tracking-wide text-ink">Conservatory Accreditations</h2>
                <p className="text-xs text-ink-3 mt-0.5 leading-relaxed">
                  Royal Academy of Dance, Vaganova Method, University of Chichester, and Attakkalari pedigree.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0 border border-bl/20 mt-0.5">
                <Calendar size={18} />
              </div>
              <div>
                <h2 className="font-anton text-lg uppercase tracking-wide text-ink">Direct Workshop Access</h2>
                <p className="text-xs text-ink-3 mt-0.5 leading-relaxed">
                  Enrolled academy students receive priority registration and masterclass immersion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRAINERS ROSTER ── */}
      <section className="w-full py-14 sm:py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="space-y-12 sm:space-y-16">
            {GUEST_TRAINERS.map((trainer, index) => (
              <div
                key={trainer.name}
                className="rounded-md border border-line bg-surface overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Portrait Visual */}
                  <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] bg-canvas-muted overflow-hidden">
                    <Image
                      src={trainer.image}
                      alt={`${trainer.name} — ${trainer.role}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none lg:hidden" />

                    {/* Location Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 text-white backdrop-blur-md border border-white/20 text-xs font-mono font-bold uppercase tracking-wider">
                      <MapPin size={12} className="text-bl" />
                      <span>{trainer.country}</span>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-bl">
                            Guest Master Faculty
                          </span>
                          <span className="text-line-strong">•</span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-3">
                            {trainer.country}
                          </span>
                        </div>
                        <h2 className="font-anton text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-ink">
                          {trainer.name}
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold text-ink-2">
                          {trainer.role}
                        </p>
                      </div>

                      <blockquote className="pl-3.5 border-l-2 border-bl/50 text-xs sm:text-sm italic text-ink-2 leading-relaxed">
                        &ldquo;{trainer.quote}&rdquo;
                      </blockquote>

                      <p className="text-xs sm:text-sm text-ink-2 font-body leading-relaxed">
                        {trainer.bio}
                      </p>

                      {/* Credentials list */}
                      <div className="space-y-2 pt-2">
                        <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink">
                          Key Accreditations &amp; Engagements
                        </h3>
                        <ul className="space-y-1.5">
                          {trainer.credentials.map((cred, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-ink-2">
                              <CheckCircle2 size={14} className="text-bl shrink-0 mt-0.5" />
                              <span>{cred}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Dance styles pill tags */}
                    <div className="pt-4 border-t border-line-subtle flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-ink-3 mr-1">Styles:</span>
                      {trainer.styles.map((style) => (
                        <span
                          key={style}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold bg-canvas-muted text-ink-2 border border-line"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKSHOP ATTENDANCE / INQUIRY BANNER ── */}
      <section className="w-full py-12 sm:py-16 border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="rounded-md border-2 border-bl/40 bg-bl/5 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-bl">
                Next Guest Masterclass Series
              </span>
              <h2 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide text-ink">
                Train Directly with Visiting International Artists
              </h2>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                Guest faculty workshops are announced seasonally. Connect with our studio desk on WhatsApp to receive priority notifications and early-bird reservation access for upcoming international masterclasses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={whatsappLink(
                  'Hi Rhythmzz Academy, I would like information on upcoming International Guest Trainer workshops and masterclasses.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-6 rounded-md font-bold text-xs uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs active:scale-[0.98]"
              >
                <span>Inquire on WhatsApp</span>
                <ArrowUpRight size={15} strokeWidth={2.2} />
              </a>

              <Link
                href={ROUTES.enrol}
                className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-6 rounded-md font-bold text-xs uppercase tracking-wider border border-line bg-surface hover:bg-canvas-muted text-ink transition-colors"
              >
                <span>Book Free Trial Class</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
