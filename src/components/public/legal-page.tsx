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
      <PublicPageTitle eyebrow={eyebrow} title={title} description={description} />
      <HomepageSection className={sectionPadAfterTitle}>
        <div className="max-w-3xl space-y-6 text-sm text-ink-2 leading-relaxed">{children}</div>
      </HomepageSection>
    </PublicPage>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-anton text-xl uppercase tracking-tight text-ink">{title}</h2>
      {children}
    </section>
  );
}
