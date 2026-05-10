<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="订单号"><el-input v-model="queryParams.orderNo" clearable placeholder="请输入订单号" @keyup.enter="getList" /></el-form-item>
        <el-form-item label="用户"><el-input v-model="queryParams.userKeyword" clearable placeholder="请输入用户" @keyup.enter="getList" /></el-form-item>
        <el-form-item label="做饭人员"><el-input v-model="queryParams.chefName" clearable placeholder="请输入做饭人员" @keyup.enter="getList" /></el-form-item>
        <el-form-item label="状态"><el-select v-model="queryParams.status" clearable placeholder="请选择" style="width: 150px"><el-option label="待处理" value="PENDING" /><el-option label="成立" value="ESTABLISHED" /><el-option label="不成立" value="REJECTED" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" icon="Search" @click="getList">搜索</el-button><el-button icon="Refresh" @click="resetQuery">重置</el-button></el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="订单号" prop="orderNo" min-width="150" />
        <el-table-column label="用户" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ userDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="做饭人员" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">{{ chefDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="类型" min-width="120">
          <template #default="{ row }">{{ complaintTypeText(row.complaintType) }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="110">
          <template #default="{ row }">
            <el-tag :type="complaintStatusType[row.status]">{{ complaintStatusMap[row.status] || row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content" min-width="240" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="170" class-name="table-action-cell">
          <template #default="{ row }">
            <el-button link type="success" @click="handle(row, true)">成立</el-button>
            <el-button link type="warning" @click="handle(row, false)">不成立</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="CookingComplaint" lang="ts">
import { handleComplaint, listComplaint } from '@/api/cooking/complaint';
import type { ComplaintVO } from '@/api/cooking/complaint/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const complaintStatusMap: Record<string, string> = { PENDING: '待处理', ESTABLISHED: '成立', REJECTED: '不成立' };
const complaintStatusType: Record<string, string> = { PENDING: 'warning', ESTABLISHED: 'danger', REJECTED: 'info' };
const complaintTypeMap: Record<string, string> = { SERVICE: '服务投诉' };
const loading = ref(false);
const rows = ref<ComplaintVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, orderNo: '', userKeyword: '', chefName: '', status: '' });

const getList = async () => {
  loading.value = true;
  const res: any = await listComplaint(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};
const resetQuery = () => { Object.assign(queryParams, { pageNum: 1, orderNo: '', userKeyword: '', chefName: '', status: '' }); getList(); };
const handle = async (row: ComplaintVO, established: boolean) => {
  await handleComplaint({ ...row, established, status: established ? 'ESTABLISHED' : 'REJECTED' });
  proxy?.$modal.msgSuccess('投诉已处理');
  getList();
};
const complaintTypeText = (value?: string) => complaintTypeMap[String(value || '').toUpperCase()] || value || '-';
const userDisplay = (row: ComplaintVO) => row.userName || row.nickName || row.userId || '-';
const chefDisplay = (row: ComplaintVO) => row.chefName || row.chefId || '-';
onMounted(getList);
</script>
