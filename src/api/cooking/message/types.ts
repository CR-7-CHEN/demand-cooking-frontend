import type { CookingBaseForm, CookingBaseQuery } from '../types';

export interface MessageVO extends CookingBaseForm {
  messageId?: string | number;
  messageType?: string;
  channel?: string;
  receiverType?: string;
  receiverId?: string | number;
  receiverName?: string;
  userName?: string;
  nickName?: string;
  chefName?: string;
  receiverMobileMask?: string;
  receiverOpenidMask?: string;
  relatedOrderId?: string | number;
  relatedOrderNo?: string;
  relatedBizType?: string;
  relatedBizId?: string | number;
  contentSummary?: string;
  sendStatus?: string;
  sendTime?: string;
  failReason?: string;
  remark?: string;
  createTime?: string;
}

export interface MessageQuery extends CookingBaseQuery {
  messageType?: string;
  channel?: string;
  receiverType?: string;
  receiverId?: string | number;
  relatedOrderNo?: string;
  relatedBizType?: string;
  sendStatus?: string;
  params?: Record<string, any>;
}

export type MessageForm = MessageVO;
