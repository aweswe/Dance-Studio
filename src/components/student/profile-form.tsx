"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { updateProfile } from "@/actions/profile";

interface ProfileFormProps {
  initial: {
    name: string;
    phone: string;
    email: string;
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async () => {
    setBusy(true);
    setFeedback(null);
    const result = await updateProfile({ name, phone, email });
    setFeedback(
      result.success
        ? { ok: true, text: "Profile updated." }
        : { ok: false, text: result.error || "Could not save — try again" },
    );
    setBusy(false);
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-sm outline-none focus:border-bl transition-colors";

  return (
    <Card className="p-6 md:p-8 max-w-xl">
      <div className="space-y-5">
        <div>
          <label htmlFor="profile-name" className="block text-[11px] font-bold tracking-[2px] uppercase text-mu mb-2">
            Full Name
          </label>
          <input
            id="profile-name"
            className={fieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className="block text-[11px] font-bold tracking-[2px] uppercase text-mu mb-2">
            Phone Number
          </label>
          <input
            id="profile-phone"
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile number"
            inputMode="numeric"
          />
          <p className="text-xs text-mu mt-1.5">
            Changing your number also updates your login — use the new number next time you sign in.
          </p>
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-[11px] font-bold tracking-[2px] uppercase text-mu mb-2">
            Email (optional)
          </label>
          <input
            id="profile-email"
            type="email"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <button
          onClick={save}
          disabled={busy}
          className="text-[11px] font-semibold tracking-[2px] uppercase px-8 py-3 bg-bl text-white rounded disabled:opacity-50 transition-all"
        >
          {busy ? "Saving…" : "Save Changes"}
        </button>

        {feedback && (
          <p className={`text-sm ${feedback.ok ? "text-green" : "text-red-500"}`}>{feedback.text}</p>
        )}
      </div>
    </Card>
  );
}
