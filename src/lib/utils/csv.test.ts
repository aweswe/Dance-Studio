import { describe, it, expect } from 'vitest';
import { escapeCsv } from './csv';

describe('escapeCsv', () => {
  it('quotes every field', () => {
    expect(escapeCsv('Aarav')).toBe('"Aarav"');
  });

  it('doubles internal double quotes', () => {
    expect(escapeCsv('he said "hi"')).toBe('"he said ""hi"""');
  });

  it('strips newlines so rows cannot be injected', () => {
    expect(escapeCsv('=cmd()\r\nHYPERLINK')).toBe('"=cmd() HYPERLINK"');
    expect(escapeCsv('a\nb\r\nc')).toBe('"a b c"');
  });

  it('turns null and undefined into an empty quoted field', () => {
    expect(escapeCsv(null)).toBe('""');
    expect(escapeCsv(undefined)).toBe('""');
  });

  it('stringifies numbers and booleans', () => {
    expect(escapeCsv(2000)).toBe('"2000"');
    expect(escapeCsv(true)).toBe('"true"');
  });
});
