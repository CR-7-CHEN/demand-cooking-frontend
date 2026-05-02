<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="订单号"><el-input v-model="queryParams.orderNo" clearable @keyup.enter="getList" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" clearable style="width: 180px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows">
        <el-table-column label="订单号" prop="orderNo" min-width="150" />
        <el-table-column label="用户" prop="userId" width="110" />
        <el-table-column label="做饭人员" prop="chefId" width="110" />
        <el-table-column label="上门时间" prop="serviceStartTime" width="170" />
        <el-table-column label="状态" width="140">
          <template #default="{ row }"><el-tag>{{ statusText(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="报价" prop="quoteAmount" width="100" />
        <el-table-column label="支付金额" prop="payAmount" width="110" />
        <el-table-column label="联系人" prop="contactName" width="110" />
        <el-table-column label="操作" fixed="right" width="240">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="showDetail(row)">详情</el-button>
            <el-button link type="success" @click="quickAction(row, 'pay')">模拟支付</el-button>
            <el-button link type="warning" @click="quickAction(row, 'confirm')">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="detail.visible" title="订单详情" width="760px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ current.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusText(current.status) }}</el-descriptions-item>
        <el-descriptions-item label="上门时间">{{ current.serviceStartTime }}</el-descriptions-item>
        <el-descriptions-item label="服务区域">{{ current.serviceArea }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ current.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ current.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="报价">{{ current.quoteAmount }}</el-descriptions-item>
        <el-descriptions-item label="支付金额">{{ current.payAmount }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ current.addressSnapshot }}</el-descriptions-item>
        <el-descriptions-item label="菜品" :span="2">{{ current.dishSnapshot }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ current.userRemark || current.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="CookingOrder" lang="ts">
import { confirmOrder, listOrder, paySuccessOrder } from '@/api/cooking/order';
import type { OrderVO } from '@/api/cooking/order/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<OrderVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, orderNo: '', status: '' });
const detail = reactive({ visible: false });
const current = reactive<any>({});

const statusOptions = [
  { label: '待响应', value: 'WAITING_RESPONSE' },
  { label: '待支付', value: 'WAITING_PAY' },
  { label: '异议中', value: 'PRICE_OBJECTION' },
  { label: '待服务', value: 'WAITING_SERVICE' },
  { label: '待确认', value: 'WAITING_CONFIRM' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '退款中', value: 'REFUNDING' },
  { label: '已退款', value: 'REFUNDED' }
];

const getList = async () => {
  loading.value = true;
  const res: any = await listOrder(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, orderNo: '', status: '' });
  getList();
};

const showDetail = (row: OrderVO) => {
  Object.assign(current, row);
  detail.visible = true;
};

const quickAction = async (row: OrderVO, action: 'pay' | 'confirm') => {
  if (!row.orderId) return;
  action === 'pay' ? await paySuccessOrder({ orderId: row.orderId, payAmount: row.quoteAmount }) : await confirmOrder({ orderId: row.orderId });
  proxy?.$modal.msgSuccess('操作成功');
  getList();
};

const statusText = (value?: string) => statusOptions.find((item) => item.value === value)?.label || value || '-';

onMounted(getList);
</script>
