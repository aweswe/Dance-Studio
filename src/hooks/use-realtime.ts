"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeOptions {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  onEvent: (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => void;
}

/**
 * Subscribe to Supabase Realtime changes on a table.
 * Used in admin dashboard for live updates.
 */
export function useRealtime({ table, event = "*", filter, onEvent }: UseRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient();

  const subscribe = useCallback(() => {
    const channelName = `realtime_${table}_${event}_${filter ?? "all"}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          onEvent({
            eventType: payload.eventType,
            new: (payload.new as Record<string, unknown>) ?? {},
            old: (payload.old as Record<string, unknown>) ?? {},
          });
        },
      )
      .subscribe();

    channelRef.current = channel;
  }, [supabase, table, event, filter, onEvent]);

  useEffect(() => {
    subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [subscribe, supabase]);
}
