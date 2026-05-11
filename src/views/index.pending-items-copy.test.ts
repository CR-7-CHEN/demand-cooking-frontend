import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageSource = readFileSync(resolve(__dirname, 'index.vue'), 'utf8');

describe('homepage pending item copy', () => {
  it('uses pending handling copy for user complaints instead of reply copy', () => {
    expect(homepageSource).toContain("label: '用户投诉待处理'");
    expect(homepageSource).not.toContain('用户投诉待回复');
  });
});
