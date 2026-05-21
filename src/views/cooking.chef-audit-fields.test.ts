import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const pageSource = readFileSync(join(__dirname, 'cooking', 'chef', 'index.vue'), 'utf8');
const typeSource = readFileSync(join(__dirname, '..', 'api', 'cooking', 'types.ts'), 'utf8');

describe('cooking chef audit operator display', () => {
  it('declares audit operator fields in the chef API type', () => {
    expect(typeSource).toContain('auditBy?: string | number;');
    expect(typeSource).toContain('auditUserName?: string;');
    expect(typeSource).toContain('auditTime?: string;');
  });

  it('shows audit operator and time columns without changing pause actions', () => {
    expect(pageSource).toContain('label="审核人" prop="auditBy"');
    expect(pageSource).toContain('label="审核时间"');
    expect(pageSource).toContain("row.auditUserName || row.auditBy || '-'");
    expect(pageSource).toContain('formatDateTime(row.auditTime)');
    expect(pageSource).toContain("handleStatus(row, '1')");
  });
});
