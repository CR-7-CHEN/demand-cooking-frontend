<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="订单号"><el-input v-model="queryParams.orderNo" clearable @keyup.enter="getList" /></el-form-item>
        <el-form-item label="服务厨师"><el-input v-model="queryParams.chefName" placeholder="服务厨师姓名" clearable @keyup.enter="getList" /></el-form-item>
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
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="订单号" prop="orderNo" min-width="150" />
        <el-table-column label="服务厨师" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">{{ chefDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="用户" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ userDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="上门时间" prop="serviceStartTime" min-width="170" />
        <el-table-column label="开始服务时间" prop="serviceStartedTime" min-width="170" />
        <el-table-column label="状态" min-width="140">
          <template #default="{ row }"><el-tag>{{ statusText(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="报价" prop="quoteAmount" min-width="100" />
        <el-table-column label="支付金额" prop="payAmount" min-width="110" />
        <el-table-column label="联系人" prop="contactName" min-width="110" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="240" class-name="table-action-cell">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="showDetail(row)">详情</el-button>
            <el-button link type="success" @click="quickAction(row, 'pay')">模拟支付</el-button>
            <el-button link type="warning" @click="quickAction(row, 'confirm')">确认完成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="detail.visible" title="订单详情" width="780px" append-to-body class="order-detail-dialog">
      <div class="detail-section">
        <div class="section-header">
          <span class="section-title">基本信息</span>
          <el-tag :type="statusTagType(current.status)" effect="dark" size="large">{{ statusText(current.status) }}</el-tag>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ current.orderNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ current.createTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="服务厨师">{{ chefDisplay(current) }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ userDisplay(current) }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="detail-section">
        <div class="section-header"><span class="section-title">服务信息</span></div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="上门时间">{{ current.serviceStartTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="开始服务时间">{{ current.serviceStartedTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="服务完成时间">{{ current.serviceCompleteTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="确认完成时间">{{ current.confirmTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="服务区域">{{ current.serviceArea || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ current.contactName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ current.contactPhone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="地址" :span="2">{{ current.addressSnapshot || '-' }}</el-descriptions-item>
          <el-descriptions-item label="菜品需求" :span="2">
            <template v-if="parsedDish.dishes.length || parsedDish.customDishNames.length">
              <el-tag v-for="d in parsedDish.dishes" :key="d.id" class="mr-[6px] mb-[4px]" type="success">{{ d.name }}<template v-if="d.category">（{{ d.category }}）</template></el-tag>
              <el-tag v-for="(name, i) in parsedDish.customDishNames" :key="'c' + i" class="mr-[6px] mb-[4px]" type="warning">{{ name }}</el-tag>
              <div v-if="parsedDish.tasteRemark" class="dish-remark">口味：{{ parsedDish.tasteRemark }}</div>
              <div v-if="parsedDish.materialRemark" class="dish-remark">食材要求：{{ parsedDish.materialRemark }}</div>
            </template>
            <template v-else>-</template>
          </el-descriptions-item>
          <el-descriptions-item label="用户备注" :span="2">{{ current.userRemark || current.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="detail-section">
        <div class="section-header"><span class="section-title">费用信息</span></div>
        <div class="amount-cards">
          <div class="amount-card">
            <div class="amount-label">报价金额</div>
            <div class="amount-value">{{ amountDisplay(current.quoteAmount) }}</div>
            <div v-if="current.quoteRemark" class="amount-extra">{{ current.quoteRemark }}</div>
          </div>
          <div class="amount-card highlight">
            <div class="amount-label">支付金额</div>
            <div class="amount-value">{{ amountDisplay(current.payAmount) }}</div>
            <div v-if="current.payTime" class="amount-extra">{{ current.payTime }}</div>
          </div>
          <div v-if="current.refundAmount" class="amount-card warn">
            <div class="amount-label">退款金额</div>
            <div class="amount-value">{{ amountDisplay(current.refundAmount) }}</div>
            <div v-if="current.refundFeeAmount" class="amount-extra">手续费 ¥{{ current.refundFeeAmount }}</div>
          </div>
        </div>
      </div>

      <div v-if="current.cancelReason || current.objectionReason" class="detail-section">
        <div class="section-header"><span class="section-title">报价异议/取消退款记录</span></div>
        <el-descriptions :column="2" border>
          <el-descriptions-item v-if="current.objectionReason" label="异议原因" :span="2">{{ current.objectionReason }}</el-descriptions-item>
          <el-descriptions-item v-if="current.objectionRemark" label="异议说明" :span="2">{{ current.objectionRemark }}</el-descriptions-item>
          <el-descriptions-item v-if="current.cancelType" label="取消类型">{{ cancelTypeText(current.cancelType) }}</el-descriptions-item>
          <el-descriptions-item v-if="current.cancelTime" label="取消时间">{{ current.cancelTime }}</el-descriptions-item>
          <el-descriptions-item v-if="current.cancelReason" label="取消原因" :span="2">{{ current.cancelReason }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="CookingOrder" lang="ts">
import { confirmOrder, listOrder, paySuccessOrder } from '@/api/cooking/order';
import type { OrderVO } from '@/api/cooking/order/types';
import { orderStatusOptions, orderStatusTagType, orderStatusText } from '@/api/cooking/status';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const loading = ref(false);
const rows = ref<OrderVO[]>([]);
const total = ref(0);
const queryParams = reactive<any>({ pageNum: 1, pageSize: 10, orderNo: '', chefName: '', status: '' });
const detail = reactive({ visible: false });
const current = reactive<any>({});

const statusOptions = orderStatusOptions;

const getList = async () => {
  loading.value = true;
  const res: any = await listOrder(queryParams);
  rows.value = res.rows || res.data || [];
  total.value = res.total || rows.value.length;
  loading.value = false;
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, orderNo: '', chefName: '', status: '' });
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

const statusText = orderStatusText;
const statusTagType = orderStatusTagType;
const chefDisplay = (row: OrderVO) => row.chefName || row.chefId || '-';
const userDisplay = (row: OrderVO) => row.userName || row.nickName || row.userId || '-';
const parsedDish = computed(() => {
  const raw = current.dishSnapshot;
  if (!raw) return { dishes: [], customDishNames: [], tasteRemark: '', materialRemark: '' };
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      dishes: Array.isArray(obj.dishes) ? obj.dishes : [],
      customDishNames: Array.isArray(obj.customDishNames) ? obj.customDishNames.filter(Boolean) : [],
      tasteRemark: obj.tasteRemark || '',
      materialRemark: obj.materialRemark || ''
    };
  } catch {
    return { dishes: [], customDishNames: [], tasteRemark: '', materialRemark: '' };
  }
});
const cancelTypeText = (value?: string) => {
  const map: Record<string, string> = {
    USER_UNPAID: '用户取消（未支付）',
    USER_PAID: '用户取消（已支付）',
    CHEF: '服务厨师取消',
    CHEF_REJECT: '服务厨师拒单',
    SYSTEM_TIMEOUT: '系统超时关闭'
  };
  return map[value || ''] || value || '-';
};
const amountDisplay = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  return '¥' + Number(value).toFixed(2);
};

onMounted(getList);
</script>

<style lang="scss" scoped>
.detail-section {
  margin-bottom: 20px;
  &:last-child { margin-bottom: 0; }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}

.amount-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.amount-card {
  padding: 16px;
  border-radius: 8px;
  background: #f5f7fa;
  text-align: center;

  &.highlight {
    background: #ecf5ff;
    .amount-value { color: #409eff; }
  }
  &.warn {
    background: #fef0f0;
    .amount-value { color: #f56c6c; }
  }
}

.amount-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.amount-value {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}

.amount-extra {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}

.dish-remark {
  margin-top: 6px;
  font-size: 13px;
  color: #606266;
}
</style>
