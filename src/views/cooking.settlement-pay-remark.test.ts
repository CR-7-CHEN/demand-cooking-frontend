import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const settlementPage = readFileSync(resolve(__dirname, 'cooking/settlement/index.vue'), 'utf8');
const settlementTypes = readFileSync(resolve(__dirname, '..', 'api/cooking/settlement/types.ts'), 'utf8');
const cookingTypes = readFileSync(resolve(__dirname, '..', 'api/cooking/types.ts'), 'utf8');

describe('cooking settlement pay remark', () => {
  it('opens a pay dialog, requires pay remark, and submits it to paySettlement', () => {
    expect(settlementPage).toContain('payDialog.visible');
    expect(settlementPage).toContain('v-model="payForm.payRemark"');
    expect(settlementPage).toContain('submitPay');
    expect(settlementPage).toContain("String(payForm.payRemark || '').trim()");
    expect(settlementPage).toContain('payRemark: String(payForm.payRemark || \'\').trim()');
    expect(settlementTypes).toContain('payRemark?: string');
  });

  it('shows pay remark in settlement detail', () => {
    expect(settlementPage).toContain('current.payRemark || \'-\'');
    expect(cookingTypes).toContain('payRemark?: string');
  });
});

