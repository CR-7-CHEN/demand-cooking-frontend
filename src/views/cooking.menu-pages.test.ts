import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cookingModules = ['address', 'area', 'message', 'review', 'faq', 'ticket'];
const adaptiveListModules = ['chef', 'order', 'dish', 'complaint', 'settlement', 'config', 'address', 'area', 'message', 'review', 'faq', 'ticket'];

const readPage = (moduleName: string) => readFileSync(resolve(__dirname, 'cooking', moduleName, 'index.vue'), 'utf8');
const firstBlock = (source: string, start: string, end: string) => {
  const startIndex = source.indexOf(start);
  expect(startIndex, `${start} exists`).toBeGreaterThanOrEqual(0);
  const endIndex = source.indexOf(end, startIndex);
  expect(endIndex, `${end} exists`).toBeGreaterThan(startIndex);
  return source.slice(startIndex, endIndex + end.length);
};
const searchForm = (source: string) => firstBlock(source, '<el-form :model="queryParams"', '</el-form>');
const mainTable = (source: string) => firstBlock(source, '<el-table', '</el-table>');

describe('cooking dynamic menu pages', () => {
  it('has Vue pages for backend-configured cooking menu components', () => {
    for (const moduleName of cookingModules) {
      expect(existsSync(resolve(__dirname, 'cooking', moduleName, 'index.vue')), `${moduleName} page exists`).toBe(true);
    }
  });

  it('has API modules used by the cooking menu pages', () => {
    for (const moduleName of cookingModules) {
      expect(existsSync(resolve(__dirname, '..', 'api', 'cooking', moduleName, 'index.ts')), `${moduleName} api exists`).toBe(true);
      expect(existsSync(resolve(__dirname, '..', 'api', 'cooking', moduleName, 'types.ts')), `${moduleName} api types exist`).toBe(true);
    }
  });

  it('uses display-name query fields after relabeling ID searches', () => {
    const addressPage = readPage('address');
    const reviewPage = readPage('review');

    expect(addressPage).toContain('queryParams.userKeyword');
    expect(reviewPage).toContain('queryParams.orderNo');
    expect(reviewPage).toContain('queryParams.userKeyword');
    expect(reviewPage).toContain('queryParams.chefName');
  });

  it('keeps cooking list tables responsive', () => {
    for (const moduleName of adaptiveListModules) {
      const table = mainTable(readPage(moduleName));
      expect(table, `${moduleName} table fills container`).toContain('style="width: 100%"');
      for (const column of table.matchAll(/<el-table-column[^>]*>/g)) {
        expect(column[0], `${moduleName} column has stable width: ${column[0]}`).toMatch(/\b(min-width|width)=/);
      }
    }
  });

  it('matches the chef, order, and dish list changes', () => {
    const chefTable = mainTable(readPage('chef'));
    const orderTable = mainTable(readPage('order'));
    const dishPage = readPage('dish');

    expect(chefTable).toContain('label="服务区域"');
    expect(chefTable).toContain('handleServiceArea(row)');
    expect(chefTable).toContain('hasServiceArea(row)');
    expect(chefTable).not.toContain('prop="areaName"');
    expect(chefTable).toContain('label="性别"');
    expect(chefTable).toContain('label="年龄"');
    expect(chefTable).toContain('prop="age"');
    expect(chefTable).toContain('handleAvailableTime(row)');
    expect(readPage('chef')).toContain('available-time-list');
    expect(readPage('chef')).toContain('available-time-line');
    expect(readPage('chef')).toContain('service-area-list');
    expect(readPage('chef')).toContain('service-area-line');
    expect(readPage('chef')).toContain('buildServiceAreaLines');
    expect(readPage('chef')).toContain('<el-form-item label="服务区域">');
    expect(readPage('chef')).toContain('handleServiceArea(form)');
    expect(readPage('chef')).not.toContain('label="区域"><el-input v-model="form.areaName"');
    expect(chefTable).toContain('prop="resignReason"');
    expect(chefTable).toContain('genderText(row.gender)');
    expect(readPage('chef')).toContain('v-model="form.gender"');
    expect(readPage('chef')).toContain('label="头像"');
    expect(readPage('chef')).toContain('imageList(form.avatarUrl)');
    expect(readPage('chef')).toContain('label="作品图"');
    expect(readPage('chef')).toContain('imageList(form.workImageUrls)');
    expect(readPage('chef')).toContain('imageList(form.healthCertImageUrl)');
    expect(readPage('chef')).toContain('fit="contain"');
    expect(readPage('chef')).not.toContain('label="健康证图片"><el-input v-model="form.healthCertImageUrl"');
    expect(chefTable).toContain('formatDate(row.healthCertExpireDate)');
    expect(readPage('chef')).toContain('value-format="YYYY-MM-DD"');
    expect(readPage('chef')).toContain('type="date"');
    expect(readPage('chef')).not.toContain('value-format="YYYY-MM-DD HH:mm:ss"');
    expect(readPage('chef')).not.toContain('type="datetime"');
    expect(readPage('chef')).toContain('const isEditMode = computed(() => Boolean(form.chefId))');
    expect(readPage('chef')).toContain('v-model="form.chefName" :disabled="isEditMode"');
    expect(readPage('chef')).toContain('v-model="form.mobile" :disabled="isEditMode"');
    expect(readPage('chef')).toContain('v-model="form.gender" :disabled="isEditMode"');
    expect(readPage('chef')).toContain('v-model="form.age" :min="0" :max="150" :precision="0" class="w-full" :disabled="isEditMode"');
    expect(readPage('chef')).toContain('v-model="form.skillTags" :disabled="isEditMode"');
    expect(readPage('chef')).toContain('v-model="form.healthCertExpireDate" value-format="YYYY-MM-DD" type="date" :disabled="isEditMode"');
    expect(readPage('chef')).toContain('v-model="form.intro" type="textarea" :disabled="isEditMode"');
    expect(readPage('chef')).toContain('const canEditResignReason = computed(() => isEditMode.value && isResignedStatus(form.chefStatus))');
    expect(readPage('chef')).toContain('v-model="form.resignReason" type="textarea" :rows="2" :disabled="!canEditResignReason"');
    expect(readPage('chef')).toContain("const payload: any = { chefId: form.chefId, chefStatus: form.chefStatus, baseSalary: form.baseSalary }");
    expect(readPage('chef')).toContain('payload.resignReason = form.resignReason');
    expect(readPage('chef')).toContain("const isResignedStatus = (value?: string) => ['3', 'RESIGNED'].includes(String(value || ''))");
    expect(readFileSync(resolve(__dirname, '..', 'api', 'cooking', 'types.ts'), 'utf8')).toContain('age?: number');
    expect(orderTable.indexOf('label="订单号"')).toBeLessThan(orderTable.indexOf('label="做饭人员"'));
    expect(dishPage).toContain('<ImageUpload v-model="form.imageUrl" :limit="1"');
    expect(dishPage).not.toContain('<el-input v-model="form.imageUrl"');
  });

  it('matches address and service-area search/list requirements', () => {
    const addressPage = readPage('address');
    const addressForm = searchForm(addressPage);
    const addressTable = mainTable(addressPage);
    const areaPage = readPage('area');
    const areaForm = searchForm(areaPage);
    const areaTable = mainTable(areaPage);

    expect(addressForm).toContain('label="用户"');
    expect(addressForm).toContain('queryParams.userKeyword');
    expect(addressForm).not.toContain('queryParams.userId');
    expect(addressForm).not.toContain('queryParams.defaultFlag');
    expect(addressTable).not.toContain('label="地址ID"');
    expect(addressTable).toContain('label="用户"');

    expect(areaForm).not.toContain('queryParams.parentCode');
    expect(areaForm).not.toContain('queryParams.areaCode');
    expect(areaTable).not.toContain('label="上级编码"');
  });

  it('matches message and review search/list requirements', () => {
    const messagePage = readPage('message');
    const messageForm = searchForm(messagePage);
    const messageTable = mainTable(messagePage);
    const reviewPage = readPage('review');
    const reviewForm = searchForm(reviewPage);
    const reviewTable = mainTable(reviewPage);

    expect(messageForm).not.toContain('queryParams.relatedBizType');
    expect(messageTable.indexOf('label="订单号"')).toBeLessThan(messageTable.indexOf('label="消息类型"'));
    expect(messageTable).not.toContain('label="消息ID"');

    expect(reviewForm).toContain('queryParams.orderNo');
    expect(reviewForm).toContain('queryParams.userKeyword');
    expect(reviewForm).toContain('queryParams.chefName');
    expect(reviewForm).not.toContain('queryParams.orderId');
    expect(reviewForm).not.toContain('queryParams.userId');
    expect(reviewForm).not.toContain('queryParams.chefId');
    expect(reviewTable).not.toContain('label="评价ID"');
    expect(reviewTable).not.toContain('label="订单ID"');
    expect(reviewTable).toContain('label="用户"');
    expect(reviewTable).toContain('label="厨师姓名"');
  });
});
