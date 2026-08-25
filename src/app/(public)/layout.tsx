import { ReactNode, Suspense } from 'react';
import { PublicHeader } from '@/components/public/public-header';
import { Footer } from '@/components/public/footer';
import { WhatsappFloat } from '@/components/public/whatsapp-float';
import { AnnouncementBanner } from '@/components/public/announcement-banner';
import { getBanner } from '@/data/content';
import { GsapProvider } from '@/components/motion/gsap-provider';

// The banner fetch lives in its own suspending child: loading.tsx does not wrap
// this layout, so awaiting getBanner() here would block the whole route shell.
async function BannerFetcher() {
  const bannerContent = await getBanner();
  return <AnnouncementBanner content={bannerContent ?? undefined} />;
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-blk font-body overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:bg-blk focus:text-white focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a>
      <PublicHeader
        bannerSlot={
          <Suspense fallback={null}>
            <BannerFetcher />
          </Suspense>
        }
      />
      <main id="main" className="flex-grow flex flex-col pt-[var(--public-header-h,72px)]">
        <GsapProvider>{children}</GsapProvider>
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}
