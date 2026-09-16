"use client";

import { useState } from "react";
import { rsvpEvent } from "@/actions/studio";
import { Input } from "@/components/ui/input";
import { indianPhoneSchema } from "@/lib/validators/phone";
import { homepageCtaBrand, homepageCtaPairButton } from '@/lib/ui/homepage-cta';
import { cn } from '@/lib/utils/cn';

export function EventRsvpForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = indianPhoneSchema.safeParse(phone);
    if (!parsed.success) {
      setMsg(parsed.error.issues[0]?.message || "Enter a valid phone");
      return;
    }
    setBusy(true);
    const res = await rsvpEvent(slug, name.trim(), parsed.data, guests);
    setMsg(res.success ? "You're on the list. See you at the showcase." : res.error || "Could not RSVP");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-3 text-left">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp number" required />
      <label className="text-xs text-ink-2">
        Guests
        <input
          type="number"
          min={1}
          max={12}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="ml-2 w-16 border border-line rounded-md px-2 py-1"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className={cn(homepageCtaBrand, homepageCtaPairButton, 'cursor-pointer disabled:opacity-60')}
      >
        {busy ? "Saving…" : "RSVP"}
      </button>
      {msg && <p className="text-sm text-ink-2">{msg}</p>}
    </form>
  );
}
