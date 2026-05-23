import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const settlementPage = readFileSync(resolve(__dirname, 'cooking/settlement/index.vue'), 'utf8');
const statusSource = readFileSync(resolve(__dirname, '..', 'api', 'cooking', 'status.ts'), 'utf8');

describe('cooking settlement numeric status', () => {
  it('uses numeric settlement status values while keeping legacy English status display compatible', () => {
    expect(settlementPage).toContain('const statusOptions = settlementStatusOptions');
    expect(settlementPage).toContain('normalizeSettlementStatus(row.status) === cookingSettlementStatus.REVIEWING');
    expect(statusSource).toContain("GENERATED: '0'");
    expect(statusSource).toContain("REVIEWING: '1'");
    expect(statusSource).toContain("CONFIRMED: '2'");
    expect(statusSource).toContain("PAID: '3'");
    expect(statusSource).toContain('PAID_OFFLINE: cookingSettlementStatus.PAID');
  });
});
