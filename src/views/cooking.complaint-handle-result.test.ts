import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(__dirname, 'cooking', 'complaint', 'index.vue'), 'utf8');
const apiTypes = readFileSync(resolve(__dirname, '..', 'api', 'cooking', 'types.ts'), 'utf8');
const statusSource = readFileSync(resolve(__dirname, '..', 'api', 'cooking', 'status.ts'), 'utf8');

describe('cooking complaint handling closure', () => {
  it('requires a handle result dialog before handling a complaint', () => {
    expect(source).toContain('handleDialog.visible');
    expect(source).toContain('handleForm.handleResult');
    expect(source).toContain('prop="handleResult"');
    expect(source).toContain('请输入处理说明');
    expect(source).toContain('submitHandle');
    expect(source).toContain('handleResult: handleForm.handleResult');
  });

  it('shows handle actions only for pending complaints and displays the handle result', () => {
    expect(source).toContain('v-if="canHandle(row)"');
    expect(source).toContain('label="处理说明"');
    expect(source).toContain('prop="handleResult"');
    expect(source).toContain('complaintStatusText(row.status)');
    expect(source).toContain('normalizeComplaintStatus(row.status) === cookingComplaintStatus.PENDING');
  });

  it('uses numeric complaint statuses while keeping legacy English values readable', () => {
    expect(source).toContain('complaintStatusOptions');
    expect(statusSource).toContain("PENDING: '0'");
    expect(statusSource).toContain("ESTABLISHED: '1'");
    expect(statusSource).toContain("REJECTED: '2'");
    expect(statusSource).toContain("[cookingComplaintStatus.PENDING]: '待处理'");
    expect(statusSource).toContain("[cookingComplaintStatus.ESTABLISHED]: '成立'");
    expect(statusSource).toContain("[cookingComplaintStatus.REJECTED]: '不成立'");
    expect(source).toContain('status: handleForm.established ? cookingComplaintStatus.ESTABLISHED : cookingComplaintStatus.REJECTED');
    expect(apiTypes).toContain('handleResult?: string');
  });
});
