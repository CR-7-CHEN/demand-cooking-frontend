import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const settlementPage = readFileSync(resolve(__dirname, 'cooking/settlement/index.vue'), 'utf8');

describe('cooking settlement current month default', () => {
  it('defaults settlement month filters to the current local month', () => {
    expect(settlementPage).toContain('const currentSettlementMonth = () =>');
    expect(settlementPage).toContain('now.getFullYear()');
    expect(settlementPage).toContain("String(now.getMonth() + 1).padStart(2, '0')");
    expect(settlementPage).toContain('settlementMonth: currentSettlementMonth()');
    expect(settlementPage).toContain("Object.assign(queryParams, { pageNum: 1, settlementMonth: currentSettlementMonth(), chefId: '', status: '' })");
  });
});
