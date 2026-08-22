import { ReactNode } from 'react';
import { Nav } from '@/components/public/nav';
import { Footer } from '@/components/public/footer';
import { WhatsappFloat } from '@/components/public/whatsapp-float';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-blk font-body overflow-x-hidden">
      <Nav />
      <main className="flex-grow flex flex-col pt-[72px]">
        {children}
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}
