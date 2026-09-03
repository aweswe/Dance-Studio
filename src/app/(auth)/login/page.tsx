"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { completeStudentOnboarding } from "@/actions/profile";
import { ACADEMY } from "@/lib/utils/constants";
import { Mail, ArrowRight, Loader2, Phone, CheckCircle2, LayoutDashboard } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"email" | "otp" | "phone_prompt">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check if directed to phone prompt via query param or if error returned, and check existing session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser(data.user);
      }
    });

    if (searchParams.get("step") === "phone") {
      setStep("phone_prompt");
    }
    const err = searchParams.get("error_description") || searchParams.get("error");
    if (err) {
      if (err.toLowerCase().includes("unsupported") || err.toLowerCase().includes("not enabled")) {
        setError("Google Sign-In is not enabled in your Supabase project dashboard (Auth → Providers → Google). Please use Email OTP below or enable Google provider.");
      } else {
        setError(err);
      }
    }
  }, [searchParams, supabase]);

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

  return (
    <main className="min-h-screen flex items-center justify-center bg-blk px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-bl/15 flex items-center justify-center mx-auto mb-4 border border-bl/30 shadow-[0_0_20px_rgba(43,180,216,0.2)]">
            {step === "phone_prompt" ? (
              <Phone className="w-5 h-5 text-bl" />
            ) : (
              <Mail className="w-5 h-5 text-bl" />
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider text-white mb-2">
            {step === "phone_prompt" ? "Complete Profile" : "Student Login"}
          </h1>
          <p className="text-xs tracking-[2px] uppercase text-white/40">
            {step === "phone_prompt"
              ? "WhatsApp / Phone for Academy Updates"
              : "Access your dashboard & fee receipts"}
          </p>
        </div>

        {/* Logged in state card */}
        {currentUser && step !== "phone_prompt" ? (
          <div className="p-6 rounded-2xl bg-white/5 border border-bl/30 shadow-[0_0_25px_rgba(43,180,216,0.15)] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-bl/20 text-bl flex items-center justify-center mx-auto border border-bl/40 font-display font-bold text-xl">
              {currentUser.email?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-bl">Currently Signed In</p>
              <p className="text-sm font-semibold text-white mt-1 truncate">{currentUser.email}</p>
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/student"
                className="w-full bg-bl hover:bg-bl-deep text-white font-semibold text-xs tracking-wider uppercase py-3.5 rounded flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                <LayoutDashboard size={14} /> Open Student Portal <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setCurrentUser(null);
                  setStep("email");
                }}
                className="text-xs text-white/50 hover:text-white transition-colors py-1.5"
              >
                Sign Out & Switch Account
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Email or Google Login */}
            {step === "email" && (
              <div className="space-y-5">
                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={oauthLoading || isLoading}
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-medium text-xs tracking-wider uppercase py-3.5 px-4 rounded flex items-center justify-center gap-3 transition-all duration-200 shadow-sm"
                >
                  {oauthLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-bl" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] uppercase tracking-[2px] text-white/30">
                    or with email OTP
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Email OTP Form */}
                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-[2px] uppercase text-white/50 mb-2 block font-medium">
                      Student Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@gmail.com"
                        required
                        className="w-full bg-white/5 border border-white/15 rounded px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-bl/60 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-400 leading-relaxed">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="w-full bg-bl hover:bg-bl-deep text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Send Email OTP <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Bypass for Aarav Sharma */}
                <div className="pt-4 border-t border-white/10 mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      document.cookie = "bypass_student=true; path=/; max-age=86400";
                      router.push("/student");
                    }}
                    className="w-full py-3 px-4 rounded bg-white/5 border border-white/15 text-white/90 hover:border-bl-light hover:text-bl text-[11px] font-semibold tracking-[1px] uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <span>⚡ Instant Demo: Enter as Aarav Sharma</span>
                  </button>
                  <p className="text-[10px] text-white/40 mt-1.5">
                    Instant student portal preview with real fees and attendance
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Email OTP Input */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded p-3 text-center mb-2">
                  <p className="text-xs text-white/50">
                    Verification code sent to:
                  </p>
                  <p className="text-sm text-bl font-medium mt-0.5">{email}</p>
                </div>

                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-white/50 mb-2 block font-medium">
                    Enter 6-digit Code from Email
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="w-full bg-white/5 border border-white/15 rounded px-4 py-3 text-white text-center text-xl tracking-[8px] font-mono placeholder-white/20 focus:outline-none focus:border-bl/60 transition-colors"
                    autoFocus
                  />
                </div>

                {error && <p className="text-xs text-red-400 leading-relaxed">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-bl hover:bg-bl-deep text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify Code & Enter"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-[10px] tracking-[2px] uppercase text-white/40 hover:text-bl transition-colors py-2 text-center"
                >
                  Use a different email
                </button>
              </form>
            )}

            {/* Step 3: Mandatory Mobile Number */}
            {step === "phone_prompt" && (
              <form onSubmit={handleSavePhone} className="space-y-4">
                <div className="bg-bl/10 border border-bl/30 rounded p-4 text-center mb-3">
                  <div className="flex items-center justify-center gap-2 text-bl text-xs font-semibold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4" /> Account Verified
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Please provide your contact number. It is strictly used for studio updates, batch schedules, and fee receipts.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-white/50 mb-2 block font-medium">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Student Name"
                    className="w-full bg-white/5 border border-white/15 rounded px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-bl/60 transition-colors mb-3"
                  />

                  <label className="text-[10px] tracking-[2px] uppercase text-white/50 mb-2 block font-medium">
                    Registered Mobile / WhatsApp Number <span className="text-bl">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60 bg-white/5 px-3 py-3 border border-white/15 rounded-l">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="90529 80859 (or 0 / +91)"
                      maxLength={16}
                      required
                      className="flex-1 bg-white/5 border border-white/15 border-l-0 rounded-r px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-bl/60 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-400 leading-relaxed">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading || !phone.trim()}
                  className="w-full bg-bl hover:bg-bl-deep text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Save & Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* Footer */}
        <p className="text-[10px] text-white/25 text-center mt-8 leading-relaxed">
          Rhythmzz Academy of Dance &bull; Secunderabad
          <br />
          Need assistance? Call{" "}
          <a href={`tel:${ACADEMY.phone}`} className="text-bl/60 hover:text-bl">
            {ACADEMY.phoneDisplay}
          </a>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

