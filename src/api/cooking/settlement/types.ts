import type { CookingBaseQuery, SettlementVO as BaseSettlementVO } from '../types';

export interface SettlementQuery extends CookingBaseQuery {
  settlementMonth?: string;
  chefId?: string | number;
  status?: string;
}

export interface SettlementForm {
  settlementMonth?: string;
  chefId?: string | number;
}

export interface SettlementReviewResolveForm {
  settlementId?: string | number;
  reviewResult?: 'KEEP' | 'REGENERATE' | string;
  reviewReply?: string;
}

export interface SettlementPayForm {
  settlementId?: string | number;
}

export type SettlementVO = BaseSettlementVO;
