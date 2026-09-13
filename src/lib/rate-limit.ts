/**
 * Sliding-window rate limiter.
 *
 * Uses Upstash Redis REST when UPSTASH_REDIS_REST_URL + TOKEN are set
 * (shared across Vercel instances). Falls back to in-memory per instance.
 */

const buckets = new Map<string, number[]>();

function prune(bucket: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  const firstFresh = bucket.findIndex((t) => t > cutoff);
  return firstFresh === -1 ? [] : bucket.slice(firstFresh);
}

function memoryLimit(
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

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (prune(v, windowMs, now).length === 0) buckets.delete(k);
    }
  }

  return true;
}

async function upstashLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const redisKey = `rl:${key}`;
  const ttl = Math.max(1, Math.ceil(windowMs / 1000));

  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["EXPIRE", redisKey, ttl, "NX"],
    ]),
  });

  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const json = (await res.json()) as Array<{ result: number }>;
  const count = Number(json?.[0]?.result ?? 0);
  return count <= limit;
}

/** Returns true when the request is allowed; false when over the limit. */
export async function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): Promise<boolean> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return await upstashLimit(key, opts);
    } catch (err) {
      console.error("[rate-limit] Upstash failed, using memory", err);
    }
  }
  return memoryLimit(key, opts);
}

/** Extract a best-effort client IP from request headers (serverless-safe). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
