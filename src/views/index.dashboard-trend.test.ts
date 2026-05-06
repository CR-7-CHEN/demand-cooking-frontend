import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageSource = readFileSync(resolve(__dirname, 'index.vue'), 'utf8');

describe('homepage revenue trend labels', () => {
  it('formats recent 7 day labels as concrete MM.DD dates', () => {
    expect(homepageSource).toContain('formatTrendDate');
    expect(homepageSource).toMatch(/item\.date\s*\?\s*formatTrendDate\(item\.date\)/);
    expect(homepageSource).toContain("const month = String(date.getMonth() + 1).padStart(2, '0');");
    expect(homepageSource).toContain("const day = String(date.getDate()).padStart(2, '0');");
  });

  it('does not use weekday placeholders for the 7-day trend fallback', () => {
    expect(homepageSource).not.toContain("const placeholders = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];");
  });
});
