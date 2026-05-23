import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageSource = readFileSync(resolve(__dirname, 'index.vue'), 'utf8');
const statusSource = readFileSync(resolve(__dirname, '..', 'api', 'cooking', 'status.ts'), 'utf8');

describe('homepage recent order status copy', () => {
  it('maps numeric order statuses to Chinese text while keeping legacy enums readable', () => {
    expect(homepageSource).toContain('recentOrderStatusText');
    expect(statusSource).toContain("[cookingOrderStatus.WAITING_CONFIRM]: '用户待确认'");
    expect(statusSource).toContain("[cookingOrderStatus.COMPLETED]: '已完成'");
    expect(statusSource).toContain("[cookingOrderStatus.REFUNDING]: '退款中'");
    expect(statusSource).toContain("[cookingOrderStatus.REFUNDED]: '已退款'");
    expect(statusSource).toContain("WAITING_CONFIRM: cookingOrderStatus.WAITING_CONFIRM");
    expect(statusSource).toContain("REFUNDED: cookingOrderStatus.REFUNDED");
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
