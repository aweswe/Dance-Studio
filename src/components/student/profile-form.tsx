"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile, uploadProfilePhoto } from "@/actions/profile";

interface ProfileFormProps {
  initial: {
    name: string;
    phone: string;
    email: string;
    photoUrl?: string | null;
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl || "");
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

  return (
    <Card className="p-6 md:p-8 max-w-xl">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-canvas-muted border border-line flex items-center justify-center text-lg font-display">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              name.charAt(0) || "?"
            )}
          </div>
          <label className="text-xs font-semibold uppercase tracking-wider text-bl cursor-pointer">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file);
                setBusy(true);
                const res = await uploadProfilePhoto(fd);
                setBusy(false);
                if (res.success && res.url) setPhotoUrl(res.url);
                setFeedback(
                  res.success
                    ? { ok: true, text: "Photo updated." }
                    : { ok: false, text: res.error || "Could not upload" },
                );
              }}
            />
          </label>
        </div>
        <Input
          id="profile-name"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />

        <div>
          <Input
            id="profile-phone"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile number"
            inputMode="numeric"
          />
          <p className="text-xs text-ink-2 mt-1.5">
            Changing your number also updates your login — use the new number next time you sign in.
          </p>
        </div>

        <Input
          id="profile-email"
          label="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <Button
          onClick={save}
          disabled={busy}
          isLoading={busy}
          className="px-8"
        >
          {busy ? "Saving…" : "Save Changes"}
        </Button>

        {feedback && (
          <p className={`text-sm ${feedback.ok ? "text-green-ink" : "text-danger"}`}>{feedback.text}</p>
        )}
      </div>
    </Card>
  );
}
