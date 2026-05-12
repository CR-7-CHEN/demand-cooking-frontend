import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(__dirname, 'cooking', 'message', 'index.vue'), 'utf8');

describe('cooking message recipient display', () => {
  it('uses receiver name search instead of receiver type filter in the query form', () => {
    expect(source).toContain('label="接收人"');
    expect(source).toContain('v-model="queryParams.receiverKeyword"');
    expect(source).toContain('placeholder="账号或服务厨师姓名"');
    expect(source).not.toContain('v-model="queryParams.receiverType"');
  });

  it('searches by send time instead of record time in the query form', () => {
    expect(source).toContain('label="发送时间"');
    expect(source).toContain('start-placeholder="发送开始时间"');
    expect(source).toContain('end-placeholder="发送结束时间"');
    expect(source).not.toContain('label="记录时间"');
  });

  it('does not expose receiver id in the list recipient column', () => {
    expect(source).toContain('receiverDisplay(row)');
    expect(source).toContain('`${receiverType}/${receiverName}`');
    expect(source).not.toContain('<span v-if="row.receiverId"> / {{ row.receiverId }}</span>');
  });

  it('removes the business column from the message list', () => {
    expect(source).not.toContain('bizTypeOptions, row.relatedBizType');
    expect(source).not.toContain('row.relatedBizId');
  });
});
