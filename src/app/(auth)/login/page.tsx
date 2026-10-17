"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { completeStudentOnboarding } from "@/actions/profile";
import { ACADEMY } from "@/lib/utils/constants";
import { ArrowRight, Loader2, LayoutDashboard, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { triggerActionLoader, dismissActionLoader } from "@/components/shared/navigation-progress";

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

  // Steps: "email" (Google / Email sign-in), "otp" (email verification code), "phone_prompt" (mandatory mobile collection)
  const [step, setStep] = useState<"email" | "otp" | "phone_prompt">(
    () => (searchParams.get("step") === "phone" ? "phone_prompt" : "email"),
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(() => authErrorFromSearch(searchParams));
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

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
        .select("id, phone")
        .eq("auth_id", data.user.id)
        .maybeSingle();

      // If user is authenticated but has no phone registered, mandatory phone step is required
      if ((!student || !student.phone) && !cancelled) {
        setStep("phone_prompt");
        return;
      }

      // User is fully onboarded — look up their role and auto-redirect
      if (!cancelled && student?.phone) {
        const { data: userProfile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        const role = userProfile?.role || "student";
        const dest = role === "admin" ? "/admin" : role === "instructor" ? "/instructor" : "/student";
        setRedirecting(true);
        triggerActionLoader("Welcome back · Loading your portal…");
        router.replace(dest);
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
    if (!agreedTerms) {
      setError("Please accept the Terms and Conditions and Policies before signing in.");
      return;
    }
    setOauthLoading(true);
    triggerActionLoader("Connecting to Google… Redirecting to sign in…");
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      dismissActionLoader();
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setOauthLoading(false);
    }
  }

  // Send Email OTP code
  async function handleSendEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!agreedTerms) {
      setError("Please accept the Terms and Conditions and Policies before signing in.");
      return;
    }
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

      triggerActionLoader("Signing in · Accessing student portal…");
      router.replace("/student");
      router.refresh();
    } catch (err) {
      dismissActionLoader();
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
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 90529 80859 or +91 90529 80859)");
      setIsLoading(false);
      return;
    }

    try {
      triggerActionLoader("Saving number · Preparing your portal…");
      const res = await completeStudentOnboarding(cleanedPhone, name.trim() || undefined);
      if (!res.success) {
        throw new Error(res.error || "Failed to save phone number");
      }
      router.replace("/student");
      router.refresh();
    } catch (err) {
      dismissActionLoader();
      setError(err instanceof Error ? err.message : "Could not complete registration");
      setIsLoading(false);
    }
  }

  const title =
    step === "phone_prompt" ? "Add your number" : step === "otp" ? "Verify email" : "Sign in";
  const eyebrow =
    step === "phone_prompt" ? "WhatsApp for class updates" : "Student portal";

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
      {redirecting ? (
        <div className="text-center space-y-4 py-4">
          <Loader2 size={28} className="animate-spin mx-auto text-bl" />
          <p className="text-sm text-ink-2">Redirecting to your portal…</p>
        </div>
      ) : currentUser && step !== "phone_prompt" ? (
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
                setStep("email");
              }}
              className="text-xs text-ink-3 hover:text-ink py-2"
            >
              Use a different account
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Step 1: Email or Google Login */}
          {step === "email" && (
            <div className="space-y-5">
              <label className="flex items-start gap-2.5 pt-1 text-xs text-ink-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => {
                    setAgreedTerms(e.target.checked);
                    if (e.target.checked) setError("");
                  }}
                  className="mt-0.5 h-4 w-4 rounded border border-line text-bl focus:ring-bl accent-bl cursor-pointer shrink-0"
                  required
                />
                <span className="leading-relaxed">
                  I accept the{" "}
                  <Link href="/terms" target="_blank" className="text-bl font-semibold underline hover:text-ink">
                    Terms and Conditions
                  </Link>
                  ,{" "}
                  <Link href="/terms#student-portal" target="_blank" className="text-bl font-semibold underline hover:text-ink">
                    Student Policy
                  </Link>
                  , and{" "}
                  <Link href="/terms#studio-rules" target="_blank" className="text-bl font-semibold underline hover:text-ink">
                    Studio Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Google One-Click Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={oauthLoading || isLoading || !agreedTerms}
                className="w-full min-h-11 bg-canvas-muted hover:bg-canvas-muted-2 border border-line text-ink text-sm font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-3 focus-visible:focus-ring active:scale-[0.96] transition-all disabled:opacity-50 cursor-pointer"
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

              <div className="flex items-center gap-2.5 my-2">
                <div className="flex-1 h-px bg-line" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
                  or sign in with email
                </span>
                <div className="flex-1 h-px bg-line" />
              </div>

              {/* Email Sign In Form */}
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
                <Button type="submit" className="w-full" disabled={isLoading || !email.trim() || !agreedTerms} isLoading={isLoading}>
                  Send verification code <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>

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
            </div>
          )}

          {/* Step 2: Email Verification OTP */}
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
                Verify &amp; Continue
              </Button>
              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="w-full text-sm text-ink-3 py-2 cursor-pointer hover:text-ink"
              >
                Use a different email
              </button>
            </form>
          )}

          {/* Step 3: Mandatory Mobile Number Collection (Onboarding / Signup) */}
          {step === "phone_prompt" && (
            <form onSubmit={handleSavePhone} className="space-y-4">
              <div className="p-3.5 rounded-md bg-bl/10 border border-bl/30 text-left space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-bl flex items-center gap-1">
                  <ShieldCheck size={13} /> Mobile Number Required
                </span>
                <p className="text-xs text-ink-2 leading-relaxed">
                  We use your WhatsApp mobile number for batch schedules, attendance updates, and fee receipts.
                </p>
              </div>

              <Input
                type="text"
                label="Student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full student name"
              />

              <div>
                <label className="text-xs font-medium text-ink-2 mb-1.5 block">
                  Mobile / WhatsApp Number <span className="text-danger">*</span>
                </label>
                <div className="flex items-stretch">
                  <span className="text-sm text-ink-2 bg-canvas-muted px-3 inline-flex items-center border border-line border-r-0 rounded-l-xl font-mono">
                    +91
                  </span>
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
                Save &amp; Enter Student Portal <ArrowRight className="w-3.5 h-3.5" />
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
