'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Lock, CheckCircle2, AlertCircle, Loader2, ShieldAlert, User, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { updateInstructorPhoto, sendInstructorPasswordReset } from '@/actions/instructor-profile';

interface InstructorProfileFormProps {
  instructor: {
    id: string;
    name: string;
    email: string | null;
    role: string | null;
    bio: string | null;
    certifications: string[] | null;
    phone: string | null;
    photo_url: string | null;
  };
  userEmail: string;
}

type Msg = { ok: boolean; text: string } | null;

export function InstructorProfileForm({ instructor, userEmail }: InstructorProfileFormProps) {
  const [photoUrl, setPhotoUrl] = useState(instructor.photo_url || '');
  const [photoPreview, setPhotoPreview] = useState(instructor.photo_url || '');
  const [photoMsg, setPhotoMsg] = useState<Msg>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const [pwMsg, setPwMsg] = useState<Msg>(null);
  const [pwBusy, setPwBusy] = useState(false);
  const [directResetLink, setDirectResetLink] = useState<string | null>(null);
  const [resetCopied, setResetCopied] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Handle local file selection — convert to data URL for preview,
  // then upload via Vercel Blob (if configured) or store as object URL note
  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    if (!file.type.startsWith('image/')) {
      setPhotoMsg({ ok: false, text: 'Please select an image file (JPG, PNG, WebP)' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoMsg({ ok: false, text: 'Image must be under 5 MB' });
      return;
    }

    setPhotoBusy(true);
    setPhotoMsg(null);

    try {
      // Try Vercel Blob upload
      const { upload } = await import('@vercel/blob/client');
      const blob = await upload(
        `instructor-photos/${instructor.id}-${Date.now()}.${file.name.split('.').pop()}`,
        file,
        { access: 'public', handleUploadUrl: '/api/blob/upload' },
      );
      const url = blob.url;
      setPhotoPreview(url);
      const res = await updateInstructorPhoto(url);
      setPhotoMsg(res.success
        ? { ok: true, text: 'Profile photo updated!' }
        : { ok: false, text: res.error ?? 'Could not save photo' });
    } catch {
      // Fallback: use a data URL as preview and a placeholder save
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        setPhotoPreview(dataUrl);
        // Can't persist a data URL to DB; tell user to use URL instead
        setPhotoMsg({ ok: false, text: 'Direct upload requires Vercel Blob. Paste a photo URL below instead.' });
        setPhotoBusy(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    setPhotoBusy(false);
  }

  async function handleUrlSave() {
    if (!photoUrl.trim()) {
      setPhotoMsg({ ok: false, text: 'Enter a valid image URL' });
      return;
    }
    setPhotoBusy(true);
    setPhotoMsg(null);
    const res = await updateInstructorPhoto(photoUrl.trim());
    setPhotoPreview(photoUrl.trim());
    setPhotoMsg(res.success
      ? { ok: true, text: 'Profile photo updated!' }
      : { ok: false, text: res.error ?? 'Could not save' });
    setPhotoBusy(false);
  }

  async function handlePasswordReset() {
    setPwBusy(true);
    setPwMsg(null);
    setDirectResetLink(null);
    const res = await sendInstructorPasswordReset();
    if (res.success) {
      setPwMsg({ ok: true, text: `Password reset link sent to ${res.email}. Check your inbox.` });
      if (res.directLink) {
        setDirectResetLink(res.directLink);
      }
    } else {
      setPwMsg({ ok: false, text: res.error ?? 'Could not send reset email' });
    }
    setPwBusy(false);
  }

  const initial = instructor.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-8 max-w-2xl">

      {/* === Profile Photo === */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Camera size={15} className="text-bl" />
          <h3 className="text-sm font-bold text-ink tracking-wide uppercase">Profile Photo</h3>
        </div>

        <div className="flex items-center gap-5">
          {/* Avatar preview */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-line-strong bg-canvas-muted flex items-center justify-center">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt={instructor.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized={photoPreview.startsWith('data:')}
                />
              ) : (
                <span className="font-anton text-3xl text-bl">{initial}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-bl text-slate-950 flex items-center justify-center shadow-md hover:bg-bl-deep transition-colors"
              title="Upload photo"
            >
              <Camera size={12} strokeWidth={2.5} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handlePhotoFile}
            />
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-xs text-ink-2">Click the camera icon to upload, or paste an image URL below.</p>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 h-9 bg-surface border border-line-strong rounded-control px-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-1 focus:ring-bl/20 transition-all"
              />
              <Button size="sm" onClick={handleUrlSave} disabled={photoBusy} isLoading={photoBusy}>
                Save
              </Button>
            </div>
          </div>
        </div>

        {photoMsg && (
          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md ${photoMsg.ok ? 'bg-green/10 text-green' : 'bg-danger/10 text-danger'}`}>
            {photoMsg.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            {photoMsg.text}
          </div>
        )}
      </Card>

      {/* === Password Reset === */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={15} className="text-bl" />
          <h3 className="text-sm font-bold text-ink tracking-wide uppercase">Password / Login</h3>
        </div>
        <p className="text-xs text-ink-2">
          Signed in as <strong className="text-ink">{userEmail}</strong>.
          Click below to receive a password reset link in your email.
        </p>
        <Button variant="outline" onClick={handlePasswordReset} disabled={pwBusy} isLoading={pwBusy} className="gap-2">
          <Lock size={14} />
          Send password reset email
        </Button>
        {pwMsg && (
          <div className={`space-y-2 text-xs px-3.5 py-3 rounded-md ${pwMsg.ok ? 'bg-green/10 text-green border border-green/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
            <div className="flex items-center gap-2">
              {pwMsg.ok ? <CheckCircle2 size={14} className="shrink-0" /> : <AlertCircle size={14} className="shrink-0" />}
              <span>{pwMsg.text}</span>
            </div>
            {directResetLink && (
              <div className="pt-2 border-t border-green/20 space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-ink">
                  Direct Reset Link (Immediate Access):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={directResetLink}
                    className="flex-1 bg-canvas-muted text-ink px-2.5 py-1.5 rounded text-[11px] font-mono border border-line select-all"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(directResetLink);
                      setResetCopied(true);
                      setTimeout(() => setResetCopied(false), 2000);
                    }}
                    className="h-7 text-xs"
                  >
                    {resetCopied ? 'Copied!' : 'Copy'}
                  </Button>
                  <a
                    href={directResetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 px-2.5 rounded bg-bl text-slate-950 font-bold text-xs inline-flex items-center gap-1 hover:bg-bl-deep transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* === Admin-managed fields (read-only) === */}
      <Card className="p-6 space-y-4">
        <div className="flex items-start gap-2 mb-1">
          <ShieldAlert size={15} className="text-ink-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-ink tracking-wide uppercase">Academy-Managed Profile</h3>
            <p className="text-xs text-ink-3 mt-0.5">Contact studio administration to update these details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Full Name', value: instructor.name },
            { label: 'Role / Title', value: instructor.role || '—' },
            { label: 'Email', value: instructor.email || '—' },
            { label: 'WhatsApp / Phone', value: instructor.phone || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <p className="text-[10px] text-ink-3 uppercase tracking-wider font-mono">{label}</p>
              <p className="text-sm text-ink-2 bg-canvas-muted rounded-md px-3 py-2 border border-line cursor-not-allowed select-text">
                {value}
              </p>
            </div>
          ))}
        </div>

        {instructor.bio && (
          <div className="space-y-1">
            <p className="text-[10px] text-ink-3 uppercase tracking-wider font-mono">Bio</p>
            <p className="text-sm text-ink-2 bg-canvas-muted rounded-md px-3 py-2 border border-line leading-relaxed cursor-not-allowed select-text">
              {instructor.bio}
            </p>
          </div>
        )}

        {(instructor.certifications ?? []).length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-ink-3 uppercase tracking-wider font-mono">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {(instructor.certifications ?? []).map((c, i) => (
                <span key={i} className="text-xs bg-canvas-muted border border-line rounded-full px-2.5 py-0.5 text-ink-2">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
