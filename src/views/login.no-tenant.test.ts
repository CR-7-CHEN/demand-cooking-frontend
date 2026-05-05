import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const loginVue = readFileSync(resolve(__dirname, 'login.vue'), 'utf-8');

describe('login page has no tenant-facing state', () => {
  it('does not read or persist tenant selection from localStorage', () => {
    expect(loginVue).not.toContain("localStorage.getItem('tenantId')");
    expect(loginVue).not.toContain("localStorage.setItem('tenantId'");
  });

  it('does not seed default admin credentials', () => {
    expect(loginVue).not.toContain("username: 'admin'");
    expect(loginVue).not.toContain("password: 'admin123'");
  });
});
