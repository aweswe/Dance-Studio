"use client";

import { useState, useCallback } from "react";

interface UsePaginationOptions<T> {
  fetcher: (cursor: string | null, limit: number) => Promise<T[]>;
  limit?: number;
  cursorField?: keyof T;
}

/**
 * Cursor-based pagination hook.
 * Uses keyset pagination for O(1) performance on large tables.
 */
export function usePagination<T extends Record<string, unknown>>({
  fetcher,
  limit = 20,
  cursorField = "created_at" as keyof T,
}: UsePaginationOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newItems = await fetcher(cursor, limit);

      if (newItems.length < limit) {
        setHasMore(false);
      }

      if (newItems.length > 0) {
        const lastItem = newItems[newItems.length - 1];
        setCursor(String(lastItem[cursorField]));
        setItems((prev) => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, cursor, limit, hasMore, isLoading, cursorField]);

  const reset = useCallback(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    setIsLoading(false);
  }, []);

  return {
    items,
    loadMore,
    hasMore,
    isLoading,
    reset,
  };
}
