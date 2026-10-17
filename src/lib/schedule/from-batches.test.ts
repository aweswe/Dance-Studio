import { describe, it, expect } from 'vitest';
import {
  getProgrammeActiveBatches,
  formatDaysDisplay,
  formatDaysShort,
  instructorInitials,
} from './from-batches';
import { DEFAULT_BATCHES } from '@/data/batches';

describe('Programme Schedule & Active Batches Function', () => {
  it('formats day names cleanly for full display and badge abbreviation', () => {
    expect(formatDaysDisplay(['Monday', 'Tuesday', 'Wednesday'])).toBe('Monday, Tuesday, Wednesday');
    expect(formatDaysShort(['Monday', 'Tuesday', 'Wednesday'])).toBe('Mon–Wed');
    expect(formatDaysShort(['Monday', 'Wednesday'])).toBe('Mon & Wed');
    expect(formatDaysShort(['Thursday', 'Saturday'])).toBe('Thu & Sat');
    expect(formatDaysShort(['Tuesday'])).toBe('Tuesday');
  });

  it('computes accurate trainer initials', () => {
    expect(instructorInitials('Nitish')).toBe('NI');
    expect(instructorInitials('Pranith')).toBe('PR');
    expect(instructorInitials('Deepak')).toBe('DE');
    expect(instructorInitials('Kajal')).toBe('KA');
    expect(instructorInitials('Srikanth')).toBe('SR');
    expect(instructorInitials('Fitness Faculty')).toBe('FF');
    expect(instructorInitials('Guru Srushti Nidhi')).toBe('GS');
  });

  it('fetches complete adult dance batches with real trainers, timings, and dates', () => {
    const batches = getProgrammeActiveBatches('adults-dance', DEFAULT_BATCHES);
    expect(batches.length).toBeGreaterThanOrEqual(2);

    const batch1 = batches.find((b) => b.time_start.startsWith('19:'));
    expect(batch1).toBeDefined();
    expect(batch1?.name).toContain('Adults');
    expect(batch1?.daysDisplay).toBe('Monday, Tuesday, Wednesday');
    expect(batch1?.daysShort).toBe('Mon–Wed');
    expect(batch1?.timeDisplay).toContain('7:00 PM – 8:00 PM');
    expect(batch1?.duration).toBe('60 min');
    expect(batch1?.trainer.name).toBe('Nitish');
    expect(batch1?.trainer.initials).toBe('NI');
    expect(batch1?.trainer.role).toBe('Dance Faculty');

    const batch2 = batches.find((b) => b.time_start.startsWith('20:'));
    expect(batch2).toBeDefined();
    expect(batch2?.timeDisplay).toContain('8:00 PM – 9:00 PM');
    expect(batch2?.trainer.name).toBe('Pranith');
    expect(batch2?.trainer.initials).toBe('PR');
  });

  it('fetches kids dance batches with Deepak and Kajal', () => {
    const batches = getProgrammeActiveBatches('kids-dance', DEFAULT_BATCHES);
    expect(batches.length).toBeGreaterThanOrEqual(2);

    const batch5pm = batches.find((b) => b.time_start.startsWith('17:'));
    expect(batch5pm?.trainer.name).toBe('Deepak');
    expect(batch5pm?.daysDisplay).toBe('Monday, Tuesday, Wednesday');

    const batch6pm = batches.find((b) => b.time_start.startsWith('18:'));
    expect(batch6pm?.trainer.name).toBe('Kajal');
  });

  it('fetches gymnastics batch with Srikanth and verified photo', () => {
    const batches = getProgrammeActiveBatches('gymnastics', DEFAULT_BATCHES);
    expect(batches.length).toBeGreaterThanOrEqual(1);

    const gymnastic = batches[0];
    expect(gymnastic.trainer.name).toBe('Srikanth');
    expect(gymnastic.trainer.role).toBe('Acrobatics Coach');
    expect(gymnastic.trainer.photoUrl).toBe('/images/team/srikanth-gymnastics-2.jpg');
    expect(gymnastic.daysShort).toBe('Thu & Sat');
    expect(gymnastic.timeDisplay).toContain('5:15 PM – 6:15 PM');
  });

  it('fetches mind & body fitness batches with combo, zumba, and yoga', () => {
    const batches = getProgrammeActiveBatches('mind-body-fitness', DEFAULT_BATCHES);
    expect(batches.length).toBeGreaterThanOrEqual(3);

    for (const b of batches) {
      expect(b.trainer.name).toBe('Fitness Faculty');
      expect(b.trainer.role).toBe('Fitness Faculty');
      expect(b.trainer.initials).toBe('FF');
    }
  });

  it('resiliently falls back to default batches if input is empty array', () => {
    const batches = getProgrammeActiveBatches('adults-dance', []);
    expect(batches.length).toBeGreaterThanOrEqual(2);
    expect(batches[0].trainer.name).toBeTruthy();
  });
});
