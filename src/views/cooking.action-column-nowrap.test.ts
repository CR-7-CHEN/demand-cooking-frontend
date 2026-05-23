import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const modulesWithActions = ['address', 'area', 'review', 'chef', 'settlement', 'config', 'dish', 'complaint', 'order'];

const readPage = (moduleName: string) => readFileSync(resolve(__dirname, 'cooking', moduleName, 'index.vue'), 'utf8');

describe('cooking table action columns', () => {
  it('keeps operation buttons on one line', () => {
    for (const moduleName of modulesWithActions) {
      const page = readPage(moduleName);
      const operationColumn = page.match(/<el-table-column[^>]*label="操作"[^>]*>/)?.[0] || '';
      expect(operationColumn, `${moduleName} operation column`).toContain('class-name="table-action-cell"');
    }
  });

  it('defines shared nowrap styles for operation cells', () => {
    const styles = readFileSync(resolve(__dirname, '..', 'assets', 'styles', 'index.scss'), 'utf8');

    expect(styles).toContain('.table-action-cell');
    expect(styles).toContain('white-space: nowrap');
  });
});
