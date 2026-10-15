import { describe, it, expect } from 'vitest';
import {
  monthKey,
  coveredMonthKeys,
  isMonthCovered,
  isDue,
  isOverdue,
  getFeeDueDate,
  monthlyAmount,
  quarterlyAmount,
  coverageMonths,
  applySiblingDiscount,
  trailingMonths,
} from './ledger';

const p = (for_month: string | null, paid_at: string, status: string = 'confirmed') => ({
  for_month,
  paid_at,
  status,
});

describe('monthKey', () => {
  it('formats zero-padded YYYY-MM keys', () => {
    expect(monthKey(new Date(2026, 7, 25))).toBe('2026-08');
    expect(monthKey('2026-01-15T10:00:00Z')).toBe('2026-01');
  });
});

describe('coveredMonthKeys / isMonthCovered / isDue / isOverdue', () => {
  it('prefers for_month and falls back to the paid_at month for confirmed payments', () => {
    const payments = [
      p('2026-08-01', '2026-09-05T10:00:00Z', 'confirmed'),
      p(null, '2026-06-10T10:00:00Z', 'confirmed'),
    ];
    const covered = coveredMonthKeys(payments);
    expect(covered.has('2026-08')).toBe(true);
    expect(covered.has('2026-09')).toBe(false);
    expect(covered.has('2026-06')).toBe(true);
  });

  it('strictly ignores pending, rejected, and unconfirmed payments', () => {
    const now = new Date(2026, 7, 25);
    expect(isDue([p('2026-08-01', '2026-08-05', 'pending')], now)).toBe(true);
    expect(isDue([p('2026-08-01', '2026-08-05', 'rejected')], now)).toBe(true);
    expect(isDue([{ for_month: '2026-08-01', paid_at: '2026-08-05', status: undefined as any }], now)).toBe(true);
    expect(isDue([p('2026-08-01', '2026-08-05', 'confirmed')], now)).toBe(false);
  });

  it('isDue is true only when the current month is uncovered', () => {
    const now = new Date(2026, 7, 25);
    expect(isDue([p('2026-07-01', '2026-07-01')], now)).toBe(true);
    expect(isDue([p('2026-08-01', '2026-08-05')], now)).toBe(false);
    expect(isDue([], now)).toBe(true);
  });

  it('isOverdue triggers only after the 7th of the month for uncovered fees', () => {
    const beforeDue = new Date(2026, 7, 5); // Aug 5th
    const afterDue = new Date(2026, 7, 12); // Aug 12th

    expect(isOverdue([], beforeDue)).toBe(false);
    expect(isOverdue([], afterDue)).toBe(true);
    expect(isOverdue([p('2026-08-01', '2026-08-01')], afterDue)).toBe(false);
  });

  it('isMonthCovered works across year boundaries', () => {
    const payments = [p('2025-12-01', '2025-12-01')];
    expect(isMonthCovered(payments, new Date(2025, 11, 20))).toBe(true);
    expect(isMonthCovered(payments, new Date(2026, 0, 5))).toBe(false);
  });
});

describe('monthlyAmount / quarterly / sibling discount', () => {
  it('uses the programme fee when set, falls back to 2500', () => {
    expect(monthlyAmount(2000)).toBe(2000);
    expect(monthlyAmount(null)).toBe(2500);
    expect(monthlyAmount(0)).toBe(2500);
  });

  it('quarterly prefers fees_quarterly then 3× monthly', () => {
    expect(quarterlyAmount(5000, 2000)).toBe(5000);
    expect(quarterlyAmount(null, 2000)).toBe(6000);
  });

  it('applies sibling discount from the second child', () => {
    expect(applySiblingDiscount(2000, 1)).toBe(2000);
    expect(applySiblingDiscount(2000, 2)).toBe(1800);
  });

  it('coverageMonths returns 1 or 3 first-of-month dates', () => {
    expect(coverageMonths('monthly', new Date(2026, 7, 25))).toEqual(['2026-08-01']);
    expect(coverageMonths('quarterly', new Date(2026, 7, 25))).toEqual([
      '2026-08-01',
      '2026-09-01',
      '2026-10-01',
    ]);
  });
});

describe('trailingMonths', () => {
  it('returns count month starts, oldest first, crossing years', () => {
    const months = trailingMonths(new Date(2026, 0, 15), 3);
    expect(months.map((m) => monthKey(m))).toEqual(['2025-11', '2025-12', '2026-01']);
  });
});
