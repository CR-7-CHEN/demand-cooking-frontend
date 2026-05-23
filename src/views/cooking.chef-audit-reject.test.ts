import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(__dirname, 'cooking', 'chef', 'index.vue'), 'utf8');

describe('cooking chef audit reject entry', () => {
  it('requires an audit reason when rejecting a chef application', () => {
    expect(source).toContain('驳回');
    expect(source).toContain("handleRejectAudit(row)");
    expect(source).toContain('rejectAuditDialog.visible');
    expect(source).toContain('rejectAuditForm.auditReason');
    expect(source).toContain('placeholder="请填写驳回原因"');
    expect(source).not.toContain('请填写驳回原因，用户将在小程序端看到');
    expect(source).toContain("auditStatus: '2'");
  });

  it('only shows audit actions for pending chefs and labels the column as 审核状态', () => {
    expect(source).toContain('label="审核状态"');
    expect(source).toContain('v-if="canAudit(row)"');
    expect(source).toContain('const canAudit = (row: ChefVO) =>');
    expect(source).toContain("PENDING: '0'");
    expect(source).toContain("['', '0'].includes(normalizeAuditStatus(row.auditStatus))");
  });
});
