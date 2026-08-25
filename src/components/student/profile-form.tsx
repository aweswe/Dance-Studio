"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <Card className="p-6 md:p-8 max-w-xl">
      <div className="space-y-5">
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
