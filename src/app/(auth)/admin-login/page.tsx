"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACADEMY } from "@/lib/utils/constants";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { demoLogin, type DemoRole } from "@/actions/demo-login";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);
  const [isPending, startTransition] = useTransition();
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

  function handleDemoLogin(role: DemoRole) {
    setError("");
    setDemoRole(role);
    startTransition(async () => {
      const result = await demoLogin(role);
      if (result?.error) {
        setError(result.error);
        setDemoRole(null);
      }
    });
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
        {error && <p className="text-xs text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
          Sign in <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </form>

      {/* Demo accounts */}
      <div className="mt-6 pt-5 border-t border-line">
        <p className="text-[11px] text-ink-3 text-center mb-3 uppercase tracking-wide font-medium">
          Try a demo account
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleDemoLogin("admin")}
            className="relative flex items-center justify-center gap-1.5 min-h-10 px-3 rounded-md border border-line text-sm font-medium text-ink hover:bg-canvas-muted focus-visible:focus-ring active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {isPending && demoRole === "admin" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            Demo Admin
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleDemoLogin("instructor")}
            className="relative flex items-center justify-center gap-1.5 min-h-10 px-3 rounded-md border border-line text-sm font-medium text-ink hover:bg-canvas-muted focus-visible:focus-ring active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {isPending && demoRole === "instructor" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            Demo Instructor
          </button>
        </div>
        <p className="text-[10px] text-ink-3 text-center mt-2">
          Read-only demo · data may be reset at any time
        </p>
      </div>
    </AuthShell>
  );
}
