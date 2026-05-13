<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="月份">
          <el-date-picker v-model="queryParams.settlementMonth" value-format="YYYY-MM" type="month" />
        </el-form-item>
        <el-form-item label="服务厨师">
          <el-input v-model="queryParams.chefId" clearable @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" clearable style="width: 180px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button type="success" icon="Plus" @click="generate">生成结算</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="月份" prop="settlementMonth" min-width="110" />
        <el-table-column label="服务厨师" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">{{ chefDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="完成单数" prop="orderCount" min-width="100" />
        <el-table-column label="订单金额" prop="orderAmount" min-width="120" />
        <el-table-column label="个人底薪" prop="baseSalary" min-width="120" />
        <el-table-column label="提成总计" prop="chefCommission" min-width="120" />
        <el-table-column label="违约次数" prop="violationCount" min-width="100" />
        <el-table-column label="违约扣款" prop="violationDeduction" min-width="120" />
        <el-table-column label="应发金额" prop="payableAmount" min-width="120" />
        <el-table-column label="状态" prop="status" min-width="110">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="260" class-name="table-action-cell">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="handleView(row)">详情</el-button>
            <el-button v-if="isReviewing(row)" link type="warning" @click="handleResolveReview(row)">处理复核</el-button>
            <el-button v-if="isConfirmed(row)" link type="success" @click="handlePay(row)">确认发放</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="detail.visible" title="结算详情" width="760px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="结算ID">{{ current.settlementId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusText(current.status) }}</el-descriptions-item>
        <el-descriptions-item label="月份">{{ current.settlementMonth || '-' }}</el-descriptions-item>
        <el-descriptions-item label="服务厨师">{{ chefDisplay(current) }}</el-descriptions-item>
        <el-descriptions-item label="完成单数">{{ displayValue(current.orderCount) }}</el-descriptions-item>
        <el-descriptions-item label="应发金额">{{ displayValue(current.payableAmount) }}</el-descriptions-item>
        <el-descriptions-item label="复核原因" :span="2">{{ reviewReasonText(current) }}</el-descriptions-item>
        <el-descriptions-item label="复核说明" :span="2">{{ current.reviewRemark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理方式">{{ reviewActionText(current.reviewAction || current.reviewResult) }}</el-descriptions-item>
        <el-descriptions-item label="处理说明" :span="2">{{ current.reviewReply || '-' }}</el-descriptions-item>
        <el-descriptions-item label="确认时间">{{ formatTime(current.confirmTime) }}</el-descriptions-item>
        <el-descriptions-item label="发放时间">{{ formatTime(current.payTime) }}</el-descriptions-item>
        <el-descriptions-item label="打款说明" :span="2">{{ current.payRemark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="resolveDialog.visible" title="处理复核" width="520px" append-to-body>
      <el-form label-width="100px">
        <el-form-item label="结算月份">
          <span>{{ resolveDialog.settlementMonth || '-' }}</span>
        </el-form-item>
        <el-form-item label="服务厨师">
          <span>{{ resolveDialog.chefName || '-' }}</span>
        </el-form-item>
        <el-form-item label="处理方式" required>
          <el-radio-group v-model="resolveForm.reviewResult">
            <el-radio-button label="KEEP">KEEP</el-radio-button>
            <el-radio-button label="REGENERATE">REGENERATE</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明" required>
          <el-input v-model="resolveForm.reviewReply" type="textarea" :rows="4" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resolveDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitResolveReview">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="payDialog.visible" title="确认发放" width="520px" append-to-body>
      <el-form label-width="100px">
        <el-form-item label="结算月份">
          <span>{{ payDialog.settlementMonth || '-' }}</span>
        </el-form-item>
        <el-form-item label="服务厨师">
          <span>{{ payDialog.chefName || '-' }}</span>
        </el-form-item>
        <el-form-item label="打款说明" required>
          <el-input v-model="payForm.payRemark" type="textarea" :rows="4" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="payDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitPay">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingSettlement" lang="ts">
import { generateSettlement, getSettlement, listSettlement, paySettlement, resolveSettlementReview } from '@/api/cooking/settlement';
import type { SettlementForm, SettlementPayForm, SettlementQuery, SettlementReviewResolveForm, SettlementVO } from '@/api/cooking/settlement/types';
import {
  cookingSettlementStatus,
  normalizeSettlementStatus,
  settlementStatusOptions,
  settlementStatusTagType,
  settlementStatusText
} from '@/api/cooking/status';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const statusOptions = settlementStatusOptions;

const resolveActionOptions = [
  { label: 'KEEP', value: 'KEEP' },
  { label: 'REGENERATE', value: 'REGENERATE' }
];

const loading = ref(false);
const rows = ref<SettlementVO[]>([]);
const total = ref(0);
const currentSettlementMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
const queryParams = reactive<SettlementQuery>({
  pageNum: 1,
  pageSize: 10,
  settlementMonth: currentSettlementMonth(),
  chefId: '',
  status: ''
});
const detail = reactive({ visible: false });
const current = reactive<SettlementVO>({});
const resolveDialog = reactive<{ visible: boolean; settlementId?: string | number; settlementMonth?: string; chefName?: string }>({
  visible: false,
  settlementId: undefined,
  settlementMonth: '',
  chefName: ''
});
const resolveForm = reactive<SettlementReviewResolveForm>({
  reviewResult: 'KEEP',
  reviewReply: ''
});
const payDialog = reactive<{ visible: boolean; settlementId?: string | number; settlementMonth?: string; chefName?: string }>({
  visible: false,
  settlementId: undefined,
  settlementMonth: '',
  chefName: ''
});
const payForm = reactive<SettlementPayForm>({
  payRemark: ''
});

const getList = async () => {
  loading.value = true;
  try {
    const res: any = await listSettlement(queryParams);
    rows.value = res.rows || res.data || [];
    total.value = res.total || rows.value.length;
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, settlementMonth: currentSettlementMonth(), chefId: '', status: '' });
  getList();
};

const generate = async () => {
  const payload: SettlementForm = { settlementMonth: queryParams.settlementMonth, chefId: queryParams.chefId };
  await generateSettlement(payload);
  proxy?.$modal.msgSuccess('结算已生成');
  getList();
};

const assignCurrent = (data?: SettlementVO) => {
  Object.keys(current).forEach((key) => delete (current as Record<string, any>)[key]);
  Object.assign(current, data || {});
};

const handleView = async (row: SettlementVO) => {
  if (!row.settlementId) {
    assignCurrent(row);
  } else {
    const res: any = await getSettlement(row.settlementId);
    assignCurrent(res.data || res);
  }
  detail.visible = true;
};

const handleResolveReview = (row: SettlementVO) => {
  resolveDialog.visible = true;
  resolveDialog.settlementId = row.settlementId;
  resolveDialog.settlementMonth = row.settlementMonth;
  resolveDialog.chefName = chefDisplay(row);
  resolveForm.reviewResult = 'KEEP';
  resolveForm.reviewReply = row.reviewReply || '';
};

const submitResolveReview = async () => {
  if (!resolveDialog.settlementId) return;
  if (!resolveForm.reviewResult) {
    proxy?.$modal.msgError('请选择处理方式');
    return;
  }
  if (!String(resolveForm.reviewReply || '').trim()) {
    proxy?.$modal.msgError('请填写处理说明');
    return;
  }
  await resolveSettlementReview({
    settlementId: resolveDialog.settlementId,
    reviewResult: resolveForm.reviewResult,
    reviewReply: String(resolveForm.reviewReply || '').trim()
  });
  proxy?.$modal.msgSuccess('复核已处理');
  resolveDialog.visible = false;
  getList();
};

const handlePay = async (row: SettlementVO) => {
  if (!row.settlementId) return;
  payDialog.visible = true;
  payDialog.settlementId = row.settlementId;
  payDialog.settlementMonth = row.settlementMonth;
  payDialog.chefName = chefDisplay(row);
  payForm.payRemark = row.payRemark || '';
};

const submitPay = async () => {
  if (!payDialog.settlementId) return;
  if (!String(payForm.payRemark || '').trim()) {
    proxy?.$modal.msgError('请填写打款说明');
    return;
  }
  const payload: SettlementPayForm = {
    settlementId: payDialog.settlementId,
    payRemark: String(payForm.payRemark || '').trim()
  };
  await paySettlement(payload);
  proxy?.$modal.msgSuccess('结算已标记为已发放');
  payDialog.visible = false;
  getList();
};

const isReviewing = (row: SettlementVO) => normalizeSettlementStatus(row.status) === cookingSettlementStatus.REVIEWING;
const isConfirmed = (row: SettlementVO) => normalizeSettlementStatus(row.status) === cookingSettlementStatus.CONFIRMED;
const statusText = settlementStatusText;
const statusTag = settlementStatusTagType;
const chefDisplay = (row: SettlementVO) => row.chefName || row.chefId || '-';
const reviewReasonText = (row: SettlementVO) => row.reviewReason || row.reviewReasonType || '-';
const reviewActionText = (value?: string) => resolveActionOptions.find((item) => item.value === value)?.label || value || '-';
const displayValue = (value?: string | number) => (value === 0 || value === '0' ? value : value || '-');
const formatTime = (value?: string) => proxy?.parseTime(value) || '-';

onMounted(getList);
</script>
