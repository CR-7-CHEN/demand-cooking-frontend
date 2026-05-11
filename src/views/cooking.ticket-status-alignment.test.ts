import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ticketPage = readFileSync(resolve(__dirname, 'cooking', 'ticket', 'index.vue'), 'utf8');
const initSql = readFileSync(
  resolve(__dirname, '..', '..', '..', '..', 'backend', 'demand-cooking-backend', 'script', 'sql', 'demand_cooking.sql'),
  'utf8'
);

describe('cooking ticket status alignment', () => {
  it('keeps the admin ticket page aligned with backend ticket states', () => {
    expect(ticketPage).toContain("value: 'PENDING'");
    expect(ticketPage).toContain("value: 'REPLIED'");
    expect(ticketPage).toContain("value: 'CLOSED'");
    expect(ticketPage).not.toContain("value: 'PROCESSING'");
    expect(ticketPage).not.toContain('PROCESSING:');
  });

  it('documents only the backend-supported ticket states in init sql', () => {
    expect(initSql).toContain('PENDING待处理');
    expect(initSql).toContain('REPLIED已回复');
    expect(initSql).toContain('CLOSED已关闭');
    expect(initSql).not.toContain('PROCESSING');
  });
});
