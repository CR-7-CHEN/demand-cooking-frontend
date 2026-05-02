import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ComplaintForm, ComplaintQuery, ComplaintVO } from './types';

export const listComplaint = (query?: ComplaintQuery): AxiosPromise<ComplaintVO[]> => request({ url: '/cooking/complaint/list', method: 'get', params: query });
export const getComplaint = (complaintId: string | number): AxiosPromise<ComplaintVO> => request({ url: `/cooking/complaint/${complaintId}`, method: 'get' });
export const addComplaint = (data: ComplaintForm) => request({ url: '/cooking/complaint', method: 'post', data });
export const handleComplaint = (data: ComplaintForm & { established?: boolean }) => request({ url: '/cooking/complaint/handle', method: 'put', data });
