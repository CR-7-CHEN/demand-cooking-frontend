import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AddressForm, AddressQuery, AddressVO } from './types';

export const listAddress = (query?: AddressQuery): AxiosPromise<AddressVO[]> => request({ url: '/cooking/address/list', method: 'get', params: query });
export const getAddress = (addressId: string | number): AxiosPromise<AddressVO> => request({ url: `/cooking/address/${addressId}`, method: 'get' });
export const addAddress = (data: AddressForm) => request({ url: '/cooking/address', method: 'post', data });
export const updateAddress = (data: AddressForm) => request({ url: '/cooking/address', method: 'put', data });
export const delAddress = (addressIds: string | number | Array<string | number>) => request({ url: `/cooking/address/${addressIds}`, method: 'delete' });
