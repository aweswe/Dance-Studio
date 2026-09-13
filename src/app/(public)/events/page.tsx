import { createAdminSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { ROUTES, SITE_URL } from "@/lib/utils/constants";
import { FALLBACK_EVENTS } from "@/data/events";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events | Rhythmzz Academy",
  alternates: { canonical: `${SITE_URL}/events` },
};

export default async function EventsIndexPage() {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("events")
    .select("slug, title, starts_at, venue")
    .eq("is_published", true)
    .order("starts_at", { ascending: true });
  const events = data && data.length > 0 ? data : FALLBACK_EVENTS;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-3">Rhythmzz stage</p>
      <h1 className="font-anton text-5xl sm:text-7xl tracking-tight uppercase">Upcoming events</h1>
      <div className="space-y-4">
        {(events as any[]).map((e) => (
          <Link
            key={e.slug}
            href={`${ROUTES.events}/${e.slug}`}
            className="block border border-line rounded-2xl p-6 hover:border-ink/40 transition-colors"
          >
            <h2 className="font-display text-2xl tracking-wide">{e.title}</h2>
            <p className="text-sm text-ink-2 mt-1">
              {new Date(e.starts_at).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              })}
            </p>
            <p className="text-sm text-ink-2">{e.venue}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
