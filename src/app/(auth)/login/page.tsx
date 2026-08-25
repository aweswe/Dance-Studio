"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACADEMY } from "@/lib/utils/constants";
import { MessageCircle, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const unlinked = searchParams.get("error") === "unlinked";
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const cleaned = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError("Enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: `+91${cleaned}`,
        options: { channel: "whatsapp" },
      });

      if (authError) throw authError;
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const cleaned = phone.replace(/\D/g, "");

    try {
      const { error: authError } = await supabase.auth.verifyOtp({
        phone: `+91${cleaned}`,
        token: otp,
        type: "sms",
      });

      if (authError) throw authError;
      router.push("/student");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-blk px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-bl/15 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-5 h-5 text-bl" />
          </div>
          <h1 className="font-display text-4xl tracking-wider text-white mb-2">
            Student Login
          </h1>
          <p className="text-xs tracking-[3px] uppercase text-white/30">
            via WhatsApp OTP
          </p>
        </div>

        {/* Unlinked number panel */}
        {unlinked && (
          <div className="mb-8 border border-gold/40 bg-gold/10 rounded p-5 text-center">
            <p className="text-xs tracking-[2px] uppercase text-gold mb-2">
              Number not linked yet
            </p>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              This number isn&apos;t connected to an enrolled student. If you
              just joined, the studio will enable your login shortly — or
              message us and we&apos;ll set it up right away.
            </p>
            <a
              href={ACADEMY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gold text-black text-[11px] font-semibold tracking-[2px] uppercase py-3 flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp the Studio
            </a>
            <p className="text-[10px] text-white/30 mt-3">
              or call{" "}
              <a href={`tel:${ACADEMY.phone}`} className="text-bl/60 hover:text-bl">
                {ACADEMY.phoneDisplay}
              </a>
            </p>
          </div>
        )}

        {/* Phone Step */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-white/40 mb-2 block">
                Registered Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/50 bg-white/5 px-3 py-3 border border-white/10 rounded-l">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="90529 80859"
                  maxLength={10}
                  className="flex-1 bg-white/5 border border-white/10 border-l-0 rounded-r px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-bl/50 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-bl text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 flex items-center justify-center gap-2 hover:opacity-85 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send OTP <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-white/40 text-center mb-2">
              OTP sent to{" "}
              <span className="text-white/70">+91 {phone}</span>
            </p>

            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-white/40 mb-2 block">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="• • • • • •"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-center text-lg tracking-[8px] font-mono placeholder-white/20 focus:outline-none focus:border-bl/50 transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-bl text-white text-[11px] font-semibold tracking-[2px] uppercase py-3.5 flex items-center justify-center gap-2 hover:opacity-85 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify & Login"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="w-full text-[10px] tracking-[2px] uppercase text-white/30 hover:text-bl transition-colors py-2"
            >
              Change number
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-[10px] text-white/20 text-center mt-8 leading-relaxed">
          Login available for enrolled students only.
          <br />
          Call{" "}
          <a href={`tel:${ACADEMY.phone}`} className="text-bl/60 hover:text-bl">
            {ACADEMY.phoneDisplay}
          </a>{" "}
          for help.
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
