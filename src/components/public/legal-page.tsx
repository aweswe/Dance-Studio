import type { ReactNode } from 'react';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';

export function LegalPage({
  eyebrow = 'Legal',
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <PublicPage>
      <PublicPageTitle eyebrow={eyebrow} title={title} description={description} align="center" />
      <HomepageSection className={sectionPadAfterTitle}>
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-ink-2 leading-relaxed">
          {children}
        </div>
      </HomepageSection>
    </PublicPage>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-md border border-line bg-surface p-6 sm:p-7 shadow-xs">
      <h2 className="font-anton text-xl sm:text-2xl uppercase tracking-tight text-ink border-b border-line pb-2.5">
        {title}
      </h2>
      <div className="text-ink-2 space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
