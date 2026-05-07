import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const registerVue = readFileSync(resolve(__dirname, 'register.vue'), 'utf-8');

describe('register page has no tenant selection', () => {
  it('does not render or load tenant choices', () => {
    expect(registerVue).not.toContain('tenantEnabled');
    expect(registerVue).not.toContain('tenantList');
    expect(registerVue).not.toContain('getTenantList');
    expect(registerVue).not.toContain('v-if="tenantEnabled"');
    expect(registerVue).not.toContain('prop="tenantId"');
  });

  it('does not seed a tenant id into the register form', () => {
    expect(registerVue).not.toContain("tenantId: ''");
    expect(registerVue).not.toContain('registerForm.value.tenantId');
  });
});
