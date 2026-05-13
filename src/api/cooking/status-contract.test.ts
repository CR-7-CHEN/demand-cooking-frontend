import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const statusPath = resolve(__dirname, 'status.ts');

describe('cooking numeric status contract', () => {
  it('exposes shared numeric status mappings for cooking modules', () => {
    expect(existsSync(statusPath)).toBe(true);
    const source = readFileSync(statusPath, 'utf8');

    expect(source).toContain("PENDING: '0'");
    expect(source).toContain("ESTABLISHED: '1'");
    expect(source).toContain("REJECTED: '2'");
    expect(source).toContain("GENERATED: '0'");
    expect(source).toContain("REVIEWING: '1'");
    expect(source).toContain("CONFIRMED: '2'");
    expect(source).toContain("PAID: '3'");
    expect(source).toContain("WAITING_RESPONSE: '0'");
    expect(source).toContain("REFUND_FAILED: '13'");
    expect(source).toContain('cookingMessageSendStatus');
    expect(source).toContain("SENDING: '3'");
    expect(source).toContain('cookingSupportTicketStatus');
    expect(source).toContain("CLOSED: '2'");
  });
});
