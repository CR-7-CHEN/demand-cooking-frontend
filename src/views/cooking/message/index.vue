<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="消息类型">
          <el-select v-model="queryParams.messageType" clearable filterable allow-create default-first-option style="width: 160px">
            <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="queryParams.receiverKeyword" clearable placeholder="账号或服务厨师姓名" style="width: 220px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="queryParams.relatedOrderNo" clearable style="width: 160px" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="queryParams.channel" clearable style="width: 130px">
            <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送状态">
          <el-select v-model="queryParams.sendStatus" clearable style="width: 130px">
            <el-option v-for="item in sendStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="-"
            start-placeholder="发送开始时间"
            end-placeholder="发送结束时间"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button plain icon="Plus" @click="handleAdd">新增记录</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table v-loading="loading" border :data="rows" style="width: 100%">
        <el-table-column label="订单号" prop="relatedOrderNo" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.relatedOrderNo || row.relatedOrderId || '-' }}</template>
        </el-table-column>
        <el-table-column label="消息类型" prop="messageType" min-width="130">
          <template #default="{ row }">
            <el-tag>{{ messageTypeText(row.messageType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接收人" min-width="150">
          <template #default="{ row }">{{ receiverDisplay(row) }}</template>
        </el-table-column>
        <el-table-column label="渠道" prop="channel" min-width="110">
          <template #default="{ row }">
            <el-tag type="info">{{ channelText(row.channel) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发送状态" prop="sendStatus" min-width="120">
          <template #default="{ row }">
            <el-tag :type="sendStatusTagType(row.sendStatus)">{{ sendStatusText(row.sendStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容摘要" prop="contentSummary" min-width="260" show-overflow-tooltip />
        <el-table-column label="失败原因" prop="failReason" min-width="180" show-overflow-tooltip />
        <el-table-column label="发送时间" prop="sendTime" min-width="170" />
        <el-table-column label="操作" fixed="right" width="200" class-name="table-action-cell">
          <template #default="{ row }">
            <el-button link type="primary" icon="View" @click="showDetail(row)">详情</el-button>
            <el-button link type="info" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>

    <el-dialog v-model="detail.visible" title="消息详情" width="760px" append-to-body>
      <el-descriptions v-loading="detailLoading" :column="2" border>
        <el-descriptions-item label="消息ID">{{ current.messageId }}</el-descriptions-item>
        <el-descriptions-item label="发送状态">
          <el-tag :type="sendStatusTagType(current.sendStatus)">{{ sendStatusText(current.sendStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消息类型">{{ messageTypeText(current.messageType) }}</el-descriptions-item>
        <el-descriptions-item label="渠道">{{ channelText(current.channel) }}</el-descriptions-item>
        <el-descriptions-item label="接收类型">{{ optionText(receiverTypeOptions, current.receiverType) }}</el-descriptions-item>
        <el-descriptions-item label="接收人ID">{{ current.receiverId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号掩码">{{ current.receiverMobileMask || '-' }}</el-descriptions-item>
        <el-descriptions-item label="OpenID掩码">{{ current.receiverOpenidMask || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联订单">{{ current.relatedOrderNo || current.relatedOrderId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="业务对象">
          {{ optionText(bizTypeOptions, current.relatedBizType) || '-' }}
          <span v-if="current.relatedBizId"> / {{ current.relatedBizId }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="发送时间">{{ current.sendTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ current.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="内容摘要" :span="2">{{ current.contentSummary || '-' }}</el-descriptions-item>
        <el-descriptions-item label="失败原因" :span="2">{{ current.failReason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ current.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detail.visible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="formDialog.visible" :title="formDialog.title" width="660px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-form-item label="消息类型">
          <el-select v-model="form.messageType" clearable filterable allow-create default-first-option>
            <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="form.channel" clearable>
            <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收类型">
          <el-select v-model="form.receiverType" clearable>
            <el-option v-for="item in receiverTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收人ID">
          <el-input v-model="form.receiverId" />
        </el-form-item>
        <el-form-item label="手机号掩码">
          <el-input v-model="form.receiverMobileMask" />
        </el-form-item>
        <el-form-item label="OpenID掩码">
          <el-input v-model="form.receiverOpenidMask" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="form.relatedOrderNo" />
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="form.relatedBizType" clearable filterable allow-create default-first-option>
            <el-option v-for="item in bizTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务ID">
          <el-input v-model="form.relatedBizId" />
        </el-form-item>
        <el-form-item label="发送状态">
          <el-select v-model="form.sendStatus" clearable>
            <el-option v-for="item in sendStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker v-model="form.sendTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="内容摘要">
          <el-input v-model="form.contentSummary" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="失败原因">
          <el-input v-model="form.failReason" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CookingMessage" lang="ts">
import { addMessage, delMessage, getMessage, listMessage, updateMessage } from '@/api/cooking/message';
import type { MessageForm, MessageQuery, MessageVO } from '@/api/cooking/message/types';
import { cookingMessageSendStatus, messageSendStatusOptions, messageSendStatusTagType, messageSendStatusText } from '@/api/cooking/status';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const messageTypeOptions = [
  { label: '订单提交', value: 'ORDER_SUBMIT' },
  { label: '订单报价', value: 'ORDER_QUOTE' },
  { label: '订单拒单', value: 'ORDER_REJECT' },
  { label: '报价异议', value: 'ORDER_OBJECTION' },
  { label: '支付成功', value: 'PAY_SUCCESS' },
  { label: '开始服务', value: 'SERVICE_START' },
  { label: '服务完成', value: 'SERVICE_COMPLETE' },
  { label: '用户确认完成', value: 'ORDER_CONFIRM' },
  { label: '用户申请退款', value: 'ORDER_REFUND' },
  { label: '厨师取消退款', value: 'CHEF_CANCEL_REFUND' },
  { label: '响应超时关闭', value: 'ORDER_RESPONSE_TIMEOUT' },
  { label: '支付超时关闭', value: 'ORDER_PAY_TIMEOUT' },
  { label: '异议超时关闭', value: 'ORDER_OBJECTION_TIMEOUT' },
  { label: '系统自动完成服务', value: 'SERVICE_AUTO_COMPLETE' },
  { label: '系统自动确认完成', value: 'ORDER_AUTO_CONFIRM' },
  { label: '结算通知', value: 'SETTLEMENT' },
  { label: '投诉通知', value: 'COMPLAINT' },
  { label: '系统通知', value: 'SYSTEM' },
  { label: '公告通知', value: 'ANNOUNCEMENT' }
];
const receiverTypeOptions = [
  { label: '用户', value: 'USER' },
  { label: '厨师', value: 'CHEF' },
  { label: '管理员', value: 'ADMIN' }
];
const channelOptions = [
  { label: '站内信', value: 'IN_APP' },
  { label: '微信', value: 'WECHAT' },
  { label: '短信', value: 'SMS' }
];
const sendStatusOptions = [
  ...messageSendStatusOptions
];
const bizTypeOptions = [
  { label: '订单', value: 'ORDER' },
  { label: '退款', value: 'REFUND' },
  { label: '结算', value: 'SETTLEMENT' },
  { label: '投诉', value: 'COMPLAINT' },
  { label: '厨师', value: 'CHEF' },
  { label: '配置', value: 'CONFIG' }
];
const messageTypeTextMap: Record<string, string> = Object.fromEntries(messageTypeOptions.map((item) => [item.value, item.label]));
Object.assign(messageTypeTextMap, {
  ORDER: '订单通知',
  REFUND: '退款通知'
});
const channelTextMap: Record<string, string> = {
  IN_APP: '站内信',
  SYSTEM: '站内信',
  WECHAT: '微信',
  SMS: '短信',
  APP: 'App'
};
const loading = ref(false);
const detailLoading = ref(false);
const rows = ref<MessageVO[]>([]);
const total = ref(0);
const dateRange = ref<string[]>([]);
const queryParams = reactive<MessageQuery>({
  pageNum: 1,
  pageSize: 10,
  messageType: '',
  receiverKeyword: '',
  relatedOrderNo: '',
  channel: '',
  sendStatus: ''
});
const detail = reactive({ visible: false });
const formDialog = reactive({ visible: false, title: '' });
const current = reactive<MessageVO>({});
const form = reactive<MessageForm>({});

const optionText = (options: Array<{ label: string; value: string }>, value?: string) =>
  options.find((item) => item.value === value)?.label || value || '-';
const enumText = (textMap: Record<string, string>, value?: string) => textMap[String(value || '').toUpperCase()] || value || '-';
const messageTypeText = (value?: string) => enumText(messageTypeTextMap, value);
const channelText = (value?: string) => enumText(channelTextMap, value);
const receiverDisplay = (row: MessageVO) => {
  const receiverType = optionText(receiverTypeOptions, row.receiverType);
  const receiverName = row.receiverName || row.userName || row.nickName || row.chefName;
  return receiverName ? `${receiverType}/${receiverName}` : receiverType;
};

const buildQueryParams = (): MessageQuery => {
  const query: MessageQuery = { ...queryParams };
  if (dateRange.value?.length === 2) {
    query.params = { beginTime: dateRange.value[0], endTime: dateRange.value[1] };
  }
  return query;
};

const getList = async () => {
  loading.value = true;
  try {
    const res: any = await listMessage(buildQueryParams());
    rows.value = res.rows || res.data || [];
    total.value = res.total || rows.value.length;
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  Object.assign(queryParams, {
    pageNum: 1,
    messageType: '',
    receiverKeyword: '',
    relatedOrderNo: '',
    channel: '',
    sendStatus: ''
  });
  dateRange.value = [];
  getList();
};

const resetRecord = () => {
  Object.keys(current).forEach((key) => delete (current as Record<string, any>)[key]);
};

const resetForm = () => {
  Object.keys(form).forEach((key) => delete (form as Record<string, any>)[key]);
  Object.assign(form, { messageType: '', channel: 'IN_APP', receiverType: '', sendStatus: cookingMessageSendStatus.SENT });
};

const showDetail = async (row: MessageVO) => {
  resetRecord();
  Object.assign(current, row);
  detail.visible = true;
  if (!row.messageId) return;
  detailLoading.value = true;
  try {
    const res: any = await getMessage(row.messageId);
    Object.assign(current, res.data || res);
  } finally {
    detailLoading.value = false;
  }
};

const handleAdd = () => {
  resetForm();
  formDialog.title = '新增消息记录';
  formDialog.visible = true;
};

const handleEdit = async (row: MessageVO) => {
  resetForm();
  if (row.messageId) {
    const res: any = await getMessage(row.messageId);
    Object.assign(form, res.data || row);
  } else {
    Object.assign(form, row);
  }
  formDialog.title = '编辑消息记录';
  formDialog.visible = true;
};

const submit = async () => {
  if (!form.messageType || !form.channel || !form.receiverType) {
    proxy?.$modal.msgError('请补充消息类型、渠道和接收类型');
    return;
  }
  form.messageId ? await updateMessage(form) : await addMessage(form);
  proxy?.$modal.msgSuccess('保存成功');
  formDialog.visible = false;
  getList();
};

const handleDelete = async (row: MessageVO) => {
  if (!row.messageId) return;
  await proxy?.$modal.confirm('是否确认删除消息记录编号为"' + row.messageId + '"的数据项？');
  await delMessage(row.messageId);
  proxy?.$modal.msgSuccess('删除成功');
  getList();
};

onMounted(getList);
</script>
