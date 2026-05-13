import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const orderPageSource = readFileSync(resolve(__dirname, 'cooking', 'order', 'index.vue'), 'utf8');
const statusSource = readFileSync(resolve(__dirname, '..', 'api', 'cooking', 'status.ts'), 'utf8');

describe('backend order management status copy', () => {
  it('uses numeric backend order statuses in the visible option map', () => {
    expect(statusSource).toContain("[cookingOrderStatus.WAITING_RESPONSE]: '待响应'")
    expect(statusSource).toContain("[cookingOrderStatus.COMPLETED]: '已完成'")
    expect(statusSource).toContain("[cookingOrderStatus.REJECTED_CLOSED]: '已拒单'")
    expect(statusSource).toContain("[cookingOrderStatus.RESPONSE_TIMEOUT_CLOSED]: '响应超时关闭'")
    expect(statusSource).toContain("[cookingOrderStatus.OBJECTION_TIMEOUT_CLOSED]: '异议超时关闭'")
    expect(statusSource).toContain("[cookingOrderStatus.PAY_TIMEOUT_CLOSED]: '支付超时关闭'")
    expect(statusSource).toContain("[cookingOrderStatus.CANCELED]: '已取消'")
    expect(statusSource).toContain("[cookingOrderStatus.REFUND_FAILED]: '退款失败'")
    expect(orderPageSource).toContain('const statusOptions = orderStatusOptions');
  });

  it('normalizes legacy English statuses before display', () => {
    expect(statusSource).toContain("WAITING_RESPONSE: cookingOrderStatus.WAITING_RESPONSE");
    expect(statusSource).toContain("REFUND_FAILED: cookingOrderStatus.REFUND_FAILED");
    expect(orderPageSource).toContain('const statusText = orderStatusText');
  });
});
