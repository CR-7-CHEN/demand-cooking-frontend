<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="月份"><el-date-picker v-model="queryParams.settlementMonth" value-format="YYYY-MM" type="month" /></el-form-item>
        <el-form-item label="做饭人员"><el-input v-model="queryParams.chefId" clearable /></el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button type="success" icon="Plus" @click="generate">生成结算</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows">
        <el-table-column label="月份" prop="settlementMonth" width="110" />
        <el-table-column label="做饭人员" prop="chefId" width="110" />
        <el-table-column label="完成单数" prop="orderCount" width="100" />
        <el-table-column label="订单金额" prop="orderAmount" width="120" />
        <el-table-column label="个人底薪" prop="baseSalary" width="120" />
        <el-table-column label="违约次数" prop="violationCount" width="100" />
        <el-table-column label="违约扣款" prop="violationDeduction" width="120" />
        <el-table-column label="应发金额" prop="payableAmount" width="120" />
        <el-table-column label="状态" prop="status" width="110" />
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="CookingSettlement" lang="ts">
import { generateSettlement, listSettlement } from '@/api/cooking/settlement';
import type { SettlementVO } from '@/api/cooking/settlement/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<SettlementVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, settlementMonth: '', chefId: '' });

const getList = async () => {
  loading.value = true;
  const res: any = await listSettlement(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};
const generate = async () => {
  await generateSettlement({ settlementMonth: queryParams.settlementMonth, chefId: queryParams.chefId });
  proxy?.$modal.msgSuccess('结算已生成');
  getList();
};
onMounted(getList);
</script>
