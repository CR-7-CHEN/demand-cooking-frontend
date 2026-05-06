import type { CookingBaseForm, CookingBaseQuery } from '../types';

export interface FaqVO extends CookingBaseForm {
  faqId?: string | number;
  question?: string;
  answer?: string;
  category?: string;
  sort?: number;
  status?: string;
  hitCount?: number;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

export interface FaqQuery extends CookingBaseQuery {
  question?: string;
  category?: string;
  status?: string;
}

export type FaqForm = FaqVO;
