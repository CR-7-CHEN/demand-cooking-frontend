import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AreaForm, AreaQuery, AreaVO } from './types';

export const listArea = (query?: AreaQuery): AxiosPromise<AreaVO[]> => request({ url: '/cooking/area/list', method: 'get', params: query });
export const getArea = (areaId: string | number): AxiosPromise<AreaVO> => request({ url: `/cooking/area/${areaId}`, method: 'get' });
export const addArea = (data: AreaForm) => request({ url: '/cooking/area', method: 'post', data });
export const updateArea = (data: AreaForm) => request({ url: '/cooking/area', method: 'put', data });
export const delArea = (areaIds: string | number | Array<string | number>) => request({ url: `/cooking/area/${areaIds}`, method: 'delete' });
