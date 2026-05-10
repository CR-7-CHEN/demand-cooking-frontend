import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const oldCopy = '做饭' + '人员';

const collectFiles = (dir: string): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const fullPath = join(dir, name);
    return statSync(fullPath).isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
};

describe('cooking admin service chef copy', () => {
  it('does not show the old chef role wording in cooking pages', () => {
    const offenders = collectFiles(join(__dirname, 'cooking'))
      .filter((file) => /\.(vue|ts)$/.test(file))
      .filter((file) => readFileSync(file, 'utf8').includes(oldCopy));

    expect(offenders).toEqual([]);
  });
});
