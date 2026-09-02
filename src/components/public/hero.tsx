import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/utils/constants';
import { Parallax } from '@/components/motion/parallax';
import { Entrance } from '@/components/motion/entrance';

export function Hero() {
  return (
    <section id="top" className="min-h-screen flex flex-col items-center justify-center text-center bg-blk relative overflow-hidden pt-[110px] px-6 pb-20">
      {/* Authentic stage photography backdrop */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="/images/srilanka-tour/raasta-stage-2.jpg"
          alt="Rhythmzz Stage Performance"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-blk/80 via-blk/90 to-blk z-0 pointer-events-none" />

      {/* Decorative orbs — drift with scroll; LCP elements never animate */}
      <Parallax className="absolute -top-[120px] -left-[120px] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(43,180,216,0.18)_0%,transparent_70%)] pointer-events-none" />
      <Parallax className="absolute -bottom-[80px] -right-[80px] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(43,180,216,0.1)_0%,transparent_70%)] pointer-events-none" />

      <Image
        src="/logo.png"
        alt="Rhythmzz Academy of Dance — dance and fitness classes in Secunderabad"
        width={300}
        height={150}
        className="h-[100px] md:h-[130px] w-auto object-contain relative z-10 mb-6 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        priority
      />

      <div className="w-px h-11 bg-white/10 mx-auto mb-5.5 relative z-10" />

      <p className="text-[10px] tracking-[2px] sm:tracking-[5px] uppercase text-bl-light mb-2 relative z-10 px-4">
        Neredmet X Road · Secunderabad · Teaching Since 2010
      </p>

      <h1 className="heading-display text-4xl sm:text-6xl md:text-display-hero text-white relative z-10 mb-3 leading-tight px-2">
        MOVE WITH <span className="text-bl">RHYTHM</span>
      </h1>

      <Entrance delay={0.1}>
        <p className="text-[10px] sm:text-[11px] tracking-[2px] sm:tracking-[4px] uppercase text-white/40 mb-8 relative z-10 px-4">
          15+ Years · 5,000+ Students · Free Trial Class
        </p>
      </Entrance>

      <Entrance delay={0.22}>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-xs sm:max-w-none mx-auto relative z-10">
          <Link
            href={ROUTES.enrol}
            className="w-full sm:w-auto bg-bl text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 px-9 text-center hover:bg-bl-deep transition-all focus-visible:focus-ring active:scale-[0.98] rounded-control shadow-lg shadow-bl/20"
          >
            Enrol Now
          </Link>
          <Link
            href={ROUTES.programmes}
            className="w-full sm:w-auto bg-transparent text-white text-[11px] font-medium tracking-[2px] uppercase border border-white/20 py-[13px] px-8 text-center hover:border-bl hover:text-bl transition-all focus-visible:focus-ring active:scale-[0.98] rounded-control"
          >
            View Programmes
          </Link>
        </div>
      </Entrance>

      <Entrance delay={0.4} className="absolute bottom-5.5 left-1/2 -translate-x-1/2">
        <div className="text-[9px] tracking-[4px] uppercase text-white/15 flex flex-col items-center gap-1.5">
          <span>Since 2010 — scroll to explore</span>
          <div className="w-px h-7 bg-white/10" />
        </div>
      </Entrance>
    </section>
  );
}
