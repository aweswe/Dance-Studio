import { describe, it, expect } from 'vitest';
import { GOOGLE_REVIEWS_DATA } from './testimonials';

describe('Google Reviews Testimonials Dataset', () => {
  it('contains at least 20 authentic reviews', () => {
    expect(GOOGLE_REVIEWS_DATA.length).toBeGreaterThanOrEqual(20);
  });

  it('contains both parent and student categories', () => {
    const parents = GOOGLE_REVIEWS_DATA.filter((r) => r.category === 'parent');
    const students = GOOGLE_REVIEWS_DATA.filter((r) => r.category === 'student');
    expect(parents.length).toBeGreaterThanOrEqual(5);
    expect(students.length).toBeGreaterThanOrEqual(10);
  });

  it('validates all reviews have complete fields', () => {
    GOOGLE_REVIEWS_DATA.forEach((review) => {
      expect(review.name.trim().length).toBeGreaterThan(0);
      expect(review.quote.trim().length).toBeGreaterThan(20);
      expect(review.programme.trim().length).toBeGreaterThan(0);
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
      expect(['parent', 'student']).toContain(review.category);
      expect(review.highlight.trim().length).toBeGreaterThan(0);
    });
  });

  it('adheres to client rule: trainer names sanitized', () => {
    // Client Directive: "Just don’t mention the trainers name. Kids 3.5 - 12 years. Adults 13+ years."
    const FORBIDDEN_FACULTY_NAMES = [/\bNitish\b/i, /\bDeepak\b/i, /\bShiva\b/i, /\bKajal\b/i];
    GOOGLE_REVIEWS_DATA.forEach((review) => {
      FORBIDDEN_FACULTY_NAMES.forEach((regex) => {
        expect(review.quote).not.toMatch(regex);
        expect(review.highlight).not.toMatch(regex);
      });
    });
  });
});
