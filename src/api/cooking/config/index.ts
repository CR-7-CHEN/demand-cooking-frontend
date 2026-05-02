import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ConfigForm, ConfigQuery, ConfigVO } from './types';

export const listCookingConfig = (query?: ConfigQuery): AxiosPromise<ConfigVO[]> => request({ url: '/cooking/config/list', method: 'get', params: query });
export const getCookingConfig = (configId: string | number): AxiosPromise<ConfigVO> => request({ url: `/cooking/config/${configId}`, method: 'get' });
export const addCookingConfig = (data: ConfigForm) => request({ url: '/cooking/config', method: 'post', data });
export const updateCookingConfig = (data: ConfigForm) => request({ url: '/cooking/config', method: 'put', data });
export const delCookingConfig = (configId: string | number | Array<string | number>) => request({ url: `/cooking/config/${configId}`, method: 'delete' });
export const publishCookingConfig = (configId: string | number) => request({ url: `/cooking/config/publish/${configId}`, method: 'put' });
