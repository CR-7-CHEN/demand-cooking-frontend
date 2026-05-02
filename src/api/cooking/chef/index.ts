import request from '@/utils/request';
import { ChefForm, ChefQuery, ChefVO } from './types';
import { AxiosPromise } from 'axios';

export const listChef = (query?: ChefQuery): AxiosPromise<ChefVO[]> => request({ url: '/cooking/chef/list', method: 'get', params: query });
export const getChef = (chefId: string | number): AxiosPromise<ChefVO> => request({ url: `/cooking/chef/${chefId}`, method: 'get' });
export const addChef = (data: ChefForm) => request({ url: '/cooking/chef', method: 'post', data });
export const updateChef = (data: ChefForm) => request({ url: '/cooking/chef', method: 'put', data });
export const delChef = (chefId: string | number | Array<string | number>) => request({ url: `/cooking/chef/${chefId}`, method: 'delete' });
export const auditChef = (data: ChefForm) => request({ url: '/cooking/chef/audit', method: 'put', data });
export const changeChefStatus = (data: ChefForm) => request({ url: '/cooking/chef/status', method: 'put', data });
