"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACADEMY } from "@/lib/utils/constants";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = (profile as { role?: string } | null)?.role;
      if (role === "admin") router.push("/admin");
      else if (role === "instructor") router.push("/instructor");
    });
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Sign-in succeeded but no session was returned.");

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role;
      if (role === "admin") {
        router.replace("/admin");
        router.refresh();
      } else if (role === "instructor") {
        router.replace("/instructor");
        router.refresh();
      } else {
        setError("This login is for staff only.");
        await supabase.auth.signOut();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Front desk"
      title="Staff sign in"
      footer={
        <>
          {ACADEMY.name}
          <br />
          Ask the academy if you need an account.
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@rhythmzz.in"
          autoFocus
          required
        />
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <label className="flex items-start gap-2 pt-1 text-xs text-ink-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 rounded border-line text-bl focus:ring-bl accent-bl cursor-pointer"
            required
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="text-bl-ink underline hover:text-ink">
              Terms &amp; Conditions
            </Link>{" "}
            and Staff Guidelines.
          </span>
        </label>
        {error && <p className="text-xs text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading || !agreedTerms} isLoading={isLoading}>
          Sign in <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </form>
    </AuthShell>
  );
}
