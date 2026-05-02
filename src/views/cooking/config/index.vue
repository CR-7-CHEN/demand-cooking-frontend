<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="配置键"><el-input v-model="queryParams.configKey" clearable @keyup.enter="getList" /></el-form-item>
        <el-form-item label="配置名"><el-input v-model="queryParams.configName" clearable @keyup.enter="getList" /></el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows">
        <el-table-column label="配置名" prop="configName" min-width="160" />
        <el-table-column label="配置键" prop="configKey" min-width="210" />
        <el-table-column label="配置值" prop="configValue" min-width="160" show-overflow-tooltip />
        <el-table-column label="类型" prop="configType" width="110" />
        <el-table-column label="发布状态" prop="publishStatus" width="110" />
        <el-table-column label="生效时间" prop="effectiveTime" width="170" />
        <el-table-column label="操作" fixed="right" width="160">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="publish(row)">发布</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="620px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-form-item label="配置名"><el-input v-model="form.configName" /></el-form-item>
        <el-form-item label="配置键"><el-input v-model="form.configKey" /></el-form-item>
        <el-form-item label="配置值"><el-input v-model="form.configValue" type="textarea" /></el-form-item>
        <el-form-item label="配置类型"><el-input v-model="form.configType" /></el-form-item>
        <el-form-item label="公告内容"><el-input v-model="form.announcementContent" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialog.visible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingConfig" lang="ts">
import { addCookingConfig, listCookingConfig, publishCookingConfig, updateCookingConfig } from '@/api/cooking/config';
import type { ConfigVO } from '@/api/cooking/config/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<ConfigVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, configKey: '', configName: '' });
const form = reactive<any>({});
const dialog = reactive({ visible: false, title: '' });

const getList = async () => {
  loading.value = true;
  const res: any = await listCookingConfig(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};
const handleAdd = () => { Object.keys(form).forEach((key) => delete form[key]); dialog.title = '新增配置'; dialog.visible = true; };
const handleEdit = (row: ConfigVO) => { Object.assign(form, row); dialog.title = '编辑配置'; dialog.visible = true; };
const submit = async () => { form.configId ? await updateCookingConfig(form) : await addCookingConfig(form); proxy?.$modal.msgSuccess('保存成功'); dialog.visible = false; getList(); };
const publish = async (row: ConfigVO) => { if (!row.configId) return; await publishCookingConfig(row.configId); proxy?.$modal.msgSuccess('发布成功'); getList(); };
onMounted(getList);
</script>
