import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DishForm, DishQuery, DishVO } from './types';

export const listDish = (query?: DishQuery): AxiosPromise<DishVO[]> => request({ url: '/cooking/dish/list', method: 'get', params: query });
export const getDish = (dishId: string | number): AxiosPromise<DishVO> => request({ url: `/cooking/dish/${dishId}`, method: 'get' });
export const addDish = (data: DishForm) => request({ url: '/cooking/dish', method: 'post', data });
export const updateDish = (data: DishForm) => request({ url: '/cooking/dish', method: 'put', data });
export const delDish = (dishId: string | number | Array<string | number>) => request({ url: `/cooking/dish/${dishId}`, method: 'delete' });
