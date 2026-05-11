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
});
