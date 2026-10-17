import { describe, it, expect } from 'vitest';
import { populateReelPlaceholders, FALLBACK_REELS, type PublicReel } from './reels';

describe('populateReelPlaceholders', () => {
  const dummyReel = (id: string): PublicReel => ({
    id,
    title: `Reel ${id}`,
    videoSrc: `/reels/${id}.mp4`,
    href: 'https://instagram.com',
  });

  it('returns all 6 fallback reels when no reels are uploaded', () => {
    const result = populateReelPlaceholders([]);
    expect(result).toHaveLength(6);
    expect(result).toEqual(FALLBACK_REELS);
  });

  it('shows exactly 6 reels when 1 reel is uploaded: 1 uploaded and 5 as placeholders', () => {
    const uploaded = [dummyReel('u1')];
    const result = populateReelPlaceholders(uploaded);
    expect(result).toHaveLength(6);
    expect(result[0].id).toBe('u1');
    expect(result[0].isPlaceholder).toBeUndefined();
    // 5 placeholders beside it
    const placeholders = result.slice(1);
    expect(placeholders).toHaveLength(5);
    expect(placeholders.every((r) => r.isPlaceholder === true)).toBe(true);
  });

  it('shows exactly 6 reels when 2 reels are uploaded: 2 uploaded and 4 as placeholders', () => {
    const uploaded = [dummyReel('u1'), dummyReel('u2')];
    const result = populateReelPlaceholders(uploaded);
    expect(result).toHaveLength(6);
    expect(result[0].id).toBe('u1');
    expect(result[1].id).toBe('u2');
    const placeholders = result.slice(2);
    expect(placeholders).toHaveLength(4);
    expect(placeholders.every((r) => r.isPlaceholder === true)).toBe(true);
  });

  it('shows exactly 6 reels when 3 reels are uploaded: 3 uploaded and 3 as placeholders', () => {
    const uploaded = [dummyReel('u1'), dummyReel('u2'), dummyReel('u3')];
    const result = populateReelPlaceholders(uploaded);
    expect(result).toHaveLength(6);
    expect(result.slice(3)).toHaveLength(3);
    expect(result.slice(3).every((r) => r.isPlaceholder === true)).toBe(true);
  });

  it('shows exactly 6 reels when 4 reels are uploaded: 4 uploaded and 2 as placeholders', () => {
    const uploaded = [dummyReel('u1'), dummyReel('u2'), dummyReel('u3'), dummyReel('u4')];
    const result = populateReelPlaceholders(uploaded);
    expect(result).toHaveLength(6);
    expect(result.slice(4)).toHaveLength(2);
    expect(result.slice(4).every((r) => r.isPlaceholder === true)).toBe(true);
  });

  it('shows exactly 6 reels when 5 reels are uploaded: 5 uploaded and 1 as placeholder', () => {
    const uploaded = [
      dummyReel('u1'),
      dummyReel('u2'),
      dummyReel('u3'),
      dummyReel('u4'),
      dummyReel('u5'),
    ];
    const result = populateReelPlaceholders(uploaded);
    expect(result).toHaveLength(6);
    expect(result[5].isPlaceholder).toBe(true);
  });

  it('shows exactly 6 reels with 0 placeholders when 6 reels are uploaded', () => {
    const uploaded = [
      dummyReel('u1'),
      dummyReel('u2'),
      dummyReel('u3'),
      dummyReel('u4'),
      dummyReel('u5'),
      dummyReel('u6'),
    ];
    const result = populateReelPlaceholders(uploaded);
    expect(result).toHaveLength(6);
    expect(result.some((r) => r.isPlaceholder)).toBe(false);
  });
});
