type TagType = '' | 'success' | 'info' | 'warning' | 'danger' | 'primary';

export const cookingComplaintStatus = {
  PENDING: '0',
  ESTABLISHED: '1',
  REJECTED: '2'
} as const;

export const cookingSettlementStatus = {
  GENERATED: '0',
  REVIEWING: '1',
  CONFIRMED: '2',
  PAID: '3'
} as const;

export const cookingChefAuditStatus = {
  PENDING: '0',
  APPROVED: '1',
  REJECTED: '2'
} as const;

export const cookingChefStatus = {
  NORMAL: '0',
  PAUSED: '1',
  DISABLED: '2',
  RESIGNED: '3'
} as const;

export const cookingOrderStatus = {
  WAITING_RESPONSE: '0',
  WAITING_PAY: '1',
  PRICE_OBJECTION: '2',
  WAITING_SERVICE: '3',
  WAITING_CONFIRM: '4',
  COMPLETED: '5',
  REJECTED_CLOSED: '6',
  RESPONSE_TIMEOUT_CLOSED: '7',
  OBJECTION_TIMEOUT_CLOSED: '8',
  PAY_TIMEOUT_CLOSED: '9',
  CANCELED: '10',
  REFUNDING: '11',
  REFUNDED: '12',
  REFUND_FAILED: '13'
} as const;

export const cookingMessageSendStatus = {
  PENDING: '0',
  SENT: '1',
  FAILED: '2',
  SENDING: '3'
} as const;

const orderLegacyToNumeric: Record<string, string> = {
  WAITING_RESPONSE: cookingOrderStatus.WAITING_RESPONSE,
  WAITING_PAY: cookingOrderStatus.WAITING_PAY,
  PRICE_OBJECTION: cookingOrderStatus.PRICE_OBJECTION,
  WAITING_SERVICE: cookingOrderStatus.WAITING_SERVICE,
  WAITING_CONFIRM: cookingOrderStatus.WAITING_CONFIRM,
  COMPLETED: cookingOrderStatus.COMPLETED,
  REJECTED_CLOSED: cookingOrderStatus.REJECTED_CLOSED,
  RESPONSE_TIMEOUT_CLOSED: cookingOrderStatus.RESPONSE_TIMEOUT_CLOSED,
  OBJECTION_TIMEOUT_CLOSED: cookingOrderStatus.OBJECTION_TIMEOUT_CLOSED,
  PAY_TIMEOUT_CLOSED: cookingOrderStatus.PAY_TIMEOUT_CLOSED,
  CANCELED: cookingOrderStatus.CANCELED,
  REFUNDING: cookingOrderStatus.REFUNDING,
  REFUNDED: cookingOrderStatus.REFUNDED,
  REFUND_FAILED: cookingOrderStatus.REFUND_FAILED
};

const complaintLegacyToNumeric: Record<string, string> = {
  PENDING: cookingComplaintStatus.PENDING,
  ESTABLISHED: cookingComplaintStatus.ESTABLISHED,
  REJECTED: cookingComplaintStatus.REJECTED
};

const settlementLegacyToNumeric: Record<string, string> = {
  GENERATED: cookingSettlementStatus.GENERATED,
  MANUAL: cookingSettlementStatus.GENERATED,
  REVIEWING: cookingSettlementStatus.REVIEWING,
  CONFIRMED: cookingSettlementStatus.CONFIRMED,
  PAID: cookingSettlementStatus.PAID,
  PAID_OFFLINE: cookingSettlementStatus.PAID
};

const messageSendLegacyToNumeric: Record<string, string> = {
  PENDING: cookingMessageSendStatus.PENDING,
  SENT: cookingMessageSendStatus.SENT,
  SUCCESS: cookingMessageSendStatus.SENT,
  FAILED: cookingMessageSendStatus.FAILED,
  SENDING: cookingMessageSendStatus.SENDING
};

export const normalizeOrderStatus = (value?: string | number) => normalizeStatus(value, orderLegacyToNumeric);
export const normalizeComplaintStatus = (value?: string | number) => normalizeStatus(value, complaintLegacyToNumeric);
export const normalizeSettlementStatus = (value?: string | number) => normalizeStatus(value, settlementLegacyToNumeric);
export const normalizeMessageSendStatus = (value?: string | number) => normalizeStatus(value, messageSendLegacyToNumeric);

export const orderStatusTextMap: Record<string, string> = {
  [cookingOrderStatus.WAITING_RESPONSE]: '待响应',
  [cookingOrderStatus.WAITING_PAY]: '待支付',
  [cookingOrderStatus.PRICE_OBJECTION]: '异议中',
  [cookingOrderStatus.WAITING_SERVICE]: '待服务',
  [cookingOrderStatus.WAITING_CONFIRM]: '用户待确认',
  [cookingOrderStatus.COMPLETED]: '已完成',
  [cookingOrderStatus.REJECTED_CLOSED]: '已拒单',
  [cookingOrderStatus.RESPONSE_TIMEOUT_CLOSED]: '响应超时关闭',
  [cookingOrderStatus.OBJECTION_TIMEOUT_CLOSED]: '异议超时关闭',
  [cookingOrderStatus.PAY_TIMEOUT_CLOSED]: '支付超时关闭',
  [cookingOrderStatus.CANCELED]: '已取消',
  [cookingOrderStatus.REFUNDING]: '退款中',
  [cookingOrderStatus.REFUNDED]: '已退款',
  [cookingOrderStatus.REFUND_FAILED]: '退款失败'
};

export const orderStatusTagMap: Record<string, TagType> = {
  [cookingOrderStatus.WAITING_RESPONSE]: 'warning',
  [cookingOrderStatus.WAITING_PAY]: 'warning',
  [cookingOrderStatus.PRICE_OBJECTION]: 'danger',
  [cookingOrderStatus.WAITING_SERVICE]: '',
  [cookingOrderStatus.WAITING_CONFIRM]: '',
  [cookingOrderStatus.COMPLETED]: 'success',
  [cookingOrderStatus.REJECTED_CLOSED]: 'info',
  [cookingOrderStatus.RESPONSE_TIMEOUT_CLOSED]: 'info',
  [cookingOrderStatus.OBJECTION_TIMEOUT_CLOSED]: 'info',
  [cookingOrderStatus.PAY_TIMEOUT_CLOSED]: 'info',
  [cookingOrderStatus.CANCELED]: 'info',
  [cookingOrderStatus.REFUNDING]: 'info',
  [cookingOrderStatus.REFUNDED]: 'info',
  [cookingOrderStatus.REFUND_FAILED]: 'danger'
};

export const orderStatusOptions = Object.entries(orderStatusTextMap).map(([value, label]) => ({ value, label }));

export const complaintStatusTextMap: Record<string, string> = {
  [cookingComplaintStatus.PENDING]: '待处理',
  [cookingComplaintStatus.ESTABLISHED]: '成立',
  [cookingComplaintStatus.REJECTED]: '不成立'
};

export const complaintStatusTypeMap: Record<string, TagType> = {
  [cookingComplaintStatus.PENDING]: 'warning',
  [cookingComplaintStatus.ESTABLISHED]: 'danger',
  [cookingComplaintStatus.REJECTED]: 'info'
};

export const complaintStatusOptions = Object.entries(complaintStatusTextMap).map(([value, label]) => ({ value, label }));

export const settlementStatusOptions: Array<{ label: string; value: string; type: TagType }> = [
  { label: '已生成', value: cookingSettlementStatus.GENERATED, type: 'info' },
  { label: '复核中', value: cookingSettlementStatus.REVIEWING, type: 'warning' },
  { label: '已确认', value: cookingSettlementStatus.CONFIRMED, type: 'primary' },
  { label: '已发放', value: cookingSettlementStatus.PAID, type: 'success' }
];

export const messageSendStatusOptions: Array<{ label: string; value: string; type: TagType }> = [
  { label: '待发送', value: cookingMessageSendStatus.PENDING, type: 'info' },
  { label: '已发送', value: cookingMessageSendStatus.SENT, type: 'success' },
  { label: '发送失败', value: cookingMessageSendStatus.FAILED, type: 'danger' },
  { label: '发送中', value: cookingMessageSendStatus.SENDING, type: 'warning' }
];

export const orderStatusText = (value?: string | number) => {
  const normalized = normalizeOrderStatus(value);
  return orderStatusTextMap[normalized] || String(value || '') || '-';
};

export const orderStatusTagType = (value?: string | number): TagType => {
  return orderStatusTagMap[normalizeOrderStatus(value)] || '';
};

export const orderStatusTone = (value?: string | number) => {
  const normalized = normalizeOrderStatus(value);
  if (normalized === cookingOrderStatus.COMPLETED) return 'success';
  if ([cookingOrderStatus.WAITING_RESPONSE, cookingOrderStatus.WAITING_PAY, cookingOrderStatus.WAITING_SERVICE, cookingOrderStatus.WAITING_CONFIRM].includes(normalized as any)) {
    return 'warning';
  }
  if ([cookingOrderStatus.PRICE_OBJECTION, cookingOrderStatus.REJECTED_CLOSED, cookingOrderStatus.REFUND_FAILED].includes(normalized as any)) {
    return 'danger';
  }
  return 'progress';
};

export const complaintStatusText = (value?: string | number) => {
  const normalized = normalizeComplaintStatus(value);
  return complaintStatusTextMap[normalized] || String(value || '') || '-';
};

export const complaintStatusTagType = (value?: string | number): TagType => {
  return complaintStatusTypeMap[normalizeComplaintStatus(value)] || 'info';
};

export const settlementStatusText = (value?: string | number) => {
  const normalized = normalizeSettlementStatus(value);
  return settlementStatusOptions.find((item) => item.value === normalized)?.label || String(value || '') || '-';
};

export const settlementStatusTagType = (value?: string | number): TagType => {
  const normalized = normalizeSettlementStatus(value);
  return settlementStatusOptions.find((item) => item.value === normalized)?.type || 'info';
};

export const messageSendStatusText = (value?: string | number) => {
  const normalized = normalizeMessageSendStatus(value);
  return messageSendStatusOptions.find((item) => item.value === normalized)?.label || String(value || '') || '-';
};

export const messageSendStatusTagType = (value?: string | number): TagType => {
  const normalized = normalizeMessageSendStatus(value);
  return messageSendStatusOptions.find((item) => item.value === normalized)?.type || 'info';
};

function normalizeStatus(value: string | number | undefined, legacyMap: Record<string, string>) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  return legacyMap[raw.toUpperCase()] || raw;
}
