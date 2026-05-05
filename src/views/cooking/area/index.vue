<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="区域名称">
          <el-input v-model="queryParams.areaName" clearable placeholder="区域名称" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="区域级别">
          <el-select v-model="queryParams.areaLevel" clearable placeholder="区域级别" style="width: 150px">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" clearable placeholder="状态" style="width: 120px">
            <el-option label="启用" value="0" />
            <el-option label="停用" value="1" />
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
        <el-table-column label="区域编码" prop="areaCode" min-width="170" show-overflow-tooltip />
        <el-table-column label="区域名称" prop="areaName" min-width="160" />
        <el-table-column label="区域级别" prop="areaLevel" min-width="110">
          <template #default="{ row }">{{ levelText(row.areaLevel) }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'info'">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" min-width="90" />
        <el-table-column label="备注" prop="remark" min-width="180" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" min-width="170" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="620px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="区域编码"><el-input v-model="form.areaCode" placeholder="区域编码" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域名称"><el-input v-model="form.areaName" placeholder="区域名称" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级编码"><el-input v-model="form.parentCode" clearable placeholder="无上级可留空" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域级别">
              <el-select v-model="form.areaLevel" placeholder="区域级别" class="w-full">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio value="0">启用</el-radio>
                <el-radio value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" class="w-full" /></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="3" maxlength="500" show-word-limit /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingArea" lang="ts">
import { addArea, delArea, getArea, listArea, updateArea } from '@/api/cooking/area';
import type { AreaVO } from '@/api/cooking/area/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<AreaVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, areaName: '', areaLevel: '', status: '' });
const form = reactive<any>({});
const dialog = reactive({ visible: false, title: '' });
const levelOptions = [
  { label: '省级', value: 'PROVINCE' },
  { label: '城市', value: 'CITY' },
  { label: '区县', value: 'DISTRICT' },
  { label: '街道', value: 'STREET' }
];

const resetForm = () => {
  Object.keys(form).forEach((key) => delete form[key]);
  Object.assign(form, { areaLevel: 'CITY', status: '0', sort: 0 });
};

const getList = async () => {
  loading.value = true;
  const res: any = await listArea(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, areaName: '', areaLevel: '', status: '' });
  getList();
};

const handleAdd = () => {
  resetForm();
  dialog.title = '新增服务区域';
  dialog.visible = true;
};

const handleEdit = async (row: AreaVO) => {
  if (!row.areaId) return;
  resetForm();
  const res: any = await getArea(row.areaId);
  Object.assign(form, res.data || res);
  dialog.title = '编辑服务区域';
  dialog.visible = true;
};

const submit = async () => {
  form.areaId ? await updateArea(form) : await addArea(form);
  proxy?.$modal.msgSuccess('保存成功');
  dialog.visible = false;
  getList();
};

const handleDelete = async (row: AreaVO) => {
  if (!row.areaId) return;
  await delArea(row.areaId);
  proxy?.$modal.msgSuccess('删除成功');
  getList();
};

const levelText = (value?: string) => levelOptions.find((item) => item.value === value)?.label || value || '-';
const statusText = (value?: string) => ({ '0': '启用', '1': '停用' })[value || ''] || value || '-';

onMounted(getList);
</script>
