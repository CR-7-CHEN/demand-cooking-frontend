import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(__dirname, '..', '..');

const removedCookingMessagePaths = [
  'src/views/cooking/message',
  'src/api/cooking/message'
];

describe('cooking message admin entry cleanup', () => {
  it('removes the admin cooking message page and api module', () => {
    for (const relativePath of removedCookingMessagePaths) {
      expect(existsSync(resolve(projectRoot, relativePath)), `${relativePath} should be removed`).toBe(false);
    }
  });

  it('keeps unrelated global notice and workflow message code', () => {
    expect(existsSync(resolve(projectRoot, 'src/store/modules/notice.ts')), 'global notice store remains').toBe(true);
    expect(existsSync(resolve(projectRoot, 'src/api/workflow/task/types.ts')), 'workflow task api types remain').toBe(true);

    const workflowTaskTypes = readFileSync(resolve(projectRoot, 'src/api/workflow/task/types.ts'), 'utf8');
    expect(workflowTaskTypes).toContain('message?: string');
  });
});
