import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SITE_URL } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';
import { PublicPage } from '@/components/public/public-page';

export const metadata: Metadata = {
  title: 'International Guest Trainers | Rhythmzz Academy of Dance',
  description:
    'Visiting international dance faculty and choreographers from the UK, Germany, Israel, and India who have conducted masterclasses and workshops at Rhythmzz Academy of Dance.',
  alternates: { canonical: `${SITE_URL}/guest-trainers` },
};

interface GuestTrainer {
  name: string;
  country: string;
  role: string;
  image: string;
  bio: string;
  highlights: string[];
}

const GUEST_TRAINERS: GuestTrainer[] = [
  {
    name: 'Ajeesh Balakrishnan',
    country: 'India',
    role: 'Kalaripayattu & Contemporary Dance Trainer',
    image: '/images/guest-trainers/ajeesh-balakrishnan.jpg',
    bio: 'Ajeesh has toured internationally with Attakkalari since 2006, performing across Europe and Asia including France, Belgium, Prague, Seoul, and Amsterdam. He has worked with ICK Amsterdam, the Emio Greco Company for the Beyond Project, and toured his choreography "Rush" with the British Council. He co-founded Chhaya Collective with British dance artist Kay Crook.',
    highlights: [
      'Attakkalari Centre for Movement Arts (Principal Performer)',
      'ICK Amsterdam & Emio Greco Beyond Project (Seoul & Europe)',
      'British Council India-UK Connections (Choreographer, "Rush")',
      'Traditional Kerala Kalaripayattu Martial Arts Teacher',
    ],
  },
  {
    name: 'Kay Crook',
    country: 'United Kingdom',
    role: 'Contemporary Trainer & Choreographer',
    image: '/images/guest-trainers/kay-crook.jpg',
    bio: 'Kay Crook is a freelance UK dance artist and the Artistic Director of Chhaya Collective, working between the UK and India. She holds a Masters in Dance Performance and a BA in Dance from the University of Chichester, where she received the Lea Anderson Award for Choreographic Excellence. Kay has conducted workshops for Attakkalari, toured with Map Dance Company, and collaborated with Asian Arts Agency in the UK.',
    highlights: [
      'MA in Dance Performance (University of Chichester)',
      'Artistic Director, Chhaya Collective (UK & India)',
      'Lea Anderson Award for Choreographic Excellence',
      'Guest teacher for Attakkalari Centre for Movement Arts',
    ],
  },
  {
    name: 'Atalya Baumer',
    country: 'Israel',
    role: 'Ballet Trainer & Performer',
    image: '/images/guest-trainers/atalya-baumer.jpg',
    bio: 'Atalya graduated from the Academy of Music and Dance in Jerusalem, holding a Teaching Certificate in Dance and Choreography, and completed the "Kelim" young choreographers program under Anat Daniely. She specializes in modern dance, jazz, and ballet (Vaganova and Chakaty methods), and has won multiple awards at the Gertrude Kraus Annual Dance Competition.',
    highlights: [
      'Academy of Music and Dance in Jerusalem (Dance & Choreography)',
      'Gertrude Kraus Annual Dance Competition Award Winner',
      'Kelim Program for Young Choreographers Graduate',
      'In-house Choreographer, Academy Dancers’ Ensemble',
    ],
  },
  {
    name: 'Maria Schneiders',
    country: 'Germany',
    role: 'Contemporary Dance Teacher & Choreographer',
    image: '/images/guest-trainers/maria-schneiders.jpg',
    bio: 'Maria is a German dancer, choreographer, and teacher trained in Classical Ballet (Royal Academy of Dance and Vaganova Method), contemporary dance, and somatic bodywork (Feldenkrais and Klein Technique). She has worked across Germany and India, presenting choreographies at the Get on Stage Festival in Dortmund, Dock11 Berlin, and the Attakkalari Centre for Movement Arts in Bangalore.',
    highlights: [
      'Royal Academy of Dance (RAD) & Vaganova Method Trained',
      'Resident Choreographer, Dock11 Berlin & Get on Stage Dortmund',
      'Guest Faculty & Choreographer, Attakkalari Diploma Program',
      'Somatic Bodywork & Movement Technique Educator',
    ],
  },
];

export default function GuestTrainersPage() {
  const whatsappInquiryHref = whatsappLink(
    'Hi Rhythmzz Academy, I would like to ask about upcoming workshops with International Guest Trainers.'
  );

  return (
    <PublicPage>
      {/* ── HEADER ── */}
      <section className="w-full pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-line bg-canvas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl space-y-2.5">
            <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-bl">
              Rhythmzz Academy of Dance
            </span>
            <h1 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-ink">
              International Guest Trainers
            </h1>
            <p className="text-sm sm:text-base text-ink-2 font-body leading-relaxed">
              Over the years, Rhythmzz Academy has invited guest artists, choreographers, and educators from around the world to conduct masterclasses and intensive training sessions for our dancers.
            </p>
          </div>
        </div>
      </section>

      {/* ── TRAINERS ROSTER ── */}
      <section className="w-full py-10 sm:py-16 bg-canvas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="space-y-8 sm:space-y-12">
            {GUEST_TRAINERS.map((trainer) => (
              <div
                key={trainer.name}
                className="rounded-md border border-line bg-surface overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Portrait - Responsive Image */}
                  <div className="md:col-span-4 lg:col-span-4 relative aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:min-h-[320px] bg-canvas-muted overflow-hidden">
                    <Image
                      src={trainer.image}
                      alt={`${trainer.name} — ${trainer.role}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-md text-[11px] font-mono font-bold uppercase tracking-wider border border-white/15">
                      <MapPin size={11} className="text-bl" />
                      <span>{trainer.country}</span>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="md:col-span-8 lg:col-span-8 p-5 sm:p-7 lg:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-3">
                          Visiting Faculty · {trainer.country}
                        </span>
                        <h2 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide text-ink mt-0.5">
                          {trainer.name}
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold text-bl mt-0.5">
                          {trainer.role}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-ink-2 font-body leading-relaxed">
                        {trainer.bio}
                      </p>

                      {/* Highlights */}
                      <div className="pt-1 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-3 block">
                          Key Background
                        </span>
                        <ul className="space-y-1">
                          {trainer.highlights.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-ink-2">
                              <CheckCircle2 size={13} className="text-bl shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKSHOP INQUIRY CARD ── */}
      <section className="w-full py-10 sm:py-14 border-t border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="rounded-md border border-line bg-canvas p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1 max-w-xl">
              <h2 className="font-anton text-xl sm:text-2xl uppercase tracking-wide text-ink">
                Guest Masterclasses &amp; Workshops
              </h2>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                Want to know about upcoming international guest workshops and masterclasses? Reach out to our studio desk on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <a
                href={whatsappInquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-6 rounded-md font-bold text-xs uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Inquire on WhatsApp</span>
                <ArrowUpRight size={15} strokeWidth={2.2} />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-5 rounded-md font-bold text-xs uppercase tracking-wider border border-line bg-surface text-ink hover:border-ink/40 transition-colors active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Contact Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
