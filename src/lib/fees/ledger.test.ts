import { describe, it, expect } from 'vitest';
import {
  monthKey,
  coveredMonthKeys,
  isMonthCovered,
  isDue,
  monthlyAmount,
  trailingMonths,
} from './ledger';

const p = (for_month: string | null, paid_at: string) => ({ for_month, paid_at });

describe('monthKey', () => {
  it('formats zero-padded YYYY-MM keys', () => {
    expect(monthKey(new Date(2026, 7, 25))).toBe('2026-08');
    expect(monthKey('2026-01-15T10:00:00Z')).toBe('2026-01');
  });
});

describe('coveredMonthKeys / isMonthCovered / isDue', () => {
  it('prefers for_month and falls back to the paid_at month', () => {
    const payments = [
      p('2026-08-01', '2026-09-05T10:00:00Z'), // covers Aug even though paid in Sep
      p(null, '2026-06-10T10:00:00Z'), // backfill: covers Jun
    ];
    const covered = coveredMonthKeys(payments);
    expect(covered.has('2026-08')).toBe(true);
    expect(covered.has('2026-09')).toBe(false);
    expect(covered.has('2026-06')).toBe(true);
  });

  it('isDue is true only when the current month is uncovered', () => {
    const now = new Date(2026, 7, 25); // Aug 2026
    expect(isDue([p('2026-07-01', '2026-07-01')], now)).toBe(true);
    expect(isDue([p('2026-08-01', '2026-08-05')], now)).toBe(false);
    expect(isDue([], now)).toBe(true);
  });

  it('isMonthCovered works across year boundaries', () => {
    const payments = [p('2025-12-01', '2025-12-01')];
    expect(isMonthCovered(payments, new Date(2025, 11, 20))).toBe(true);
    expect(isMonthCovered(payments, new Date(2026, 0, 5))).toBe(false);
  });
});

describe('monthlyAmount', () => {
  it('uses the programme fee when set, falls back to 2500', () => {
    expect(monthlyAmount(2000)).toBe(2000);
    expect(monthlyAmount(null)).toBe(2500);
    expect(monthlyAmount(0)).toBe(2500);
  });
});

describe('trailingMonths', () => {
  it('returns count month starts, oldest first, crossing years', () => {
    const months = trailingMonths(new Date(2026, 0, 15), 3);
    expect(months.map((m) => monthKey(m))).toEqual(['2025-11', '2025-12', '2026-01']);
  });
});
