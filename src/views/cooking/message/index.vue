<template>
  <div class="p-2">
    <el-card shadow="hover" class="mb-[10px]">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="消息类型">
          <el-select v-model="queryParams.messageType" clearable filterable allow-create default-first-option style="width: 160px">
            <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收类型">
          <el-select v-model="queryParams.receiverType" clearable style="width: 130px">
            <el-option v-for="item in receiverTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="queryParams.receiverId" clearable placeholder="用户/厨师ID" style="width: 140px" @keyup.enter="getList" />
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
        <el-form-item label="记录时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
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
            <el-tag>{{ optionText(messageTypeOptions, row.messageType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接收人" min-width="150">
          <template #default="{ row }">
            {{ optionText(receiverTypeOptions, row.receiverType) }}
            <span v-if="row.receiverId"> / {{ row.receiverId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务" min-width="190">
          <template #default="{ row }">
            <span>{{ optionText(bizTypeOptions, row.relatedBizType) || '-' }}</span>
            <span v-if="row.relatedBizId"> / {{ row.relatedBizId }}</span>
            <span v-if="row.relatedOrderNo"> / {{ row.relatedOrderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道" prop="channel" min-width="110">
          <template #default="{ row }">
            <el-tag type="info">{{ optionText(channelOptions, row.channel) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发送状态" prop="sendStatus" min-width="120">
          <template #default="{ row }">
            <el-tag :type="sendStatusTagType(row.sendStatus)">{{ optionText(sendStatusOptions, row.sendStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容摘要" prop="contentSummary" min-width="260" show-overflow-tooltip />
        <el-table-column label="失败原因" prop="failReason" min-width="180" show-overflow-tooltip />
        <el-table-column label="发送时间" prop="sendTime" min-width="170" />
        <el-table-column label="操作" fixed="right" width="200">
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
          <el-tag :type="sendStatusTagType(current.sendStatus)">{{ optionText(sendStatusOptions, current.sendStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消息类型">{{ optionText(messageTypeOptions, current.messageType) }}</el-descriptions-item>
        <el-descriptions-item label="渠道">{{ optionText(channelOptions, current.channel) }}</el-descriptions-item>
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

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const messageTypeOptions = [
  { label: '订单通知', value: 'ORDER' },
  { label: '退款通知', value: 'REFUND' },
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
  { label: '站内', value: 'SYSTEM' },
  { label: '短信', value: 'SMS' },
  { label: '微信', value: 'WECHAT' },
  { label: 'App', value: 'APP' }
];
const sendStatusOptions = [
  { label: '待发送', value: 'PENDING' },
  { label: '发送中', value: 'SENDING' },
  { label: '已发送', value: 'SENT' },
  { label: '发送失败', value: 'FAILED' }
];
const bizTypeOptions = [
  { label: '订单', value: 'ORDER' },
  { label: '退款', value: 'REFUND' },
  { label: '结算', value: 'SETTLEMENT' },
  { label: '投诉', value: 'COMPLAINT' },
  { label: '厨师', value: 'CHEF' },
  { label: '配置', value: 'CONFIG' }
];
type TagType = 'primary' | 'success' | 'info' | 'warning' | 'danger';
const sendStatusType: Record<string, TagType> = { PENDING: 'info', SENDING: 'warning', SENT: 'success', FAILED: 'danger' };

const loading = ref(false);
const detailLoading = ref(false);
const rows = ref<MessageVO[]>([]);
const total = ref(0);
const dateRange = ref<string[]>([]);
const queryParams = reactive<MessageQuery>({
  pageNum: 1,
  pageSize: 10,
  messageType: '',
  receiverType: '',
  receiverId: '',
  relatedOrderNo: '',
  channel: '',
  sendStatus: ''
});
const detail = reactive({ visible: false });
const formDialog = reactive({ visible: false, title: '' });
const current = reactive<MessageVO>({});
const form = reactive<MessageForm>({});

const optionText = (options: Array<{ label: string; value: string }>, value?: string) => options.find((item) => item.value === value)?.label || value || '-';
const sendStatusTagType = (value?: string): TagType => sendStatusType[value || ''] || 'info';

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
    receiverType: '',
    receiverId: '',
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
  Object.assign(form, { messageType: '', channel: '', receiverType: '', sendStatus: 'SENT' });
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
