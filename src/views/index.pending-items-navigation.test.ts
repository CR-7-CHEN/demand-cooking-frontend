import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const viewsDir = __dirname;
const homepageSource = readFileSync(resolve(viewsDir, 'index.vue'), 'utf8');
const chefPageSource = readFileSync(resolve(viewsDir, 'cooking/chef/index.vue'), 'utf8');
const complaintPageSource = readFileSync(resolve(viewsDir, 'cooking/complaint/index.vue'), 'utf8');

describe('homepage pending item navigation', () => {
  it('makes only chef audit and complaint reply pending items navigable', () => {
    expect(homepageSource).toContain('const pendingItemRoutes');
    expect(homepageSource).toContain("chefAudit: { path: '/cooking/chef', query: { auditStatus: '0' } }");
    expect(homepageSource).toContain("complaintReply: { path: '/cooking/complaint', query: { status: cookingComplaintStatus.PENDING } }");
    expect(homepageSource).not.toMatch(/chefService:\s*\{\s*path:/);
  });

  it('uses router navigation from clickable pending items only', () => {
    expect(homepageSource).toContain('useRouter');
    expect(homepageSource).toContain('handlePendingItemClick');
    expect(homepageSource).toContain('@click="handlePendingItemClick(item)"');
    expect(homepageSource).toContain(':class="{ clickable: isPendingItemClickable(item) }"');
  });

  it('applies pending-item query parameters on target list pages', () => {
    expect(chefPageSource).toContain('useRoute');
    expect(chefPageSource).toContain('route.query.auditStatus');
    expect(chefPageSource).toContain("auditStatus: routeQueryValue(route.query.auditStatus)");
    expect(chefPageSource).toContain('label="审核状态"');
    expect(chefPageSource).toContain('v-model="queryParams.auditStatus"');
    expect(chefPageSource).toContain('placeholder="审核状态"');
    expect(chefPageSource).toContain('label="待审核" value="0"');
    expect(chefPageSource).toContain('label="通过" value="1"');
    expect(chefPageSource).toContain('label="驳回" value="2"');

    expect(complaintPageSource).toContain('useRoute');
    expect(complaintPageSource).toContain('route.query.status');
    expect(complaintPageSource).toContain("status: routeQueryValue(route.query.status)");
  });
});
