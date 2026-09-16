"use client";

import { Suspense, useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { completeStudentOnboarding } from "@/actions/profile";
import { ACADEMY } from "@/lib/utils/constants";
import { ArrowRight, Loader2, LayoutDashboard } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { demoLogin } from "@/actions/demo-login";

function authErrorFromSearch(params: URLSearchParams): string {
  const err = params.get("error_description") || params.get("error");
  if (!err) return "";
  if (err.toLowerCase().includes("unsupported") || err.toLowerCase().includes("not enabled")) {
    return "Google Sign-In is not enabled in your Supabase project dashboard (Auth → Providers → Google). Please use Email OTP below or enable Google provider.";
  }
  return err;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"phone" | "email" | "otp" | "phone_otp" | "phone_prompt">(
    () => (searchParams.get("step") === "phone" ? "phone_prompt" : "phone"),
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(() => authErrorFromSearch(searchParams));
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDemoLoading, startDemoTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function syncSession() {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data?.user) return;

      setCurrentUser(data.user);

      if (searchParams.get("step") === "phone") {
        setStep("phone_prompt");
        return;
      }

      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", data.user.id)
        .maybeSingle();

      if (!student && !cancelled) {
        setStep("phone_prompt");
      }
    }

    syncSession();
    return () => {
      cancelled = true;
    };
  }, [supabase, searchParams]);

  // Google OAuth Login
  async function handleGoogleLogin() {
    setError("");
    setOauthLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setOauthLoading(false);
    }
  }

  async function handleSendPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { normalizeIndianPhone } = await import("@/lib/utils/format");
    const cleaned = normalizeIndianPhone(phone);
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError("Enter a valid 10-digit Indian mobile number");
      setIsLoading(false);
      return;
    }
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: `+91${cleaned}`,
        options: { shouldCreateUser: true },
      });
      if (authError) throw authError;
      setStep("phone_otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send SMS OTP. Try email below, or ask the academy to enable phone login.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { normalizeIndianPhone } = await import("@/lib/utils/format");
    const cleaned = normalizeIndianPhone(phone);
    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({
        phone: `+91${cleaned}`,
        token: otp.trim(),
        type: "sms",
      });
      if (authError) throw authError;
      if (data?.user) {
        await completeStudentOnboarding(cleaned, name.trim() || undefined);
      }
      router.replace("/student");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
      setIsLoading(false);
    }
  }

  // Send Email OTP
  async function handleSendEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (authError) throw authError;
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  }

  // Verify Email OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: "email",
      });

      if (authError) throw authError;

      // Check if this student already has a phone registered
      if (data?.user) {
        const { data: student } = await supabase
          .from("students")
          .select("id, phone")
          .eq("auth_id", data.user.id)
          .maybeSingle();

        if (!student?.phone) {
          setStep("phone_prompt");
          setIsLoading(false);
          return;
        }
      }

      router.push("/student");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired verification code");
      setIsLoading(false);
    }
  }

  // Mandatory Phone Number Registration after auth
  async function handleSavePhone(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { normalizeIndianPhone } = await import("@/lib/utils/format");
    const cleanedPhone = normalizeIndianPhone(phone);
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9548691732 or +91 95486 91732)");
      setIsLoading(false);
      return;
    }

    try {
      const res = await completeStudentOnboarding(cleanedPhone, name.trim() || undefined);
      if (!res.success) {
        throw new Error(res.error || "Failed to save phone number");
      }
      router.push("/student");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete registration");
      setIsLoading(false);
    }
  }

  const title =
    step === "phone_prompt" ? "Add your number" : "Sign in";
  const eyebrow = step === "phone_prompt" ? "WhatsApp for class updates" : "Student portal";

  return (
    <AuthShell
      eyebrow={eyebrow}
      title={title}
      footer={
        <>
          {ACADEMY.name}
          <br />
          Need help?{" "}
          <a href={`tel:${ACADEMY.phone}`} className="text-ink hover:text-bl">
            {ACADEMY.phoneDisplay}
          </a>
        </>
      }
    >
        {currentUser && step !== "phone_prompt" ? (
          <div className="text-center space-y-4">
            <div className="w-11 h-11 rounded-full bg-canvas-muted border border-line text-ink flex items-center justify-center mx-auto font-semibold">
              {currentUser.email?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <p className="text-xs text-ink-3">Signed in</p>
              <p className="text-sm font-medium text-ink mt-0.5 truncate">{currentUser.email}</p>
            </div>
            <div className="pt-1 flex flex-col gap-2">
              <Button
                className="w-full"
                type="button"
                onClick={() => {
                  router.replace("/student");
                  router.refresh();
                }}
              >
                <LayoutDashboard size={14} /> Open portal <ArrowRight size={14} />
              </Button>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setCurrentUser(null);
                  setStep("phone");
                }}
                className="text-xs text-ink-3 hover:text-ink py-2"
              >
                Use a different account
              </button>
            </div>
          </div>
        ) : (
          <>
            {step === "phone" && (
              <div className="space-y-5">
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-ink-2 mb-1.5 block">Mobile / WhatsApp</label>
                    <div className="flex items-stretch">
                      <span className="text-sm text-ink-2 bg-canvas-muted px-3 inline-flex items-center border border-line border-r-0 rounded-l-xl">+91</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="90529 80859"
                        required
                        className="flex-1 min-h-11 bg-canvas-muted border border-line rounded-r-xl px-3.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20"
                        autoFocus
                      />
                    </div>
                  </div>
                  {error && <p className="text-xs text-danger leading-relaxed">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading || !phone.trim()} isLoading={isLoading}>
                    Send SMS code <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); }}
                  className="w-full text-sm text-ink-2 hover:text-ink py-2"
                >
                  Use email or Google
                </button>
                {process.env.NODE_ENV !== "production" && (
                  <button
                    type="button"
                    onClick={() => {
                      document.cookie = "bypass_student=true; path=/; max-age=86400";
                      router.push("/student");
                    }}
                    className="w-full text-[11px] text-ink-3 hover:text-ink py-1"
                  >
                    Local preview as Aarav
                  </button>
                )}

                {/* Demo student account */}
                <div className="pt-2 border-t border-line">
                  <p className="text-[11px] text-ink-3 text-center mb-2 uppercase tracking-wide font-medium">
                    Try a demo account
                  </p>
                  <button
                    type="button"
                    disabled={isDemoLoading}
                    onClick={() => {
                      setError("");
                      startDemoTransition(async () => {
                        const result = await demoLogin("student");
                        if (result?.error) setError(result.error);
                      });
                    }}
                    className="w-full flex items-center justify-center gap-1.5 min-h-10 px-3 rounded-md border border-line text-sm font-medium text-ink hover:bg-canvas-muted focus-visible:focus-ring active:scale-[0.97] transition-all disabled:opacity-60"
                  >
                    {isDemoLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : null}
                    Demo Student
                  </button>
                  <p className="text-[10px] text-ink-3 text-center mt-1.5">
                    Read-only demo · data may be reset at any time
                  </p>
                </div>
              </div>
            )}

            {step === "phone_otp" && (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                <p className="text-sm text-ink-2 text-center">Code sent to +91 {phone}</p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full min-h-12 bg-canvas-muted border border-line rounded-md px-4 text-ink text-center text-xl tracking-[0.4em] font-mono focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20"
                  autoFocus
                />
                {error && <p className="text-xs text-danger">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6} isLoading={isLoading}>
                  Verify
                </Button>
                <button type="button" onClick={() => { setStep("phone"); setOtp(""); setError(""); }} className="w-full text-sm text-ink-3 py-2">
                  Use a different number
                </button>
              </form>
            )}

            {step === "email" && (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={oauthLoading || isLoading}
                  className="w-full min-h-11 bg-canvas-muted hover:bg-canvas-muted-2 border border-line text-ink text-sm font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-3 focus-visible:focus-ring active:scale-[0.96]"
                >
                  {oauthLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <p className="text-[11px] text-ink-3 text-center">or email code</p>

                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  <Input
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    required
                    autoFocus
                  />
                  {error && <p className="text-xs text-danger leading-relaxed">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading || !email.trim()} isLoading={isLoading}>
                    Send email code <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </form>

                <button
                  type="button"
                  onClick={() => { setStep("phone"); setError(""); }}
                  className="w-full text-sm text-ink-2 hover:text-ink py-2"
                >
                  Back to phone
                </button>
              </div>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-ink-2 text-center">
                  Code sent to <span className="text-ink font-medium">{email}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full min-h-12 bg-canvas-muted border border-line rounded-md px-4 text-ink text-center text-xl tracking-[0.4em] font-mono focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20"
                  autoFocus
                />
                {error && <p className="text-xs text-danger leading-relaxed">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6} isLoading={isLoading}>
                  Verify
                </Button>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                  className="w-full text-sm text-ink-3 py-2"
                >
                  Use a different email
                </button>
              </form>
            )}

            {step === "phone_prompt" && (
              <form onSubmit={handleSavePhone} className="space-y-4">
                <p className="text-sm text-ink-2">
                  We use this number for batch times, receipts, and WhatsApp notices.
                </p>
                <Input
                  type="text"
                  label="Student name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
                <div>
                  <label className="text-xs font-medium text-ink-2 mb-1.5 block">Mobile / WhatsApp</label>
                  <div className="flex items-stretch">
                    <span className="text-sm text-ink-2 bg-canvas-muted px-3 inline-flex items-center border border-line border-r-0 rounded-l-xl">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="90529 80859"
                      maxLength={16}
                      required
                      className="flex-1 min-h-11 bg-canvas-muted border border-line rounded-r-xl px-3.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-bl/50 focus:ring-2 focus:ring-bl/20"
                      autoFocus
                    />
                  </div>
                </div>
                {error && <p className="text-xs text-danger leading-relaxed">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading || !phone.trim()} isLoading={isLoading}>
                  Save and continue <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>
            )}
          </>
        )}
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
