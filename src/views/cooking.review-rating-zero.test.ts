import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(__dirname, 'cooking', 'review', 'index.vue'), 'utf8');

describe('cooking review rating display', () => {
  it('keeps zero rating values visible in the detail panel', () => {
    expect(source).toContain('displayRating(current.rating)');
    expect(source).toContain("value === 0 || value === '0'");
    expect(source).toContain("value !== undefined && value !== null && value !== '' ? value : '-'");
  });
});
