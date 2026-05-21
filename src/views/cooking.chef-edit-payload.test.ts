import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(__dirname, 'cooking', 'chef', 'index.vue'), 'utf8');
const editSubmitBlock = source.match(/if \(form\.chefId\) \{([\s\S]*?)await updateChef\(payload\);/)?.[1] || '';

describe('cooking chef edit payload', () => {
  it('submits the editable chef profile fields when saving an existing chef', () => {
    expect(editSubmitBlock).not.toContain('const payload: any = { chefId: form.chefId, chefStatus: form.chefStatus, baseSalary: form.baseSalary }');

    [
      'chefId',
      'chefName',
      'mobile',
      'gender',
      'age',
      'avatarUrl',
      'workImageUrls',
      'healthCertImageUrl',
      'intro',
      'specialties',
      'serviceArea',
      'availableTimes',
      'baseSalary',
      'chefStatus'
    ].forEach((field) => {
      expect(editSubmitBlock).toContain(field);
    });

    expect(editSubmitBlock).toContain('healthCertExpireDate: formatDate(form.healthCertExpireDate)');
    expect(editSubmitBlock).toContain('payload.resignReason = form.resignReason');
    expect(source).toContain('await updateChef(payload)');
  });
});
