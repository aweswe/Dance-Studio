/**
 * In-memory sliding-window rate limiter.
 *
 * Deliberately dependency-free: this protects the anonymous endpoints
 * (studio rental, export, certificate) and expensive actions (broadcast)
 * from spam and cost abuse. It is per-server-instance — limits reset on
 * redeploy and are not shared across instances. That is the right trade
 * for a single-instance deployment; move to Upstash/Redis if the app
 * ever runs horizontally.
 *
 * Note on auth endpoints: OTP and password login call Supabase Auth
 * directly from the browser, so they cannot be throttled here — they
 * are covered by Supabase Auth's built-in per-phone/per-email limits.
 */

const buckets = new Map<string, number[]>();

function prune(bucket: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  const firstFresh = bucket.findIndex((t) => t > cutoff);
  return firstFresh === -1 ? [] : bucket.slice(firstFresh);
}

/** Returns true when the request is allowed; false when over the limit. */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): boolean {
  const now = Date.now();
  const bucket = prune(buckets.get(key) ?? [], windowMs, now);

  if (bucket.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.push(now);
  buckets.set(key, bucket);

  // Sweep stale keys so a long-running server doesn't accumulate memory.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (prune(v, windowMs, now).length === 0) buckets.delete(k);
    }
  }

  return true;
}

/** Extract a best-effort client IP from request headers (serverless-safe). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
