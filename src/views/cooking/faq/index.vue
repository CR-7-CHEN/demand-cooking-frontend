<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="问题">
          <el-input v-model="queryParams.question" clearable placeholder="请输入常见问题" style="width: 220px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="queryParams.category" clearable placeholder="请输入分类" style="width: 160px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" clearable style="width: 130px">
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
        <el-table-column label="问题" prop="question" min-width="240" show-overflow-tooltip />
        <el-table-column label="分类" prop="category" min-width="130">
          <template #default="{ row }">{{ row.category || '-' }}</template>
        </el-table-column>
        <el-table-column label="答案" prop="answer" min-width="320" show-overflow-tooltip />
        <el-table-column label="状态" prop="status" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'info'">{{ row.status === '0' ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" min-width="90" />
        <el-table-column label="命中次数" prop="hitCount" min-width="100" />
        <el-table-column label="更新时间" prop="updateTime" min-width="170" />
        <el-table-column label="操作" fixed="right" width="250" class-name="table-action-cell">
          <template #default="{ row }">
            <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button link :type="row.status === '0' ? 'warning' : 'success'" icon="Switch" @click="handleStatus(row)">
              {{ row.status === '0' ? '停用' : '启用' }}
            </el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="680px" append-to-body>
      <el-form ref="faqFormRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="问题" prop="question">
          <el-input v-model="form.question" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="form.category" maxlength="40" placeholder="如：订单、费用、服务流程" />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="form.answer" type="textarea" :rows="5" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="0">启用</el-radio>
            <el-radio value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="9999" controls-position="right" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingFaq" lang="ts">
import { addFaq, changeFaqStatus, delFaq, getFaq, listFaq, updateFaq } from '@/api/cooking/faq';
import type { FaqForm, FaqQuery, FaqVO } from '@/api/cooking/faq/types';
import type { FormInstance, FormRules } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const loading = ref(false);
const rows = ref<FaqVO[]>([]);
const total = ref(0);
const faqFormRef = ref<FormInstance>();
const queryParams = reactive<FaqQuery>({ pageNum: 1, pageSize: 10, question: '', category: '', status: '' });
const form = reactive<FaqForm>({});
const dialog = reactive({ visible: false, title: '' });
const rules: FormRules = {
  question: [{ required: true, message: '请输入常见问题', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
};

const resetForm = () => {
  Object.keys(form).forEach((key) => delete (form as Record<string, any>)[key]);
  Object.assign(form, { status: '0', sort: 0 });
  faqFormRef.value?.clearValidate();
};

const getList = async () => {
  loading.value = true;
  try {
    const res: any = await listFaq(queryParams);
    rows.value = res.rows || res.data || [];
    total.value = res.total || rows.value.length;
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, question: '', category: '', status: '' });
  getList();
};

const handleAdd = () => {
  resetForm();
  dialog.title = '新增 FAQ';
  dialog.visible = true;
};

const handleEdit = async (row: FaqVO) => {
  resetForm();
  if (row.faqId) {
    const res: any = await getFaq(row.faqId);
    Object.assign(form, res.data || row);
  } else {
    Object.assign(form, row);
  }
  dialog.title = '编辑 FAQ';
  dialog.visible = true;
};

const submit = async () => {
  await faqFormRef.value?.validate();
  form.faqId ? await updateFaq(form) : await addFaq(form);
  proxy?.$modal.msgSuccess('保存成功');
  dialog.visible = false;
  getList();
};

const handleStatus = async (row: FaqVO) => {
  if (!row.faqId) return;
  const nextStatus = row.status === '0' ? '1' : '0';
  await changeFaqStatus(row.faqId, nextStatus);
  proxy?.$modal.msgSuccess(nextStatus === '0' ? '启用成功' : '停用成功');
  getList();
};

const handleDelete = async (row: FaqVO) => {
  if (!row.faqId) return;
  await proxy?.$modal.confirm('是否确认删除该常见问题？');
  await delFaq(row.faqId);
  proxy?.$modal.msgSuccess('删除成功');
  getList();
};

onMounted(getList);
</script>
