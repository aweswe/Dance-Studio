import { describe, it, expect } from 'vitest';
import { logOfflinePaymentSchema } from './fees';
import { updateStudentSchema } from './student';
import { enrolFormSchema } from './enrol';

const UUID = 'a1b2c3d4-4001-4000-8000-000000000001';

describe('logOfflinePaymentSchema', () => {
  const base = { studentId: UUID, amount: 2500, source: 'cash', notes: '' };

  it('accepts a valid cash payment', () => {
    expect(logOfflinePaymentSchema.safeParse(base).success).toBe(true);
  });

  it('rejects zero, negative, and fractional amounts', () => {
    expect(logOfflinePaymentSchema.safeParse({ ...base, amount: 0 }).success).toBe(false);
    expect(logOfflinePaymentSchema.safeParse({ ...base, amount: -5 }).success).toBe(false);
    expect(logOfflinePaymentSchema.safeParse({ ...base, amount: 99.5 }).success).toBe(false);
  });

  it('rejects a non-UUID student id and unknown sources', () => {
    expect(logOfflinePaymentSchema.safeParse({ ...base, studentId: 'nope' }).success).toBe(false);
    expect(logOfflinePaymentSchema.safeParse({ ...base, source: 'card' }).success).toBe(false);
  });

  it('rejects notes longer than 500 characters', () => {
    expect(logOfflinePaymentSchema.safeParse({ ...base, notes: 'x'.repeat(501) }).success).toBe(false);
    expect(logOfflinePaymentSchema.safeParse({ ...base, notes: 'x'.repeat(500) }).success).toBe(true);
  });
});

describe('updateStudentSchema', () => {
  const base = { name: 'Aarav', phone: '9052980859', status: 'active' as const };

  it('accepts a valid student', () => {
    expect(updateStudentSchema.safeParse(base).success).toBe(true);
  });

  it('rejects Indian mobile numbers outside the 6-9 range or wrong length', () => {
    expect(updateStudentSchema.safeParse({ ...base, phone: '5052980859' }).success).toBe(false);
    expect(updateStudentSchema.safeParse({ ...base, phone: '905298085' }).success).toBe(false);
    expect(updateStudentSchema.safeParse({ ...base, phone: '90529808599' }).success).toBe(false);
  });

  it('accepts an empty email but rejects a malformed one', () => {
    expect(updateStudentSchema.safeParse({ ...base, email: '' }).success).toBe(true);
    expect(updateStudentSchema.safeParse({ ...base, email: 'not-an-email' }).success).toBe(false);
  });

  it('defaults status to active when omitted', () => {
    const parsed = updateStudentSchema.safeParse({ name: 'Aarav', phone: '9052980859' });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.status).toBe('active');
  });
});

describe('enrolFormSchema', () => {
  const base = {
    name: 'Aarav',
    phone: '9052980859',
    email: '',
    programmeId: UUID,
    batchId: 'a1b2c3d4-4101-4000-8000-000000000001',
  };

  it('accepts a valid enrolment', () => {
    expect(enrolFormSchema.safeParse(base).success).toBe(true);
  });

  it('rejects missing programme/batch ids', () => {
    expect(enrolFormSchema.safeParse({ ...base, programmeId: undefined }).success).toBe(false);
    expect(enrolFormSchema.safeParse({ ...base, batchId: 'garbage' }).success).toBe(false);
  });

  it('rejects names under 2 characters', () => {
    expect(enrolFormSchema.safeParse({ ...base, name: 'A' }).success).toBe(false);
  });
});
