import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogPostBySlug } from '@/data/blog';
import { formatDate } from '@/lib/utils/format';
import { SITE_URL } from '@/lib/utils/constants';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaOutlineLight } from '@/lib/ui/homepage-cta';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts: any[] = (await getBlogPosts()) || [];
  if (posts.length > 0) {
    return posts.map((p) => ({
      slug: p.slug,
    }));
  }
  return [{ slug: 'welcome-to-rhythmzz-dance-academy' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post: any = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on the Rhythmzz Academy blog.`,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      images: post.cover_image_url || post.cover_image ? [post.cover_image_url || post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post: any = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverImg = post.cover_image_url || post.cover_image;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: coverImg ? [coverImg] : [],
    datePublished: post.published_at,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Rhythmzz Academy',
    },
  };

  const meta = [post.author?.name || 'Academy', post.published_at ? formatDate(post.published_at) : 'Draft']
    .filter(Boolean)
    .join(' · ');

  return (
    <PublicPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <PublicPageTitle eyebrow={meta} title={post.title} description={post.excerpt || undefined} />

      <HomepageSection className={sectionPadAfterTitle} innerClassName="px-6 sm:px-10 lg:px-12 xl:px-14">
        <article className="max-w-3xl">
          {coverImg && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden mb-10 border border-line">
              <Image src={coverImg} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-headings:font-anton prose-headings:uppercase prose-a:text-bl prose-img:rounded-md">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-ink-2 py-10">Content is empty.</p>
            )}
          </div>

          <footer className="mt-16 pt-8 border-t border-line">
            <div className="flex items-center gap-6 rounded-md border border-line bg-surface p-6">
              {post.author?.photo_url ? (
                <Image
                  src={post.author.photo_url}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blk text-white flex items-center justify-center text-2xl font-bold shrink-0">
                  {post.author?.name?.charAt(0) || 'R'}
                </div>
              )}
              <div>
                <h2 className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-2">
                  Written by {post.author?.name || 'Academy'}
                </h2>
                {post.author?.bio && <p className="text-sm text-ink-2 leading-relaxed">{post.author.bio}</p>}
              </div>
            </div>

            <div className="mt-8">
              <Link href="/blog" className={homepageCtaOutlineLight}>
                Back to journal
              </Link>
            </div>
          </footer>
        </article>
      </HomepageSection>
    </PublicPage>
  );
}
