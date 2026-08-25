"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACADEMY } from "@/lib/utils/constants";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Get role and redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = (profile as any)?.role;
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "instructor") {
          router.push("/instructor");
        } else {
          setError("Access denied. Admin or Instructor accounts only.");
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-blk px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-white/40" />
          </div>
          <h1 className="font-display text-4xl tracking-wider text-white mb-2">
            Staff Login
          </h1>
          <p className="text-xs tracking-[3px] uppercase text-white/30">
            Admin & Instructors
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-white/40 mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rhythmzz.in"
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-bl/50 transition-colors"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-white/40 mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-bl/50 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-blk text-[11px] font-semibold tracking-[2px] uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-white/20 text-center mt-8 leading-relaxed">
          {ACADEMY.name}
          <br />
          Contact admin for account access.
        </p>
      </div>
    </main>
  );
}
