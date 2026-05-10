import type { CookingBaseQuery, OrderVO } from '../types';

export type { OrderVO, OrderVO as OrderForm };

export interface OrderQuery extends CookingBaseQuery {
  chefName?: string;
}

export interface OrderActionForm {
  orderId?: string | number;
  quoteAmount?: number;
  quoteRemark?: string;
  objectionReason?: string;
  objectionRemark?: string;
  payAmount?: number;
  payNo?: string;
  cancelReason?: string;
}
