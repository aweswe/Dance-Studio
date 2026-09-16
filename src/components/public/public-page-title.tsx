import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { cn } from '@/lib/utils/cn';

export function PublicPageTitle({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <HomepageSection className="pt-14 sm:pt-16 pb-4 sm:pb-5">
      <HomepageSectionHeading
        as="h1"
        eyebrow={eyebrow}
        title={title}
        accent={accent}
        description={description}
        className={cn('mb-0', align === 'center' && 'mx-auto text-center')}
      />
    </HomepageSection>
  );
}
