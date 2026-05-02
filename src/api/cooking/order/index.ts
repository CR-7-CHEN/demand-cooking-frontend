import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderActionForm, OrderForm, OrderQuery, OrderVO } from './types';

export const listOrder = (query?: OrderQuery): AxiosPromise<OrderVO[]> => request({ url: '/cooking/order/list', method: 'get', params: query });
export const getOrder = (orderId: string | number): AxiosPromise<OrderVO> => request({ url: `/cooking/order/${orderId}`, method: 'get' });
export const submitOrder = (data: OrderForm): AxiosPromise<OrderVO> => request({ url: '/cooking/order/submit', method: 'post', data });
export const quoteOrder = (data: OrderActionForm) => request({ url: '/cooking/order/quote', method: 'post', data });
export const rejectOrder = (data: OrderActionForm) => request({ url: '/cooking/order/reject', method: 'post', data });
export const paySuccessOrder = (data: OrderActionForm) => request({ url: '/cooking/order/pay/success', method: 'post', data });
export const serviceCompleteOrder = (data: OrderActionForm) => request({ url: '/cooking/order/serviceComplete', method: 'post', data });
export const confirmOrder = (data: OrderActionForm) => request({ url: '/cooking/order/confirm', method: 'post', data });
export const cancelOrder = (data: OrderActionForm) => request({ url: '/cooking/order/user/cancel', method: 'post', data });
