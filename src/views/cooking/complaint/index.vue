<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="订单号"><el-input v-model="queryParams.orderNo" clearable @keyup.enter="getList" /></el-form-item>
        <el-form-item label="状态"><el-select v-model="queryParams.status" clearable style="width: 150px"><el-option label="待处理" value="PENDING" /><el-option label="成立" value="VALID" /><el-option label="不成立" value="INVALID" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" icon="Search" @click="getList">搜索</el-button><el-button icon="Refresh" @click="resetQuery">重置</el-button></el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows">
        <el-table-column label="订单号" prop="orderNo" min-width="150" />
        <el-table-column label="用户" prop="userId" width="110" />
        <el-table-column label="做饭人员" prop="chefId" width="110" />
        <el-table-column label="类型" prop="complaintType" width="120" />
        <el-table-column label="状态" prop="status" width="110" />
        <el-table-column label="内容" prop="content" min-width="240" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="170">
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
const loading = ref(false);
const rows = ref<ComplaintVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, orderNo: '', status: '' });

const getList = async () => {
  loading.value = true;
  const res: any = await listComplaint(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};
const resetQuery = () => { Object.assign(queryParams, { pageNum: 1, orderNo: '', status: '' }); getList(); };
const handle = async (row: ComplaintVO, established: boolean) => {
  await handleComplaint({ ...row, established, status: established ? 'VALID' : 'INVALID' });
  proxy?.$modal.msgSuccess('投诉已处理');
  getList();
};
onMounted(getList);
</script>
