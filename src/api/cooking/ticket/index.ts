import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TicketProcessForm, TicketQuery, TicketVO } from './types';

export const listTicket = (query?: TicketQuery): AxiosPromise<TicketVO[]> =>
  request({ url: '/cooking/support/ticket/list', method: 'get', params: query });
export const getTicket = (ticketId: string | number): AxiosPromise<TicketVO> =>
  request({ url: `/cooking/support/ticket/${ticketId}`, method: 'get' });
export const replyTicket = (data: TicketProcessForm) => request({ url: '/cooking/support/ticket/reply', method: 'put', data });
export const closeTicket = (ticketId: string | number) => request({ url: `/cooking/support/ticket/close/${ticketId}`, method: 'put' });
