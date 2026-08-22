"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/supabase/types";

interface UserProfile {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
}

/**
 * Client-side hook to get current authenticated user and their role.
 */
export function useSupabase(): UserProfile {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser(authUser);
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", authUser.id)
          .single();

        setRole(((profile as any)?.role as UserRole) ?? null);
      }

      setIsLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, role, isLoading };
}
