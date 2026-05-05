import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(__dirname, '..', '..');

const removedTemplatePaths = [
  'src/views/system/tenant',
  'src/views/system/tenantPackage',
  'src/views/workflow/leave',
  'src/views/demo',
  'src/views/tool/gen',
  'src/api/system/tenant',
  'src/api/system/tenantPackage',
  'src/api/workflow/leave',
  'src/api/demo',
  'src/api/tool/gen'
];

describe('RuoYi template admin pages are removed', () => {
  it('does not keep tenant, workflow demo, demo, or code-generator modules', () => {
    for (const relativePath of removedTemplatePaths) {
      expect(existsSync(resolve(projectRoot, relativePath)), `${relativePath} should be removed`).toBe(false);
    }
  });
});
