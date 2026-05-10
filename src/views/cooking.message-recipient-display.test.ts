import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(__dirname, 'cooking', 'message', 'index.vue'), 'utf8');

describe('cooking message recipient display', () => {
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
