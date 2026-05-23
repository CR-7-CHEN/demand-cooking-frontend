<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="订单号"><el-input v-model="queryParams.orderNo" clearable placeholder="请输入订单号" @keyup.enter="getList" /></el-form-item>
        <el-form-item label="用户"><el-input v-model="queryParams.userKeyword" clearable placeholder="请输入用户" @keyup.enter="getList" /></el-form-item>
        <el-form-item label="服务厨师"><el-input v-model="queryParams.chefName" clearable placeholder="请输入服务厨师" @keyup.enter="getList" /></el-form-item>
        <el-form-item label="状态"><el-select v-model="queryParams.status" clearable placeholder="请选择" style="width: 150px"><el-option v-for="item in complaintStatusOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" icon="Search" @click="getList">搜索</el-button><el-button icon="Refresh" @click="resetQuery">重置</el-button></el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="订单号" prop="orderNo" min-width="150" />
        <el-table-column label="用户" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ userDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="服务厨师" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">{{ chefDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="类型" min-width="120">
          <template #default="{ row }">{{ complaintTypeText(row.complaintType) }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="110">
          <template #default="{ row }">
            <el-tag :type="complaintStatusTagType(row.status)">{{ complaintStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content" min-width="240" show-overflow-tooltip />
        <el-table-column label="处理说明" prop="handleResult" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">{{ row.handleResult || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="170" class-name="table-action-cell">
          <template #default="{ row }">
            <template v-if="canHandle(row)">
              <el-button link type="success" @click="openHandleDialog(row, true)">成立</el-button>
              <el-button link type="warning" @click="openHandleDialog(row, false)">不成立</el-button>
            </template>
            <span v-else class="text-gray-400">已处理</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
    <el-dialog v-model="handleDialog.visible" :title="handleDialog.title" width="520px" append-to-body>
      <el-form ref="handleFormRef" :model="handleForm" :rules="handleRules" label-width="90px">
        <el-form-item label="处理说明" prop="handleResult">
          <el-input v-model="handleForm.handleResult" type="textarea" :rows="4" maxlength="1000" show-word-limit placeholder="请输入处理说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingComplaint" lang="ts">
import { handleComplaint, listComplaint } from '@/api/cooking/complaint';
import type { ComplaintVO } from '@/api/cooking/complaint/types';
import {
  complaintStatusOptions,
  complaintStatusTagType,
  complaintStatusText,
  cookingComplaintStatus,
  normalizeComplaintStatus
} from '@/api/cooking/status';
import { useRoute } from 'vue-router';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
const complaintTypeMap: Record<string, string> = { SERVICE: '服务投诉' };
const loading = ref(false);
const rows = ref<ComplaintVO[]>([]);
const total = ref(0);
const handleFormRef = ref();
const routeQueryValue = (value: unknown) => {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === 'string' ? normalizeComplaintStatus(firstValue) : '';
};
const queryParams = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  orderNo: '',
  userKeyword: '',
  chefName: '',
  status: routeQueryValue(route.query.status)
});
const handleDialog = reactive({
  visible: false,
  title: ''
});
const handleForm = reactive({
  complaintId: undefined as string | number | undefined,
  established: true,
  handleResult: ''
});
const handleRules = {
  handleResult: [{ required: true, message: '请输入处理说明', trigger: 'blur' }]
};

const getList = async () => {
  loading.value = true;
  const res: any = await listComplaint(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};
const resetQuery = () => { Object.assign(queryParams, { pageNum: 1, orderNo: '', userKeyword: '', chefName: '', status: '' }); getList(); };
const openHandleDialog = (row: ComplaintVO, established: boolean) => {
  Object.assign(handleForm, { complaintId: row.complaintId, established, handleResult: '' });
  handleDialog.title = established ? '投诉成立' : '投诉不成立';
  handleDialog.visible = true;
  nextTick(() => handleFormRef.value?.clearValidate?.());
};
const submitHandle = async () => {
  await handleFormRef.value?.validate?.();
  await handleComplaint({
    complaintId: handleForm.complaintId,
    established: handleForm.established,
    status: handleForm.established ? cookingComplaintStatus.ESTABLISHED : cookingComplaintStatus.REJECTED,
    handleResult: handleForm.handleResult
  });
  handleDialog.visible = false;
  proxy?.$modal.msgSuccess('投诉已处理');
  getList();
};
const complaintTypeText = (value?: string) => complaintTypeMap[String(value || '').toUpperCase()] || value || '-';
const canHandle = (row: ComplaintVO) => normalizeComplaintStatus(row.status) === cookingComplaintStatus.PENDING;
const userDisplay = (row: ComplaintVO) => row.userName || row.nickName || row.userId || '-';
const chefDisplay = (row: ComplaintVO) => row.chefName || row.chefId || '-';
onMounted(getList);
</script>
