import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(__dirname, 'cooking', 'chef', 'index.vue'), 'utf8');

describe('cooking chef status actions', () => {
  it('shows pause only for approved normal chefs and resume only for paused chefs', () => {
    expect(source).toContain('v-if="canPauseChef(row)"');
    expect(source).toContain('v-if="canResumeChef(row)"');
    expect(source).toContain("handleStatus(row, '1')");
    expect(source).toContain("handleStatus(row, '0')");
    expect(source).toContain('const canPauseChef = (row: ChefVO) => isApprovedAudit(row.auditStatus) && isNormalChefStatus(row.chefStatus)');
    expect(source).toContain('const canResumeChef = (row: ChefVO) => isApprovedAudit(row.auditStatus) && isPausedChefStatus(row.chefStatus)');
  });

  it('normalizes numeric status values while keeping legacy enum display compatibility', () => {
    expect(source).toContain('const normalizeAuditStatus = (value?: string | number) =>');
    expect(source).toContain('const normalizeChefStatus = (value?: string | number) =>');
    expect(source).toContain("APPROVED: '1'");
    expect(source).toContain("PAUSED: '1'");
    expect(source).toContain("RESIGNED: '3'");
    expect(source).toContain("normalizeChefStatus(row.chefStatus) === '0' ? 'success' : 'info'");
  });
});
