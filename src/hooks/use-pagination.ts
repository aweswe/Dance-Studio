"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UsePaginationOptions<T> {
  fetcher: (cursor: string | null, limit: number) => Promise<T[]>;
  limit?: number;
  cursorField?: keyof T;
  /** First page rendered on the server — seeds the list so the first
   *  "Load More" continues from where the server page left off. */
  initialItems?: T[];
  initialCursor?: string | null;
  /** When this value changes, the list resets and refetches page 1
   *  (debounced) — wire search/filter state into it. */
  refreshKey?: string;
  debounceMs?: number;
}

/**
 * Cursor-based pagination hook.
 * Uses keyset pagination for O(1) performance on large tables.
 *
 * Seeded from server-rendered initialItems/initialCursor; changing
 * refreshKey resets to page 1 so filters always search the whole table
 * (fixes the "search only affects Load More" bug).
 */
export function usePagination<T extends Record<string, unknown>>({
  fetcher,
  limit = 20,
  cursorField = "created_at" as keyof T,
  initialItems = [],
  initialCursor = null,
  refreshKey,
  debounceMs = 300,
}: UsePaginationOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialItems.length >= limit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest fetcher in a ref so inline closures don't retrigger effects.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const loadPage = useCallback(
    async (cursorVal: string | null, append: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const newItems = await fetcherRef.current(cursorVal, limit);

        if (newItems.length < limit) {
          setHasMore(false);
        }

        if (newItems.length > 0) {
          const lastItem = newItems[newItems.length - 1];
          setCursor(String(lastItem[cursorField]));
        }

        setItems((prev) => (append ? [...prev, ...newItems] : newItems));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setIsLoading(false);
      }
    },
    [cursorField, limit],
  );

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    void loadPage(cursor, true);
  }, [isLoading, hasMore, cursor, loadPage]);

  // Debounced reset + first-page refetch when the filter/search key changes.
  // Skips the initial render — the server-seeded items are already page 1.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setHasMore(true);
    const t = setTimeout(() => {
      void loadPage(null, false);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [refreshKey, debounceMs, loadPage]);

  const reset = useCallback(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    items,
    loadMore,
    hasMore,
    isLoading,
    error,
    reset,
  };
}
