import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const messagePageSource = readFileSync(resolve(__dirname, 'cooking', 'message', 'index.vue'), 'utf8');

describe('cooking message enum alignment', () => {
  it('supports backend-generated message types instead of only generic categories', () => {
    expect(messagePageSource).toContain("ORDER_SUBMIT");
    expect(messagePageSource).toContain("ORDER_QUOTE");
    expect(messagePageSource).toContain("ORDER_AUTO_CONFIRM");
  });

  it('supports the real stored message channel and send status values', () => {
    expect(messagePageSource).toContain("IN_APP");
    expect(messagePageSource).toContain('messageSendStatusOptions');
    expect(messagePageSource).toContain('cookingMessageSendStatus.SENT');
  });
});
