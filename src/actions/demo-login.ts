"use server";

import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Single shared password for all demo accounts — never exposed in UI */
const DEMO_PASSWORD = "Rhythmzz@Demo2024!";

export type DemoRole = "admin" | "instructor" | "student";

const DEMO_ACCOUNTS: Record<
  DemoRole,
  { email: string; name: string; redirectTo: string }
> = {
  admin: {
    email: "demo.admin@rhythmzz.demo",
    name: "Demo Admin",
    redirectTo: "/admin",
  },
  instructor: {
    email: "demo.instructor@rhythmzz.demo",
    name: "Demo Instructor",
    redirectTo: "/instructor",
  },
  student: {
    email: "demo.student@rhythmzz.demo",
    name: "Demo Student",
    redirectTo: "/student",
  },
};

/**
 * Idempotently ensure role-specific DB records exist for a demo user.
 * Safe to call multiple times — uses upsert/insert-if-absent patterns.
 */
async function ensureRoleRecords(
  admin: ReturnType<typeof createAdminSupabase>,
  role: DemoRole,
  authId: string,
  account: (typeof DEMO_ACCOUNTS)[DemoRole],
) {
  // Ensure entry in the users table with the correct role
  await admin.from("users").upsert(
    { id: authId, role },
    { onConflict: "id", ignoreDuplicates: false },
  );

  if (role === "instructor") {
    // Insert a demo instructor row if it doesn't already exist
    const { data: existing } = await admin
      .from("instructors")
      .select("id")
      .eq("auth_id", authId)
      .maybeSingle();

    if (!existing) {
      await admin.from("instructors").insert({
        name: account.name,
        email: account.email,
        auth_id: authId,
        is_active: true,
        bio: "Demo instructor account for previewing the instructor portal.",
      });
    }
  }

  if (role === "student") {
    // Insert a demo student row if it doesn't already exist
    const { data: existing } = await admin
      .from("students")
      .select("id")
      .eq("auth_id", authId)
      .maybeSingle();

    if (!existing) {
      await admin.from("students").insert({
        name: account.name,
        email: account.email,
        auth_id: authId,
        status: "active",
        student_id_display: "DEMO-001",
        join_date: new Date().toISOString().split("T")[0],
      });
    }
  }
}

/**
 * One-click demo login — provisions the account on first use, then signs in.
 * Call from a client component with a server action button or form action.
 */
export async function demoLogin(role: DemoRole) {
  const account = DEMO_ACCOUNTS[role];
  const admin = createAdminSupabase();
  const supabase = await createServerSupabase();

  // ── Step 1: try signing in (fast path for returning visits) ──────────────
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: account.email,
      password: DEMO_PASSWORD,
    });

  if (!signInError && signInData.user) {
    // Idempotently ensure records are present (in case a previous provision
    // was interrupted partway through)
    await ensureRoleRecords(admin, role, signInData.user.id, account);
    redirect(account.redirectTo);
  }

  // ── Step 2: first visit — create the Supabase Auth user ─────────────────
  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email: account.email,
      password: DEMO_PASSWORD,
      email_confirm: true, // skip the confirmation email
      user_metadata: { name: account.name },
    });

  if (createError) {
    // If "already registered" we lost the race on first call — just retry sign-in
    if (!createError.message.toLowerCase().includes("already registered")) {
      return { error: `Could not create demo account: ${createError.message}` };
    }
  }

  const authId = created?.user?.id;

  if (authId) {
    await ensureRoleRecords(admin, role, authId, account);
  }

  // ── Step 3: sign in now that the user definitely exists ──────────────────
  const { error: retryError } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: DEMO_PASSWORD,
  });

  if (retryError) {
    return { error: `Demo sign-in failed: ${retryError.message}` };
  }

  redirect(account.redirectTo);
}
