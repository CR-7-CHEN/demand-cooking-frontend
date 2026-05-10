import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageSource = readFileSync(resolve(__dirname, 'index.vue'), 'utf8');

describe('homepage recent order status copy', () => {
  it('maps backend english order enums to Chinese status text', () => {
    expect(homepageSource).toContain('recentOrderStatusText');
    expect(homepageSource).toContain("REFUNDING: '退款中'");
    expect(homepageSource).toContain("REFUNDED: '已退款'");
    expect(homepageSource).toContain("WAITING_CONFIRM: '待确认'");
    expect(homepageSource).toContain("COMPLETED: '已完成'");
  });

  it('does not directly echo raw backend status values in recent orders', () => {
    expect(homepageSource).not.toContain("statusLabel: order.statusLabel || order.status || '-'");
  });
});
