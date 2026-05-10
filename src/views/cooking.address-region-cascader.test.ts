import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const addressPage = () => readFileSync(resolve(__dirname, 'cooking', 'address', 'index.vue'), 'utf8');
const regionDataPath = resolve(__dirname, '..', 'utils', 'china-region-data.ts');

describe('cooking address region search', () => {
  it('uses province-city-district cascading data instead of service-area data for search', () => {
    const source = addressPage();

    expect(source).toContain("import regionData from '@/utils/china-region-data'");
    expect(source).not.toContain("import { listArea } from '@/api/cooking/area'");
    expect(source).toContain(':options="regionOptions"');
    expect(source).toContain('placeholder="请选择省 / 市 / 区"');
    expect(source).toContain('queryParams.areaName = selectedPath.map((item) => item.label).join');
    expect(existsSync(regionDataPath)).toBe(true);
  });
});
