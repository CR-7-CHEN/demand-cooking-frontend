import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readView = (pathParts: string[]) => readFileSync(resolve(__dirname, ...pathParts), 'utf8');

describe('cooking announcement source alignment', () => {
  it('keeps announcement editing in system notice instead of business config', () => {
    const configPage = readView(['cooking', 'config', 'index.vue']);
    const noticePage = readView(['system', 'notice', 'index.vue']);

    expect(configPage).not.toContain('announcementContent');
    expect(configPage).not.toContain('公告内容');
    expect(configPage).not.toContain("ANNOUNCEMENT: '公告'");
    expect(configPage).toContain("item?.configType !== 'ANNOUNCEMENT'");
    expect(noticePage).toContain('form.noticeContent');
    expect(noticePage).toContain('公告标题');
    expect(noticePage).toContain('公告类型');
  });
});
