import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit, clientIp } from './rate-limit';

const WINDOW = 60_000;

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-25T10:00:00Z'));
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows up to the limit and denies the next request', async () => {
    const key = `t:${Math.random()}`;
    for (let i = 0; i < 5; i++) expect(await rateLimit(key, { limit: 5, windowMs: WINDOW })).toBe(true);
    expect(await rateLimit(key, { limit: 5, windowMs: WINDOW })).toBe(false);
  });

  it('allows again once the window slides past', async () => {
    const key = `t:${Math.random()}`;
    expect(await rateLimit(key, { limit: 1, windowMs: WINDOW })).toBe(true);
    expect(await rateLimit(key, { limit: 1, windowMs: WINDOW })).toBe(false);
    vi.advanceTimersByTime(WINDOW + 1);
    expect(await rateLimit(key, { limit: 1, windowMs: WINDOW })).toBe(true);
  });

  it('expires a request sitting exactly on the window edge (boundary exclusive)', async () => {
    const key = `t:${Math.random()}`;
    expect(await rateLimit(key, { limit: 1, windowMs: WINDOW })).toBe(true);
    vi.advanceTimersByTime(WINDOW);
    expect(await rateLimit(key, { limit: 1, windowMs: WINDOW })).toBe(true);
  });

  it('keeps keys isolated', async () => {
    const a = `t:${Math.random()}:a`;
    const b = `t:${Math.random()}:b`;
    expect(await rateLimit(a, { limit: 1, windowMs: WINDOW })).toBe(true);
    expect(await rateLimit(a, { limit: 1, windowMs: WINDOW })).toBe(false);
    expect(await rateLimit(b, { limit: 1, windowMs: WINDOW })).toBe(true);
  });
});

describe('clientIp', () => {
  it('takes the first x-forwarded-for entry', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' });
    expect(clientIp(headers)).toBe('203.0.113.7');
  });

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '198.51.100.4' });
    expect(clientIp(headers)).toBe('198.51.100.4');
  });

  it('returns unknown when no IP headers exist', () => {
    expect(clientIp(new Headers())).toBe('unknown');
  });
});
