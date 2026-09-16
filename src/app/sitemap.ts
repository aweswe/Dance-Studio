import type { MetadataRoute } from "next";
import { getPublicSupabase } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/utils/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const buildDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: buildDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/programmes`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/schedule`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/enrol`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/studio-rental`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/events`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/events/annual-day`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/syllabus`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/syllabus/kuchipudi`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/syllabus/kathak`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/shipping`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  const supabase = getPublicSupabase();
  if (!supabase) {
    return staticPages;
  }

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

  const { data: events } = await supabase
    .from("events")
    .select("slug, starts_at")
    .eq("is_published", true);

  const eventPages: MetadataRoute.Sitemap = ((events ?? []) as any[]).map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: e.starts_at ? new Date(e.starts_at) : buildDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...programmePages, ...blogPages, ...eventPages];
}
