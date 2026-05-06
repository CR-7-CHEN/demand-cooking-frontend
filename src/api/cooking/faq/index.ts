import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FaqForm, FaqQuery, FaqVO } from './types';

export const listFaq = (query?: FaqQuery): AxiosPromise<FaqVO[]> => request({ url: '/cooking/support/faq/list', method: 'get', params: query });
export const getFaq = (faqId: string | number): AxiosPromise<FaqVO> => request({ url: `/cooking/support/faq/${faqId}`, method: 'get' });
export const addFaq = (data: FaqForm) => request({ url: '/cooking/support/faq', method: 'post', data });
export const updateFaq = (data: FaqForm) => request({ url: '/cooking/support/faq', method: 'put', data });
export const changeFaqStatus = (faqId: string | number, status: string) =>
  request({ url: '/cooking/support/faq/status', method: 'put', data: { faqId, status } });
export const delFaq = (faqIds: string | number | Array<string | number>) => request({ url: `/cooking/support/faq/${faqIds}`, method: 'delete' });
