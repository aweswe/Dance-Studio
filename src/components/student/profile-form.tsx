"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile, uploadProfilePhoto } from "@/actions/profile";
import { Users, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ProfileFormProps {
  initial: {
    name: string;
    phone: string;
    email: string;
    photoUrl?: string | null;
    parentName?: string;
    parentPhone?: string;
    parentRelationship?: string;
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl || "");
  const [parentName, setParentName] = useState(initial.parentName || "");
  const [parentPhone, setParentPhone] = useState(initial.parentPhone || "");
  const [parentRelationship, setParentRelationship] = useState(initial.parentRelationship || "Mother");
  const [sameAsStudentPhone, setSameAsStudentPhone] = useState(
    Boolean(
      initial.phone &&
      initial.parentPhone &&
      initial.phone.replace(/\D/g, "") === initial.parentPhone.replace(/\D/g, "")
    )
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Student name must be at least 2 characters";
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = "Enter a valid 10-digit mobile number (starts with 6-9)";
    }
    if (!parentName.trim() || parentName.trim().length < 2) {
      errs.parentName = "Parent or guardian name is mandatory";
    }
    const cleanParentPhone = parentPhone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanParentPhone)) {
      errs.parentPhone = "Valid 10-digit parent phone number is mandatory (starts with 6-9)";
    }
    if (!parentRelationship.trim()) {
      errs.parentRelationship = "Relationship to student is mandatory";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) {
      setFeedback({ ok: false, text: "Please complete all mandatory fields marked with an asterisk (*)." });
      return;
    }

    setBusy(true);
    setFeedback(null);
    const result = await updateProfile({
      name: name.trim(),
      phone: phone.replace(/\D/g, ""),
      email: email.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.replace(/\D/g, ""),
      parentRelationship: parentRelationship.trim(),
    });

    setFeedback(
      result.success
        ? { ok: true, text: "Profile and parents' information successfully updated." }
        : { ok: false, text: result.error || "Could not save — try again" },
    );
    setBusy(false);
  };

  return (
    <Card className="p-6 md:p-8 max-w-xl shadow-xs border-2 border-line">
      <div className="space-y-6">
        {/* Photo Upload */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-canvas-muted border border-line flex items-center justify-center text-lg font-display text-ink">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              name.charAt(0) || "?"
            )}
          </div>
          <label className="text-xs font-semibold uppercase tracking-wider text-bl hover:underline cursor-pointer">
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

        {/* Student Personal Information */}
        <div className="space-y-4">
          <Input
            id="profile-name"
            label="Student Full Name *"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Student's full name"
            error={errors.name}
            required
          />

          <div>
            <Input
              id="profile-phone"
              label="Student Phone Number *"
              value={phone}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(clean);
                if (sameAsStudentPhone) {
                  setParentPhone(clean);
                  if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: '' }));
                }
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              error={errors.phone}
              required
            />
            <p className="text-xs text-ink-2 mt-1.5">
              Primary mobile number used for student dashboard sign in.
            </p>
          </div>

          <Input
            id="profile-email"
            label="Email Address (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MANDATORY PARENT / GUARDIAN INFORMATION SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-5 rounded-md border-2 border-line bg-canvas/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-bl shrink-0" />
              <h3 className="font-anton text-base uppercase tracking-wide text-ink">
                Parents / Guardian Information
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
              Mandatory
            </span>
          </div>
          <p className="text-xs text-ink-2 leading-relaxed">
            Mandatory for academy safety, emergency contacts, fee receipts, and official studio notices.
            No need for a second number — students or adult learners can mark their own mobile number as guardian contact.
          </p>

          <Input
            id="profile-parent-name"
            label="Parent / Guardian Full Name *"
            value={parentName}
            onChange={(e) => {
              setParentName(e.target.value);
              if (errors.parentName) setErrors((prev) => ({ ...prev, parentName: '' }));
            }}
            placeholder="e.g. Rajesh Sharma"
            error={errors.parentName}
            required
          />

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label htmlFor="profile-parent-phone" className="text-xs font-medium text-ink-2">
                Parent / Guardian Mobile Phone *
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-bl hover:text-bl/80 select-none group">
                <input
                  type="checkbox"
                  id="profile-same-phone-toggle"
                  checked={sameAsStudentPhone}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSameAsStudentPhone(checked);
                    if (checked) {
                      setParentPhone(phone);
                      if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: '' }));
                    }
                  }}
                  className="w-3.5 h-3.5 rounded border-line text-bl accent-bl cursor-pointer"
                />
                <span className="group-hover:underline">Same as student mobile</span>
              </label>
            </div>

            <Input
              id="profile-parent-phone"
              value={parentPhone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setParentPhone(val);
                if (val !== phone) {
                  setSameAsStudentPhone(false);
                }
                if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: '' }));
              }}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              error={errors.parentPhone}
              required
            />
            {sameAsStudentPhone && (
              <div className="flex items-center gap-1.5 text-[11px] text-bl font-medium bg-bl/10 border border-bl/20 rounded px-2.5 py-1 mt-1.5">
                <CheckCircle2 size={12} className="text-bl shrink-0" />
                <span>Marked as student&apos;s own number ({phone ? `+91 ${phone}` : "syncs with your student phone"})</span>
              </div>
            )}
            <p className="text-[11px] text-ink-3 mt-1">
              Emergency contact and recipient of official WhatsApp fee receipts. No need for two separate numbers if you share or use your own mobile.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-2 mb-1.5 block">
              Relationship to Student *
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {['Mother', 'Father', 'Guardian', 'Self'].map((rel) => {
                const isSelected = parentRelationship.toLowerCase() === rel.toLowerCase();
                return (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => {
                      setParentRelationship(rel);
                      if (rel === 'Self') {
                        setSameAsStudentPhone(true);
                        if (phone) setParentPhone(phone);
                        if (!parentName.trim() || parentName === initial.name) {
                          setParentName(name || initial.name);
                        }
                        if (errors.parentName) setErrors((prev) => ({ ...prev, parentName: '' }));
                        if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: '' }));
                      }
                      if (errors.parentRelationship) setErrors((prev) => ({ ...prev, parentRelationship: '' }));
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                      isSelected
                        ? "bg-bl text-slate-950 font-bold shadow-2xs"
                        : "bg-surface border border-line text-ink hover:border-ink/40"
                    )}
                  >
                    {rel}
                  </button>
                );
              })}
            </div>
            <Input
              id="profile-parent-relationship"
              value={parentRelationship}
              onChange={(e) => {
                setParentRelationship(e.target.value);
                if (errors.parentRelationship) setErrors((prev) => ({ ...prev, parentRelationship: '' }));
              }}
              placeholder="Or specify (e.g. Aunt, Grandparent)"
              error={errors.parentRelationship}
              required
            />
          </div>
        </div>

        <Button
          onClick={save}
          disabled={busy}
          isLoading={busy}
          className="w-full sm:w-auto px-8"
        >
          {busy ? "Saving…" : "Save Changes"}
        </Button>

        {feedback && (
          <div
            className={cn(
              "p-3 rounded-md text-xs sm:text-sm font-medium flex items-center gap-2 border",
              feedback.ok
                ? "bg-green-500/10 border-green-500/20 text-green-ink"
                : "bg-danger/10 border-danger/20 text-danger"
            )}
          >
            {feedback.ok ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.text}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
