import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ticketPage = readFileSync(resolve(__dirname, 'cooking', 'ticket', 'index.vue'), 'utf8');
const initSql = readFileSync(
  resolve(__dirname, '..', '..', '..', 'demand-cooking-backend', 'script', 'sql', 'demand_cooking.sql'),
  'utf8'
);

describe('cooking ticket status alignment', () => {
  it('keeps the admin ticket page aligned with backend ticket states', () => {
    expect(ticketPage).toContain('supportTicketStatusOptions');
    expect(ticketPage).toContain('cookingSupportTicketStatus.CLOSED');
    expect(ticketPage).not.toContain("value: 'PROCESSING'");
    expect(ticketPage).not.toContain('PROCESSING:');
  });

  it('documents only the backend-supported ticket states in init sql', () => {
    expect(initSql).toContain('状态（0待处理 1已回复 2已关闭');
    expect(initSql).not.toContain('PROCESSING');
  });
});
