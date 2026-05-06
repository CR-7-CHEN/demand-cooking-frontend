import type { CookingBaseForm, CookingBaseQuery } from '../types';

export interface TicketVO extends CookingBaseForm {
  ticketId?: string | number;
  ticketNo?: string;
  userId?: string | number;
  userName?: string;
  nickName?: string;
  contactPhone?: string;
  orderId?: string | number;
  orderNo?: string;
  questionType?: string;
  question?: string;
  questionContent?: string;
  reply?: string;
  processReply?: string;
  processorName?: string;
  status?: string;
  submitTime?: string;
  processTime?: string;
  handleTime?: string;
  closeTime?: string;
  createTime?: string;
  updateTime?: string;
  remark?: string;
}

export interface TicketQuery extends CookingBaseQuery {
  ticketId?: string | number;
  userId?: string | number;
  orderId?: string | number;
  question?: string;
  status?: string;
}

export interface TicketProcessForm extends CookingBaseForm {
  ticketId?: string | number;
  reply?: string;
  processReply?: string;
  remark?: string;
}

export type TicketForm = TicketVO;
