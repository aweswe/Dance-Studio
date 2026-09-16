import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '@/data/blog';
import { formatDate } from '@/lib/utils/format';
import { ArrowRight } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionPadAfterTitleLg } from '@/lib/ui/section-layout';

export const metadata: Metadata = {
  title: 'Journal & Insights | Rhythmzz Academy of Dance',
  description:
    'Dance conditioning, choreography breakdowns, performance culture, and community stories from Rhythmzz Academy in Secunderabad.',
};

export default async function BlogPage() {
  const posts: any[] = (await getBlogPosts()) || [];

  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Journal"
        title="From the studio"
        description="Essays on movement mechanics, musicality, performance mindset, and academy news from our coaching faculty."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between rounded-md overflow-hidden border border-line bg-surface hover:border-ink/30 transition-colors"
              >
                <div className="relative aspect-video bg-canvas w-full overflow-hidden border-b border-line">
                  {post.cover_image_url || post.cover_image ? (
                    <Image
                      src={post.cover_image_url || post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-3 text-xs bg-surface">
                      Rhythmzz Journal
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-bl">
                        {post.author?.name || 'Academy'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-ink-3">
                        {post.published_at ? formatDate(post.published_at) : ''}
                      </span>
                    </div>

                    <h2 className="font-anton text-2xl mb-2 text-ink group-hover:text-bl transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-sm text-ink-2 line-clamp-2 mb-6 leading-relaxed">{post.excerpt}</p>
                  </div>

                  <div className="pt-3 border-t border-line flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-bl">
                    <span>Read article</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-md border border-line max-w-lg mx-auto p-10">
            <h2 className="font-anton text-3xl mb-2 text-ink uppercase">No posts yet</h2>
            <p className="text-sm text-ink-2">Check back soon for new choreo breakdowns and technique essays.</p>
          </div>
        )}
      </HomepageSection>
    </PublicPage>
  );
}
