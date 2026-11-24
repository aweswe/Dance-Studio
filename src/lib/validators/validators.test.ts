import { describe, it, expect } from 'vitest';
import { logOfflinePaymentSchema } from './fees';
import { updateStudentSchema } from './student';
import { enrolFormSchema, kidsEnrolFormSchema } from './enrol';
import { profileSchema, kidsProfileSchema } from './profile';
import { isAdultProgramme, isKidsProgramme } from '@/lib/students/parent-info';
import { enrolHref, parseEnrolIntent } from '@/lib/utils/constants';

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
    childName: 'Aarav',
    parentName: 'Suresh',
    age: '7',
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
    expect(enrolFormSchema.safeParse({ ...base, childName: 'A' }).success).toBe(false);
  });
});

describe('enrolHref', () => {
  it('defaults unknown intent to trial', () => {
    expect(parseEnrolIntent(undefined)).toBe('trial');
    expect(parseEnrolIntent('pay')).toBe('pay');
    expect(parseEnrolIntent('trial')).toBe('trial');
    expect(parseEnrolIntent('other')).toBe('trial');
    expect(parseEnrolIntent(undefined, 'quarterly', 5000)).toBe('pay');
  });

  it('sends pricing visitors to pay and other CTAs to a plain enrol URL', () => {
    expect(enrolHref({ programme: 'kids-dance', intent: 'pay' })).toBe(
      '/enrol?intent=pay&programme=kids-dance',
    );
    expect(enrolHref({ programme: 'kuchipudi', intent: 'trial' })).toBe(
      '/enrol?intent=trial&programme=kuchipudi',
    );
    expect(enrolHref()).toBe('/enrol');
  });
});

describe('profileSchema & kidsProfileSchema (parent phone mandatory ONLY for kids)', () => {
  const valid = {
    name: 'Aarav Sharma',
    phone: '9052980859',
    email: 'aarav@example.com',
    parentName: 'Rajesh Sharma',
    parentPhone: '9876543210',
    parentRelationship: 'Father',
  };

  it('allows adult students to save profile WITHOUT parent phone or parent name', () => {
    const adultProfile = {
      name: 'Rohan Varma',
      phone: '9876543210',
      email: 'rohan@example.com',
      parentName: '',
      parentPhone: '',
      parentRelationship: '',
    };
    expect(profileSchema.safeParse(adultProfile).success).toBe(true);
    expect(profileSchema.safeParse({ name: 'Rohan Varma', phone: '9876543210' }).success).toBe(true);
  });

  it('rejects adult profile only if an invalid parentPhone is manually typed', () => {
    expect(profileSchema.safeParse({ ...valid, parentPhone: '12345' }).success).toBe(false);
  });

  it('requires complete parent details for kidsProfileSchema', () => {
    expect(kidsProfileSchema.safeParse(valid).success).toBe(true);
    expect(kidsProfileSchema.safeParse({ ...valid, parentName: '' }).success).toBe(false);
    expect(kidsProfileSchema.safeParse({ ...valid, parentPhone: '' }).success).toBe(false);
    expect(kidsProfileSchema.safeParse({ ...valid, parentPhone: '12345' }).success).toBe(false);
    expect(kidsProfileSchema.safeParse({ ...valid, parentPhone: undefined }).success).toBe(false);
    expect(kidsProfileSchema.safeParse({ ...valid, parentRelationship: '' }).success).toBe(false);
  });

  it('distinguishes adult vs kids programmes accurately', () => {
    expect(isAdultProgramme({ slug: 'adults-dance', name: 'Adults Dance', age_group: '13+ Years' })).toBe(true);
    expect(isKidsProgramme({ slug: 'adults-dance', name: 'Adults Dance', age_group: '13+ Years' })).toBe(false);

    expect(isAdultProgramme({ slug: 'mind-body-fitness', name: 'Mind & Body Fitness', age_group: '13+ Years' })).toBe(true);
    expect(isKidsProgramme({ slug: 'mind-body-fitness', name: 'Mind & Body Fitness', age_group: '13+ Years' })).toBe(false);

    expect(isKidsProgramme({ slug: 'kids-dance', name: 'Kids Dance', age_group: 'Kids: 3.5–12 years' })).toBe(true);
    expect(isAdultProgramme({ slug: 'kids-dance', name: 'Kids Dance', age_group: 'Kids: 3.5–12 years' })).toBe(false);

    expect(isKidsProgramme({ slug: 'gymnastics', name: 'Gymnastics & Tumbling', age_group: 'Kids: 3.5–12 years' })).toBe(true);
    expect(isKidsProgramme({ slug: 'kuchipudi', name: 'Kuchipudi', age_group: 'Kids: 3.5–12 yrs & Adults: 13+ yrs' })).toBe(false);
  });

  it('enforces parentName on kidsEnrolFormSchema but not on adult enrolFormSchema', () => {
    const baseEnrol = {
      childName: 'Rohan Varma',
      parentName: '',
      age: '25',
      phone: '9876543210',
      email: '',
      programmeId: UUID,
      batchId: UUID,
    };
    expect(enrolFormSchema.safeParse(baseEnrol).success).toBe(true);
    expect(kidsEnrolFormSchema.safeParse(baseEnrol).success).toBe(false);
    expect(kidsEnrolFormSchema.safeParse({ ...baseEnrol, age: '8', parentName: 'Rajesh Varma' }).success).toBe(true);
  });
});

