export type { CookingBaseQuery as OrderQuery, OrderVO, OrderVO as OrderForm } from '../types';

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
