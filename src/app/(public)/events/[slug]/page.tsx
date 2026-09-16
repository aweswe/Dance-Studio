import { createAdminSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EventRsvpForm } from "@/components/public/event-rsvp-form";
import { SITE_URL, ACADEMY } from "@/lib/utils/constants";
import { fallbackEvent } from "@/data/events";
import { whatsappLink } from "@/lib/utils/format";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = fallbackEvent(slug);
  return {
    title: `${event?.title ?? slug.replace(/-/g, " ")} | Rhythmzz Academy`,
    alternates: { canonical: `${SITE_URL}/events/${slug}` },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminSupabase();
  const { data: row } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
  const e = (row as any)?.is_published === false ? null : (row as any) || fallbackEvent(slug);
  if (!e) notFound();

  const when = new Date(e.starts_at).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const dbReady = Boolean(row);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-3">Rhythmzz stage</p>
      <h1 className="font-anton text-5xl sm:text-7xl tracking-tight uppercase">{e.title}</h1>
      <p className="text-ink-2">{when}</p>
      <p className="text-ink-2">{e.venue}</p>
      <p className="text-sm leading-relaxed text-ink">{e.description}</p>
      {dbReady ? (
        <EventRsvpForm slug={slug} />
      ) : (
        <a
          href={whatsappLink(`Hi Rhythmzz, RSVP for ${e.title} — ${when}`)}
          className="inline-flex items-center justify-center bg-bl text-blk font-black uppercase tracking-wider text-xs py-3 px-6 rounded-md"
        >
          RSVP on WhatsApp · {ACADEMY.phoneDisplay}
        </a>
      )}
    </div>
  );
}
