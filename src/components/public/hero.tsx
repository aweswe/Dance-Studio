import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/utils/constants';

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center bg-blk relative overflow-hidden pt-[110px] px-6 pb-20">
      <div className="absolute -top-[120px] -left-[120px] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(43,180,216,0.18)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[80px] -right-[80px] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(43,180,216,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <Image 
        src="/logo.png" 
        alt="Rhythmzz Logo" 
        width={300} 
        height={150} 
        className="h-[150px] w-auto brightness-0 invert relative z-10 mb-6" 
        priority 
      />
      
      <div className="w-px h-11 bg-white/10 mx-auto mb-5.5 relative z-10" />
      
      <h1 className="heading-display text-[clamp(60px,10vw,120px)] text-white relative z-10 mb-2">
        MOVE WITH <span className="text-bl">RHYTHM</span>
      </h1>
      
      <p className="text-[11px] tracking-[4px] uppercase text-white/30 mb-9 relative z-10">
        Secunderabad&apos;s Premier Dance & Fitness Studio
      </p>
      
      <div className="flex gap-3 justify-center flex-wrap relative z-10">
        <Link 
          href={ROUTES.enrol}
          className="bg-bl text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 px-9 hover:opacity-85 transition-opacity"
        >
          Enrol Now
        </Link>
        <Link 
          href={ROUTES.programmes}
          className="bg-transparent text-white text-[11px] font-medium tracking-[2px] uppercase border border-white/20 py-[13px] px-8 hover:border-bl hover:text-bl transition-all"
        >
          View Programmes
        </Link>
      </div>
      
      <div className="absolute bottom-5.5 left-1/2 -translate-x-1/2 text-[9px] tracking-[4px] uppercase text-white/15 flex flex-col items-center gap-1.5">
        <span>Scroll to explore</span>
        <div className="w-px h-7 bg-white/10" />
      </div>
    </section>
  );
}
