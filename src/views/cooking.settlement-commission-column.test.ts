import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const settlementPage = readFileSync(resolve(__dirname, 'cooking/settlement/index.vue'), 'utf8');
const cookingTypes = readFileSync(resolve(__dirname, '..', 'api/cooking/types.ts'), 'utf8');

const mainTable = (source: string) => {
  const start = source.indexOf('<el-table');
  const end = source.indexOf('</el-table>', start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return source.slice(start, end);
};

describe('cooking settlement commission display', () => {
  it('shows monthly chef commission after base salary and before deductions', () => {
    const table = mainTable(settlementPage);

    expect(table).toContain('label="提成总计" prop="chefCommission"');
    expect(table.indexOf('prop="baseSalary"')).toBeLessThan(table.indexOf('prop="chefCommission"'));
    expect(table.indexOf('prop="chefCommission"')).toBeLessThan(table.indexOf('prop="violationCount"'));
    expect(cookingTypes).toContain('chefCommission?: number');
  });
});
