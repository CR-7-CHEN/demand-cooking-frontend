import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const loginApi = readFileSync(resolve(__dirname, 'login.ts'), 'utf-8');

describe('login api has no tenant scope coupling', () => {
  it('does not inject tenant id into login or register payloads', () => {
    expect(loginApi).not.toContain('tenantId: data.tenantId');
    expect(loginApi).not.toContain('tenantId: DEFAULT_LOGIN_SCOPE');
    expect(loginApi).not.toContain("tenantId: clientId");
  });

  it('does not expose tenant list loading through the auth api module', () => {
    expect(loginApi).not.toContain('getTenantList');
    expect(loginApi).not.toContain('TenantInfo');
  });
});
