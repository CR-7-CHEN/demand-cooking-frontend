<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="工单ID">
          <el-input v-model="queryParams.ticketId" clearable style="width: 170px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="queryParams.userId" clearable style="width: 160px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="订单ID">
          <el-input v-model="queryParams.orderId" clearable style="width: 170px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="问题内容">
          <el-input v-model="queryParams.question" clearable style="width: 180px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" clearable style="width: 130px">
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
        <el-table-column label="工单号" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.ticketNo || row.ticketId || '-' }}</template>
        </el-table-column>
        <el-table-column label="用户" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.nickName || row.userName || row.userId || '-' }}</template>
        </el-table-column>
        <el-table-column label="订单号" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.orderNo || row.orderId || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="110">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ optionText(statusOptions, row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="问题内容" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">{{ row.questionContent || row.question || '-' }}</template>
        </el-table-column>
        <el-table-column label="处理回复" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">{{ row.processReply || row.reply || '-' }}</template>
        </el-table-column>
        <el-table-column label="提交时间" min-width="170">
          <template #default="{ row }">{{ row.submitTime || row.createTime || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="240" class-name="table-action-cell">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="showDetail(row)">详情</el-button>
            <el-button link type="success" icon="Edit" :disabled="row.status === 'CLOSED'" @click="handleReply(row)">处理</el-button>
            <el-button link type="warning" icon="CircleClose" :disabled="row.status === 'CLOSED'" @click="handleClose(row)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="detail.visible" title="工单详情" width="760px" append-to-body>
      <el-descriptions v-loading="detailLoading" :column="2" border>
        <el-descriptions-item label="工单号">{{ current.ticketNo || current.ticketId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusTagType(current.status)">{{ optionText(statusOptions, current.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户">{{ current.nickName || current.userName || current.userId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ current.contactPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ current.orderNo || current.orderId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ current.submitTime || current.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ current.processTime || current.handleTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关闭时间">{{ current.closeTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ current.processorName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="问题内容" :span="2">{{ current.questionContent || current.question || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理回复" :span="2">{{ current.processReply || current.reply || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ current.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detail.visible = false">关闭</el-button>
        <el-button v-if="current.status !== 'CLOSED'" type="primary" @click="handleReply(current)">处理</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="replyDialog.visible" :title="replyDialog.title" width="640px" append-to-body>
      <el-form ref="replyFormRef" :model="replyForm" :rules="replyRules" label-width="90px">
        <el-form-item label="工单号">
          <el-input :model-value="current.ticketNo || current.ticketId || '-'" disabled />
        </el-form-item>
        <el-form-item label="问题内容">
          <el-input :model-value="current.questionContent || current.question || '-'" type="textarea" :rows="3" disabled />
        </el-form-item>
        <el-form-item label="处理回复" prop="processReply">
          <el-input v-model="replyForm.processReply" type="textarea" :rows="5" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="replyForm.remark" type="textarea" :rows="2" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">保存回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingTicket" lang="ts">
import { closeTicket, getTicket, listTicket, replyTicket } from '@/api/cooking/ticket';
import type { TicketProcessForm, TicketQuery, TicketVO } from '@/api/cooking/ticket/types';
import type { FormInstance, FormRules } from 'element-plus';

type TagType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const statusOptions = [
  { label: '待处理', value: 'PENDING' },
  { label: '处理中', value: 'PROCESSING' },
  { label: '已回复', value: 'REPLIED' },
  { label: '已关闭', value: 'CLOSED' }
];
const statusType: Record<string, TagType> = { PENDING: 'warning', PROCESSING: 'primary', REPLIED: 'success', CLOSED: 'info' };

const loading = ref(false);
const detailLoading = ref(false);
const rows = ref<TicketVO[]>([]);
const total = ref(0);
const replyFormRef = ref<FormInstance>();
const queryParams = reactive<TicketQuery>({ pageNum: 1, pageSize: 10, ticketId: '', userId: '', orderId: '', question: '', status: '' });
const current = reactive<TicketVO>({});
const replyForm = reactive<TicketProcessForm>({});
const detail = reactive({ visible: false });
const replyDialog = reactive({ visible: false, title: '' });
const replyRules: FormRules = {
  processReply: [{ required: true, message: '请输入处理回复', trigger: 'blur' }]
};

const optionText = (options: Array<{ label: string; value: string }>, value?: string) =>
  options.find((item) => item.value === value)?.label || value || '-';
const statusTagType = (value?: string): TagType => statusType[value || ''] || 'info';

const resetCurrent = () => {
  Object.keys(current).forEach((key) => delete (current as Record<string, any>)[key]);
};

const resetReplyForm = () => {
  Object.keys(replyForm).forEach((key) => delete (replyForm as Record<string, any>)[key]);
  replyFormRef.value?.clearValidate();
};

const assignCurrent = async (row: TicketVO) => {
  resetCurrent();
  Object.assign(current, row);
  if (!row.ticketId) return;
  const res: any = await getTicket(row.ticketId);
  Object.assign(current, res.data || row);
};

const getList = async () => {
  loading.value = true;
  try {
    const res: any = await listTicket(queryParams);
    rows.value = res.rows || res.data || [];
    total.value = res.total || rows.value.length;
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  Object.assign(queryParams, { pageNum: 1, ticketId: '', userId: '', orderId: '', question: '', status: '' });
  getList();
};

const showDetail = async (row: TicketVO) => {
  detail.visible = true;
  detailLoading.value = true;
  try {
    await assignCurrent(row);
  } finally {
    detailLoading.value = false;
  }
};

const handleReply = async (row: TicketVO) => {
  resetReplyForm();
  await assignCurrent(row);
  Object.assign(replyForm, {
    ticketId: current.ticketId,
    processReply: current.processReply || current.reply || '',
    remark: current.remark || ''
  });
  replyDialog.title = '处理工单';
  replyDialog.visible = true;
};

const submitReply = async () => {
  await replyFormRef.value?.validate();
  await replyTicket({
    ticketId: replyForm.ticketId,
    reply: replyForm.processReply,
    remark: replyForm.remark
  });
  proxy?.$modal.msgSuccess('处理回复已保存');
  replyDialog.visible = false;
  detail.visible = false;
  getList();
};

const handleClose = async (row: TicketVO) => {
  if (!row.ticketId) return;
  await proxy?.$modal.confirm('是否确认关闭该工单？');
  await closeTicket(row.ticketId);
  proxy?.$modal.msgSuccess('工单已关闭');
  getList();
};

onMounted(getList);
</script>
