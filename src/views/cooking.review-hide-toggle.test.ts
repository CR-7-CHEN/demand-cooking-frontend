import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(__dirname, 'cooking', 'review', 'index.vue'), 'utf8');

describe('cooking review hide toggle', () => {
  it('lets the operator hide and unhide a review from the action column', () => {
    expect(source).toContain('toggleDisplayStatus(row)');
    expect(source).toContain('hideActionText(row)');
    expect(source).not.toContain('disabled>宸查殣钘?');
  });
});
