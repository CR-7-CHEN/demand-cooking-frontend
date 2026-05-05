<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.chefName" clearable placeholder="做饭人员姓名" @keyup.enter="getList" />
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
        <el-table-column label="手机号" prop="mobile" min-width="130" />
        <el-table-column label="服务区域" prop="areaName" min-width="140" show-overflow-tooltip />
        <el-table-column label="擅长" prop="skillTags" min-width="160" show-overflow-tooltip />
        <el-table-column label="健康证到期" prop="healthCertExpireDate" min-width="160" />
        <el-table-column label="评分" prop="rating" min-width="90" />
        <el-table-column label="完成单数" prop="completedOrders" min-width="100" />
        <el-table-column label="审核" min-width="100">
          <template #default="{ row }">
            <el-tag>{{ auditText(row.auditStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.chefStatus === '0' ? 'success' : 'info'">{{ statusText(row.chefStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="210">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleAudit(row, '1')">通过</el-button>
            <el-button link type="warning" @click="handleStatus(row, '1')">暂停</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="620px" append-to-body>
      <el-form :model="form" label-width="110px">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="姓名"><el-input v-model="form.chefName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机号"><el-input v-model="form.mobile" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="区域"><el-input v-model="form.areaName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="底薪"><el-input-number v-model="form.baseSalary" :min="0" class="w-full" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="擅长菜系"><el-input v-model="form.skillTags" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="健康证图片"><el-input v-model="form.healthCertImageUrl" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="健康证到期"><el-date-picker v-model="form.healthCertExpireDate" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="接单状态"><el-select v-model="form.chefStatus"><el-option label="可接单" value="0" /><el-option label="暂停" value="1" /><el-option label="禁用" value="2" /><el-option label="离职" value="3" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="简介"><el-input v-model="form.intro" type="textarea" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingChef" lang="ts">
import { addChef, auditChef, changeChefStatus, listChef, updateChef } from '@/api/cooking/chef';
import type { ChefVO } from '@/api/cooking/chef/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<ChefVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, chefName: '', mobile: '', chefStatus: '' });
const form = reactive<any>({});
const dialog = reactive({ visible: false, title: '' });

const getList = async () => {
  loading.value = true;
  const res: any = await listChef(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, chefName: '', mobile: '', chefStatus: '' });
  getList();
};

const handleAdd = () => {
  Object.keys(form).forEach((key) => delete form[key]);
  form.chefStatus = '0';
  dialog.title = '新增做饭人员';
  dialog.visible = true;
};

const handleEdit = (row: ChefVO) => {
  Object.assign(form, row);
  dialog.title = '编辑做饭人员';
  dialog.visible = true;
};

const submit = async () => {
  form.chefId ? await updateChef(form) : await addChef(form);
  proxy?.$modal.msgSuccess('保存成功');
  dialog.visible = false;
  getList();
};

const handleAudit = async (row: ChefVO, auditStatus: string) => {
  await auditChef({ ...row, auditStatus });
  proxy?.$modal.msgSuccess('审核已更新');
  getList();
};

const handleStatus = async (row: ChefVO, chefStatus: string) => {
  await changeChefStatus({ ...row, chefStatus });
  proxy?.$modal.msgSuccess('状态已更新');
  getList();
};

const auditText = (value?: string) => ({ '0': '待审核', '1': '通过', '2': '驳回', PENDING: '待审核', APPROVED: '通过', REJECTED: '驳回' })[value || ''] || value || '-';
const statusText = (value?: string) => ({ '0': '可接单', '1': '暂停', '2': '禁用', '3': '离职', APPROVED: '可接单', PAUSED: '暂停', DISABLED: '禁用', RESIGNED: '离职' })[value || ''] || value || '-';

onMounted(getList);
</script>
