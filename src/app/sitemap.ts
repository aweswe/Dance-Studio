import type { MetadataRoute } from "next";
import { getPublicSupabase } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.rhythmzzdance.com";
  const supabase = getPublicSupabase();
  const buildDate = new Date("2026-01-01T00:00:00.000Z");

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: buildDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/programmes`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/enrol`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/studio-rental`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Programme pages
  const { data: programmes } = await supabase
    .from("programmes")
    .select("slug, updated_at")
    .eq("is_active", true);

  const programmePages: MetadataRoute.Sitemap = ((programmes ?? []) as any[]).map((p) => ({
    url: `${baseUrl}/programmes/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : buildDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  const blogPages: MetadataRoute.Sitemap = ((posts ?? []) as any[]).map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : buildDate,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...programmePages, ...blogPages];
}
