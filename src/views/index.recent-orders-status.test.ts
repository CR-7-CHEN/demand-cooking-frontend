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

  it('keeps recent orders in a fixed-height scroll area with a view-all order link', () => {
    expect(homepageSource).toContain('class="panel recent-orders-panel"');
    expect(homepageSource).toContain('class="order-list recent-orders-scroll"');
    expect(homepageSource).toContain('handleViewAllOrders');
    expect(homepageSource).toContain("router.push('/cooking/order')");
    expect(homepageSource).toMatch(/\.recent-orders-panel\s*{[^}]*height:\s*280px/s);
    expect(homepageSource).toMatch(/\.recent-orders-scroll\s*{[^}]*overflow-y:\s*auto/s);
  });
});
