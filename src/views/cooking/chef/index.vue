<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.chefName" clearable placeholder="服务厨师姓名" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryParams.mobile" clearable placeholder="手机号" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.chefStatus" clearable placeholder="接单状态" style="width: 150px">
            <el-option label="可接单" value="0" />
            <el-option label="暂停" value="1" />
            <el-option label="禁用" value="2" />
            <el-option label="离职" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryParams.auditStatus" clearable placeholder="审核状态" style="width: 150px">
            <el-option label="待审核" value="0" />
            <el-option label="通过" value="1" />
            <el-option label="驳回" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="姓名" prop="chefName" min-width="120" />
        <el-table-column label="性别" min-width="90">
          <template #default="{ row }">{{ genderText(row.gender) }}</template>
        </el-table-column>
        <el-table-column label="年龄" prop="age" min-width="90" />
        <el-table-column label="手机号" prop="mobile" min-width="130" />
        <el-table-column label="底薪" prop="baseSalary" min-width="120" />
        <el-table-column label="服务区域" min-width="120">
          <template #default="{ row }">
            <el-button v-if="hasServiceArea(row)" link type="primary" @click="handleServiceArea(row)">查看</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="可预约时间" min-width="120">
          <template #default="{ row }">
            <el-button v-if="hasAvailableTime(row)" link type="primary" @click="handleAvailableTime(row)">查看</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="擅长" prop="skillTags" min-width="160" show-overflow-tooltip />
        <el-table-column label="健康证到期" prop="healthCertExpireDate" min-width="160">
          <template #default="{ row }">{{ formatDate(row.healthCertExpireDate) || '-' }}</template>
        </el-table-column>
        <el-table-column label="评分" prop="rating" min-width="90" />
        <el-table-column label="完成单数" prop="completedOrders" min-width="100" />
        <el-table-column label="审核状态" min-width="100">
          <template #default="{ row }">
            <el-tag>{{ auditText(row.auditStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核人" prop="auditBy" min-width="110">
          <template #default="{ row }">{{ row.auditBy || '-' }}</template>
        </el-table-column>
        <el-table-column label="审核时间" min-width="160">
          <template #default="{ row }">{{ formatDateTime(row.auditTime) || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="normalizeChefStatus(row.chefStatus) === '0' ? 'success' : 'info'">{{ statusText(row.chefStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="驳回原因" prop="auditReason" min-width="180" show-overflow-tooltip />
        <el-table-column label="离职原因" prop="resignReason" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="250" class-name="table-action-cell">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="canAudit(row)" link type="success" @click="handleAudit(row, '1')">通过</el-button>
            <el-button v-if="canAudit(row)" link type="danger" @click="handleRejectAudit(row)">驳回</el-button>
            <el-button v-if="canPauseChef(row)" link type="warning" @click="handleStatus(row, '1')">暂停</el-button>
            <el-button v-if="canResumeChef(row)" link type="success" @click="handleStatus(row, '0')">恢复接单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="760px" append-to-body>
      <el-form :model="form" label-width="110px">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="姓名"><el-input v-model="form.chefName" :disabled="isEditMode" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机号"><el-input v-model="form.mobile" :disabled="isEditMode" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="性别"><el-select v-model="form.gender" :disabled="isEditMode"><el-option label="男" value="0" /><el-option label="女" value="1" /><el-option label="未知" value="2" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="年龄"><el-input-number v-model="form.age" :min="0" :max="150" :precision="0" class="w-full" :disabled="isEditMode" /></el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="服务区域">
              <el-button v-if="hasServiceArea(form)" link type="primary" @click="handleServiceArea(form)">查看</el-button>
              <span v-else class="image-empty">-</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="头像">
              <div v-if="imageList(form.avatarUrl).length" class="chef-image-list single">
                <el-image
                  v-for="(url, index) in imageList(form.avatarUrl)"
                  :key="url + index"
                  class="chef-image avatar"
                  :src="url"
                  fit="contain"
                  :preview-src-list="imageList(form.avatarUrl)"
                  preview-teleported
                />
              </div>
              <span v-else class="image-empty">暂无头像</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="作品图">
              <div v-if="imageList(form.workImageUrls).length" class="chef-image-list">
                <el-image
                  v-for="(url, index) in imageList(form.workImageUrls)"
                  :key="url + index"
                  class="chef-image"
                  :src="url"
                  fit="contain"
                  :preview-src-list="imageList(form.workImageUrls)"
                  preview-teleported
                />
              </div>
              <span v-else class="image-empty">暂无作品图</span>
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="底薪"><el-input-number v-model="form.baseSalary" :min="0" class="w-full" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="擅长菜系"><el-input v-model="form.skillTags" :disabled="isEditMode" /></el-form-item></el-col>
          <el-col :span="24">
            <el-form-item label="健康证图片">
              <div v-if="imageList(form.healthCertImageUrl).length" class="chef-image-list">
                <el-image
                  v-for="(url, index) in imageList(form.healthCertImageUrl)"
                  :key="url + index"
                  class="chef-image cert"
                  :src="url"
                  fit="contain"
                  :preview-src-list="imageList(form.healthCertImageUrl)"
                  preview-teleported
                />
              </div>
              <span v-else class="image-empty">暂无健康证图片</span>
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="健康证到期"><el-date-picker v-model="form.healthCertExpireDate" value-format="YYYY-MM-DD" type="date" :disabled="isEditMode" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="接单状态"><el-select v-model="form.chefStatus"><el-option label="可接单" value="0" /><el-option label="暂停" value="1" /><el-option label="禁用" value="2" /><el-option label="离职" value="3" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="离职原因"><el-input v-model="form.resignReason" type="textarea" :rows="2" :disabled="!canEditResignReason" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="简介"><el-input v-model="form.intro" type="textarea" :disabled="isEditMode" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="availableTimeDialog.visible" :title="availableTimeDialog.title" width="520px" append-to-body>
      <div v-if="availableTimeDialog.times.length" class="available-time-list">
        <div v-for="(item, index) in availableTimeDialog.times" :key="index" class="available-time-line">{{ item }}</div>
      </div>
      <el-empty v-else description="暂无可预约时间" />
    </el-dialog>

    <el-dialog v-model="serviceAreaDialog.visible" :title="serviceAreaDialog.title" width="520px" append-to-body>
      <div v-if="serviceAreaDialog.areas.length" class="service-area-list">
        <div v-for="(item, index) in serviceAreaDialog.areas" :key="index" class="service-area-line">{{ item }}</div>
      </div>
      <el-empty v-else description="暂无服务区域" />
    </el-dialog>

    <el-dialog v-model="rejectAuditDialog.visible" title="驳回入驻申请" width="520px" append-to-body>
      <el-form :model="rejectAuditForm" label-width="90px">
        <el-form-item label="服务厨师">
          <span>{{ rejectAuditForm.chefName || '-' }}</span>
        </el-form-item>
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="rejectAuditForm.auditReason"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请填写驳回原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectAuditDialog.visible = false">取消</el-button>
        <el-button type="danger" @click="submitRejectAudit">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingChef" lang="ts">
import { addChef, auditChef, changeChefStatus, listChef, updateChef } from '@/api/cooking/chef';
import type { ChefVO } from '@/api/cooking/chef/types';
import { useRoute } from 'vue-router';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
const loading = ref(false);
const rows = ref<ChefVO[]>([]);
const total = ref(0);
const routeQueryValue = (value: unknown) => {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === 'string' ? firstValue : '';
};
const queryParams = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  chefName: '',
  mobile: '',
  chefStatus: '',
  auditStatus: routeQueryValue(route.query.auditStatus)
});
const form = reactive<any>({});
const dialog = reactive({ visible: false, title: '' });
const availableTimeDialog = reactive({ visible: false, title: '可预约时间', times: [] as string[] });
const serviceAreaDialog = reactive({ visible: false, title: '服务区域', areas: [] as string[] });
const rejectAuditDialog = reactive({ visible: false });
const rejectAuditForm = reactive<any>({ chefId: undefined, chefName: '', auditReason: '' });
const isEditMode = computed(() => Boolean(form.chefId));
const canEditResignReason = computed(() => isEditMode.value && isResignedStatus(form.chefStatus));

const getList = async () => {
  loading.value = true;
  const res: any = await listChef(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, chefName: '', mobile: '', chefStatus: '', auditStatus: '' });
  getList();
};

const handleAdd = () => {
  Object.keys(form).forEach((key) => delete form[key]);
  form.gender = '2';
  form.chefStatus = '0';
  dialog.title = '新增服务厨师';
  dialog.visible = true;
};

const handleEdit = (row: ChefVO) => {
  Object.assign(form, row);
  form.healthCertExpireDate = formatDate(row.healthCertExpireDate);
  dialog.title = '编辑服务厨师';
  dialog.visible = true;
};

const submit = async () => {
  if (form.chefId) {
    const payload: any = {
      chefId: form.chefId,
      chefName: form.chefName,
      mobile: form.mobile,
      gender: form.gender,
      age: form.age,
      avatarUrl: form.avatarUrl,
      workImageUrls: form.workImageUrls,
      healthCertImageUrl: form.healthCertImageUrl,
      healthCertExpireDate: formatDate(form.healthCertExpireDate),
      intro: form.intro,
      specialties: form.specialties ?? form.skillTags,
      skillTags: form.skillTags,
      serviceArea: form.serviceArea,
      availableTimes: form.availableTimes,
      baseSalary: form.baseSalary,
      chefStatus: form.chefStatus
    };
    if (isResignedStatus(form.chefStatus)) {
      payload.resignReason = form.resignReason;
    }
    await updateChef(payload);
  } else {
    const payload = { ...form, healthCertExpireDate: formatDate(form.healthCertExpireDate) };
    await addChef(payload);
  }
  proxy?.$modal.msgSuccess('保存成功');
  dialog.visible = false;
  getList();
};

const handleAudit = async (row: ChefVO, auditStatus: string) => {
  await auditChef({ chefId: row.chefId, auditStatus, auditReason: '' });
  proxy?.$modal.msgSuccess('审核已更新');
  getList();
};

const handleRejectAudit = (row: ChefVO) => {
  Object.assign(rejectAuditForm, {
    chefId: row.chefId,
    chefName: row.chefName,
    auditReason: row.auditReason || ''
  });
  rejectAuditDialog.visible = true;
};

const submitRejectAudit = async () => {
  const auditReason = String(rejectAuditForm.auditReason || '').trim();
  if (!auditReason) {
    proxy?.$modal.msgError('请填写驳回原因');
    return;
  }
  await auditChef({ chefId: rejectAuditForm.chefId, auditStatus: '2', auditReason });
  proxy?.$modal.msgSuccess('已驳回入驻申请');
  rejectAuditDialog.visible = false;
  getList();
};

const handleStatus = async (row: ChefVO, chefStatus: string) => {
  await changeChefStatus({ ...row, chefStatus });
  proxy?.$modal.msgSuccess('状态已更新');
  getList();
};

const hasAvailableTime = (row: ChefVO) => buildAvailableTimeLines(row).length > 0;

const handleAvailableTime = (row: ChefVO) => {
  availableTimeDialog.title = `${row.chefName || '服务厨师'} - 可预约时间`;
  availableTimeDialog.times = buildAvailableTimeLines(row);
  availableTimeDialog.visible = true;
};

const hasServiceArea = (row: any) => buildServiceAreaLines(row).length > 0;

const handleServiceArea = (row: any) => {
  serviceAreaDialog.title = `${row.chefName || '服务厨师'} - 服务区域`;
  serviceAreaDialog.areas = buildServiceAreaLines(row);
  serviceAreaDialog.visible = true;
};

const buildServiceAreaLines = (row: any) => {
  const rawValue = getServiceAreaValue(row);
  const values = Array.isArray(rawValue) ? rawValue : [rawValue];
  return values
    .flatMap((item) => parseServiceAreaItem(item))
    .map((item) => item.trim())
    .filter(Boolean);
};

const getServiceAreaValue = (row: any) => {
  if (Array.isArray(row?.serviceAreas) && row.serviceAreas.length) return row.serviceAreas;
  if (row?.serviceArea) return row.serviceArea;
  return row?.areaName;
};

const parseServiceAreaItem = (item: any) => {
  if (item == null) return [];
  if (typeof item === 'object') {
    return parseServiceAreaItem(item.areaName || item.serviceArea || item.name || item.label);
  }
  return String(item)
    .split(/[,，、;；\n]/)
    .map((area) => area.trim())
    .filter(Boolean);
};

const buildAvailableTimeLines = (row: ChefVO) => {
  if (Array.isArray(row.availableTimes) && row.availableTimes.length) {
    return row.availableTimes.map((item) => formatAvailableTime(item)).filter(Boolean);
  }
  return String(row.availableTimeText || '')
    .split(/[;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatAvailableTime = (item: any) => {
  const start = formatDateTime(item.startTime);
  const end = formatDateTime(item.endTime);
  if (!start && !end) return '';
  const range = [start, end].filter(Boolean).join(' - ');
  return item.remark ? `${range}（${item.remark}）` : range;
};

const formatDateTime = (value?: string) => {
  if (!value) return '';
  return String(value).replace('T', ' ').slice(0, 16);
};

const formatDate = (value?: string) => {
  if (!value) return '';
  return String(value).replace('T', ' ').slice(0, 10);
};

const imageList = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }
  const text = String(value || '').trim();
  if (!text) return [];
  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item || '').trim()).filter(Boolean);
      }
    } catch {
      return [];
    }
  }
  return text
    .split(/[,，;\n；]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeAuditStatus = (value?: string | number) => {
  const key = String(value ?? '').trim().toUpperCase();
  return ({ PENDING: '0', APPROVED: '1', REJECTED: '2' } as Record<string, string>)[key] || key;
};

const normalizeChefStatus = (value?: string | number) => {
  const key = String(value ?? '').trim().toUpperCase();
  return ({ NORMAL: '0', AVAILABLE: '0', APPROVED: '0', PAUSED: '1', DISABLED: '2', RESIGNED: '3' } as Record<string, string>)[key] || key;
};

const auditText = (value?: string | number) => ({ '0': '待审核', '1': '通过', '2': '驳回' })[normalizeAuditStatus(value)] || String(value ?? '') || '-';
const statusText = (value?: string | number) => ({ '0': '可接单', '1': '暂停', '2': '禁用', '3': '离职' })[normalizeChefStatus(value)] || String(value ?? '') || '-';
const genderText = (value?: string) => ({ '0': '男', '1': '女', '2': '未知' })[value || ''] || '-';
const isApprovedAudit = (value?: string | number) => normalizeAuditStatus(value) === '1';
const isNormalChefStatus = (value?: string | number) => normalizeChefStatus(value) === '0';
const isPausedChefStatus = (value?: string | number) => normalizeChefStatus(value) === '1';
const isResignedStatus = (value?: string | number) => normalizeChefStatus(value) === '3';
const canAudit = (row: ChefVO) => ['', '0'].includes(normalizeAuditStatus(row.auditStatus));
const canPauseChef = (row: ChefVO) => isApprovedAudit(row.auditStatus) && isNormalChefStatus(row.chefStatus);
const canResumeChef = (row: ChefVO) => isApprovedAudit(row.auditStatus) && isPausedChefStatus(row.chefStatus);

onMounted(getList);
</script>

<style scoped>
.available-time-list,
.service-area-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.available-time-line,
.service-area-line {
  padding: 10px 12px;
  border-radius: 6px;
  background: #f7f8fa;
  color: #303133;
  line-height: 1.5;
}

.chef-image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.chef-image-list.single {
  max-width: 148px;
}

.chef-image {
  width: 148px;
  height: 148px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #f7f8fa;
}

.chef-image.avatar {
  width: 120px;
  height: 120px;
}

.chef-image.cert {
  width: 220px;
  height: 148px;
}

.image-empty {
  color: #909399;
}
</style>
