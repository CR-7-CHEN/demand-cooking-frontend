import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const orderPageSource = readFileSync(resolve(__dirname, 'cooking', 'order', 'index.vue'), 'utf8');

describe('backend order management status copy', () => {
  it('maps all backend order terminal and exception statuses to Chinese text', () => {
    expect(orderPageSource).toContain("REJECTED_CLOSED: '已拒单'")
    expect(orderPageSource).toContain("RESPONSE_TIMEOUT_CLOSED: '响应超时关闭'")
    expect(orderPageSource).toContain("OBJECTION_TIMEOUT_CLOSED: '异议超时关闭'")
    expect(orderPageSource).toContain("PAY_TIMEOUT_CLOSED: '支付超时关闭'")
    expect(orderPageSource).toContain("CANCELED: '已取消'")
    expect(orderPageSource).toContain("REFUND_FAILED: '退款失败'")
  });

  it('reads displayed text from the dedicated status map', () => {
    expect(orderPageSource).toContain("const statusText = (value?: string) => statusTextMap[value || ''] || value || '-'");
  });
});
