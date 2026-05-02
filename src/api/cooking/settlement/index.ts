import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SettlementForm, SettlementQuery, SettlementVO } from './types';

export const listSettlement = (query?: SettlementQuery): AxiosPromise<SettlementVO[]> => request({ url: '/cooking/settlement/list', method: 'get', params: query });
export const getSettlement = (settlementId: string | number): AxiosPromise<SettlementVO> => request({ url: `/cooking/settlement/${settlementId}`, method: 'get' });
export const generateSettlement = (data: SettlementForm): AxiosPromise<SettlementVO> => request({ url: '/cooking/settlement/generate', method: 'post', data });
